"use client"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-gradient-to-r from-[#e91e8c] to-[#9333ea]">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-white">
            <span className="font-bold">Naju Gourmet</span>
            {" "}&bull;{" "}
            Salgados e Doces
          </p>
          <p className="text-xs text-white/70">
            © {currentYear} GVSoftware. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
