import type { Product, ProductImage } from '@prisma/client';
import { AddToCart } from './add-to-cart';

const money = (n: number) => '$' + n.toLocaleString('es-AR');

export function ProductCard({
  product,
}: {
  product: Product & { images: ProductImage[] };
}) {
  const cover = product.images[0]?.url ?? product.imageUrl;
  return (
    <article className="relative rounded-2xl border-4 border-hotpink bg-white p-4 shadow-[5px_5px_0_rgba(233,58,154,0.25)] transition hover:border-pink-400">
      {product.featured ? (
        <span className="absolute -right-2 -top-3 z-10 rotate-6 rounded-full border-2 border-lima bg-lime-100 px-2 py-0.5 font-round text-xs font-extrabold text-lime-700">
          ★ TOP
        </span>
      ) : null}
      <a href={`/producto/${product.id}`} className="block">
        <div className="rounded-xl bg-pink-100 p-2">
          {cover ? (
            <img
              src={cover}
              alt={product.name}
              className="h-56 w-full rounded-lg object-cover"
            />
          ) : (
            <div className="h-56 w-full rounded-lg bg-pink-200" />
          )}
        </div>
        <h2 className="mt-3 font-round text-sm font-extrabold uppercase text-azul">
          {product.name}
        </h2>
        {product.description ? (
          <p className="mt-1 line-clamp-2 font-round text-xs font-semibold text-neutral-500">
            {product.description}
          </p>
        ) : null}
      </a>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="font-round text-lg font-extrabold text-lima">
          {product.price != null ? money(product.price) : ''}
        </span>
        {product.stock <= 0 ? (
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
}
