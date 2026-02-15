import { MenuClient } from "@/components/menu-client"
import { StoreClosed } from "@/components/store-closed"
import type { Banner, Product, ProductCategory, FlavorCategory, Flavor, StoreSettings } from "@/lib/types"

async function loadData() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[v0] Supabase env vars not set, using fallback data')
      return null
    }

    const { getBanners, getProducts, getProductCategories, getFlavorCategories, getFlavors, getStoreSettings } = await import("@/lib/data")

    const [banners, products, categories, flavorCategories, flavors, storeSettings] = await Promise.all([
      getBanners(),
      getProducts(),
      getProductCategories(),
      getFlavorCategories(),
      getFlavors(),
      getStoreSettings(),
    ])

    return { banners, products, categories, flavorCategories, flavors, storeSettings }
  } catch (error) {
    console.error('[v0] Error loading data from Supabase:', error)
    return null
  }
}

function getFallbackData() {
  const { products: localProducts, categories: localCategories, flavorCategoriesCopo, flavorCategoriesGarrafa } = require("@/lib/menu-data")

  // Convert local menu-data format to Supabase format
  const categories: ProductCategory[] = localCategories.map((c: { id: string; name: string; description: string }) => ({
    id: c.id,
    name: c.name,
    slug: c.id,
    emoji: null,
    color: null,
  }))

  const products: Product[] = localProducts.map((p: { id: string; name: string; description: string; price: number; image: string; categoryId: string }) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category_id: p.categoryId,
    image_url: p.image,
    available: true,
  }))

  const allFlavorCategories = [...flavorCategoriesCopo, ...flavorCategoriesGarrafa]
  const flavorCategories: FlavorCategory[] = allFlavorCategories.map((fc: { id: string; name: string; maxSelections: number; required: boolean; extraPrice: number; flavors: { id: string; name: string; price: number }[] }) => ({
    id: fc.id,
    name: fc.name,
    slug: fc.id,
    max_selections: fc.maxSelections,
    is_required: fc.required,
    extra_price: fc.extraPrice,
    applies_to: flavorCategoriesGarrafa.includes(fc) ? 'garrafa' : 'copo',
    sort_order: 0,
  }))

  const flavors: Flavor[] = allFlavorCategories.flatMap((fc: { id: string; flavors: { id: string; name: string; price: number }[] }) =>
    fc.flavors.map((f: { id: string; name: string; price: number }) => ({
      id: f.id,
      name: f.name,
      category_id: fc.id,
      extra_price: f.price,
      available: true,
      sort_order: 0,
    }))
  )

  return {
    banners: [] as Banner[],
    products,
    categories,
    flavorCategories,
    flavors,
    storeSettings: null as StoreSettings | null,
  }
}

export default async function Home() {
  const data = await loadData()

  const { banners, products, categories, flavorCategories, flavors, storeSettings } = data || getFallbackData()

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
}
