-- =============================================
-- Cardapio Naju - Seed Data
-- =============================================

-- Store Settings
INSERT INTO store_settings (is_open, open_message, closed_message, whatsapp)
VALUES (true, 'Estamos abertos! Faca seu pedido.', 'Estamos fechados no momento. Volte mais tarde!', '5517997595692')
ON CONFLICT DO NOTHING;

-- Banners
INSERT INTO banners (title, image_url, active, sort_order)
VALUES 
  ('Promo Acai', '/images/banner-acai.jpg', true, 1),
  ('Novidades', '/images/banner-novidades.jpg', true, 2);

-- Product Categories
INSERT INTO product_categories (id, name, slug, emoji, color)
VALUES 
  ('a1b2c3d4-1111-1111-1111-111111111111', 'Acai no Copo', 'acai-copo', '🍧', '#7C3AED'),
  ('a1b2c3d4-2222-2222-2222-222222222222', 'Acai na Garrafa', 'acai-garrafa', '🍶', '#EC4899');

-- Products
INSERT INTO products (name, description, price, category_id, image_url, available)
VALUES 
  ('Acai 300ml', 'Escolha 1 fruta, 1 creme e 1 topping', 22.00, 'a1b2c3d4-1111-1111-1111-111111111111', '/images/acai-copo.jpg', true),
  ('Acai 500ml', 'Escolha 1 fruta, 1 creme e 1 topping', 28.00, 'a1b2c3d4-1111-1111-1111-111111111111', '/images/acai-copo.jpg', true),
  ('Garrafa 300ml', 'Escolha ate 2 sabores', 15.00, 'a1b2c3d4-2222-2222-2222-222222222222', '/images/acai-garrafa.jpg', true);

-- Flavor Categories for Acai no Copo
INSERT INTO flavor_categories (id, name, slug, max_selections, is_required, extra_price, applies_to, sort_order)
VALUES 
  ('f1a1a1a1-1111-1111-1111-111111111111', 'Fruta', 'fruta', 1, true, 0, 'acai-copo', 1),
  ('f1a1a1a1-2222-2222-2222-222222222222', 'Creme', 'creme', 1, true, 0, 'acai-copo', 2),
  ('f1a1a1a1-3333-3333-3333-333333333333', 'Topping', 'topping', 1, true, 0, 'acai-copo', 3),
  ('f1a1a1a1-4444-4444-4444-444444444444', 'Complementos Premium', 'complemento', 4, false, 0, 'acai-copo', 4),
  ('f1a1a1a1-5555-5555-5555-555555555555', 'Sabores', 'sabor-garrafa', 2, true, 0, 'acai-garrafa', 1);

-- Flavors: Frutas
INSERT INTO flavors (name, category_id, extra_price, available, sort_order)
VALUES 
  ('Banana', 'f1a1a1a1-1111-1111-1111-111111111111', 0, true, 1),
  ('Morango', 'f1a1a1a1-1111-1111-1111-111111111111', 0, true, 2),
  ('Uva', 'f1a1a1a1-1111-1111-1111-111111111111', 0, true, 3);

-- Flavors: Cremes
INSERT INTO flavors (name, category_id, extra_price, available, sort_order)
VALUES 
  ('Leite Condensado', 'f1a1a1a1-2222-2222-2222-222222222222', 0, true, 1),
  ('Creme de Pacoca', 'f1a1a1a1-2222-2222-2222-222222222222', 0, true, 2),
  ('Musse de Maracuja', 'f1a1a1a1-2222-2222-2222-222222222222', 0, true, 3),
  ('Musse de Morango', 'f1a1a1a1-2222-2222-2222-222222222222', 0, true, 4);

-- Flavors: Toppings
INSERT INTO flavors (name, category_id, extra_price, available, sort_order)
VALUES 
  ('Pacoca', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 1),
  ('Bis', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 2),
  ('Confete', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 3),
  ('Leite Ninho', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 4),
  ('Kit Kat', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 5),
  ('Chocobol', 'f1a1a1a1-3333-3333-3333-333333333333', 0, true, 6);

-- Flavors: Complementos Premium
INSERT INTO flavors (name, category_id, extra_price, available, sort_order)
VALUES 
  ('Kinder Bueno', 'f1a1a1a1-4444-4444-4444-444444444444', 5, true, 1),
  ('Creme Bueno', 'f1a1a1a1-4444-4444-4444-444444444444', 5, true, 2),
  ('Nutella', 'f1a1a1a1-4444-4444-4444-444444444444', 5, true, 3),
  ('Creme de Ninho', 'f1a1a1a1-4444-4444-4444-444444444444', 5, true, 4);

-- Flavors: Sabores Garrafa
INSERT INTO flavors (name, category_id, extra_price, available, sort_order)
VALUES 
  ('Kinder Bueno', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 1),
  ('Nutella', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 2),
  ('Maracuja', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 3),
  ('Morango', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 4),
  ('Leite Ninho', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 5),
  ('Pacoca', 'f1a1a1a1-5555-5555-5555-555555555555', 0, true, 6);
