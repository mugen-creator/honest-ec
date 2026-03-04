"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      // セキュリティ上、エラーでも成功画面を表示
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="font-serif-jp text-2xl font-medium tracking-wide mb-4">メールを送信しました</h1>
          <p className="text-gray-600 mb-8">
            ご登録のメールアドレス宛にパスワード再設定用のリンクを送信しました。
            <br />
            メールをご確認ください。
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ※メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
          <Link href="/login" className="text-amber-600 hover:underline">
            ログインページに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-serif-jp text-2xl font-medium tracking-wide text-center mb-2">パスワード再設定</h1>
        <p className="text-center text-gray-600 mb-8">
          ご登録のメールアドレスを入力してください。
          <br />
          パスワード再設定用のリンクをお送りします。
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="メールアドレス"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            送信する
          </Button>
        </form>

        <p className="text-center mt-6">
          <Link href="/login" className="text-amber-600 hover:underline text-sm">
            ログインページに戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
