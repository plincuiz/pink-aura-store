import { prisma } from '@/lib/prisma';
import { requirePerm, roleCan, type Perm } from '@/lib/auth';

const links: { href: string; label: string; key: string; perm: Perm }[] = [
  { href: '/admin', label: 'Panel', key: 'panel', perm: 'panel' },
  { href: '/admin/productos', label: 'Productos', key: 'productos', perm: 'productos' },
  { href: '/admin/secciones', label: 'Secciones', key: 'secciones', perm: 'secciones' },
  { href: '/admin/compras', label: 'Compras', key: 'compras', perm: 'compras' },
  { href: '/admin/ventas', label: 'Ventas', key: 'ventas', perm: 'ventas' },
  { href: '/admin/pedidos', label: 'Pedidos', key: 'pedidos', perm: 'pedidos' },
  { href: '/admin/redes', label: 'Redes', key: 'redes', perm: 'redes' },
  { href: '/admin/usuarios', label: 'Usuarios', key: 'usuarios', perm: 'usuarios' },
];

export async function AdminNav({ current }: { current: string }) {
  const me = await requirePerm(
    links.find((l) => l.key === current)?.perm ?? 'panel'
  );
  const visibles = links.filter((l) => roleCan(me.role, l.perm));
  const pendientes = roleCan(me.role, 'pedidos')
    ? await prisma.order.count({ where: { estado: 'pendiente' } })
    : 0;
  return (
    <nav className="flex flex-wrap items-center gap-1 rounded-full border-2 border-hotpink bg-white p-1">
      {visibles.map((l) => (
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
