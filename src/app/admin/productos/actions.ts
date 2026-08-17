'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { saveFile } from '@/lib/storage';
import { requirePerm } from '@/lib/auth';

function calcPrice(cost: number | null, margin: number | null): number | null {
  if (cost == null) return null;
  const m = margin ?? 70;
  return Math.round(cost * (1 + m / 100));
}

async function resolveSectionId(formData: FormData): Promise<number> {
  const raw = parseInt(String(formData.get('sectionId') ?? ''), 10);
  if (!isNaN(raw)) return raw;
  const first = await prisma.section.findFirst({ orderBy: { id: 'asc' } });
  return first?.id ?? 0;
}

async function saveImages(formData: FormData, productId: number) {
  const files = formData.getAll('image');
  const valid = files.filter(
    (f): f is File => typeof f !== 'string' && f.size > 0
  );
  if (valid.length === 0) return;
  for (const file of valid) {
    const url = await saveFile(file, 'productos');
    await prisma.productImage.create({ data: { url, productId } });
  }
}

export async function createProduct(formData: FormData) {
  await requirePerm('productos');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) redirect('/admin/productos');
  const sectionId = await resolveSectionId(formData);
  const description = String(formData.get('description') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const stock = parseInt(String(formData.get('stock') ?? '0'), 10) || 0;
  const costRaw = String(formData.get('cost') ?? '').trim();
  const cost = costRaw === '' ? null : Number(costRaw);
  const marginRaw = String(formData.get('marginPercent') ?? '').trim();
  const marginPercent = marginRaw === '' ? 70 : Number(marginRaw);
  const active = formData.get('active') === 'on';
  const featured = formData.get('featured') === 'on';
  const product = await prisma.product.create({
    data: {
      name,
      description,
      category,
      sectionId,
      stock,
      cost,
      marginPercent: cost == null ? null : marginPercent,
      price: calcPrice(cost, marginPercent),
      active,
      featured,
    },
  });
  await saveImages(formData, product.id);
  revalidatePath('/', 'layout');
  redirect('/admin/productos');
}

export async function updateProduct(formData: FormData) {
  await requirePerm('productos');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/productos');
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) redirect('/admin/productos');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) redirect(`/admin/productos/${id}/editar`);
  const sectionId = await resolveSectionId(formData);
  const description = String(formData.get('description') ?? '').trim() || null;
  const category = String(formData.get('category') ?? '').trim() || null;
  const stock = parseInt(String(formData.get('stock') ?? '0'), 10) || 0;
  const costRaw = String(formData.get('cost') ?? '').trim();
  const cost = costRaw === '' ? null : Number(costRaw);
  const marginRaw = String(formData.get('marginPercent') ?? '').trim();
  const marginPercent = marginRaw === '' ? 70 : Number(marginRaw);
  const active = formData.get('active') === 'on';
  const featured = formData.get('featured') === 'on';
  const removeIds = formData
    .getAll('removeImages')
    .map((v) => Number(v))
    .filter((n) => !isNaN(n));
  if (removeIds.length > 0) {
    await prisma.productImage.deleteMany({
      where: { id: { in: removeIds }, productId: id },
    });
  }
  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      category,
      sectionId,
      stock,
      cost,
      marginPercent: cost == null ? null : marginPercent,
      price: calcPrice(cost, marginPercent),
      active,
      featured,
    },
  });
  await saveImages(formData, id);
  revalidatePath('/', 'layout');
  redirect('/admin/productos');
}

export async function deleteProduct(formData: FormData) {
  await requirePerm('productos-delete');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!isNaN(id)) {
    await prisma.product.delete({ where: { id } });
  }
  revalidatePath('/', 'layout');
  redirect('/admin/productos');
}
