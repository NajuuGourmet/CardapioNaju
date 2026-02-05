"use client"

import Image from "next/image"
import { Plus, Sparkles } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
  index?: number
}

export function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  return (
    <button
      onClick={() => onClick(product)}
      className="group relative w-full text-left card-modern"
      style={{ 
        animation: `slide-up 0.5s ease-out ${index * 0.1}s forwards`,
        opacity: 0 
      }}
    >
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image_url || "/images/acai-copo.jpg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          
          {/* Add button */}
          <div className="absolute top-3 right-3">
            <div className="w-9 h-9 glass rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:bg-pink-500/40 group-hover:shadow-lg group-hover:shadow-pink-500/20">
              <Plus className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Best seller badge */}
          {product.is_featured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 gradient-primary rounded-lg flex items-center gap-1.5 shadow-lg shadow-pink-500/20">
              <Sparkles className="w-3 h-3 text-white" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wide">Destaque</span>
            </div>
          )}
          
          {/* Price tag */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="glass rounded-xl px-3 py-2.5 flex items-center justify-between group-hover:bg-white/15 transition-colors">
              <span className="text-white font-bold text-base">
                R$ {Number(product.price).toFixed(2).replace(".", ",")}
              </span>
              <span className="text-pink-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Pedir
              </span>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-pink-400 transition-colors duration-300">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-white/40 text-xs mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
