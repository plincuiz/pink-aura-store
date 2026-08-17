'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requirePerm } from '@/lib/auth';

export async function createPurchase(formData: FormData) {
  await requirePerm('compras');
  const productId = parseInt(String(formData.get('productId') ?? ''), 10);
  const quantity = parseInt(String(formData.get('quantity') ?? ''), 10);
  if (isNaN(productId) || isNaN(quantity) || quantity <= 0) {
    redirect('/admin/compras');
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) redirect('/admin/compras');
  const unitCostRaw = String(formData.get('unitCost') ?? '').trim();
  const unitCost =
    unitCostRaw === '' ? (product.cost ?? 0) : Number(unitCostRaw);
  const dateRaw = String(formData.get('date') ?? '').trim();
  const date = dateRaw ? new Date(`${dateRaw}T12:00:00`) : new Date();
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
      data: { stock: { increment: quantity } },
    }),
  ]);
  revalidatePath('/', 'layout');
  redirect('/admin/compras');
}
