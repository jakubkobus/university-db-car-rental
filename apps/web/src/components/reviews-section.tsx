"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReviewForm } from "@/components/review-form";
import { Review } from "@/types";

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${sizeClasses[size]} ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

interface ReviewsSectionProps {
  carReviews: Review[];
  avgRating: number;
  carId: number;
}

export function ReviewsSection({ carReviews, avgRating, carId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(carReviews);

  const handleReviewAdded = () => {
    // In a real app, you'd refetch reviews here
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recenzje ({reviews.length})</CardTitle>
          {avgRating > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">z 5</p>
              </div>
              <StarRating rating={Math.round(avgRating)} size="lg" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div key={review.id}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {(review.user?.firstName?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{review.user?.firstName || "Anonimowy"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground ml-13">{review.comment}</p>
                )}
                {index < reviews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Brak recenzji dla tego pojazdu</p>
            <p className="text-xs mt-1">Bądź pierwszym, który zostawisz opinię!</p>
          </div>
        )}
        <Separator className="my-4" />
        <ReviewForm carId={carId} />
      </CardContent>
    </Card>
  );
}