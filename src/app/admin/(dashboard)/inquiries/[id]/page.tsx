import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Package, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { InquiryReplyForm } from "@/components/admin/inquiry-reply-form";

export const dynamic = "force-dynamic";

interface InquiryDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusLabels: Record<string, string> = {
  PENDING: "未対応",
  REPLIED: "返信済",
  CLOSED: "クローズ",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REPLIED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-gray-100 text-gray-800",
};

export default async function AdminInquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
      },
      user: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/admin/inquiries"
        className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        問い合わせ一覧に戻る
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">問い合わせ詳細</h1>
        <span className={`px-3 py-1 text-sm rounded-full ${statusColors[inquiry.status]}`}>
          {statusLabels[inquiry.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左カラム */}
        <div className="lg:col-span-2 space-y-6">
          {/* 問い合わせ内容 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              問い合わせ内容
            </h2>

            {inquiry.subject && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">件名</div>
                <div className="font-medium">{inquiry.subject}</div>
              </div>
            )}

            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">メッセージ</div>
              <div className="bg-gray-50 p-4 rounded whitespace-pre-wrap text-sm">
                {inquiry.message}
              </div>
            </div>

            <div className="text-sm text-gray-500">
              受信日時: {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
            </div>
          </div>

          {/* 返信履歴 */}
          {inquiry.reply && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold mb-4">返信内容</h2>
              <div className="bg-blue-50 p-4 rounded whitespace-pre-wrap text-sm">
                {inquiry.reply}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                更新日時: {new Date(inquiry.updatedAt).toLocaleString("ja-JP")}
              </div>
            </div>
          )}

          {/* 返信フォーム */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4">返信する</h2>
            <InquiryReplyForm
              inquiryId={inquiry.id}
              customerEmail={inquiry.email}
              customerName={inquiry.name}
              currentStatus={inquiry.status}
              currentReply={inquiry.reply || ""}
            />
          </div>
        </div>

        {/* 右カラム */}
        <div className="space-y-6">
          {/* 送信者情報 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              送信者情報
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">お名前</dt>
                <dd className="font-medium">{inquiry.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">メールアドレス</dt>
                <dd>
                  <a href={`mailto:${inquiry.email}`} className="text-amber-600 hover:underline">
                    {inquiry.email}
                  </a>
                </dd>
              </div>
              {inquiry.user && (
                <div>
                  <dt className="text-gray-500">会員</dt>
                  <dd>
                    <Link
                      href={`/admin/members/${inquiry.user.id}`}
                      className="text-amber-600 hover:underline"
                    >
                      会員情報を見る
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* 関連商品 */}
          {inquiry.product && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                関連商品
              </h2>
              <Link
                href={`/admin/products/${inquiry.product.id}`}
                className="block hover:opacity-80"
              >
                {inquiry.product.images[0] && (
                  <img
                    src={inquiry.product.images[0].url}
                    alt={inquiry.product.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <div className="text-sm font-medium">{inquiry.product.name}</div>
              </Link>
            </div>
          )}

          {/* タイムライン */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              履歴
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5"></div>
                <div>
                  <div>問い合わせ受信</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(inquiry.createdAt).toLocaleString("ja-JP")}
                  </div>
                </div>
              </div>
              {inquiry.reply && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div>
                    <div>返信送信</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(inquiry.updatedAt).toLocaleString("ja-JP")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
