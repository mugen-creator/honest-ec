"use client";

import { useState } from "react";
import { Tag, X, Loader2, Check } from "lucide-react";

interface CouponResult {
  id: string;
  code: string;
  type: string;
  value: number;
}

interface CouponInputProps {
  totalAmount: number;
  onApply: (coupon: CouponResult, discountAmount: number) => void;
  onRemove: () => void;
  appliedCoupon?: CouponResult | null;
  discountAmount?: number;
}

export function CouponInput({
  totalAmount,
  onApply,
  onRemove,
  appliedCoupon,
  discountAmount = 0,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), totalAmount }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        onApply(data.coupon, data.discountAmount);
        setCode("");
        setStatus("idle");
      } else {
        setError(data.error || "クーポンを適用できません");
        setStatus("error");
      }
    } catch {
      setError("通信エラーが発生しました");
      setStatus("error");
    }
  };

  const handleRemove = () => {
    onRemove();
    setCode("");
    setError("");
    setStatus("idle");
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 p-3 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              クーポン適用中: {appliedCoupon.code}
            </span>
          </div>
          <button
            onClick={handleRemove}
            className="text-gray-400 hover:text-gray-600"
            aria-label="クーポンを削除"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-green-600 mt-1">
          -{discountAmount.toLocaleString()}円
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">クーポンコード</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
            setStatus("idle");
          }}
          placeholder="クーポンコードを入力"
          className="flex-1 px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-cyan-600"
        />
        <button
          onClick={handleApply}
          disabled={status === "loading" || !code.trim()}
          className="px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "適用"
          )}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
