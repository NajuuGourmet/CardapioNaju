// Data fetching functions for Supabase
import { createClient } from '@/lib/supabase/server'
import type { Banner, Product, ProductCategory, FlavorCategory, Flavor, StoreSettings } from '@/lib/types'

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching store settings:', error)
    return null
  }

  return data
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching banners:', error)
    return []
  }

  return data || []
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*)
    `)
    .eq('available', true)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getFlavorCategories(): Promise<FlavorCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flavor_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching flavor categories:', error)
    return []
  }

  return data || []
}

export async function getFlavors(): Promise<Flavor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('flavors')
    .select(`
      *,
      category:flavor_categories(*)
    `)
    .eq('available', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching flavors:', error)
    return []
  }

  return data || []
}
