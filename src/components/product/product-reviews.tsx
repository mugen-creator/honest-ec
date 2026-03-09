"use client";

import { useEffect, useState } from "react";
import { Star, User } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
  };
}

interface ReviewStats {
  count: number;
  avgRating: number;
}

interface ProductReviewsProps {
  productId: string;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating ? "fill-cyan-400 text-cyan-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ count: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || { count: 0, avgRating: 0 });
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg">カスタマーレビュー</h2>
        {stats.count > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(stats.avgRating)} />
            <span className="text-sm text-gray-600">
              {stats.avgRating.toFixed(1)} ({stats.count}件)
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          まだレビューはありません
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {review.user.name || "匿名"}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </div>
              </div>
              {review.title && (
                <p className="font-medium text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
