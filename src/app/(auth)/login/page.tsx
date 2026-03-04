"use client";

import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

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
        placeholder="パスワード"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        ログイン
      </Button>

      <div className="text-center">
        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-black">
          パスワードをお忘れの方
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif-jp text-2xl font-medium tracking-wide mb-2">ログイン</h1>
        <p className="text-gray-600 text-sm">
          アカウントにログインしてください
        </p>
      </div>

      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100" />}>
        <LoginForm />
      </Suspense>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          アカウントをお持ちでない方は{" "}
          <Link href="/register" className="text-amber-600 hover:underline">
            会員登録
          </Link>
        </p>
      </div>
    </div>
  );
}
