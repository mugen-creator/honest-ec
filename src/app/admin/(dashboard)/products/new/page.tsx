"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(1, "商品名を入力してください"),
  description: z.string().min(10, "商品説明は10文字以上で入力してください"),
  price: z.string().min(1, "価格を入力してください"),
  brandId: z.string().min(1, "ブランドを選択してください"),
  categoryId: z.string().min(1, "カテゴリーを選択してください"),
  condition: z.string().min(1, "商品状態を選択してください"),
  serialNumber: z.string().optional(),
  certificate: z.string().optional(),
  stock: z.string(),
  isPublished: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

const conditionOptions = [
  { value: "", label: "選択してください" },
  { value: "NEW", label: "新品" },
  { value: "S", label: "S (未使用に近い)" },
  { value: "A", label: "A (目立った傷や汚れなし)" },
  { value: "B", label: "B (やや傷や汚れあり)" },
  { value: "C", label: "C (傷や汚れあり)" },
];

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      stock: "1",
      isPublished: false,
    },
  });

  useEffect(() => {
    // カテゴリとブランドを取得
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(console.error);

    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch(console.error);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        // ファイルサイズチェック (10MB以下)
        if (file.size > 10 * 1024 * 1024) {
          alert("ファイルサイズは10MB以下にしてください");
          continue;
        }

        // クライアントサイドアップロード
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        setImageUrls((prev) => [...prev, blob.url]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "アップロードに失敗しました");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (url: string) => {
    setImageUrls(imageUrls.filter((u) => u !== url));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseInt(data.price),
          stock: parseInt(data.stock),
          images: imageUrls,
        }),
      });

      if (response.ok) {
        alert("商品を登録しました");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "商品の登録に失敗しました");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("商品の登録に失敗しました");
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          商品一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold">新規商品登録</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">基本情報</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                id="name"
                label="商品名 *"
                placeholder="ROLEX デイトナ 116500LN"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            <Select
              id="brandId"
              label="ブランド *"
              options={[
                { value: "", label: "選択してください" },
                ...brands.map((b) => ({ value: b.id, label: b.name })),
              ]}
              error={errors.brandId?.message}
              {...register("brandId")}
            />

            <Select
              id="categoryId"
              label="カテゴリー *"
              options={[
                { value: "", label: "選択してください" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            />

            <Input
              id="price"
              label="価格（税込） *"
              type="number"
              placeholder="1000000"
              error={errors.price?.message}
              {...register("price")}
            />

            <Select
              id="condition"
              label="商品状態 *"
              options={conditionOptions}
              error={errors.condition?.message}
              {...register("condition")}
            />

            <Input
              id="serialNumber"
              label="シリアル番号"
              placeholder="7XXXXXXX"
              {...register("serialNumber")}
            />

            <Input
              id="stock"
              label="在庫数"
              type="number"
              defaultValue="1"
              {...register("stock")}
            />
          </div>
        </div>

        {/* 商品説明 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">商品説明</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              説明文 *
            </label>
            <textarea
              id="description"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
              placeholder="商品の詳細な説明を入力してください"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="mt-4">
            <Input
              id="certificate"
              label="付属品・証明書"
              placeholder="箱、保証書、コマ調整用リンク"
              {...register("certificate")}
            />
          </div>
        </div>

        {/* 画像 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">商品画像</h2>

          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  アップロード中...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  画像をアップロード
                </>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              JPEG, PNG, WebP, GIF形式（10MB以下）
            </p>
          </div>

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`商品画像 ${index + 1}`}
                    fill
                    className="object-cover border rounded"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 公開設定 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="font-bold mb-4">公開設定</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-5 h-5"
              {...register("isPublished")}
            />
            <span>商品を公開する</span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            チェックを入れると、サイトに商品が表示されます。
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" isLoading={isSubmitting}>
            商品を登録
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              キャンセル
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
