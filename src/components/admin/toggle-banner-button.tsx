"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface ToggleBannerButtonProps {
  id: string;
  isActive: boolean;
}

export function ToggleBannerButton({ id, isActive }: ToggleBannerButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error("Toggle failed");

      router.refresh();
    } catch (error) {
      console.error("Toggle error:", error);
      alert("変更に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded transition-colors ${
        isActive
          ? "text-green-600 hover:bg-green-50"
          : "text-gray-400 hover:bg-gray-100"
      }`}
      title={isActive ? "非公開にする" : "公開する"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isActive ? (
        <Eye className="w-4 h-4" />
      ) : (
        <EyeOff className="w-4 h-4" />
      )}
    </button>
  );
}
