"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import { DataTable } from "@/components/data-table";
import api from "@/lib/axios";

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.push("/admin");
      return;
    }
    if (user?.role === "ADMIN") {
      fetchUsers();
    }
  }, [user, isLoading, router]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const columns = [
    { key: "email", label: "Email" },
    { key: "firstName", label: "Imię" },
    { key: "lastName", label: "Nazwisko" },
    { key: "role", label: "Rola" },
    { key: "phone", label: "Telefon" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (user?.role !== "ADMIN") return <div>Brak dostępu</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <DataTable
        data={users}
        columns={columns}
        title="Użytkownicy"
        onRefresh={fetchUsers}
        deleteEndpoint={(id) => `/users/${id}`}
      />
    </div>
  );
}