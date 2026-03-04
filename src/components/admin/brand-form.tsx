"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BrandForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        setName("");
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || "ブランドの追加に失敗しました");
      }
    } catch (error) {
      console.error("Brand create error:", error);
      alert("ブランドの追加に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="brandName"
        label="ブランド名"
        placeholder="ROLEX"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        追加
      </Button>
    </form>
  );
}
