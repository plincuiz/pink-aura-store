'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requirePerm } from '@/lib/auth';

export async function createSale(formData: FormData) {
  await requirePerm('ventas');
  const productId = parseInt(String(formData.get('productId') ?? ''), 10);
  const quantity = parseInt(String(formData.get('quantity') ?? ''), 10);
  if (isNaN(productId) || isNaN(quantity) || quantity <= 0) {
    redirect('/admin/ventas');
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) redirect('/admin/ventas');
  if (product.stock < quantity) redirect('/admin/ventas?error=stock');
  const unitPriceRaw = String(formData.get('unitPrice') ?? '').trim();
  const unitPrice =
    unitPriceRaw === '' ? (product.price ?? 0) : Number(unitPriceRaw);
  const dateRaw = String(formData.get('date') ?? '').trim();
  const date = dateRaw ? new Date(`${dateRaw}T12:00:00`) : new Date();
  const notes = String(formData.get('notes') ?? '').trim() || null;
  await prisma.$transaction([
    prisma.sale.create({
      data: {
        productId,
        quantity,
        unitPrice,
        total: unitPrice * quantity,
        date,
        notes,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    }),
  ]);
  revalidatePath('/', 'layout');
  redirect('/admin/ventas');
}
