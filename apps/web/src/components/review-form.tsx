"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ReviewFormProps {
  carId: number;
  onReviewAdded?: () => void;
}

export function ReviewForm({ carId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      await api.post("/reviews", {
        rating,
        comment: comment || undefined,
        carId,
        userId: user.id,
      });
      toast.success("Recenzja została dodana!");
      setRating(5);
      setComment("");
      window.location.reload();
    } catch (error) {
      console.error("Failed to add review", error);
      toast.error("Nie udało się dodać recenzji");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Dodaj recenzję</h3>
      <div>
        <Label>Ocena</Label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} gwiazdki</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Komentarz (opcjonalny)</Label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Podziel się swoją opinią..."
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Dodawanie..." : "Dodaj recenzję"}
      </Button>
    </form>
  );
}