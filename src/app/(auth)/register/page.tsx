"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const registerSchema = z
  .object({
    name: z.string().min(1, "お名前を入力してください"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(/[A-Za-z]/, "パスワードには英字を含めてください")
      .regex(/[0-9]/, "パスワードには数字を含めてください"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "会員登録に失敗しました");
        return;
      }

      // 登録成功後、自動ログイン
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push("/");
      router.refresh();
    } catch {
      setError("会員登録に失敗しました。もう一度お試しください。");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif-jp text-2xl font-medium tracking-wide mb-2">会員登録</h1>
        <p className="text-gray-600 text-sm">
          新規アカウントを作成してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          id="name"
          type="text"
          label="お名前"
          placeholder="山田 太郎"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label="メールアドレス"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          type="password"
          label="パスワード"
          placeholder="8文字以上（英字・数字を含む）"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="パスワード（確認）"
          placeholder="パスワードを再入力"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <div className="text-xs text-gray-500">
          <p>
            会員登録することで、
            <Link href="/legal/privacy" className="underline">
              プライバシーポリシー
            </Link>
            と
            <Link href="/legal/tokushoho" className="underline">
              利用規約
            </Link>
            に同意したものとみなされます。
          </p>
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          会員登録
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-cyan-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
