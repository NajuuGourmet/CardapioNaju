"use client"

import { useState, useEffect } from "react"
import { X, Trash2, Plus, Minus, ShoppingBag, Loader2, Check, Eye } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CheckoutModal, type CheckoutData } from "./checkout-modal"
import { OrderTracking } from "./order-tracking"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

const WHATSAPP_NUMBER = "5517997595692"

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  useEffect(() => {
    const savedOrderId = localStorage.getItem("naju_last_order_id")
    if (savedOrderId) {
      setLastOrderId(savedOrderId)
    }
  }, [])

  const formatWhatsAppMessage = (orderId: string | undefined, checkoutData: CheckoutData) => {
    if (items.length === 0) return ""
    const finalTotal = totalPrice + checkoutData.deliveryFee

    let message = "━━━━━━━━━━━━━━━━━━━━\n"
    message += "       *NAJU GOURMET*\n"
    message += "━━━━━━━━━━━━━━━━━━━━\n\n"
    
    if (orderId) {
      message += `*PEDIDO #${orderId.slice(0, 8).toUpperCase()}*\n\n`
    }

    message += `*CLIENTE:* ${checkoutData.customerName}\n`
    message += `*TELEFONE:* ${checkoutData.customerPhone}\n`
    message += `*ENTREGA:* ${checkoutData.deliveryType === "entrega" ? "Delivery" : "Retirada"}\n`
    if (checkoutData.deliveryType === "entrega" && checkoutData.address) {
      message += `*ENDERECO:* ${checkoutData.address}\n`
    }
    message += `*PAGAMENTO:* ${checkoutData.paymentMethod === "pix" ? "PIX" : checkoutData.paymentMethod === "cartao" ? "Cartao (Aproximacao)" : "Dinheiro"}\n`
    if (checkoutData.paymentMethod === "dinheiro" && checkoutData.cashAmount > 0) {
      const change = checkoutData.cashAmount - finalTotal
      message += `*VALOR EM MAOS:* R$ ${checkoutData.cashAmount.toFixed(2).replace(".", ",")}\n`
      message += change > 0 ? `*TROCO:* R$ ${change.toFixed(2).replace(".", ",")}\n` : `*TROCO:* Nao precisa\n`
    }
    
    message += "\n*ITENS DO PEDIDO:*\n"
    message += "─────────────────────\n\n"

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.productName}*\n`
      message += `   Qtd: ${item.quantity}x\n`
      
      if (item.flavors.length > 0) {
        const groupedFlavors = item.flavors.reduce((acc, flavor) => {
          if (!acc[flavor.categoryName]) acc[flavor.categoryName] = []
          acc[flavor.categoryName].push(flavor.flavorName)
          return acc
        }, {} as Record<string, string[]>)

        Object.entries(groupedFlavors).forEach(([category, flavors]) => {
          message += `   ${category}: _${flavors.join(", ")}_\n`
        })
      }
      
      message += `   *Subtotal: R$ ${item.totalPrice.toFixed(2).replace(".", ",")}*\n\n`
    })

    message += "─────────────────────\n"
    if (checkoutData.deliveryFee > 0) {
      message += `*Subtotal:* R$ ${totalPrice.toFixed(2).replace(".", ",")}\n`
      message += `*Taxa de entrega:* R$ ${checkoutData.deliveryFee.toFixed(2).replace(".", ",")}\n`
    }
    message += `*TOTAL: R$ ${finalTotal.toFixed(2).replace(".", ",")}*\n`
    message += "─────────────────────\n\n"
    message += "Aguardo a confirmacao!\nObrigado pela preferencia!"

    return encodeURIComponent(message)
  }

  const handleCheckout = async (checkoutData: CheckoutData) => {
    setIsLoading(true)
    const finalTotal = totalPrice + checkoutData.deliveryFee
    
    // Build the WhatsApp URL BEFORE the async call so iOS doesn't block it
    const whatsappUrl = (orderId?: string) => {
      const message = formatWhatsAppMessage(orderId, checkoutData)
      return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`
    }

    try {
      const orderData = {
        customer_name: checkoutData.customerName,
        customer_phone: checkoutData.customerPhone,
        total: finalTotal,
        notes: checkoutData.paymentMethod === "dinheiro" && checkoutData.cashAmount > 0 
          ? `Troco para R$ ${checkoutData.cashAmount.toFixed(2).replace(".", ",")}` : "",
        delivery_type: checkoutData.deliveryType,
        address: checkoutData.address,
        payment_method: checkoutData.paymentMethod,
        status: "pendente",
        items: items.map(item => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.productPrice,
          selected_flavors: item.flavors.length > 0 ? item.flavors.map(f => f.flavorName) : null,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()
      
      if (result.order_id) {
        localStorage.setItem("naju_last_order_id", result.order_id)
        setLastOrderId(result.order_id)
      }
      
      clearCart()
      setShowCheckout(false)
      onClose()

      // Use location.href for iOS compatibility (window.open is blocked after async)
      window.location.href = whatsappUrl(result.order_id)
    } catch (error) {
      console.error('Error creating order:', error)
      window.location.href = whatsappUrl(undefined)
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md animate-slide-in-right">
        <div className="h-full glass-card rounded-l-3xl flex flex-col overflow-hidden border-l border-white/10">
          {/* Header */}
          <div className="gradient-primary p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
                  <p className="text-white/70 text-sm">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mb-6 animate-float">
                <span className="text-5xl">🍨</span>
              </div>
              <h3 className="font-bold text-xl text-white mb-2">Carrinho vazio</h3>
              <p className="text-white/50 text-sm mb-6">Adicione deliciosos itens ao seu pedido</p>
              
              <button 
                onClick={onClose}
                className="btn-premium px-8 py-3 rounded-xl font-semibold text-white"
              >
                Explorar Cardapio
              </button>
              
              {lastOrderId && (
                <button 
                  onClick={() => setShowTracking(true)}
                  className="mt-4 px-6 py-3 glass rounded-xl text-white/80 hover:text-white font-medium flex items-center gap-2 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  Acompanhar ultimo pedido
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="glass-card rounded-2xl p-4 animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.productName}</h4>
                        {item.flavors.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(
                              item.flavors.reduce((acc, f) => {
                                if (!acc[f.categoryName]) acc[f.categoryName] = []
                                acc[f.categoryName].push(f.flavorName)
                                return acc
                              }, {} as Record<string, string[]>)
                            ).map(([category, flavors]) => (
                              <p key={category} className="text-xs text-white/50">
                                <span className="text-pink-400">{category}:</span> {flavors.join(", ")}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-white" />
                        </button>
                        <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 glass rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </button>
                      </div>
                      <span className="font-bold text-pink-400 text-lg">
                        R$ {item.totalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 space-y-4 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total do pedido</span>
                  <span className="text-3xl font-bold gradient-text">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full h-14 btn-premium rounded-xl font-bold text-white flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Finalizar Pedido
                </button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-white/40 hover:text-red-400 text-sm transition-colors"
                >
                  Limpar carrinho
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        totalPrice={totalPrice}
        onConfirm={handleCheckout}
        isLoading={isLoading}
      />

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
