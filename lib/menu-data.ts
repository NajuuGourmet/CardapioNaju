export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  sizes?: { name: string; price: number }[]
  hasFlavorModal: boolean
}

export interface FlavorCategory {
  id: string
  name: string
  description: string
  required: boolean
  maxSelections: number
  minSelections: number
  extraPrice: number
  flavors: Flavor[]
}

export interface Flavor {
  id: string
  name: string
  price: number
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  icon: string
}

export const categories: ProductCategory[] = [
  { id: "acai-copo", name: "Acai no Copo", description: "Monte seu acai do seu jeito", icon: "cup" },
  { id: "acai-garrafa", name: "Acai na Garrafa", description: "Leve para casa", icon: "bottle" },
  // Futuras categorias
  // { id: "cones", name: "Cones", description: "Cones recheados", icon: "cone" },
  // { id: "doces", name: "Doces", description: "Doces gourmet", icon: "cake" },
]

export const products: Product[] = [
  {
    id: "acai-300ml",
    name: "Acai 300ml",
    description: "Escolha 1 fruta, 1 creme e 1 topping",
    price: 22,
    image: "/images/acai-copo.jpg",
    categoryId: "acai-copo",
    hasFlavorModal: true,
  },
  {
    id: "acai-500ml",
    name: "Acai 500ml",
    description: "Escolha 1 fruta, 1 creme e 1 topping",
    price: 28,
    image: "/images/acai-copo.jpg",
    categoryId: "acai-copo",
    hasFlavorModal: true,
  },
  {
    id: "garrafa-300ml",
    name: "Garrafa 300ml",
    description: "Escolha ate 2 sabores",
    price: 15,
    image: "/images/acai-garrafa.jpg",
    categoryId: "acai-garrafa",
    hasFlavorModal: true,
  },
]

export const flavorCategoriesCopo: FlavorCategory[] = [
  {
    id: "fruta",
    name: "Fruta",
    description: "Escolha 1 fruta (obrigatorio)",
    required: true,
    maxSelections: 1,
    minSelections: 1,
    extraPrice: 5,
    flavors: [
      { id: "banana", name: "Banana", price: 0 },
      { id: "morango", name: "Morango", price: 0 },
      { id: "uva", name: "Uva", price: 0 },
    ],
  },
  {
    id: "creme",
    name: "Creme",
    description: "Escolha 1 creme (obrigatorio)",
    required: true,
    maxSelections: 1,
    minSelections: 1,
    extraPrice: 5,
    flavors: [
      { id: "leite-condensado", name: "Leite Condensado", price: 0 },
      { id: "creme-pacoca", name: "Creme de Pacoca", price: 0 },
      { id: "musse-maracuja", name: "Musse de Maracuja", price: 0 },
      { id: "musse-morango", name: "Musse de Morango", price: 0 },
    ],
  },
  {
    id: "topping",
    name: "Topping",
    description: "Escolha 1 topping (obrigatorio)",
    required: true,
    maxSelections: 1,
    minSelections: 1,
    extraPrice: 5,
    flavors: [
      { id: "pacoca", name: "Pacoca", price: 0 },
      { id: "bis", name: "Bis", price: 0 },
      { id: "confete", name: "Confete", price: 0 },
      { id: "leite-ninho", name: "Leite Ninho", price: 0 },
      { id: "kitkat", name: "Kit Kat", price: 0 },
      { id: "chocobol", name: "Chocobol", price: 0 },
    ],
  },
  {
    id: "complemento",
    name: "Complementos Premium",
    description: "Adicione complementos especiais (+R$5 cada)",
    required: false,
    maxSelections: 4,
    minSelections: 0,
    extraPrice: 0,
    flavors: [
      { id: "kinder-bueno", name: "Kinder Bueno", price: 5 },
      { id: "creme-bueno", name: "Creme Bueno", price: 5 },
      { id: "nutella", name: "Nutella", price: 5 },
      { id: "creme-ninho", name: "Creme de Ninho", price: 5 },
    ],
  },
]

export const flavorCategoriesGarrafa: FlavorCategory[] = [
  {
    id: "sabor-garrafa",
    name: "Sabores",
    description: "Escolha 2 sabores para sua garrafa",
    required: true,
    maxSelections: 2,
    minSelections: 2,
    extraPrice: 0,
    flavors: [
      { id: "kinder-bueno-g", name: "Kinder Bueno", price: 0 },
      { id: "nutella-g", name: "Nutella", price: 0 },
      { id: "maracuja-g", name: "Maracuja", price: 0 },
      { id: "morango-g", name: "Morango", price: 0 },
      { id: "leite-ninho-g", name: "Leite Ninho", price: 0 },
      { id: "pacoca-g", name: "Pacoca", price: 0 },
    ],
  },
]

export function getFlavorCategories(productId: string): FlavorCategory[] {
  if (productId.includes("garrafa")) {
    return flavorCategoriesGarrafa
  }
  return flavorCategoriesCopo
}
