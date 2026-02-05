"use client"

import { ProductCard } from "@/components/product-card"
import type { Product, ProductCategory } from "@/lib/types"

interface MenuSectionProps {
  category: ProductCategory
  products: Product[]
  onProductClick: (product: Product) => void
}

export function MenuSection({ category, products, onProductClick }: MenuSectionProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="animate-fade-in">
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl">
          {category.emoji || '🍨'}
        </div>
        <div>
          <h3 className="font-bold text-white">{category.name}</h3>
          <p className="text-xs text-white/40">
            {products.length} {products.length === 1 ? 'opcao disponivel' : 'opcoes disponiveis'}
          </p>
        </div>
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductClick}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
