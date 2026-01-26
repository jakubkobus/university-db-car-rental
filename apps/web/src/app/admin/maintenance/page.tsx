"use client";

import { useEffect, useState } from "react";
import { Maintenance } from "@/types";
import { DataTable } from "@/components/data-table";
import api from "@/lib/axios";

export default function AdminMaintenancePage() {
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const { data } = await api.get<Maintenance[]>("/maintenance");
      setMaintenance(data);
    } catch (error) {
      console.error("Failed to fetch maintenance", error);
    }
  };

  const columns = [
    { key: "type", label: "Typ" },
    { key: "description", label: "Opis" },
    { key: "cost", label: "Koszt" },
    { key: "date", label: "Data", render: (val: string) => new Date(val).toLocaleDateString('pl-PL') },
    { key: "car", label: "Samochód", render: (val: any) => `${val.brand} ${val.model}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataTable
        data={maintenance}
        columns={columns}
        title="Przeglądy"
        onRefresh={fetchMaintenance}
        deleteEndpoint={(id) => `/maintenance/${id}`}
      />
    </div>
  );
}