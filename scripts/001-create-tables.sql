-- =============================================
-- Cardapio Naju - Database Schema
-- =============================================

-- Store Settings
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_message TEXT NOT NULL DEFAULT 'Estamos abertos! Faca seu pedido.',
  closed_message TEXT NOT NULL DEFAULT 'Estamos fechados no momento. Volte mais tarde!',
  whatsapp TEXT NOT NULL DEFAULT '5517997595692',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product Categories
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  emoji TEXT,
  color TEXT
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true
);

-- Flavor Categories
CREATE TABLE IF NOT EXISTS flavor_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  max_selections INTEGER NOT NULL DEFAULT 1,
  is_required BOOLEAN NOT NULL DEFAULT false,
  extra_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  applies_to TEXT NOT NULL DEFAULT 'all',
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Flavors
CREATE TABLE IF NOT EXISTS flavors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES flavor_categories(id) ON DELETE CASCADE,
  extra_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL DEFAULT 'Cliente via Cardapio',
  customer_phone TEXT NOT NULL DEFAULT '',
  total NUMERIC(10,2) NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pendente',
  delivery_type TEXT NOT NULL DEFAULT 'retirada',
  address TEXT DEFAULT '',
  payment_method TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  selected_flavors JSONB
);

-- =============================================
-- Enable Row Level Security
-- =============================================
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies - Public read access for menu data
-- =============================================
CREATE POLICY "Allow public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Allow public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read flavor_categories" ON flavor_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read flavors" ON flavors FOR SELECT USING (true);

-- Orders: public can insert (create orders)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);

-- Order Items: public can insert
CREATE POLICY "Allow public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
