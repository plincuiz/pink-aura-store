import { prisma } from '@/lib/prisma';
import { requirePerm, roleCan } from '@/lib/auth';
import { logoutAction } from '../actions';
import { AdminNav } from '../nav';
import { cancelOrder, confirmOrder, deliverOrder } from './actions';
import { ConfirmSubmit } from './confirm-buttons';

export const dynamic = 'force-dynamic';
const money = (n: number) => '$' + n.toLocaleString('es-AR');
const estadoColor: Record<string, string> = {
  pendiente: 'border-yellow-400 bg-yellow-100 text-yellow-700',
  confirmado: 'border-lima bg-lime-100 text-lime-700',
  entregado: 'border-azul bg-blue-100 text-blue-700',
  cancelado: 'border-red-400 bg-red-100 text-red-600',
};

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; id?: string }>;
}) {
  const me = await requirePerm('pedidos');
  const canConfirm = roleCan(me.role, 'pedidos-confirm');
  const canCancel = roleCan(me.role, 'pedidos-cancel');
  const canEntregar = roleCan(me.role, 'pedidos-entregar');
  const params = await searchParams;
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">PEDIDOS</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="pedidos" />
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
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        {params.error === 'stock' ? (
          <p className="rounded-xl border-2 border-red-500 bg-red-100 px-4 py-2 font-round text-sm font-bold text-red-600">
            No se pudo confirmar el pedido #{params.id}: stock insuficiente de
            algún producto. Ajustá el stock en Productos y volvé a intentar.
          </p>
        ) : null}
        {orders.length === 0 ? (
          <p className="rounded-2xl border-4 border-hotpink bg-white p-6 text-center font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
            Todavía no hay pedidos. Cuando un cliente envíe uno desde el
            catálogo, aparece acá.
          </p>
        ) : (
          orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border-4 border-hotpink bg-white p-5 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-round font-extrabold text-azul">
                    Pedido #{o.id} · {o.createdAt.toLocaleString('es-AR')}
                  </p>
                  <p className="mt-1 font-round text-sm font-bold text-neutral-600">
                    {o.nombre} {o.apellido}
                  </p>
                  <p className="font-round text-sm font-semibold text-neutral-500">
                    {o.email} · {o.celular}
                  </p>
                  {o.observaciones ? (
                    <p className="mt-1 font-round text-sm font-semibold text-neutral-500">
                      Obs: {o.observaciones}
                    </p>
                  ) : null}
                </div>
                <span
                  className={`rounded-full border-2 px-3 py-1 font-round text-xs font-extrabold uppercase ${estadoColor[o.estado] ?? ''}`}
                >
                  {o.estado}
                </span>
              </div>
              <div className="mt-4 divide-y divide-pink-200 rounded-xl border-2 border-pink-200">
                {o.items.map((i) => (
                  <div
                    key={i.id}
                    className="flex justify-between px-3 py-2 font-round text-sm"
                  >
                    <span className="font-bold">
                      {i.cantidad} x {i.nombreSnapshot}
                    </span>
                    <span className="font-semibold text-neutral-500">
                      {money(i.subtotal)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 font-round text-sm font-extrabold">
                  <span>Total</span>
                  <span className="text-lima">{money(o.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {o.estado === 'pendiente' ? (
                  <>
                    {canConfirm ? (
                      <form action={confirmOrder}>
                        <input type="hidden" name="id" value={o.id} />
                        <ConfirmSubmit
                          label="Confirmar (descuenta stock)"
                          message={`¿Confirmar el pedido #${o.id}? Se descuenta stock y se registra como venta.`}
                          className="rounded-full bg-lima px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
                        />
                      </form>
                    ) : null}
                    {canCancel ? (
                      <form action={cancelOrder}>
                        <input type="hidden" name="id" value={o.id} />
                        <ConfirmSubmit
                          label="Cancelar"
                          message={`¿Cancelar el pedido #${o.id}?`}
                          className="rounded-full border-2 border-red-500 px-4 py-2 font-round text-sm font-extrabold text-red-500 hover:bg-red-100"
                        />
                      </form>
                    ) : null}
                  </>
                ) : o.estado === 'confirmado' && canEntregar ? (
                  <form action={deliverOrder}>
                    <input type="hidden" name="id" value={o.id} />
                    <ConfirmSubmit
                      label="Marcar entregado"
                      message={`¿Marcar el pedido #${o.id} como entregado?`}
                      className="rounded-full bg-azul px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
                    />
                  </form>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
