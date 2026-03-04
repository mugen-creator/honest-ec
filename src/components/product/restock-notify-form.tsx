"use client";

import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";

interface RestockNotifyFormProps {
  productId: string;
  productName: string;
}

export function RestockNotifyForm({ productId, productName }: RestockNotifyFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/restock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productId }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "エラーが発生しました");
      }
    } catch {
      setStatus("error");
      setMessage("通信エラーが発生しました");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-700 mb-1">
          <Check className="w-5 h-5" />
          <span className="font-medium">登録完了</span>
        </div>
        <p className="text-sm text-green-600">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-amber-600" />
        <span className="font-medium text-sm">再入荷通知を受け取る</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        「{productName}」が再入荷した際にメールでお知らせします。
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
          className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-amber-600"
        />
        {status === "error" && (
          <p className="text-xs text-red-600">{message}</p>
        )}
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="w-full py-2 bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              登録中...
            </>
          ) : (
            "通知を登録する"
          )}
        </button>
      </form>
    </div>
  );
}
