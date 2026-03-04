"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(1, "件名を入力してください"),
  message: z.string().min(10, "お問い合わせ内容は10文字以上で入力してください"),
});

type ContactFormData = z.infer<typeof contactSchema>;

function ContactForm() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: productId ? `商品についてのお問い合わせ (ID: ${productId})` : "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // TODO: 実際の送信処理
    console.log("Contact form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">
          お問い合わせを受け付けました
        </h2>
        <p className="text-gray-600 mb-8">
          内容を確認の上、担当者よりご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="name"
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
        id="subject"
        label="件名"
        placeholder="お問い合わせ件名"
        error={errors.subject?.message}
        {...register("subject")}
      />

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
          placeholder="お問い合わせ内容をご入力ください"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        送信する
      </Button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">お問い合わせ</h1>
        <p className="text-gray-600">
          商品に関するご質問やご要望など、お気軽にお問い合わせください。
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-6 lg:p-8">
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100" />}>
          <ContactForm />
        </Suspense>
      </div>

      <div className="mt-8 p-6 bg-gray-50">
        <h2 className="font-bold mb-4">その他のお問い合わせ方法</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex gap-4">
            <dt className="text-gray-500 w-24">電話</dt>
            <dd>03-4500-3763（平日 10:00〜18:00）</dd>
          </div>
          <div className="flex gap-4">
            <dt className="text-gray-500 w-24">メール</dt>
            <dd>info@maison.k-honest.com</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
