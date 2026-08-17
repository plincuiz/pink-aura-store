import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { SectionTabs } from '@/components/section-tabs';

export const dynamic = 'force-dynamic';

export default async function TopPage() {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { name: 'asc' },
    include: { images: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <SiteHeader />
      <SectionTabs current="top" />
      <section className="mx-auto max-w-6xl px-6 py-8">
        {products.length === 0 ? (
          <p className="rounded-2xl border-4 border-hotpink bg-white p-6 text-center font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
            No hay productos destacados todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
