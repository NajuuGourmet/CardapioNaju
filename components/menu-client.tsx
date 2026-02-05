"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Package } from "lucide-react"
import { CartProvider, useCart } from "@/lib/cart-context"
import { FlavorModal } from "@/components/flavor-modal"
import { CartDrawer } from "@/components/cart-drawer"
import { SplashScreen } from "@/components/splash-screen"
import { OrderTracking } from "@/components/order-tracking"
import { ProductCard } from "@/components/product-card"
import type { Banner, Product, ProductCategory, FlavorCategory, Flavor } from "@/lib/types"
import Image from "next/image"

interface MenuClientProps {
  banners: Banner[]
  products: Product[]
  categories: ProductCategory[]
  flavorCategories: FlavorCategory[]
  flavors: Flavor[]
  isStoreOpen: boolean
}

function MenuContent({ 
  products, 
  categories, 
  flavorCategories, 
  flavors,
  isStoreOpen
}: Omit<MenuClientProps, 'banners'> & { isStoreOpen: boolean }) {
  const [showSplash, setShowSplash] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const { items } = useCart()

  useEffect(() => {
    const savedOrderId = localStorage.getItem("naju_last_order_id")
    if (savedOrderId) {
      setLastOrderId(savedOrderId)
    }
  }, [])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsFlavorModalOpen(true)
  }

  const handleFlavorModalClose = () => {
    setIsFlavorModalOpen(false)
    setSelectedProduct(null)
  }

  const getProductFlavorCategories = (product: Product | null) => {
    if (!product) return []
    const productCategory = categories.find(c => c.id === product.category_id)
    const categorySlug = productCategory?.slug || ''
    const appliesTo = categorySlug.includes('garrafa') ? 'garrafa' : 'copo'
    return flavorCategories.filter(fc => fc.applies_to === appliesTo || fc.applies_to === 'all')
  }

  const getProductFlavors = (product: Product | null) => {
    if (!product) return []
    const relevantCategories = getProductFlavorCategories(product)
    const categoryIds = relevantCategories.map(c => c.id)
    return flavors.filter(f => categoryIds.includes(f.category_id))
  }

  if (showSplash) {
    return <SplashScreen onEnter={() => setShowSplash(false)} isOpen={isStoreOpen} />
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur */}
      <div className="fixed inset-0">
        <Image
          src="/images/bg-cardapio.png"
          alt="Background"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-4 mt-4">
            <div className="max-w-lg mx-auto glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-pink-500/50 shadow-lg shadow-pink-500/20">
                  <Image
                    src="/images/logo-naju.png"
                    alt="Naju Gourmet"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight">Naju Gourmet</h1>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Salgados & Doces</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 glass rounded-xl hover-scale group"
              >
                <ShoppingBag className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 gradient-primary rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-pink-500/30">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="pt-28 pb-6 px-4">
          <div className="max-w-lg mx-auto">
            <p className="text-pink-400 text-xs uppercase tracking-[0.3em] mb-2 animate-slide-up">Cardapio Digital</p>
            <h2 className="text-3xl font-bold text-white leading-tight animate-slide-up stagger-1">
              Descubra nossos
              <br />
              <span className="gradient-text">sabores incriveis</span>
            </h2>
          </div>
        </section>

        {/* Products organized by category */}
        <main className="px-4 pb-32">
          <div className="max-w-lg mx-auto space-y-8">
            {categories
              .filter(category => products.some(p => p.category_id === category.id))
              .map((category) => {
                const categoryProducts = products.filter(p => p.category_id === category.id)
                return (
                  <section key={category.id} className="animate-slide-up">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-pink-500/50 to-transparent" />
                      <span className="text-xs text-white/40">{categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'itens'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {categoryProducts.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={() => handleProductClick(product)}
                          index={index}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
          </div>
        </main>

        {/* Track order button */}
        {lastOrderId && (
          <button
            onClick={() => setShowTracking(true)}
            className="fixed bottom-24 left-4 z-40 btn-premium px-4 py-3 rounded-2xl shadow-xl shadow-pink-500/25 flex items-center gap-2"
          >
            <Package className="h-5 w-5 text-white" />
            <span className="font-semibold text-sm text-white">Acompanhar</span>
          </button>
        )}
      </div>

      {/* Modals */}
      <FlavorModal
        product={selectedProduct}
        flavorCategories={getProductFlavorCategories(selectedProduct)}
        flavors={getProductFlavors(selectedProduct)}
        open={isFlavorModalOpen}
        onClose={handleFlavorModalClose}
      />
      
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {lastOrderId && (
        <OrderTracking
          open={showTracking}
          onClose={() => setShowTracking(false)}
          orderId={lastOrderId}
        />
      )}
    </div>
  )
}

export function MenuClient(props: MenuClientProps) {
  return (
    <CartProvider>
      <MenuContent {...props} />
    </CartProvider>
  )
}
