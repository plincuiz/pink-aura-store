import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Gallery } from '../gallery';
import { AddToCart } from '@/components/add-to-cart';
import { SiteHeader } from '@/components/header';
export const dynamic = 'force-dynamic';
export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { images: { orderBy: { id: 'asc' } } },
  });
  if (!product || !product.active) notFound();
  const all =
    product.images.length > 0
      ? product.images.map((i) => i.url)
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <a
          href="/"
          className="font-round text-sm font-bold text-hotpink hover:underline"
        >
          ← Volver al catálogo
        </a>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            {all.length > 0 ? (
              <Gallery images={all} name={product.name} />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl border-4 border-hotpink bg-white font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
                Sin fotos
              </div>
            )}
          </div>
          <div>
            {product.category ? (
              <p className="font-round text-xs font-extrabold uppercase tracking-widest text-neutral-500">
                {product.category}
              </p>
            ) : null}
            <h1 className="mt-1 font-round text-3xl font-extrabold text-azul">
              {product.name}
            </h1>
            <p className="mt-4 font-round text-3xl font-extrabold text-lima">
              {product.price != null ? `$${product.price}` : 'A confirmar'}
            </p>
            {product.stock <= 0 ? (
              <p className="mt-2 inline-block rounded-full bg-red-500 px-3 py-1 font-round text-sm font-extrabold text-white">
                Sin stock
              </p>
            ) : (
              <div className="mt-4">
                <AddToCart
                  id={product.id}
                  name={product.name}
                  price={product.price}
                />
              </div>
            )}
            {product.description ? (
              <div className="mt-6 rounded-2xl border-4 border-hotpink bg-white p-4 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
                <h2 className="font-round text-sm font-extrabold text-hotpink">
                  Descripción
                </h2>
                <p className="mt-1 whitespace-pre-line font-round text-sm font-semibold text-neutral-600">
                  {product.description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
