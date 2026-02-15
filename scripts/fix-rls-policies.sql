-- Drop existing policies first, then recreate them
-- This ensures clean state for all menu-related tables

-- store_settings
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read store_settings" ON public.store_settings;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read store_settings"
  ON public.store_settings FOR SELECT TO anon USING (true);

-- products
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read products" ON public.products;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read products"
  ON public.products FOR SELECT TO anon USING (true);

-- product_categories
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read product_categories" ON public.product_categories;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read product_categories"
  ON public.product_categories FOR SELECT TO anon USING (true);

-- flavor_categories
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read flavor_categories" ON public.flavor_categories;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read flavor_categories"
  ON public.flavor_categories FOR SELECT TO anon USING (true);

-- flavors
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read flavors" ON public.flavors;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read flavors"
  ON public.flavors FOR SELECT TO anon USING (true);

-- banners
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read banners" ON public.banners;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read banners"
  ON public.banners FOR SELECT TO anon USING (true);

-- orders (insert + read)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous insert orders" ON public.orders;
  DROP POLICY IF EXISTS "Allow anonymous read orders" ON public.orders;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous insert orders"
  ON public.orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous read orders"
  ON public.orders FOR SELECT TO anon USING (true);

-- order_items (insert + read)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous insert order_items" ON public.order_items;
  DROP POLICY IF EXISTS "Allow anonymous read order_items" ON public.order_items;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous insert order_items"
  ON public.order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous read order_items"
  ON public.order_items FOR SELECT TO anon USING (true);

-- product_options
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow anonymous read product_options" ON public.product_options;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
CREATE POLICY "Allow anonymous read product_options"
  ON public.product_options FOR SELECT TO anon USING (true);
