"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get("method");
  const isBankTransfer = paymentMethod === "bank_transfer";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />

      <h1 className="text-2xl lg:text-3xl font-bold mb-4">
        ご注文ありがとうございます
      </h1>

      <p className="text-gray-600 mb-8">
        ご注文を受け付けました。
        <br />
        確認メールをお送りしましたのでご確認ください。
      </p>

      {isBankTransfer && (
        <div className="bg-amber-50 border border-amber-200 p-6 mb-8 text-left">
          <h2 className="font-bold mb-4 text-amber-800">お振込先</h2>
          <p className="text-sm text-amber-700 mb-4">
            下記口座へ7日以内にお振込みください。
            <br />
            ご入金確認後、商品を発送いたします。
          </p>
          <dl className="text-sm space-y-2">
            <div className="flex">
              <dt className="w-24 text-gray-600">銀行名</dt>
              <dd className="font-medium">○○銀行</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-600">支店名</dt>
              <dd className="font-medium">○○支店（000）</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-600">口座種別</dt>
              <dd className="font-medium">普通</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-600">口座番号</dt>
              <dd className="font-medium">1234567</dd>
            </div>
            <div className="flex">
              <dt className="w-24 text-gray-600">口座名義</dt>
              <dd className="font-medium">ド）オネスト</dd>
            </div>
          </dl>
          <p className="text-xs text-amber-600 mt-4">
            ※ 振込手数料はお客様のご負担となります
          </p>
        </div>
      )}

      <div className="bg-gray-50 p-6 mb-8 text-left">
        <h2 className="font-bold mb-4">今後の流れ</h2>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              1
            </span>
            <span>ご注文確認メールの送信</span>
          </li>
          {isBankTransfer && (
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
                2
              </span>
              <span>お振込み（7日以内）</span>
            </li>
          )}
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              {isBankTransfer ? "3" : "2"}
            </span>
            <span>商品の検品・梱包</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              {isBankTransfer ? "4" : "3"}
            </span>
            <span>発送完了メールの送信（追跡番号をお知らせします）</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              {isBankTransfer ? "5" : "4"}
            </span>
            <span>商品のお届け</span>
          </li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/mypage/orders">
          <Button variant="outline">注文履歴を見る</Button>
        </Link>
        <Link href="/products">
          <Button>お買い物を続ける</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">読み込み中...</div>
        </div>
      }
    >
      <CheckoutCompleteContent />
    </Suspense>
  );
}
