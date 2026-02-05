-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES product_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  has_flavors BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flavor_categories table (for organizing flavors by type)
CREATE TABLE IF NOT EXISTS flavor_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  max_selections INTEGER DEFAULT 1,
  extra_price DECIMAL(10,2) DEFAULT 0,
  display_order INTEGER DEFAULT 0
);

-- Create flavors table
CREATE TABLE IF NOT EXISTS flavors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flavor_category_id UUID REFERENCES flavor_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  extra_price DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  selected_flavors JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert categories
INSERT INTO product_categories (id, name, description, display_order) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Açaí no Copo', 'Açaí cremoso servido no copo com suas coberturas favoritas', 1),
  ('22222222-2222-2222-2222-222222222222', 'Açaí na Garrafa', 'Açaí puro para levar para casa', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert products
INSERT INTO products (id, category_id, name, description, price, has_flavors, display_order) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Açaí 300ml', 'Açaí cremoso 300ml com 1 fruta, 1 creme, 1 topping', 22.00, true, 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Açaí 500ml', 'Açaí cremoso 500ml com 1 fruta, 1 creme, 1 topping', 28.00, true, 2),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Garrafa 1L', 'Açaí puro 1 litro - escolha 2 sabores', 35.00, true, 1),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Garrafa 2L', 'Açaí puro 2 litros - escolha 2 sabores', 65.00, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Insert flavor categories for Açaí 300ml
INSERT INTO flavor_categories (id, product_id, name, is_required, max_selections, extra_price, display_order) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fruta', true, 1, 5.00, 1),
  ('f2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Creme', true, 1, 5.00, 2),
  ('f3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Topping', true, 1, 5.00, 3),
  ('f4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Complementos', false, 4, 0, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert flavor categories for Açaí 500ml
INSERT INTO flavor_categories (id, product_id, name, is_required, max_selections, extra_price, display_order) VALUES
  ('f5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fruta', true, 1, 5.00, 1),
  ('f6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Creme', true, 1, 5.00, 2),
  ('f7777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Topping', true, 1, 5.00, 3),
  ('f8888888-8888-8888-8888-888888888888', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Complementos', false, 4, 0, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert flavor categories for Garrafa 1L
INSERT INTO flavor_categories (id, product_id, name, is_required, max_selections, extra_price, display_order) VALUES
  ('f9999999-9999-9999-9999-999999999999', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sabores', true, 2, 0, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert flavor categories for Garrafa 2L
INSERT INTO flavor_categories (id, product_id, name, is_required, max_selections, extra_price, display_order) VALUES
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Sabores', true, 2, 0, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert flavors for Açaí 300ml - Frutas
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'Banana', 0, 1),
  ('f1111111-1111-1111-1111-111111111111', 'Morango', 0, 2),
  ('f1111111-1111-1111-1111-111111111111', 'Uva', 0, 3);

-- Insert flavors for Açaí 300ml - Cremes
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f2222222-2222-2222-2222-222222222222', 'Leite Condensado', 0, 1),
  ('f2222222-2222-2222-2222-222222222222', 'Creme de Paçoca', 0, 2),
  ('f2222222-2222-2222-2222-222222222222', 'Musse de Maracujá', 0, 3),
  ('f2222222-2222-2222-2222-222222222222', 'Musse de Morango', 0, 4);

-- Insert flavors for Açaí 300ml - Toppings
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f3333333-3333-3333-3333-333333333333', 'Paçoca', 0, 1),
  ('f3333333-3333-3333-3333-333333333333', 'Bis', 0, 2),
  ('f3333333-3333-3333-3333-333333333333', 'Confete', 0, 3),
  ('f3333333-3333-3333-3333-333333333333', 'Leite Ninho', 0, 4),
  ('f3333333-3333-3333-3333-333333333333', 'Kit Kat', 0, 5),
  ('f3333333-3333-3333-3333-333333333333', 'Chocobol', 0, 6);

-- Insert flavors for Açaí 300ml - Complementos (pagos)
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f4444444-4444-4444-4444-444444444444', 'Kinder Bueno', 5.00, 1),
  ('f4444444-4444-4444-4444-444444444444', 'Creme Bueno', 5.00, 2),
  ('f4444444-4444-4444-4444-444444444444', 'Nutella', 5.00, 3),
  ('f4444444-4444-4444-4444-444444444444', 'Creme de Ninho', 5.00, 4);

-- Insert flavors for Açaí 500ml - Frutas
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f5555555-5555-5555-5555-555555555555', 'Banana', 0, 1),
  ('f5555555-5555-5555-5555-555555555555', 'Morango', 0, 2),
  ('f5555555-5555-5555-5555-555555555555', 'Uva', 0, 3);

-- Insert flavors for Açaí 500ml - Cremes
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f6666666-6666-6666-6666-666666666666', 'Leite Condensado', 0, 1),
  ('f6666666-6666-6666-6666-666666666666', 'Creme de Paçoca', 0, 2),
  ('f6666666-6666-6666-6666-666666666666', 'Musse de Maracujá', 0, 3),
  ('f6666666-6666-6666-6666-666666666666', 'Musse de Morango', 0, 4);

-- Insert flavors for Açaí 500ml - Toppings
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f7777777-7777-7777-7777-777777777777', 'Paçoca', 0, 1),
  ('f7777777-7777-7777-7777-777777777777', 'Bis', 0, 2),
  ('f7777777-7777-7777-7777-777777777777', 'Confete', 0, 3),
  ('f7777777-7777-7777-7777-777777777777', 'Leite Ninho', 0, 4),
  ('f7777777-7777-7777-7777-777777777777', 'Kit Kat', 0, 5),
  ('f7777777-7777-7777-7777-777777777777', 'Chocobol', 0, 6);

-- Insert flavors for Açaí 500ml - Complementos (pagos)
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f8888888-8888-8888-8888-888888888888', 'Kinder Bueno', 5.00, 1),
  ('f8888888-8888-8888-8888-888888888888', 'Creme Bueno', 5.00, 2),
  ('f8888888-8888-8888-8888-888888888888', 'Nutella', 5.00, 3),
  ('f8888888-8888-8888-8888-888888888888', 'Creme de Ninho', 5.00, 4);

-- Insert flavors for Garrafa 1L - Sabores
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('f9999999-9999-9999-9999-999999999999', 'Kinder Bueno', 0, 1),
  ('f9999999-9999-9999-9999-999999999999', 'Nutella', 0, 2),
  ('f9999999-9999-9999-9999-999999999999', 'Maracujá', 0, 3),
  ('f9999999-9999-9999-9999-999999999999', 'Morango', 0, 4),
  ('f9999999-9999-9999-9999-999999999999', 'Leite Ninho', 0, 5),
  ('f9999999-9999-9999-9999-999999999999', 'Paçoca', 0, 6);

-- Insert flavors for Garrafa 2L - Sabores
INSERT INTO flavors (flavor_category_id, name, extra_price, display_order) VALUES
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kinder Bueno', 0, 1),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nutella', 0, 2),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maracujá', 0, 3),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Morango', 0, 4),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Leite Ninho', 0, 5),
  ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Paçoca', 0, 6);

-- Enable RLS on all tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on flavor_categories" ON flavor_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on flavors" ON flavors FOR SELECT USING (true);

-- Create policies for order creation (public can create orders)
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on activity_logs" ON activity_logs FOR INSERT WITH CHECK (true);
