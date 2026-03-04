"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const images = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920", // 高級時計
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1920",   // バッグ
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920", // ジュエリー
  "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=1920", // 時計ディスプレイ
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(false);
      // 次のスライドへ
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsAnimating(true);
      }, 50);
    }, 6000); // 6秒ごとに切り替え

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {images.map((image, index) => (
        <div
          key={image}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-1000",
            index === currentIndex ? "opacity-60" : "opacity-0"
          )}
          style={{
            backgroundImage: `url('${image}')`,
            transform: index === currentIndex && isAnimating ? "scale(1.05)" : "scale(1)",
            transition: "opacity 1s ease-out, transform 6s ease-out",
          }}
        />
      ))}

      {/* Progress indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(false);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsAnimating(true);
              }, 50);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70"
            )}
            aria-label={`スライド ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
