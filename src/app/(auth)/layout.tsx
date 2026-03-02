import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
          <Link href="/" className="text-xl font-bold tracking-wider">
            <span className="text-black">Honest</span>
            <span className="text-amber-600">-</span>
            <span className="text-black">Maison</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Honest-Maison. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
