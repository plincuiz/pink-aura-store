import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { updateProduct } from '../../actions';
import { ProductForm } from '../../form';
export const dynamic = 'force-dynamic';
export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: { orderBy: { id: 'asc' } } },
  });
  if (!product) notFound();
  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-neutral-800">
      <div className="mx-auto max-w-xl">
        <h1 className="font-logo text-2xl text-hotpink">EDITAR PRODUCTO</h1>
        <div className="mt-6 rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <ProductForm action={updateProduct} initial={product} />
        </div>
        <a
          href="/admin/productos"
          className="mt-4 inline-block font-round text-sm font-bold text-neutral-500 hover:text-hotpink"
        >
          Volver
        </a>
      </div>
    </main>
  );
}
