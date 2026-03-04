"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteBannerButtonProps {
  id: string;
}

export function DeleteBannerButton({ id }: DeleteBannerButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("このバナーを削除しますか？")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
      title="削除"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
