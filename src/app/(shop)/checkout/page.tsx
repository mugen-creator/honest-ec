"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, MapPin, CreditCard } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

declare global {
  interface Window {
    Square?: {
      payments: (appId: string, locationId: string) => Promise<any>;
    };
  }
}

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

interface UserAddress {
  name: string | null;
  phone: string | null;
  postalCode: string | null;
  prefecture: string | null;
  city: string | null;
  address: string | null;
  building: string | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null);
  const [useRegisteredAddress, setUseRegisteredAddress] = useState<boolean | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);

  // Square関連
  const [cardReady, setCardReady] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const selectedPaymentMethod = useWatch({ control, name: "paymentMethod" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ログインチェック
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // 登録住所を取得
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserAddress(data.user);
            // 住所が登録されている場合はデフォルトで登録住所を使う
            if (data.user.postalCode) {
              setUseRegisteredAddress(true);
              reset({
                name: data.user.name || "",
                phone: data.user.phone || "",
                postalCode: data.user.postalCode || "",
                prefecture: data.user.prefecture || "",
                city: data.user.city || "",
                address: data.user.address || "",
                building: data.user.building || "",
              });
            } else {
              setUseRegisteredAddress(false);
            }
          }
        })
        .catch(console.error);
    }
  }, [status, reset]);

  // Squareカード入力の初期化
  useEffect(() => {
    if (selectedPaymentMethod !== "credit_card" || !mounted) return;

    let isMounted = true;

    const loadSquare = async () => {
      setIsCardLoading(true);
      setCardError(null);

      try {
        // Square SDKの読み込み
        if (!window.Square) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.querySelector('script[src*="square"]');
            if (existingScript) {
              if (window.Square) {
                resolve();
              } else {
                existingScript.addEventListener("load", () => resolve());
              }
              return;
            }

            const script = document.createElement("script");
            script.src = "https://web.squarecdn.com/v1/square.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Square SDKの読み込みに失敗しました"));
            document.head.appendChild(script);
          });
        }

        if (!isMounted || !window.Square) return;

        // 設定を取得
        const configRes = await fetch("/api/payment/config");
        const config = await configRes.json();

        if (!config.applicationId || !config.locationId) {
          throw new Error("Square設定が見つかりません");
        }

        // Paymentsインスタンスの作成
        if (!paymentsRef.current) {
          paymentsRef.current = await window.Square.payments(config.applicationId, config.locationId);
        }

        // 既存のカードがあれば破棄
        if (cardRef.current) {
          await cardRef.current.destroy();
          cardRef.current = null;
        }

        // カードの初期化（郵便番号欄を非表示）
        const card = await paymentsRef.current.card({
          postalCode: false,
        });

        if (isMounted && cardContainerRef.current) {
          await card.attach(cardContainerRef.current);
          cardRef.current = card;
          setCardReady(true);
        }
      } catch (error) {
        console.error("Square initialization error:", error);
        if (isMounted) {
          setCardError(error instanceof Error ? error.message : "カード入力の初期化に失敗しました");
        }
      } finally {
        if (isMounted) {
          setIsCardLoading(false);
        }
      }
    };

    // 少し遅延させてDOMの準備を待つ
    const timeoutId = setTimeout(loadSquare, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [selectedPaymentMethod, mounted]);

  // 住所選択が変わったときにフォームをリセット
  const handleAddressChoice = (useRegistered: boolean) => {
    setUseRegisteredAddress(useRegistered);
    if (useRegistered && userAddress) {
      reset({
        name: userAddress.name || "",
        phone: userAddress.phone || "",
        postalCode: userAddress.postalCode || "",
        prefecture: userAddress.prefecture || "",
        city: userAddress.city || "",
        address: userAddress.address || "",
        building: userAddress.building || "",
      });
    } else {
      reset({
        name: "",
        phone: "",
        postalCode: "",
        prefecture: "",
        city: "",
        address: "",
        building: "",
      });
    }
  };

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
    setCardError(null);

    try {
      // 住所を保存する場合
      if (saveAddress && useRegisteredAddress === false) {
        await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            postalCode: data.postalCode,
            prefecture: data.prefecture,
            city: data.city,
            address: data.address,
            building: data.building,
          }),
        });
      }

      let paymentId: string | undefined;

      // クレジットカード決済の場合
      if (data.paymentMethod === "credit_card") {
        if (!cardRef.current) {
          throw new Error("カード情報が入力されていません");
        }

        // カード情報をトークン化
        const tokenResult = await cardRef.current.tokenize();

        if (tokenResult.status !== "OK") {
          const errorMessage = tokenResult.errors?.[0]?.message || "カード情報の検証に失敗しました";
          throw new Error(errorMessage);
        }

        // 決済処理
        const paymentResponse = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceId: tokenResult.token,
            amount: getTotal(),
          }),
        });

        const paymentData = await paymentResponse.json();

        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || "決済処理に失敗しました");
        }

        paymentId = paymentData.paymentId;
      }

      // 注文を作成
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
          })),
          shippingName: data.name,
          shippingPhone: data.phone,
          shippingPostal: data.postalCode,
          shippingPrefecture: data.prefecture,
          shippingCity: data.city,
          shippingAddress: data.address,
          shippingBuilding: data.building || "",
          paymentMethod: data.paymentMethod,
          paymentId,
          totalAmount: getTotal(),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "注文処理に失敗しました");
      }

      const orderData = await orderResponse.json();

      clearCart();
      router.push(`/checkout/complete?method=${data.paymentMethod}&order=${orderData.orderNumber}`);
    } catch (error) {
      console.error("Checkout error:", error);
      const message = error instanceof Error ? error.message : "注文処理中にエラーが発生しました。";
      setCardError(message);
      alert(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasRegisteredAddress = userAddress?.postalCode;

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

              {/* Address Choice */}
              {hasRegisteredAddress && (
                <div className="mb-6 space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                      useRegisteredAddress
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handleAddressChoice(true)}
                  >
                    <input
                      type="radio"
                      name="addressChoice"
                      checked={useRegisteredAddress === true}
                      onChange={() => handleAddressChoice(true)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        <span className="font-medium">登録済みの住所を使う</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {userAddress?.name && `${userAddress.name}　`}
                        〒{userAddress?.postalCode}
                        <br />
                        {userAddress?.prefecture}{userAddress?.city}{userAddress?.address}
                        {userAddress?.building && ` ${userAddress.building}`}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                      useRegisteredAddress === false
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                    onClick={() => handleAddressChoice(false)}
                  >
                    <input
                      type="radio"
                      name="addressChoice"
                      checked={useRegisteredAddress === false}
                      onChange={() => handleAddressChoice(false)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium">別の住所を入力する</span>
                    </div>
                  </label>
                </div>
              )}

              {/* Address Form */}
              {(useRegisteredAddress === false || !hasRegisteredAddress) && (
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

                  {/* Save address checkbox */}
                  <div className="md:col-span-2 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">この住所を次回以降も使用する</span>
                    </label>
                  </div>
                </div>
              )}

              {/* 登録住所使用時は確認表示 */}
              {useRegisteredAddress === true && hasRegisteredAddress && (
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <p className="text-gray-600 mb-2">以下の住所に配送します：</p>
                  <p className="font-medium">
                    {userAddress?.name}
                    <br />
                    〒{userAddress?.postalCode}
                    <br />
                    {userAddress?.prefecture}{userAddress?.city}{userAddress?.address}
                    {userAddress?.building && <><br />{userAddress.building}</>}
                    <br />
                    TEL: {userAddress?.phone}
                  </p>
                  {/* Hidden inputs for form submission */}
                  <input type="hidden" {...register("name")} />
                  <input type="hidden" {...register("phone")} />
                  <input type="hidden" {...register("postalCode")} />
                  <input type="hidden" {...register("prefecture")} />
                  <input type="hidden" {...register("city")} />
                  <input type="hidden" {...register("address")} />
                  <input type="hidden" {...register("building")} />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="border border-gray-200 p-6">
              <h2 className="font-bold mb-4">お支払い方法</h2>

              <div className="space-y-3">
                <div>
                  <label className="flex items-start gap-3 p-4 border border-gray-200 cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:bg-gray-50">
                    <input
                      type="radio"
                      value="credit_card"
                      className="mt-0.5"
                      {...register("paymentMethod")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="font-medium">クレジットカード決済</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        VISA / Mastercard / JCB / American Express
                      </p>
                    </div>
                  </label>

                  {/* Square Card Input */}
                  {selectedPaymentMethod === "credit_card" && (
                    <div className="mt-3 ml-7 p-4 bg-gray-50 border border-gray-200 rounded">
                      <p className="text-sm text-gray-600 mb-3">カード情報を入力してください</p>

                      {isCardLoading && (
                        <div className="flex items-center justify-center py-6">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-600 border-t-transparent"></div>
                          <span className="ml-2 text-sm text-gray-500">読み込み中...</span>
                        </div>
                      )}

                      <div
                        ref={cardContainerRef}
                        id="card-container"
                        className={isCardLoading ? "hidden" : ""}
                        style={{ minHeight: "89px" }}
                      />

                      {cardError && (
                        <p className="text-sm text-red-500 mt-2">{cardError}</p>
                      )}

                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        カード情報は安全に暗号化されて処理されます
                      </p>
                    </div>
                  )}
                </div>

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
