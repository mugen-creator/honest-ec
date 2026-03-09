"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Heart, User } from "lucide-react";
import { CartIcon } from "./cart-icon";
import { SearchModal } from "./search-modal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>送料無料 | 全品正規品保証</p>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="font-display text-xl lg:text-2xl font-semibold tracking-wide">
              <span className="text-black">Honest</span>
              <span className="text-cyan-600">-</span>
              <span className="text-black">Maison</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products?sort=newest" className="font-display text-sm tracking-wide hover:text-cyan-600 transition-colors">
              NEW ARRIVALS
            </Link>
            <Link href="/ranking" className="font-display text-sm tracking-wide hover:text-cyan-600 transition-colors">
              RANKING
            </Link>
            <Link href="/brands" className="font-display text-sm tracking-wide hover:text-cyan-600 transition-colors">
              BRANDS
            </Link>
            <Link href="/categories" className="font-display text-sm tracking-wide hover:text-cyan-600 transition-colors">
              CATEGORY
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 hover:text-cyan-600 transition-colors"
              aria-label="検索"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link href="/mypage/favorites" className="p-2 hover:text-cyan-600 transition-colors" aria-label="お気に入り">
              <Heart className="w-5 h-5" />
            </Link>
            <CartIcon />
            <Link href="/mypage" className="p-2 hover:text-cyan-600 transition-colors" aria-label="マイページ">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-2">
          <Link
            href="/products?sort=newest"
            className="px-4 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            NEW ARRIVALS
          </Link>
          <Link
            href="/ranking"
            className="px-4 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            RANKING
          </Link>
          <Link
            href="/brands"
            className="px-4 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            BRANDS
          </Link>
          <Link
            href="/categories"
            className="px-4 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            CATEGORY
          </Link>
          <div className="border-t border-gray-100 mt-2 pt-2 px-4">
            <Link
              href="/mypage"
              className="block py-3 text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              マイページ
            </Link>
            <Link
              href="/guide"
              className="block py-3 text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              ご利用ガイド
            </Link>
          </div>
        </nav>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
