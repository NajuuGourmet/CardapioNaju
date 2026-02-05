"use client"

import { useState, useEffect } from "react"
import { X, Package, ChefHat, CheckCircle, Truck, Clock, XCircle, RefreshCw, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface OrderTrackingProps {
  open: boolean
  onClose: () => void
  orderId: string
}

interface Order {
  id: string
  status: string
  customer_name: string
  total: number
  created_at: string
  delivery_type: string
}

const STATUS_CONFIG = {
  pendente: {
    label: "Pendente",
    description: "Aguardando confirmacao",
    color: "from-yellow-500 to-amber-500",
    glowColor: "shadow-yellow-500/30",
    icon: Clock,
    step: 1,
  },
  "em producao": {
    label: "Em Producao",
    description: "Preparando seu pedido",
    color: "from-blue-500 to-cyan-500",
    glowColor: "shadow-blue-500/30",
    icon: ChefHat,
    step: 2,
  },
  pronto: {
    label: "Pronto",
    description: "Pronto para retirada",
    color: "from-green-500 to-emerald-500",
    glowColor: "shadow-green-500/30",
    icon: CheckCircle,
    step: 3,
  },
  "saiu entrega": {
    label: "Saiu Entrega",
    description: "A caminho do endereco",
    color: "from-purple-500 to-violet-500",
    glowColor: "shadow-purple-500/30",
    icon: Truck,
    step: 4,
  },
  entregue: {
    label: "Entregue",
    description: "Entregue com sucesso!",
    color: "from-gray-500 to-slate-500",
    glowColor: "shadow-gray-500/30",
    icon: Package,
    step: 5,
  },
  cancelado: {
    label: "Cancelado",
    description: "Pedido cancelado",
    color: "from-red-500 to-rose-500",
    glowColor: "shadow-red-500/30",
    icon: XCircle,
    step: -1,
  },
}

export function OrderTracking({ open, onClose, orderId }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrder = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single()

      if (fetchError) throw fetchError
      setOrder(data)
    } catch (err) {
      console.error("Error fetching order:", err)
      setError("Nao foi possivel carregar o pedido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!open || !orderId) return

    fetchOrder()

    const supabase = createClient()
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [open, orderId])

  if (!open) return null

  const currentStatus = order?.status?.toLowerCase() || "pendente"
  const statusConfig = STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pendente
  const StatusIcon = statusConfig.icon

  const getStepStatus = (stepNumber: number) => {
    if (currentStatus === "cancelado") return "cancelled"
    if (statusConfig.step >= stepNumber) return "completed"
    if (statusConfig.step === stepNumber - 1) return "current"
    return "pending"
  }

  const steps = [
    { number: 1, label: "Pendente", icon: Clock },
    { number: 2, label: "Preparando", icon: ChefHat },
    { number: 3, label: "Pronto", icon: CheckCircle },
    { number: 4, label: "Entrega", icon: Truck },
    { number: 5, label: "Entregue", icon: Package },
  ]

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden animate-scale-in border border-white/10">
        {/* Header */}
        <div className={`bg-gradient-to-r ${statusConfig.color} p-6 relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 glass rounded-xl hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="relative">
            <div className={`w-16 h-16 glass rounded-2xl flex items-center justify-center mb-4 shadow-lg ${statusConfig.glowColor}`}>
              <StatusIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {statusConfig.label}
            </h2>
            <p className="text-white/80 mt-1">{statusConfig.description}</p>
            {order && (
              <p className="text-white/50 text-sm mt-2 font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-transparent to-black/20">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 text-pink-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-white/60">{error}</p>
              <button
                onClick={fetchOrder}
                className="mt-4 px-6 py-2.5 glass rounded-xl text-white/80 hover:text-white font-medium transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : currentStatus === "cancelado" ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-4 bg-red-500/20">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
              <p className="text-white/60">Seu pedido foi cancelado.</p>
              <p className="text-white/40 text-sm mt-2">Entre em contato conosco.</p>
            </div>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => {
                  const stepStatus = getStepStatus(step.number)
                  const StepIcon = step.icon
                  
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500
                            ${stepStatus === "completed" 
                              ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30" 
                              : stepStatus === "current"
                              ? `bg-gradient-to-r ${statusConfig.color} text-white animate-pulse shadow-lg ${statusConfig.glowColor}`
                              : "glass text-white/30"
                            }
                          `}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <span className={`text-[10px] mt-2 font-medium ${
                          stepStatus === "completed" || stepStatus === "current"
                            ? "text-white/80"
                            : "text-white/30"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={`
                          w-4 h-1 mx-0.5 rounded-full transition-all duration-500 -mt-5
                          ${getStepStatus(step.number + 1) === "completed" || getStepStatus(step.number + 1) === "current"
                            ? "bg-gradient-to-r from-green-400 to-emerald-500"
                            : "bg-white/10"
                          }
                        `} />
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Order Info */}
              {order && (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Cliente</span>
                    <span className="font-medium text-white">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">Tipo</span>
                    <span className="font-medium text-white capitalize">{order.delivery_type}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-white/50 text-sm">Total</span>
                    <span className="font-bold text-xl gradient-text">
                      R$ {Number(order.total).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={fetchOrder}
                className="w-full mt-4 py-3 flex items-center justify-center gap-2 text-white/50 hover:text-white glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar status
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-4 glass hover:bg-white/10 text-white/80 hover:text-white font-semibold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
