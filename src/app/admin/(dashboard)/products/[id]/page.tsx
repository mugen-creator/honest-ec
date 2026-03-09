"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Upload, X, Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const {
    register,
    handleSubmit,
    reset,
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
    Promise.all([
      fetch("/api/admin/categories").then((res) => res.json()),
      fetch("/api/admin/brands").then((res) => res.json()),
      fetch(`/api/admin/products/${id}`).then((res) => res.json()),
    ])
      .then(([categoriesData, brandsData, productData]) => {
        setCategories(categoriesData.categories || []);
        setBrands(brandsData.brands || []);

        if (productData.product) {
          const p = productData.product;
          reset({
            name: p.name,
            description: p.description,
            price: String(p.price),
            brandId: p.brandId,
            categoryId: p.categoryId,
            condition: p.condition,
            serialNumber: p.serialNumber || "",
            certificate: p.certificate || "",
            stock: String(p.stock),
            isPublished: p.isPublished,
          });
          setImageUrls(p.images?.map((img: { url: string }) => img.url) || []);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setIsLoading(false);
      });
  }, [id, reset]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setImageUrls((prev) => [...prev, data.url]);
        } else {
          const error = await response.json();
          alert(error.error || "アップロードに失敗しました");
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("アップロードに失敗しました");
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
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseInt(data.price),
          stock: parseInt(data.stock),
          images: imageUrls,
        }),
      });

      if (response.ok) {
        alert("商品を更新しました");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "商品の更新に失敗しました");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("商品の更新に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!confirm("この商品を削除しますか？この操作は取り消せません。")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("商品を削除しました");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "商品の削除に失敗しました");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("商品の削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">商品編集</h1>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            削除
          </Button>
        </div>
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
            変更を保存
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
