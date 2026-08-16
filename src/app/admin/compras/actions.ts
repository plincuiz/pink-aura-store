'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

function parseDate(value: string): Date {
  if (!value) return new Date();
  const d = new Date(`${value}T12:00:00`);
  return isNaN(d.getTime()) ? new Date() : d;
}

export async function createPurchase(formData: FormData) {
  const productId = parseInt(String(formData.get('productId') ?? ''), 10);
  const quantity = parseInt(String(formData.get('quantity') ?? ''), 10);
  if (isNaN(productId) || isNaN(quantity) || quantity <= 0) {
    redirect('/admin/compras?error=1');
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) redirect('/admin/compras?error=1');

  const unitCostRaw = String(formData.get('unitCost') ?? '').trim();
  const unitCost =
    unitCostRaw === '' ? (product.cost ?? 0) : Number(unitCostRaw);
  const date = parseDate(String(formData.get('date') ?? ''));
  const notes = String(formData.get('notes') ?? '').trim() || null;

  await prisma.$transaction([
    prisma.purchase.create({
      data: {
        productId,
        quantity,
        unitCost,
        total: unitCost * quantity,
        date,
        notes,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: product.stock + quantity },
    }),
  ]);

  revalidatePath('/', 'layout');
  redirect('/admin/compras');
}
