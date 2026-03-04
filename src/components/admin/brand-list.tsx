"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface BrandListProps {
  brands: Brand[];
}

export function BrandList({ brands }: BrandListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      alert("このブランドには商品が登録されているため削除できません");
      return;
    }

    if (!confirm("このブランドを削除しますか？")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "削除に失敗しました");
      }
    } catch (error) {
      console.error("Brand delete error:", error);
      alert("削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  };

  if (brands.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        ブランドがありません
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            ブランド名
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            スラッグ
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            商品数
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            操作
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {brands.map((brand) => (
          <tr key={brand.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 font-medium">{brand.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{brand.slug}</td>
            <td className="px-6 py-4 text-sm">{brand._count.products}件</td>
            <td className="px-6 py-4 text-right">
              <button
                onClick={() => handleDelete(brand.id, brand._count.products)}
                disabled={deletingId === brand.id}
                className="text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
