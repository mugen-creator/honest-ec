"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface SalesChartProps {
  data: { date: string; amount: number; count: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  // 7日ごとのラベルを表示
  const showLabel = (index: number) => index % 7 === 0 || index === data.length - 1;

  return (
    <div className="relative">
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap z-10">
          <p className="font-medium">{data[hoveredIndex].date}</p>
          <p>売上: {formatPrice(data[hoveredIndex].amount)}</p>
          <p>注文: {data[hoveredIndex].count}件</p>
        </div>
      )}

      {/* Chart */}
      <div className="flex items-end gap-1 h-48">
        {data.map((item, index) => (
          <div
            key={item.date}
            className="flex-1 flex flex-col items-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`w-full rounded-t transition-all cursor-pointer ${
                hoveredIndex === index ? "bg-amber-500" : "bg-amber-400"
              }`}
              style={{
                height: `${(item.amount / maxAmount) * 100}%`,
                minHeight: item.amount > 0 ? "4px" : "0",
              }}
            />
          </div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex gap-1 mt-2">
        {data.map((item, index) => (
          <div key={item.date} className="flex-1 text-center">
            {showLabel(index) && (
              <span className="text-xs text-gray-500">
                {item.date.slice(5).replace("-", "/")}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex justify-center gap-8 mt-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            {formatPrice(data.reduce((sum, d) => sum + d.amount, 0))}
          </p>
          <p className="text-xs text-gray-500">合計売上</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            {data.reduce((sum, d) => sum + d.count, 0)}件
          </p>
          <p className="text-xs text-gray-500">合計注文数</p>
        </div>
      </div>
    </div>
  );
}
