'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function confirmOrder(formData: FormData) {
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/pedidos');
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order || order.estado !== 'pendiente') redirect('/admin/pedidos');
  for (const item of order.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product || product.stock < item.cantidad) {
      redirect(`/admin/pedidos?error=stock&id=${order.id}`);
    }
  }
  await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: { estado: 'confirmado' },
    }),
    ...order.items.map((item) =>
      prisma.sale.create({
        data: {
          productId: item.productId,
          quantity: item.cantidad,
          unitPrice: item.precioSnapshot,
          total: item.subtotal,
          notes: `Pedido #${order.id}`,
        },
      })
    ),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.cantidad } },
      })
    ),
  ]);
  revalidatePath('/', 'layout');
  redirect('/admin/pedidos');
}

export async function cancelOrder(formData: FormData) {
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/pedidos');
  await prisma.order.update({
    where: { id },
    data: { estado: 'cancelado' },
  });
  revalidatePath('/', 'layout');
  redirect('/admin/pedidos');
}

export async function deliverOrder(formData: FormData) {
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/pedidos');
  await prisma.order.update({
    where: { id },
    data: { estado: 'entregado' },
  });
  revalidatePath('/', 'layout');
  redirect('/admin/pedidos');
}
