"use client";

import { useEffect, useState } from 'react';
import { Car, Category, Transmission } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CarCard } from '@/components/car-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import api from '@/lib/axios';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    categoryId: 'all',
    transmission: 'all',
    maxPrice: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, catsRes] = await Promise.all([
          api.get<Car[]>('/cars'),
          api.get<Category[]>('/categories'),
        ]);
        setCars(carsRes.data);
        setFilteredCars(carsRes.data);
        setCategories(catsRes.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = cars;
    if (filters.categoryId && filters.categoryId !== 'all') {
      filtered = filtered.filter(car => car.categoryId === parseInt(filters.categoryId));
    }
    if (filters.transmission && filters.transmission !== 'all') {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(car => Number(car.pricePerDay) <= parseInt(filters.maxPrice));
    }
    setFilteredCars(filtered);
  }, [filters, cars]);

  const clearFilters = () => {
    setFilters({ categoryId: 'all', transmission: 'all', maxPrice: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dostępne samochody</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Przeglądaj naszą flotę pojazdów i znajdź idealny samochód dla siebie
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Filtry</h2>
              <Separator className="mb-4" />
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Kategoria</Label>
                  <Select value={filters.categoryId} onValueChange={(value) => setFilters(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Wszystkie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Skrzynia biegów</Label>
                  <Select value={filters.transmission} onValueChange={(value) => setFilters(prev => ({ ...prev, transmission: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Wszystkie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Wszystkie</SelectItem>
                      <SelectItem value="MANUAL">Manualna</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatyczna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Maksymalna cena za dzień</Label>
                  <Input
                    type="number"
                    placeholder="np. 200 zł"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Wyczyść filtry
                </Button>
              </div>
            </Card>
          </aside>

          {/* Cars Grid */}
          <main className="flex-1">
            {filteredCars.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-12">
                    Brak dostępnych samochodów spełniających kryteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}