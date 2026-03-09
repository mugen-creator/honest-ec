"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1920",
  "/hermes.webp",
  "/cartier.avif",
  "/daytona.webp",
];

export function HeroSlideshow() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // バナーを取得
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/admin/banners");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setBanners(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoaded(true);
      }
    };

    fetchBanners();
  }, []);

  // スライドショー
  const images = banners.length > 0 ? banners.map((b) => b.imageUrl) : defaultImages;

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsAnimating(true);
      }, 50);
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length]);

  const currentBanner = banners.length > 0 ? banners[currentIndex] : null;

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

      {/* Banner text overlay */}
      {currentBanner && (currentBanner.title || currentBanner.subtitle) && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center text-white">
            {currentBanner.subtitle && (
              <p className="text-sm md:text-base tracking-widest mb-2 animate-fade-in">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.linkUrl ? (
              <Link
                href={currentBanner.linkUrl}
                className="pointer-events-auto inline-block mt-4 px-6 py-2 bg-white/90 text-black text-sm hover:bg-white transition-colors"
              >
                {currentBanner.linkText || "詳しく見る"}
              </Link>
            ) : null}
          </div>
        </div>
      )}

      {/* Progress indicators */}
      {images.length > 1 && (
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
      )}
    </>
  );
}
