import { prisma } from '@/lib/prisma';

export async function SectionTabs({
  current,
}: {
  current: number | 'top';
}) {
  const sections = await prisma.section.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-6 pt-6">
      <a
        href="/top"
        className={`rounded-full border-4 px-6 py-2 font-logo text-lg uppercase transition hover:scale-105 ${
          current === 'top'
            ? 'border-lima bg-lima text-white shadow-[4px_4px_0_rgba(132,204,22,0.4)]'
            : 'border-lima bg-white text-lime-700 shadow-[4px_4px_0_rgba(132,204,22,0.25)]'
        }`}
      >
        ★ TOP
      </a>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`/seccion/${s.id}`}
          className={`rounded-full border-4 px-6 py-2 font-logo text-lg uppercase transition hover:scale-105 ${
            s.id === current
              ? 'border-hotpink bg-hotpink text-white shadow-[4px_4px_0_rgba(233,58,154,0.35)]'
              : 'border-hotpink bg-white text-hotpink shadow-[4px_4px_0_rgba(233,58,154,0.2)]'
          }`}
        >
          {s.name}
        </a>
      ))}
    </div>
  );
}
