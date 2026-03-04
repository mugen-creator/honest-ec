"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
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

const checkoutSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  phone: z.string().min(10, "電話番号を入力してください"),
  postalCode: z.string().regex(/^\d{3}-?\d{4}$/, "郵便番号を正しく入力してください"),
  prefecture: z.string().min(1, "都道府県を選択してください"),
  city: z.string().min(1, "市区町村を入力してください"),
  address: z.string().min(1, "番地を入力してください"),
  building: z.string().optional(),
  paymentMethod: z.enum(["bank_transfer", "credit_card"], {
    message: "支払い方法を選択してください",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // ログインチェック
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // カートが空の場合
  if (mounted && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">ご注文手続き</h1>
        <p className="text-gray-500 mb-8">カートに商品がありません</p>
        <Link href="/products">
          <Button>商品を見る</Button>
        </Link>
      </div>
    );
  }

  if (status === "loading" || !mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">読み込み中...</div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      if (data.paymentMethod === "credit_card") {
        // TODO: Stripe決済処理
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // 注文を作成（本来はAPIで処理）
      await new Promise((resolve) => setTimeout(resolve, 500));

      clearCart();
      router.push(`/checkout/complete?method=${data.paymentMethod}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("注文処理中にエラーが発生しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      {/* Back Link */}
      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        カートに戻る
      </Link>

      <h1 className="text-2xl lg:text-3xl font-bold mb-8">ご注文手続き</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 p-6">
              <h2 className="font-bold mb-6">配送先情報</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    id="name"
                    label="お名前"
                    placeholder="山田 太郎"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    id="phone"
                    label="電話番号"
                    placeholder="090-1234-5678"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                <Input
                  id="postalCode"
                  label="郵便番号"
                  placeholder="123-4567"
                  error={errors.postalCode?.message}
                  {...register("postalCode")}
                />

                <Select
                  id="prefecture"
                  label="都道府県"
                  options={[
                    { value: "", label: "選択してください" },
                    ...prefectures.map((p) => ({ value: p, label: p })),
                  ]}
                  error={errors.prefecture?.message}
                  {...register("prefecture")}
                />

                <div className="md:col-span-2">
                  <Input
                    id="city"
                    label="市区町村"
                    placeholder="渋谷区渋谷"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    id="address"
                    label="番地"
                    placeholder="1-2-3"
                    error={errors.address?.message}
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
            </div>

            {/* Payment Method */}
            <div className="border border-gray-200 p-6">
              <h2 className="font-bold mb-4">お支払い方法</h2>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:bg-gray-50">
                  <input
                    type="radio"
                    value="credit_card"
                    className="mt-0.5"
                    {...register("paymentMethod")}
                  />
                  <div>
                    <span className="font-medium">クレジットカード決済</span>
                    <p className="text-xs text-gray-500 mt-1">
                      VISA / Mastercard / JCB / American Express
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:bg-gray-50">
                  <input
                    type="radio"
                    value="bank_transfer"
                    className="mt-0.5"
                    {...register("paymentMethod")}
                  />
                  <div>
                    <span className="font-medium">銀行振込</span>
                    <p className="text-xs text-gray-500 mt-1">
                      ご注文後7日以内にお振込みください
                    </p>
                  </div>
                </label>
              </div>

              {errors.paymentMethod && (
                <p className="text-sm text-red-500 mt-2">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="font-bold mb-4">ご注文内容</h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {items.map(({ product }) => (
                  <div key={product.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-gray-100 flex-shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-600">{product.brand.name}</p>
                      <p className="text-sm line-clamp-1">{product.name}</p>
                      <p className="text-sm font-bold">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <dl className="space-y-2 text-sm border-t pt-4 mb-6">
                <div className="flex justify-between">
                  <dt className="text-gray-500">小計</dt>
                  <dd>{formatPrice(getTotal())}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">送料</dt>
                  <dd>無料</dd>
                </div>
              </dl>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>合計</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">（税込）</p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isProcessing}
              >
                注文を確定する
              </Button>

              <p className="text-xs text-gray-400 text-center mt-4">
                注文を確定することで、利用規約に同意したものとみなされます。
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
