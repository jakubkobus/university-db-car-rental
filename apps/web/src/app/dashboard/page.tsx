"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Rental } from "@/types";
import api from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    console.log("DASHBOARD: User state:", { user, userRole: user?.role });
    const fetchRentals = async () => {
      try {
        console.log("DASHBOARD: Attempting to fetch from /rentals/my");
        const response = await api.get<Rental[]>("/rentals/my");
        console.log("DASHBOARD: Success, got:", response.data);
        setRentals(response.data);
      } catch (error) {
        console.error("DASHBOARD: Failed to fetch rentals", error);
        console.log("DASHBOARD: Error details - URL:", error.config?.url, "Status:", error.response?.status);
        console.log("DASHBOARD: Full error:", error);
      }
    };
    if (user) fetchRentals();
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel użytkownika</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aktywne wypożyczenia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => r.status === "ONGOING").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Łącznie wypożyczeń</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Łączny koszt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.reduce((sum, r) => sum + Number(r.totalPrice), 0)} zł
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Oczekujące</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rentals.filter(r => r.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moje wypożyczenia</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Samochód</TableHead>
                <TableHead>Data rozpoczęcia</TableHead>
                <TableHead>Data zakończenia</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Koszt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.car?.brand} {rental.car?.model}</TableCell>
                  <TableCell>{new Date(rental.startDate).toLocaleDateString('pl-PL')}</TableCell>
                  <TableCell>{new Date(rental.endDate).toLocaleDateString('pl-PL')}</TableCell>
                  <TableCell>
                    <Badge variant={rental.status === "COMPLETED" ? "default" : rental.status === "ONGOING" ? "secondary" : "outline"}>
                      {rental.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{Number(rental.totalPrice)} zł</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}