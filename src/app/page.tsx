import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/header';
import { ProductCard } from '@/components/product-card';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [sections, featured] = await Promise.all([
    prisma.section.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.product.findMany({
      where: { active: true, featured: true },
      orderBy: { name: 'asc' },
      include: { images: true },
    }),
  ]);
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <SiteHeader />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-6 pt-8">
        <a href="/top" className="rounded-full border-4 border-lima bg-white px-8 py-4 font-logo text-xl uppercase text-lime-700 shadow-[5px_5px_0_rgba(132,204,22,0.35)] transition hover:scale-105 hover:bg-lima hover:text-white sm:text-2xl">★ TOP</a>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`/seccion/${s.id}`}
            className="rounded-full border-4 border-hotpink bg-white px-8 py-4 font-logo text-xl uppercase text-hotpink shadow-[5px_5px_0_rgba(233,58,154,0.35)] transition hover:scale-105 hover:bg-hotpink hover:text-white sm:text-2xl"
          >
            {s.name}
          </a>
        ))}
      </div>
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-center font-logo text-2xl text-hotpink drop-shadow-[2px_2px_0_rgba(132,204,22,0.35)] sm:text-3xl">
          ★ TOP
        </h2>
        {featured.length === 0 ? (
          <p className="mt-6 rounded-2xl border-4 border-hotpink bg-white p-6 text-center font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
            Todavía no hay productos destacados.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
