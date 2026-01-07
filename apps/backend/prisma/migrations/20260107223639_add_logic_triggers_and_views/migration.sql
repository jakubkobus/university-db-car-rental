CREATE OR REPLACE FUNCTION calculate_rental_total_price()
RETURNS TRIGGER AS $$
DECLARE
  v_price_per_day DECIMAL;
  v_days          INT;
BEGIN
  IF NEW."totalPrice" IS NOT NULL AND NEW."totalPrice" > 0 THEN
    RETURN NEW;
  END IF;

  SELECT pricePerDay INTO v_price_per_day FROM "cars" WHERE id = NEW."carId";

  SELECT GREATEST(1, DATE_PART('day', NEW."endDate" - NEW."startDate")) INTO v_days;

  NEW."totalPrice" := v_price_per_day * v_days;
    
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_calc_rental_price ON "rentals";
CREATE TRIGGER trigger_calc_rental_price
BEFORE INSERT ON "rentals"
FOR EACH ROW EXECUTE PROCEDURE calculate_rental_total_price();


CREATE OR REPLACE FUNCTION set_car_unavailable_on_maintenance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "cars"
  SET "isAvailable" = false
  WHERE id = NEW."carId";
    
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_maintenance_block_car ON "maintenances";
CREATE TRIGGER trigger_maintenance_block_car
AFTER INSERT ON "maintenances"
FOR EACH ROW EXECUTE PROCEDURE set_car_unavailable_on_maintenance();


CREATE OR REPLACE VIEW v_car_analytics AS
SELECT 
  c.id AS car_id,
  c.brand,
  c.model,
  c."plateNumber",
  c.mileage,
  c."mileageUnit",
  COUNT(r.id) AS total_rentals,
  COALESCE(SUM(r."totalPrice"), 0) AS total_revenue,
  COALESCE(AVG(rev.rating), 0) AS average_rating
FROM "cars" c
LEFT JOIN "rentals" r ON c.id = r."carId" AND r.status = 'COMPLETED'
LEFT JOIN "reviews" rev ON c.id = rev."carId"
GROUP BY c.id;


CREATE OR REPLACE VIEW v_available_cars_now AS
SELECT c.*
FROM "cars" c
WHERE c."isAvailable" = true
AND NOT EXISTS (
  SELECT 1 FROM "rentals" r
  WHERE r."carId" = c.id
  AND r.status IN ('CONFIRMED', 'ONGOING')
  AND NOW() BETWEEN r."startDate" AND r."endDate"
);
