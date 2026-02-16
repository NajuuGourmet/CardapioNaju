"use client"

import { useState, useMemo } from "react"
import { X, Check, Plus, Minus, Sparkles } from "lucide-react"
import { useCart, type FlavorSelection } from "@/lib/cart-context"
import type { Product, FlavorCategory, Flavor } from "@/lib/types"

const TOPPING_KEYWORDS = ["topping", "toppings"]

function isToppingCategory(category: FlavorCategory) {
  return TOPPING_KEYWORDS.includes(category.slug?.toLowerCase() ?? "") ||
    category.name.toLowerCase().includes("topping")
}

interface FlavorModalProps {
  product: Product | null
  flavorCategories: FlavorCategory[]
  flavors: Flavor[]
  open: boolean
  onClose: () => void
}

interface VirtualCategory {
  id: string
  name: string
  is_required: boolean
  max_selections: number
  flavors: Flavor[]
  isFree: boolean
}

export function FlavorModal({ product, flavorCategories, flavors, open, onClose }: FlavorModalProps) {
  const { addItem } = useCart()
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [quantity, setQuantity] = useState(1)

  // Split topping categories into FREE + PAID virtual categories
  const virtualCategories: VirtualCategory[] = useMemo(() => {
    const result: VirtualCategory[] = []

    for (const category of flavorCategories) {
      const catFlavors = flavors.filter(f => f.category_id === category.id)

      if (isToppingCategory(category)) {
        // FREE section: pick 1 gratis
        result.push({
          id: `${category.id}_free`,
          name: `${category.name} Gratis`,
          is_required: false,
          max_selections: 1,
          flavors: catFlavors.map(f => ({ ...f })),
          isFree: true,
        })
        // PAID section: pick 1 paid (optional)
        result.push({
          id: `${category.id}_paid`,
          name: `${category.name}`,
          is_required: false,
          max_selections: 1,
          flavors: catFlavors.map(f => ({ ...f })),
          isFree: false,
        })
      } else {
        const allFree = catFlavors.every(f => Number(f.extra_price) === 0)
        result.push({
          id: category.id,
          name: category.name,
          is_required: category.is_required,
          max_selections: category.max_selections,
          flavors: catFlavors,
          isFree: allFree,
        })
      }
    }

    return result
  }, [flavorCategories, flavors])

  const handleFlavorToggle = (category: VirtualCategory, flavor: Flavor) => {
    setSelections(prev => {
      const current = prev[category.id] || []
      const isSelected = current.includes(flavor.id)

      if (isSelected) {
        return { ...prev, [category.id]: current.filter(id => id !== flavor.id) }
      }

      if (current.length >= category.max_selections) {
        if (category.max_selections === 1) {
          return { ...prev, [category.id]: [flavor.id] }
        }
        return prev
      }

      return { ...prev, [category.id]: [...current, flavor.id] }
    })
  }

  const isFlavorSelected = (categoryId: string, flavorId: string) => {
    return (selections[categoryId] || []).includes(flavorId)
  }

  const getSelectionCount = (categoryId: string) => {
    return (selections[categoryId] || []).length
  }

  const isValid = useMemo(() => {
    return virtualCategories.every(category => {
      if (!category.is_required) return true
      return getSelectionCount(category.id) >= 1
    })
  }, [virtualCategories, selections])

  const calculateTotal = useMemo(() => {
    if (!product) return 0
    let total = Number(product.price)

    for (const category of virtualCategories) {
      if (category.isFree) continue // Free categories add no cost
      const selectedFlavors = selections[category.id] || []
      for (const flavorId of selectedFlavors) {
        const flavor = category.flavors.find(f => f.id === flavorId)
        if (flavor && Number(flavor.extra_price) > 0) {
          total += Number(flavor.extra_price)
        }
      }
    }

    return total * quantity
  }, [product, virtualCategories, selections, quantity])

  const handleAddToCart = () => {
    if (!product || !isValid) return

    const flavorSelections: FlavorSelection[] = []

    for (const category of virtualCategories) {
      const selectedFlavors = selections[category.id] || []
      for (const flavorId of selectedFlavors) {
        const flavor = category.flavors.find(f => f.id === flavorId)
        if (flavor) {
          flavorSelections.push({
            categoryId: category.id,
            categoryName: category.name,
            flavorId: flavor.id,
            flavorName: flavor.name,
            price: category.isFree ? 0 : Number(flavor.extra_price),
          })
        }
      }
    }

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      productPrice: Number(product.price),
      quantity,
      flavors: flavorSelections,
      totalPrice: calculateTotal,
    })

    setSelections({})
    setQuantity(1)
    onClose()
  }

  const handleClose = () => {
    setSelections({})
    setQuantity(1)
    onClose()
  }

  if (!product || !open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={handleClose} />
      
      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 glass-card rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up border-t border-white/10">
        {/* Header */}
        <div className="gradient-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {product.name}
              </h2>
              <p className="text-white/70 text-sm">Personalize do seu jeito</p>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[50vh] p-5 space-y-6 no-scrollbar">
          {virtualCategories.map((category, catIndex) => {
            const selCount = getSelectionCount(category.id)

            return (
              <div 
                key={category.id} 
                className={`animate-slide-up ${
                  category.isFree ? 'rounded-2xl border border-green-500/30 bg-green-500/5 p-4' : ''
                }`}
                style={{ animationDelay: `${catIndex * 0.1}s` }}
              >
                {/* Category header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {category.name}
                      {category.isFree && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 uppercase tracking-wider">
                          {'Gratis'}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-white/50">
                      {category.isFree
                        ? `Escolha ${category.max_selections === 1 ? '1 opcao gratis' : `ate ${category.max_selections} gratis`}`
                        : category.is_required 
                          ? `Escolha ${category.max_selections === 1 ? '1 opcao' : `ate ${category.max_selections}`}`
                          : `Opcional`
                      }
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    selCount >= 1 
                      ? category.isFree ? "bg-green-500/20 text-green-400" : "bg-green-500/20 text-green-400"
                      : category.is_required ? "bg-pink-500/20 text-pink-400" : "bg-white/10 text-white/40"
                  }`}>
                    {selCount}/{category.max_selections}
                  </span>
                </div>

                {/* Flavor options */}
                <div className="grid grid-cols-2 gap-2">
                  {category.flavors.map((flavor, index) => {
                    const selected = isFlavorSelected(category.id, flavor.id)

                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        onClick={() => handleFlavorToggle(category, flavor)}
                        className={`p-3.5 rounded-xl text-left transition-all duration-300 ${
                          selected 
                            ? category.isFree
                              ? "bg-green-500/20 border border-green-500/40 shadow-lg shadow-green-500/10"
                              : "gradient-primary shadow-lg shadow-pink-500/20" 
                            : "glass hover:bg-white/10"
                        }`}
                        style={{ 
                          animation: `slide-up 0.3s ease-out ${(catIndex * 0.1) + (index * 0.05)}s forwards`,
                          opacity: 0 
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-sm ${selected ? 'text-white' : 'text-white/80'}`}>
                            {flavor.name}
                          </span>
                          {selected && (
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${category.isFree ? 'bg-green-500/30' : 'bg-white/20'}`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        {category.isFree ? (
                          <span className={`text-xs mt-1 block ${selected ? 'text-green-300' : 'text-green-400/70'}`}>
                            {'Gratis'}
                          </span>
                        ) : Number(flavor.extra_price) > 0 ? (
                          <span className={`text-xs mt-1 block ${selected ? 'text-white/70' : 'text-pink-400'}`}>
                            +R$ {Number(flavor.extra_price).toFixed(2).replace(".", ",")}
                          </span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-5 space-y-4 bg-black/20">
          {/* Quantity */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/15 disabled:opacity-30 transition-all"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
            <span className="text-3xl font-bold text-white w-14 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-white/15 transition-all"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddToCart}
            disabled={!isValid}
            className="w-full h-14 btn-premium rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Adicionar - R$ {calculateTotal.toFixed(2).replace(".", ",")}
          </button>
        </div>
      </div>
    </div>
  )
}
