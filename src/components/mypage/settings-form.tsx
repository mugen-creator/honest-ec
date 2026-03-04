"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const settingsSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  postalCode: z.string().optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  building: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface User {
  name: string | null;
  email: string;
  phone: string | null;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  address: string | null;
  building: string | null;
}

export function SettingsForm({ initialUser }: { initialUser: User }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: initialUser.name || "",
      phone: initialUser.phone || "",
      postalCode: initialUser.postalCode || "",
      prefecture: initialUser.prefecture || "",
      city: initialUser.city || "",
      address: initialUser.address || "",
      building: initialUser.building || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    setShowSuccess(false);

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        reset({
          name: result.user.name || "",
          phone: result.user.phone || "",
          postalCode: result.user.postalCode || "",
          prefecture: result.user.prefecture || "",
          city: result.user.city || "",
          address: result.user.address || "",
          building: result.user.building || "",
        });
        setShowSuccess(true);
        router.refresh();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const error = await response.json();
        alert(error.error || "更新に失敗しました");
      }
    } catch (error) {
      console.error("Settings update error:", error);
      alert("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const postalCode = e.target.value.replace(/-/g, "");
    if (postalCode.length === 7) {
      try {
        const response = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
        );
        const data = await response.json();
        if (data.results && data.results[0]) {
          const result = data.results[0];
          reset((prev) => ({
            ...prev,
            prefecture: result.address1,
            city: result.address2 + result.address3,
          }));
        }
      } catch (error) {
        console.error("Postal code lookup error:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          <CheckCircle className="w-5 h-5" />
          <span>保存しました</span>
        </div>
      )}

      {/* 基本情報 */}
      <section className="border-b pb-6">
        <h2 className="font-bold mb-4">基本情報</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 px-4 py-3 border">
              {initialUser.email}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              メールアドレスは変更できません
            </p>
          </div>

          <Input
            id="name"
            label="お名前"
            placeholder="山田 太郎"
            {...register("name")}
          />

          <Input
            id="phone"
            label="電話番号"
            placeholder="090-1234-5678"
            {...register("phone")}
          />
        </div>
      </section>

      {/* 配送先住所 */}
      <section className="border-b pb-6">
        <h2 className="font-bold mb-4">配送先住所</h2>
        <p className="text-sm text-gray-500 mb-4">
          ここに登録した住所は、注文時に自動で入力されます。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="postalCode"
            label="郵便番号"
            placeholder="123-4567"
            {...register("postalCode", {
              onChange: handlePostalCodeChange,
            })}
          />

          <Select
            id="prefecture"
            label="都道府県"
            options={[
              { value: "", label: "選択してください" },
              ...prefectures.map((p) => ({ value: p, label: p })),
            ]}
            {...register("prefecture")}
          />

          <div className="md:col-span-2">
            <Input
              id="city"
              label="市区町村"
              placeholder="渋谷区渋谷"
              {...register("city")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="address"
              label="番地"
              placeholder="1-2-3"
              {...register("address")}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="building"
              label="建物名・部屋番号（任意）"
              placeholder="○○マンション 101号室"
              {...register("building")}
            />
          </div>
        </div>
      </section>

      {/* 保存ボタン */}
      <div className="flex gap-4">
        <Button type="submit" isLoading={isLoading} disabled={!isDirty}>
          変更を保存
        </Button>
      </div>
    </form>
  );
}
