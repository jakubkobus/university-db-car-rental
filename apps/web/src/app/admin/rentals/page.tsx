"use client";

import { useEffect, useState } from "react";
import { Rental } from "@/types";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const { data } = await api.get<Rental[]>("/rentals");
      setRentals(data);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "car", label: "Samochód", render: (val: any) => `${val.brand} ${val.model}` },
    { key: "user", label: "Użytkownik", render: (val: any) => val.email },
    { key: "startDate", label: "Od", render: (val: string) => new Date(val).toLocaleDateString('pl-PL') },
    { key: "endDate", label: "Do", render: (val: string) => new Date(val).toLocaleDateString('pl-PL') },
    { key: "status", label: "Status", render: (val: string) => (
      <Badge variant={val === "COMPLETED" ? "default" : val === "ONGOING" ? "secondary" : "outline"}>
        {val}
      </Badge>
    ) },
    { key: "totalPrice", label: "Cena", render: (val: string) => `${Number(val)} zł` },
  ];

  const editForm = (rental: Rental) => (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const status = formData.get("status") as string;
      try {
        await api.patch(`/rentals/${rental.id}`, { status });
        toast.success("Zaktualizowano");
        fetchRentals();
      } catch (error) {
        toast.error("Błąd");
      }
    }} className="space-y-4">
      <div>
        <Label>Status</Label>
        <Select name="status" defaultValue={rental.status}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Oczekujący</SelectItem>
            <SelectItem value="CONFIRMED">Potwierdzony</SelectItem>
            <SelectItem value="ONGOING">Trwający</SelectItem>
            <SelectItem value="COMPLETED">Zakończony</SelectItem>
            <SelectItem value="CANCELLED">Anulowany</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Zaktualizuj</button>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <DataTable
        data={rentals}
        columns={columns}
        title="Wypożyczenia"
        onRefresh={fetchRentals}
        editForm={editForm}
        deleteEndpoint={(id) => `/rentals/${id}`}
      />
    </div>
  );
}