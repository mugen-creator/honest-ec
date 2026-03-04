import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "バナー編集",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: Props) {
  const { id } = await params;

  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">バナー編集</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <BannerForm banner={banner} />
      </div>
    </div>
  );
}
