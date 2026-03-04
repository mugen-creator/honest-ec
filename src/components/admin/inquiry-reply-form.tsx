"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface InquiryReplyFormProps {
  inquiryId: string;
  customerEmail: string;
  customerName: string;
  currentStatus: string;
  currentReply: string;
}

export function InquiryReplyForm({
  inquiryId,
  customerEmail,
  customerName,
  currentStatus,
  currentReply,
}: InquiryReplyFormProps) {
  const router = useRouter();
  const [reply, setReply] = useState(currentReply);
  const [status, setStatus] = useState(currentStatus);
  const [sendEmail, setSendEmail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reply.trim()) {
      alert("返信内容を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply,
          status,
          sendEmail,
          customerEmail,
          customerName,
        }),
      });

      if (response.ok) {
        alert(sendEmail ? "返信を送信しました" : "保存しました");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "エラーが発生しました");
      }
    } catch (error) {
      console.error("Reply error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          返信内容
        </label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
          placeholder="返信内容を入力..."
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:border-black focus:ring-1 focus:ring-black outline-none"
          >
            <option value="PENDING">未対応</option>
            <option value="REPLIED">返信済</option>
            <option value="CLOSED">クローズ</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">顧客にメール送信する</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" isLoading={isSubmitting}>
          {sendEmail ? "返信を送信" : "保存"}
        </Button>
      </div>
    </form>
  );
}
