"use client"

import Image from "next/image"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#e91e8c] via-[#d91a80] to-[#c41574] shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg ring-2 ring-white/20 hover:ring-white/40 transition-all hover:scale-105">
              <Image
                src="/images/logo-naju.png"
                alt="Naju Gourmet"
                width={44}
                height={44}
                className="object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">
                Naju Gourmet
              </h1>
              <p className="text-pink-200 text-[10px] font-medium">
                Salgados e Doces
              </p>
            </div>
          </div>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative bg-white/15 hover:bg-white/25 backdrop-blur-sm p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
