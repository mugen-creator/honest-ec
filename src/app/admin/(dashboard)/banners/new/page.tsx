import { BannerForm } from "@/components/admin/banner-form";

export const metadata = {
  title: "バナー新規追加",
};

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">バナー新規追加</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <BannerForm />
      </div>
    </div>
  );
}
