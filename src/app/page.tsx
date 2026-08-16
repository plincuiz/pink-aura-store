import { prisma } from '@/lib/prisma';
import { AddToCart } from '@/components/add-to-cart';
import { SiteHeader } from '@/components/header';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    include: { images: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <SiteHeader />
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const cover = product.images[0]?.url ?? product.imageUrl;
          const sinStock = product.stock <= 0;
          return (
            <article
              key={product.id}
              className="relative flex flex-col justify-between rounded-2xl border-4 border-hotpink bg-white p-4 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
            >
              {product.featured ? (
                <span className="absolute -right-2 -top-3 z-10 rotate-6 rounded-full bg-lima px-3 py-1 font-round text-xs font-extrabold text-white shadow">
                  ★ TOP
                </span>
              ) : null}
              <a href={`/producto/${product.id}`} className="block">
                <div className="relative mb-3">
                  {cover ? (
                    <img
                      src={cover}
                      alt={product.name}
                      className="aspect-square w-full rounded-xl bg-pink-100 object-contain p-2"
                    />
                  ) : null}
                  {sinStock && cover ? (
                    <span className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 font-round text-xs font-extrabold text-white">
                      Sin stock
                    </span>
                  ) : null}
                </div>
                <h2 className="font-round text-lg font-extrabold text-azul">
                  {product.name}
                </h2>
                {product.description ? (
                  <p className="mt-1 line-clamp-2 font-round text-sm font-semibold text-neutral-500">
                    {product.description}
                  </p>
                ) : null}
              </a>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="font-round text-xl font-extrabold text-lima">
                  {product.price != null ? `$${product.price}` : 'A confirmar'}
                </span>
                {sinStock ? (
                  <span className="font-round text-xs font-extrabold text-red-500">
                    Sin stock
                  </span>
                ) : (
                  <AddToCart
                    id={product.id}
                    name={product.name}
                    price={product.price}
                  />
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
