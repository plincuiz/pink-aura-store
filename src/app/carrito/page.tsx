'use client';
import { useEffect, useState } from 'react';
import { readCart, writeCart, type CartItem } from '@/lib/cart';
import { createOrder } from './actions';

const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';
const row =
  'grid grid-cols-[minmax(0,1fr)_11rem_5.5rem] items-center gap-3 p-4';

export default function CarritoPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [status, setStatus] = useState<'form' | 'sending' | 'ok'>('form');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const total = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  function save(next: CartItem[]) {
    setItems(next);
    writeCart(next);
  }
  function changeQty(id: number, delta: number) {
    save(
      items
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }
  function removeItem(id: number) {
    save(items.filter((i) => i.id !== id));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0 || status === 'sending') return;
    setStatus('sending');
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await createOrder(items, {
      nombre: String(fd.get('nombre') ?? ''),
      apellido: String(fd.get('apellido') ?? ''),
      email: String(fd.get('email') ?? ''),
      celular: String(fd.get('celular') ?? ''),
      observaciones: String(fd.get('observaciones') ?? ''),
    });
    if (result.ok) {
      writeCart([]);
      setItems([]);
      setOrderId(result.id ?? null);
      setStatus('ok');
    } else {
      setError(result.error ?? 'No se pudo crear el pedido');
      setStatus('form');
    }
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-neutral-800">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="font-round text-sm font-bold text-hotpink hover:underline"
        >
          ← Volver al catálogo
        </a>
        <h1 className="mt-4 font-logo text-3xl text-hotpink drop-shadow-[3px_3px_0_rgba(132,204,22,0.35)]">
          TU PEDIDO
        </h1>
        {status === 'ok' ? (
          <div className="mt-6 rounded-2xl border-4 border-lima bg-white p-6 text-center shadow-[5px_5px_0_rgba(132,204,22,0.3)]">
            <p className="font-round text-lg font-extrabold text-lima">
              ¡Pedido recibido!
            </p>
            <p className="mt-2 font-round text-sm font-bold text-neutral-600">
              Número de pedido: #{orderId}
            </p>
            <p className="mt-1 font-round text-sm font-semibold text-neutral-500">
              Te contactamos por email o celular para coordinar.
            </p>
            <a
              href="/"
              className="mt-4 inline-block rounded-full bg-hotpink px-5 py-2 font-round text-sm font-bold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)]"
            >
              Volver al catálogo
            </a>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border-4 border-hotpink bg-white p-6 text-center font-round text-sm font-bold text-neutral-500 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
            Tu carrito está vacío.
            <a href="/" className="mt-3 block text-hotpink hover:underline">
              Ver productos
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            <div className="divide-y divide-pink-200 rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
              {items.map((i) => (
                <div key={i.id} className={row}>
                  <div className="min-w-0">
                    <p className="truncate font-round text-sm font-extrabold text-azul">
                      {i.name}
                    </p>
                    <p className="font-round text-xs font-semibold text-neutral-500">
                      ${i.price} c/u
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeQty(i.id, -1)}
                      className="h-8 w-8 rounded-full border-2 border-hotpink bg-white font-round font-extrabold text-hotpink hover:bg-hotpink hover:text-white"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-round font-extrabold">
                      {i.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQty(i.id, 1)}
                      className="h-8 w-8 rounded-full border-2 border-hotpink bg-white font-round font-extrabold text-hotpink hover:bg-hotpink hover:text-white"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(i.id)}
                      className="ml-1 font-round text-xs font-extrabold text-red-500 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                  <span className="text-right font-round text-sm font-extrabold text-lima">
                    ${i.price * i.qty}
                  </span>
                </div>
              ))}
              <div className={row}>
                <span className="font-round text-sm font-bold text-neutral-600">
                  Total
                </span>
                <span />
                <span className="text-right font-round text-xl font-extrabold text-lima">
                  ${total}
                </span>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)] sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="nombre">Nombre *</label>
                <input id="nombre" name="nombre" required className={input} />
              </div>
              <div>
                <label className={label} htmlFor="apellido">Apellido *</label>
                <input id="apellido" name="apellido" required className={input} />
              </div>
              <div>
                <label className={label} htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={input}
                />
              </div>
              <div>
                <label className={label} htmlFor="celular">Celular *</label>
                <input id="celular" name="celular" required className={input} />
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="observaciones">
                  Observaciones
                </label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  rows={3}
                  className={input}
                />
              </div>
            </div>
            {error ? (
              <p className="rounded-xl border-2 border-red-500 bg-red-100 px-4 py-2 font-round text-sm font-bold text-red-600">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-full bg-hotpink py-3 font-round text-sm font-extrabold text-white shadow-[3px_3px_0_rgba(0,0,0,0.15)] transition hover:scale-[1.01] disabled:opacity-50"
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar pedido'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
