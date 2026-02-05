import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      customer_name, 
      customer_phone, 
      items, 
      total, 
      notes,
      delivery_type,
      address,
      payment_method,
      status
    } = body

    const supabase = await createClient()

    // Criar o pedido com todos os campos que o painel espera
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customer_name || 'Cliente via Cardapio',
        customer_phone: customer_phone || '',
        total,
        notes: notes || '',
        status: status || 'pendente',
        delivery_type: delivery_type || 'retirada',
        address: address || '',
        payment_method: payment_method || '',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
    }

    // Criar os itens do pedido com todos os campos
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.quantity * item.unit_price,
      selected_flavors: item.selected_flavors || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json({ error: 'Erro ao criar itens do pedido' }, { status: 500 })
    }

    return NextResponse.json({ success: true, order_id: order.id })
  } catch (error) {
    console.error('Error processing order:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
