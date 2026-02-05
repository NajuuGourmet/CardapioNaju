"use client"

import { useState } from "react"
import { X, Loader2, Copy, Check, MapPin, Store, CreditCard, Banknote, QrCode, MessageCircle, Sparkles } from "lucide-react"

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  totalPrice: number
  onConfirm: (data: CheckoutData) => void
  isLoading: boolean
}

export interface CheckoutData {
  customerName: string
  customerPhone: string
  deliveryType: "retirada" | "entrega"
  address: string
  paymentMethod: "pix" | "cartao" | "dinheiro"
  cashAmount: number
  deliveryFee: number
}

const PIX_KEY = "17997595692"
const PIX_NAME = "Ana Jullia de Lima"
const PIX_BANK = "Banco Bradesco S.A."
const DELIVERY_FEE = 2.00
const WHATSAPP_NUMBER = "5517997595692"

export function CheckoutModal({ open, onClose, totalPrice, onConfirm, isLoading }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryType, setDeliveryType] = useState<"retirada" | "entrega">("retirada")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "cartao" | "dinheiro">("pix")
  const [cashAmount, setCashAmount] = useState("")
  const [copied, setCopied] = useState(false)

  const deliveryFee = deliveryType === "entrega" ? DELIVERY_FEE : 0
  const finalTotal = totalPrice + deliveryFee
  const cashValue = parseFloat(cashAmount.replace(",", ".")) || 0
  const change = cashValue - finalTotal

  const getCashStatus = () => {
    if (!cashAmount || cashValue === 0) return null
    if (cashValue < finalTotal) return "insufficient"
    if (cashValue === finalTotal) return "exact"
    return "change"
  }

  const cashStatus = getCashStatus()

  const copyPixKey = async () => {
    await navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendReceipt = () => {
    const message = `Ola! Segue o comprovante do PIX para o pedido.\n\nChave: ${PIX_KEY}\nValor: R$ ${finalTotal.toFixed(2).replace(".", ",")}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleSubmit = () => {
    if (!customerName.trim()) return alert("Por favor, informe seu nome")
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 10) return alert("Por favor, informe um telefone valido")
    if (deliveryType === "entrega" && !address.trim()) return alert("Por favor, informe o endereco de entrega")
    if (paymentMethod === "dinheiro" && cashStatus === "insufficient") return alert("Valor em dinheiro insuficiente")

    onConfirm({
      customerName,
      customerPhone: customerPhone.replace(/\D/g, ""),
      deliveryType,
      address,
      paymentMethod,
      cashAmount: cashValue,
      deliveryFee,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="absolute inset-x-4 bottom-4 top-auto max-h-[85vh] glass-card rounded-3xl shadow-2xl shadow-pink-500/10 animate-slide-up flex flex-col overflow-hidden border border-white/10">
        {/* Header */}
        <div className="gradient-primary p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Finalizar Pedido
              </h2>
              <p className="text-white/70 text-sm">Complete seus dados</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Nome */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-white/80 mb-2">Seu Nome</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 input-modern"
            />
          </div>

          {/* Telefone */}
          <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <label className="block text-sm font-semibold text-white/80 mb-2">Seu Telefone</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 input-modern"
            />
          </div>

          {/* Tipo de entrega */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-white/80 mb-2">Tipo de Entrega</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType("retirada")}
                className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                  deliveryType === "retirada"
                    ? "gradient-primary shadow-lg shadow-pink-500/25"
                    : "glass hover:bg-white/10"
                }`}
              >
                <Store className={`h-6 w-6 ${deliveryType === "retirada" ? "text-white" : "text-white/60"}`} />
                <span className={`font-semibold ${deliveryType === "retirada" ? "text-white" : "text-white/60"}`}>
                  Retirada
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setDeliveryType("entrega")}
                className={`p-4 rounded-xl transition-all flex flex-col items-center gap-2 ${
                  deliveryType === "entrega"
                    ? "gradient-primary shadow-lg shadow-pink-500/25"
                    : "glass hover:bg-white/10"
                }`}
              >
                <MapPin className={`h-6 w-6 ${deliveryType === "entrega" ? "text-white" : "text-white/60"}`} />
                <span className={`font-semibold ${deliveryType === "entrega" ? "text-white" : "text-white/60"}`}>
                  Delivery
                </span>
                <span className="text-xs text-white/50">+R$ 2,00</span>
              </button>
            </div>

            {deliveryType === "entrega" && (
              <div className="mt-3 animate-slide-up">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Digite seu endereco completo"
                  className="w-full px-4 py-3.5 glass rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 input-modern"
                />
              </div>
            )}
          </div>

          {/* Forma de pagamento */}
          <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <label className="block text-sm font-semibold text-white/80 mb-2">Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pix', icon: QrCode, label: 'PIX' },
                { id: 'cartao', icon: CreditCard, label: 'Cartao' },
                { id: 'dinheiro', icon: Banknote, label: 'Dinheiro' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id as typeof paymentMethod)}
                  className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === id
                      ? "gradient-primary shadow-lg shadow-pink-500/25"
                      : "glass hover:bg-white/10"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${paymentMethod === id ? "text-white" : "text-white/60"}`} />
                  <span className={`text-sm font-semibold ${paymentMethod === id ? "text-white" : "text-white/60"}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* PIX Details */}
            {paymentMethod === "pix" && (
              <div className="mt-3 p-4 glass rounded-xl animate-scale-in">
                <div className="text-center mb-3">
                  <p className="text-sm text-white/60">Chave PIX (Celular)</p>
                  <p className="text-xl font-bold text-pink-400 mt-1">{PIX_KEY}</p>
                </div>
                <div className="text-center text-sm text-white/50 space-y-0.5 mb-3">
                  <p>{PIX_NAME}</p>
                  <p>{PIX_BANK}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={copyPixKey}
                    className="flex items-center justify-center gap-2 py-2.5 glass rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <><Check className="h-4 w-4 text-green-400" /><span className="text-sm font-medium text-green-400">Copiado!</span></>
                    ) : (
                      <><Copy className="h-4 w-4 text-white/60" /><span className="text-sm font-medium text-white/80">Copiar</span></>
                    )}
                  </button>
                  <button
                    onClick={sendReceipt}
                    className="flex items-center justify-center gap-2 py-2.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Enviar</span>
                  </button>
                </div>
              </div>
            )}

            

            {/* Cash Details */}
            {paymentMethod === "dinheiro" && (
              <div className="mt-3 space-y-3 animate-scale-in">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">R$</span>
                  <input
                    type="text"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value.replace(/[^0-9,]/g, ""))}
                    placeholder="Valor em maos"
                    className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 input-modern"
                  />
                </div>

                {cashStatus && (
                  <div className={`p-3 rounded-xl text-center font-medium ${
                    cashStatus === "exact" ? "bg-green-500/20 text-green-400" :
                    cashStatus === "change" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {cashStatus === "exact" && "Valor exato - Sem troco"}
                    {cashStatus === "change" && `Troco: R$ ${change.toFixed(2).replace(".", ",")}`}
                    {cashStatus === "insufficient" && `Faltam R$ ${Math.abs(change).toFixed(2).replace(".", ",")}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 space-y-3 border-t border-white/10 bg-black/20">
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white/80">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            {deliveryType === "entrega" && (
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Taxa de entrega</span>
                <span className="text-white/80">R$ {DELIVERY_FEE.toFixed(2).replace(".", ",")}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-white/10">
              <span className="font-semibold text-white">Total</span>
              <span className="text-2xl font-bold gradient-text">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !customerName.trim() || !customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 10 || (deliveryType === "entrega" && !address.trim()) || (paymentMethod === "dinheiro" && cashStatus === "insufficient")}
            className="w-full h-14 btn-premium rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 className="h-5 w-5 animate-spin" />Enviando...</>
            ) : (
              <><Check className="h-5 w-5" />Confirmar Pedido</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
