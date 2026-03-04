"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface BannerFormProps {
  banner?: Banner;
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl || "");
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      setError("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string || null,
      imageUrl,
      linkUrl: formData.get("linkUrl") as string || null,
      linkText: formData.get("linkText") as string || null,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    if (!data.title || !imageUrl) {
      setError("タイトルと画像は必須です");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        banner ? `/api/admin/banners/${banner.id}` : "/api/admin/banners",
        {
          method: banner ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      router.push("/admin/banners");
      router.refresh();
    } catch (err) {
      setError("保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          defaultValue={banner?.title}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">サブタイトル</label>
        <input
          type="text"
          name="subtitle"
          defaultValue={banner?.subtitle || ""}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          画像 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          {imageUrl && (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt="Banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>{uploading ? "アップロード中..." : "画像を選択"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500">
            推奨サイズ: 1920×800px、JPG/PNG/WebP形式
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">リンクURL</label>
          <input
            type="text"
            name="linkUrl"
            defaultValue={banner?.linkUrl || ""}
            placeholder="/products"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">リンクテキスト</label>
          <input
            type="text"
            name="linkText"
            defaultValue={banner?.linkText || ""}
            placeholder="商品を見る"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">表示順</label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={banner?.sortOrder || 0}
          className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <p className="text-xs text-gray-500 mt-1">小さい数字が先に表示されます</p>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={banner?.isActive ?? true}
            className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm font-medium">公開する</span>
        </label>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {banner ? "更新する" : "追加する"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
