"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronRight, Sparkles } from "lucide-react"

interface SplashScreenProps {
  onEnter: () => void
  isOpen: boolean
}

export function SplashScreen({ onEnter, isOpen }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleEnter = () => {
    setIsExiting(true)
    setTimeout(() => {
      onEnter()
    }, 600)
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${
        isExiting ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-loja-aberta.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo - Redonda */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/40 to-purple-500/40 rounded-full blur-2xl animate-pulse-glow" />
          
          {/* Logo container - Redonda */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-2xl shadow-pink-500/40 ring-4 ring-white/20">
            <Image
              src="/images/logo-naju.png"
              alt="Naju Gourmet"
              fill
              className="object-cover"
              priority
            />
            {/* Shine effect */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
          Naju Gourmet
        </h1>
        
        <p className="text-white/70 text-sm uppercase tracking-[0.3em] mb-8">
          Salgados & Doces
        </p>

        {/* Status badge */}
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-md ${
          isOpen 
            ? "bg-green-500/20 border border-green-500/50" 
            : "bg-red-500/20 border border-red-500/50"
        }`}>
          <span className={`relative w-3 h-3 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`}>
            <span className={`absolute inset-0 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} animate-ping`} />
          </span>
          <span className="text-white font-semibold text-sm">
            {isOpen ? "Estamos Abertos" : "Estamos Fechados"}
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative bg-gradient-to-r from-[#e91e8c] to-[#9333ea] px-8 py-4 rounded-2xl font-bold text-white text-lg flex items-center gap-3 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          <span>Ver Cardapio</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Subtitle */}
        <p className="text-white/50 text-xs mt-6 tracking-widest uppercase">
          Toque para explorar
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-white/30 text-xs tracking-wider">
          © {new Date().getFullYear()} GVSoftware
        </p>
      </div>
    </div>
  )
}
