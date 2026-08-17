import { prisma } from '@/lib/prisma';
import { requirePerm, roleCan } from '@/lib/auth';
import { deleteProduct } from './actions';
import { ConfirmDeleteButton } from './confirm-button';
import { AdminNav } from '../nav';
export const dynamic = 'force-dynamic';
const money = (n: number) => '$' + n.toLocaleString('es-AR');
export default async function ProductosPage() {
  const me = await requirePerm('productos');
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: { images: true, section: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">PRODUCTOS</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="productos" />
          <a
            href="/admin/productos/nuevo"
            className="rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
          >
            + Nuevo producto
          </a>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Sección</th>
                <th className="px-4 py-3">Costo</th>
                <th className="px-4 py-3">Margen %</th>
                <th className="px-4 py-3">Precio venta</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {products.map((p) => {
                const cover = p.images[0]?.url ?? p.imageUrl;
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      {cover ? (
                        <img
                          src={cover}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg border-2 border-pink-200 object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-pink-100" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-azul">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border-2 border-hotpink bg-pink-100 px-2 py-0.5 text-xs font-extrabold text-hotpink">
                        {p.section?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.cost != null ? money(p.cost) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {p.marginPercent != null ? `${p.marginPercent}%` : '—'}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-lima">
                      {p.price != null ? money(p.price) : '—'}
                    </td>
                    <td className="px-4 py-3 font-bold">{p.stock}</td>
                    <td className="px-4 py-3 font-bold">
                      {p.active ? 'Sí' : 'No'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <a
                          href={`/admin/productos/${p.id}/editar`}
                          className="rounded-full border-2 border-azul px-3 py-1 font-round text-xs font-bold text-azul hover:bg-blue-100"
                        >
                          Editar
                        </a>
                        {roleCan(me.role, 'productos-delete') ? (
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <ConfirmDeleteButton />
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
