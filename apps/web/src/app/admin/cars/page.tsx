"use client";

import { useEffect, useState } from "react";
import { Car, Category, Feature, FuelType, Transmission } from "@/types";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [carsRes, catsRes, featsRes] = await Promise.all([
        api.get<Car[]>("/cars"),
        api.get<Category[]>("/categories"),
        api.get<Feature[]>("/features"),
      ]);
      setCars(carsRes.data);
      setCategories(catsRes.data);
      setFeatures(featsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const columns = [
    { key: "brand", label: "Marka" },
    { key: "model", label: "Model" },
    { key: "year", label: "Rok" },
    { key: "plateNumber", label: "Nr rej." },
    { key: "pricePerDay", label: "Cena/dzień" },
    { key: "isAvailable", label: "Dostępny", render: (val: boolean) => val ? "Tak" : "Nie" },
  ];

  const createForm = <CreateCarForm onSuccess={fetchData} categories={categories} features={features} />;
  const editForm = (car: Car) => <EditCarForm car={car} onSuccess={fetchData} categories={categories} features={features} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <DataTable
        data={cars}
        columns={columns}
        title="Samochody"
        onRefresh={fetchData}
        createForm={createForm}
        editForm={editForm}
        deleteEndpoint={(id) => `/cars/${id}`}
      />
    </div>
  );
}

function CreateCarForm({ onSuccess, categories, features }: { onSuccess: () => void; categories: Category[]; features: Feature[] }) {
  const [form, setForm] = useState({
    brand: "", model: "", year: "", plateNumber: "", color: "", description: "",
    mileage: "", fuelType: "", transmission: "", engineSize: "", horsePower: "",
    pricePerDay: "", deposit: "", categoryId: "", featureIds: [] as number[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/cars", {
        ...form,
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage),
        engineSize: form.engineSize ? parseFloat(form.engineSize) : undefined,
        horsePower: form.horsePower ? parseInt(form.horsePower) : undefined,
        pricePerDay: parseFloat(form.pricePerDay),
        deposit: parseFloat(form.deposit),
        categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
        featureIds: form.featureIds,
      });
      toast.success("Samochód dodany");
      onSuccess();
    } catch (error) {
      toast.error("Błąd");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Marka</Label>
          <Input value={form.brand} onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))} required />
        </div>
        <div>
          <Label>Model</Label>
          <Input value={form.model} onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))} required />
        </div>
        <div>
          <Label>Rok</Label>
          <Input type="number" value={form.year} onChange={(e) => setForm(prev => ({ ...prev, year: e.target.value }))} required />
        </div>
        <div>
          <Label>Nr rejestracyjny</Label>
          <Input value={form.plateNumber} onChange={(e) => setForm(prev => ({ ...prev, plateNumber: e.target.value }))} required />
        </div>
        <div>
          <Label>Paliwo</Label>
          <Select value={form.fuelType} onValueChange={(value) => setForm(prev => ({ ...prev, fuelType: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PETROL">Benzyna</SelectItem>
              <SelectItem value="DIESEL">Diesel</SelectItem>
              <SelectItem value="ELECTRIC">Elektryczny</SelectItem>
              <SelectItem value="HYBRID">Hybryda</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Skrzynia</Label>
          <Select value={form.transmission} onValueChange={(value) => setForm(prev => ({ ...prev, transmission: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MANUAL">Manualna</SelectItem>
              <SelectItem value="AUTOMATIC">Automatyczna</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Cena/dzień</Label>
          <Input type="number" value={form.pricePerDay} onChange={(e) => setForm(prev => ({ ...prev, pricePerDay: e.target.value }))} required />
        </div>
        <div>
          <Label>Kaucja</Label>
          <Input type="number" value={form.deposit} onChange={(e) => setForm(prev => ({ ...prev, deposit: e.target.value }))} required />
        </div>
        <div>
          <Label>Kategoria</Label>
          <Select value={form.categoryId} onValueChange={(value) => setForm(prev => ({ ...prev, categoryId: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Dodaj</Button>
    </form>
  );
}

function EditCarForm({ car, onSuccess, categories, features }: { car: Car; onSuccess: () => void; categories: Category[]; features: Feature[] }) {
  const [form, setForm] = useState({
    brand: car.brand, model: car.model, year: car.year.toString(), plateNumber: car.plateNumber,
    color: car.color || "", description: car.description || "", mileage: car.mileage.toString(),
    fuelType: car.fuelType, transmission: car.transmission, engineSize: car.engineSize?.toString() || "",
    horsePower: car.horsePower?.toString() || "", pricePerDay: car.pricePerDay.toString(),
    deposit: car.deposit.toString(), isAvailable: car.isAvailable, categoryId: car.categoryId?.toString() || "",
    featureIds: car.features?.map(f => f.id) || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/cars/${car.id}`, {
        ...form,
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage),
        engineSize: form.engineSize ? parseFloat(form.engineSize) : undefined,
        horsePower: form.horsePower ? parseInt(form.horsePower) : undefined,
        pricePerDay: parseFloat(form.pricePerDay),
        deposit: parseFloat(form.deposit),
        categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
        featureIds: form.featureIds,
      });
      toast.success("Zaktualizowano");
      onSuccess();
    } catch (error) {
      toast.error("Błąd");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Similar fields as create, with values pre-filled */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Marka</Label>
          <Input value={form.brand} onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))} required />
        </div>
        <div>
          <Label>Model</Label>
          <Input value={form.model} onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))} required />
        </div>
        <div>
          <Label>Cena/dzień</Label>
          <Input type="number" value={form.pricePerDay} onChange={(e) => setForm(prev => ({ ...prev, pricePerDay: e.target.value }))} required />
        </div>
        <div>
          <Label>Dostępny</Label>
          <Select value={form.isAvailable ? "true" : "false"} onValueChange={(value) => setForm(prev => ({ ...prev, isAvailable: value === "true" }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Tak</SelectItem>
              <SelectItem value="false">Nie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Zaktualizuj</Button>
    </form>
  );
}