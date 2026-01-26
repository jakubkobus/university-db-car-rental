"use client";

import { useEffect, useState } from "react";
import { Review } from "@/types";
import { DataTable } from "@/components/data-table";
import api from "@/lib/axios";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get<Review[]>("/reviews");
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const columns = [
    { key: "rating", label: "Ocena" },
    { key: "comment", label: "Komentarz" },
    { key: "car", label: "Samochód", render: (val: any) => `${val.brand} ${val.model}` },
    { key: "user", label: "Użytkownik", render: (val: any) => val.email },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataTable
        data={reviews}
        columns={columns}
        title="Recenzje"
        onRefresh={fetchReviews}
        deleteEndpoint={(id) => `/reviews/${id}`}
      />
    </div>
  );
}