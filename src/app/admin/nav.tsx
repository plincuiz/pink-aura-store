import { prisma } from '@/lib/prisma';

const links = [
  { href: '/admin', label: 'Panel', key: 'panel' },
  { href: '/admin/productos', label: 'Productos', key: 'productos' },
  { href: '/admin/compras', label: 'Compras', key: 'compras' },
  { href: '/admin/ventas', label: 'Ventas', key: 'ventas' },
  { href: '/admin/pedidos', label: 'Pedidos', key: 'pedidos' },
  { href: '/admin/redes', label: 'Redes', key: 'redes' },
] as const;

export async function AdminNav({
  current,
}: {
  current: 'panel' | 'productos' | 'compras' | 'ventas' | 'pedidos' | 'redes';
}) {
  const pendientes = await prisma.order.count({
    where: { estado: 'pendiente' },
  });
  return (
    <nav className="flex flex-wrap items-center gap-1 rounded-full border-2 border-hotpink bg-white p-1">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          className={`rounded-full px-3 py-1 font-round text-sm font-bold ${
            current === l.key
              ? 'bg-hotpink text-white'
              : 'text-neutral-600 hover:text-hotpink'
          }`}
        >
          {l.label}
          {l.key === 'pedidos' && pendientes > 0 ? (
            <span className="ml-1 rounded-full bg-lima px-1.5 text-xs font-extrabold text-white">
              {pendientes}
            </span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}
