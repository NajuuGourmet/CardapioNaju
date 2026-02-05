"use client"

import Image from "next/image"
import { Instagram, Phone, Moon } from "lucide-react"

interface StoreClosedProps {
  message: string
  whatsapp: string
}

export function StoreClosed({ message, whatsapp }: StoreClosedProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background image with blur */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-loja-fechada.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
      </div>

      {/* Subtle overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(135deg, transparent 0%, rgba(147, 51, 234, 0.3) 50%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="relative mb-6">
          {/* Soft glow behind logo */}
          <div className="absolute -inset-4 bg-white/15 rounded-full blur-2xl" />
          
          {/* Logo */}
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-white/40">
            <div className="absolute inset-0 bg-[#f5f0e8]" />
            <Image
              src="/images/logo-naju.png"
              alt="Naju Gourmet"
              fill
              className="object-contain p-2"
            />
            {/* Subtle light sweep */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className="absolute -inset-full w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: "light-sweep 3s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
          Naju Gourmet
        </h1>
        <p className="text-white/70 text-base mb-6 drop-shadow-md">
          Salgados e Doces
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-orange-500/90 backdrop-blur-sm rounded-full mb-4 shadow-lg">
          <Moon className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm">Estamos Fechados</span>
        </div>

        {/* Message */}
        <p className="text-white/80 mb-8 text-base px-4 drop-shadow-md">
          {message}
        </p>

        {/* Buttons */}
        <div className="space-y-3 px-4">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Phone className="w-5 h-5" />
            <span>Fale Conosco</span>
          </a>

          <a
            href="https://www.instagram.com/naju.gourmet/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-semibold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Instagram className="w-5 h-5" />
            <span>Siga no Instagram</span>
          </a>
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-white/50">
          © {currentYear} GVSoftware. Todos os direitos reservados.
        </p>
      </div>

      <style jsx>{`
        @keyframes light-sweep {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(100%) rotate(15deg); }
        }
      `}</style>
    </div>
  )
}
