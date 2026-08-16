import { prisma } from '@/lib/prisma';
import { currentMonthRange } from '@/lib/month';
import { logoutAction } from '../actions';
import { AdminNav } from '../nav';
import { createPurchase } from './actions';
export const dynamic = 'force-dynamic';
const money = (n: number) => '$' + n.toLocaleString('es-AR');
const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';
export default async function ComprasPage() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  const { start, end } = currentMonthRange();
  const month = await prisma.purchase.aggregate({
    where: { date: { gte: start, lt: end } },
    _sum: { total: true, quantity: true },
  });
  const purchases = await prisma.purchase.findMany({
    orderBy: { date: 'desc' },
    take: 50,
    include: { product: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">COMPRAS</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="compras" />
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border-4 border-azul bg-white p-5 shadow-[4px_4px_0_rgba(37,99,235,0.25)]">
            <p className="font-round text-sm font-bold text-neutral-500">
              Compras del mes
            </p>
            <p className="mt-1 font-round text-2xl font-extrabold text-azul">
              {money(month._sum.total ?? 0)}
            </p>
          </div>
          <div className="rounded-2xl border-4 border-hotpink bg-white p-5 shadow-[4px_4px_0_rgba(233,58,154,0.25)]">
            <p className="font-round text-sm font-bold text-neutral-500">
              Unidades compradas
            </p>
            <p className="mt-1 font-round text-2xl font-extrabold text-hotpink">
              {month._sum.quantity ?? 0}
            </p>
          </div>
        </div>
        <form
          action={createPurchase}
          className="mt-6 grid gap-4 rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)] sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label className={label} htmlFor="productId">Producto</label>
            <select id="productId" name="productId" required className={input}>
              <option value="">Seleccionar…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="quantity">Cantidad</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              required
              defaultValue={1}
              className={input}
            />
          </div>
          <div>
            <label className={label} htmlFor="unitCost">Costo unit.</label>
            <input
              id="unitCost"
              name="unitCost"
              type="number"
              min={0}
              placeholder="usa costo actual"
              className={input}
            />
          </div>
          <div>
            <label className={label} htmlFor="date">Fecha</label>
            <input id="date" name="date" type="date" className={input} />
          </div>
          <div className="lg:col-span-4">
            <label className={label} htmlFor="notes">Observaciones</label>
            <input id="notes" name="notes" className={input} />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-full bg-hotpink py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-[1.02]"
            >
              Registrar compra
            </button>
          </div>
        </form>
        <div className="mt-6 overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cant.</th>
                <th className="px-4 py-3">Costo unit.</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Obs.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                    Todavía no hay compras cargadas
                  </td>
                </tr>
              ) : (
                purchases.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{c.date.toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3 font-bold text-azul">{c.product.name}</td>
                    <td className="px-4 py-3 font-bold">{c.quantity}</td>
                    <td className="px-4 py-3">{money(c.unitCost)}</td>
                    <td className="px-4 py-3 font-extrabold text-azul">
                      {money(c.total)}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{c.notes ?? '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
