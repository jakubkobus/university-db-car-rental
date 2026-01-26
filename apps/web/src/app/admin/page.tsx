"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    totalRentals: 0,
    pendingRentals: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "ADMIN" && user.role !== "EMPLOYEE"))) {
      redirect("/");
    }
    if (user && (user.role === "ADMIN" || user.role === "EMPLOYEE")) {
      fetchStats();
    }
  }, [user, isLoading]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel administracyjny</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Łącznie samochodów</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableCars} dostępnych
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wypożyczenia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRentals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingRentals} oczekujących
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Użytkownicy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Przychody</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue} zł</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/cars" className="block p-2 border rounded hover:bg-gray-50">Zarządzaj samochodami</a>
            <a href="/admin/rentals" className="block p-2 border rounded hover:bg-gray-50">Zarządzaj wypożyczeniami</a>
            {user?.role === "ADMIN" && (
              <a href="/admin/users" className="block p-2 border rounded hover:bg-gray-50">Zarządzaj użytkownikami</a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}