'use server';
import { prisma } from '@/lib/prisma';
import type { CartItem } from '@/lib/cart';

type OrderData = {
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  observaciones: string;
};

export async function createOrder(
  items: CartItem[],
  data: OrderData
): Promise<{ ok: boolean; id?: number; error?: string }> {
  if (!items.length) return { ok: false, error: 'El carrito está vacío' };
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.id) }, active: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = [];
  for (const item of items) {
    const p = byId.get(item.id);
    if (!p || p.price == null) {
      return { ok: false, error: `Producto no disponible: ${item.name}` };
    }
    if (p.stock < item.qty) {
      return { ok: false, error: `Stock insuficiente: ${item.name}` };
    }
    lines.push({
      productId: p.id,
      nombreSnapshot: p.name,
      precioSnapshot: p.price,
      cantidad: item.qty,
      subtotal: p.price * item.qty,
    });
  }
  const total = lines.reduce((acc, l) => acc + l.subtotal, 0);
  const order = await prisma.order.create({
    data: {
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: data.email.trim(),
      celular: data.celular.trim(),
      observaciones: data.observaciones.trim() || null,
      total,
      items: { create: lines },
    },
    include: { items: true },
  });

  const detalle = order.items
    .map((l) => `${l.cantidad} x ${l.nombreSnapshot} - $${l.precioSnapshot} c/u`)
    .join('\n');
  console.log(`
==== NUEVO PEDIDO PINK AURA #${order.id} ====
Cliente: ${order.nombre} ${order.apellido}
Email: ${order.email}
Celular: ${order.celular}
Productos:
${detalle}
Total: $${order.total}
Observaciones: ${order.observaciones ?? '-'}
=============================================`);

  return { ok: true, id: order.id };
}
