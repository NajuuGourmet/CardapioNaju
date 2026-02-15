import { getBanners, getProducts, getProductCategories, getFlavorCategories, getFlavors, getStoreSettings } from "@/lib/data"
import { MenuClient } from "@/components/menu-client"
import { StoreClosed } from "@/components/store-closed"

export default async function Home() {
  console.log("[v0] SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("[v0] SUPABASE_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  try {
    const [banners, products, categories, flavorCategories, flavors, storeSettings] = await Promise.all([
      getBanners(),
      getProducts(),
      getProductCategories(),
      getFlavorCategories(),
      getFlavors(),
      getStoreSettings(),
    ])

    // Se a loja estiver fechada, mostra a tela de fechado
    if (storeSettings && !storeSettings.is_open) {
      return (
        <StoreClosed 
          message={storeSettings.closed_message}
          whatsapp={storeSettings.whatsapp}
        />
      )
    }

    return (
      <MenuClient
        banners={banners}
        products={products}
        categories={categories}
        flavorCategories={flavorCategories}
        flavors={flavors}
        isStoreOpen={storeSettings?.is_open ?? true}
      />
    )
  } catch (error) {
    console.error('Error loading page:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Erro ao carregar</h1>
          <p className="text-white/80 mb-6">
            Nao foi possivel carregar o cardapio. Por favor, tente novamente mais tarde.
          </p>
          <a 
            href="https://wa.me/5517997595692" 
            className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors"
          >
            Fale Conosco no WhatsApp
          </a>
        </div>
      </div>
    )
  }
}
