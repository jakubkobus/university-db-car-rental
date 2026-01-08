import { Car, FuelType, MileageUnit, Transmission } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Calendar, Fuel, Gauge, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const fuelTypeMap: Record<FuelType, string> = {
  [FuelType.PETROL]: "Benzyna",
  [FuelType.DIESEL]: "Diesel",
  [FuelType.ELECTRIC]: "Elektryczny",
  [FuelType.HYBRID]: "Hybryda",
};

const transmissionMap: Record<Transmission, string> = {
  [Transmission.MANUAL]: "Manualna",
  [Transmission.AUTOMATIC]: "Automatyczna",
};

const mileageUnitMap: Record<MileageUnit, string> = {
  [MileageUnit.KILOMETER]: "km",
  [MileageUnit.MILE]: "mi",
};

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {car.imageUrl ? (
          <Image
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
            Brak zdjęcia
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-bold text-sm bg-white/90 hover:bg-white text-primary shadow-sm backdrop-blur-sm">
            {car.pricePerDay} PLN / dzień
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold truncate">{car.brand} {car.model}</h3>
            <p className="text-sm text-muted-foreground">
              {car.category?.name || 'Samochód osobowy'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary shrink-0" />
          <span>{car.year}</span>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary shrink-0" />
          <span>{transmissionMap[car.transmission]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Fuel className="w-4 h-4 text-primary shrink-0" />
          <span>{fuelTypeMap[car.fuelType]}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary shrink-0" />
          <span>{car.mileage} {mileageUnitMap[car.mileageUnit]}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button className="w-full" asChild>
          <Link href={`/cars/${car.id}`}>
            Szczegóły
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}