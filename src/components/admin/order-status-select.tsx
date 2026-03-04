"use client";

import { useState } from "react";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  statusLabels: Record<string, string>;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  PAYMENT_CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
  SHIPPED: "bg-purple-100 text-purple-800 border-purple-300",
  DELIVERED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
};

export function OrderStatusSelect({
  orderId,
  currentStatus,
  statusLabels,
}: OrderStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      } else {
        alert("ステータスの更新に失敗しました");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert("ステータスの更新に失敗しました");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isUpdating}
      className={`px-2 py-1 text-xs rounded border ${statusColors[status] || "bg-gray-100"} cursor-pointer disabled:opacity-50`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
