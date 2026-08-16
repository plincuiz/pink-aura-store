import { prisma } from '@/lib/prisma';
import { currentMonthRange } from '@/lib/month';
import { logoutAction } from './actions';
import { AdminNav } from './nav';
export const dynamic = 'force-dynamic';
const money = (n: number) => '$' + n.toLocaleString('es-AR');
export default async function AdminPage() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  const { start, end } = currentMonthRange();
  const compras = await prisma.purchase.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { total: true },
  });
  const ventas = await prisma.sale.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { total: true },
  });
  const totalCompras = compras._sum.total ?? 0;
  const totalVentas = ventas._sum.total ?? 0;
  const resultado = totalVentas - totalCompras;
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">PINK AURA · ADMIN</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="panel" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-round text-sm font-bold text-red-500 hover:underline"
            >
              Salir
            </button>
          </form>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border-4 border-azul bg-white p-5 shadow-[4px_4px_0_rgba(37,99,235,0.25)]">
            <p className="font-round text-sm font-bold text-neutral-500">
              Total compras del mes
            </p>
            <p className="mt-1 font-round text-2xl font-extrabold text-azul">
              {money(totalCompras)}
            </p>
          </div>
          <div className="rounded-2xl border-4 border-lima bg-white p-5 shadow-[4px_4px_0_rgba(132,204,22,0.3)]">
            <p className="font-round text-sm font-bold text-neutral-500">
              Total ventas del mes
            </p>
            <p className="mt-1 font-round text-2xl font-extrabold text-lima">
              {money(totalVentas)}
            </p>
          </div>
          <div className="rounded-2xl border-4 border-hotpink bg-white p-5 shadow-[4px_4px_0_rgba(233,58,154,0.25)]">
            <p className="font-round text-sm font-bold text-neutral-500">
              Resultado
            </p>
            <p
              className={`mt-1 font-round text-2xl font-extrabold ${
                resultado >= 0 ? 'text-lima' : 'text-red-500'
              }`}
            >
              {money(resultado)}
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Costo</th>
                <th className="px-4 py-3">Margen %</th>
                <th className="px-4 py-3">Precio venta</th>
                <th className="px-4 py-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-bold text-azul">{p.name}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
