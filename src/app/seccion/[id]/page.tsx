import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { SiteHeader } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { SectionTabs } from '@/components/section-tabs';

export const dynamic = 'force-dynamic';

export default async function SeccionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sectionId = Number(id);
  const section = await prisma.section.findUnique({
    where: { id: sectionId },
  });
  if (!section) notFound();
  const products = await prisma.product.findMany({
    where: { active: true, sectionId },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    include: { images: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <SiteHeader />
      <SectionTabs current={sectionId} />
      <section className="mx-auto max-w-6xl px-6 py-8">
        {products.length === 0 ? (
          <p className="rounded-2xl border-4 border-hotpink bg-white p-6 text-center font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
            No hay productos cargados en esta sección todavía.
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
