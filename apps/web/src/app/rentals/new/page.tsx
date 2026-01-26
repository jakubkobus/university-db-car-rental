"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Car } from "@/types";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function NewRentalContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = searchParams.get("carId");

  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const fetchCar = async () => {
    if (!carId) return;
    
    try {
      const { data } = await api.get<Car>(`/cars/${carId}`);
      setCar(data);
    } catch (error) {
      console.error("Failed to fetch car", error);
      toast.error("Nie udało się pobrać danych samochodu");
    }
  };

  const calculatePrice = () => {
    if (!car || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days * Number(car.pricePerDay);
  };

  useEffect(() => {
    setTotalPrice(calculatePrice());
  }, [startDate, endDate, car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!car) {
      toast.error("Dane samochodu nie są dostępne");
      return;
    }
    
    if (!user) {
      toast.error("Musisz być zalogowany, aby utworzyć wypożyczenie");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Wybierz datę rozpoczęcia i zakończenia");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/rentals", {
        startDate,
        endDate,
        totalPrice,
        carId: car.id,
      });
      toast.success("Wypożyczenie zostało utworzone!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create rental", error);
      toast.error("Nie udało się utworzyć wypożyczenia");
    } finally {
      setIsLoading(false);
    }
  };

  if (!carId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Błąd</h1>
          <p className="text-gray-600 mb-4">Nie wybrano samochodu do wypożyczenia.</p>
          <Button onClick={() => router.push("/cars")}>
            Wróć do listy samochodów
          </Button>
        </div>
      </div>
    );
  }

  if (!car) {
    return <div>Ładowanie danych samochodu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nowe wypożyczenie</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Szczegóły samochodu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Marka:</strong> {car.brand}</p>
              <p><strong>Model:</strong> {car.model}</p>
              <p><strong>Rok:</strong> {car.year}</p>
              <p><strong>Cena za dzień:</strong> {Number(car.pricePerDay)} zł</p>
              <p><strong>Kaucja:</strong> {Number(car.deposit)} zł</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Szczegóły wypożyczenia</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="startDate">Data rozpoczęcia</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data zakończenia</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Łączny koszt: {totalPrice} zł</Label>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Tworzenie..." : "Zarezerwuj"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function NewRental() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewRentalContent />
    </Suspense>
  );
}