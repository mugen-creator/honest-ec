import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "ご注文完了",
};

export default function CheckoutCompletePage() {
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

      <div className="bg-gray-50 p-6 mb-8 text-left">
        <h2 className="font-bold mb-4">今後の流れ</h2>
        <ol className="space-y-3 text-sm text-gray-600">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              1
            </span>
            <span>ご注文確認メールの送信</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              2
            </span>
            <span>商品の検品・梱包</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              3
            </span>
            <span>発送完了メールの送信（追跡番号をお知らせします）</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
              4
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
