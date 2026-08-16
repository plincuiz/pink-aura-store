'use client';
import { useEffect, useState } from 'react';
import { readCart, writeCart } from '@/lib/cart';

export function AddToCart({
  id,
  name,
  price,
}: {
  id: number;
  name: string;
  price: number | null;
}) {
  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const update = () =>
      setQty(readCart().find((i) => i.id === id)?.qty ?? 0);
    update();
    window.addEventListener('pa-cart-change', update);
    return () => window.removeEventListener('pa-cart-change', update);
  }, [id]);

  if (price == null) return null;
  return (
    <button
      type="button"
      onClick={() => {
        const items = readCart();
        const found = items.find((i) => i.id === id);
        if (found) found.qty += 1;
        else items.push({ id, name, price, qty: 1 });
        writeCart(items);
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className={
        qty > 0
          ? 'rounded-full border-2 border-lima bg-lime-100 px-4 py-2 font-round text-sm font-bold text-lime-700 transition hover:bg-lime-200'
          : 'rounded-full bg-hotpink px-4 py-2 font-round text-sm font-bold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105'
      }
    >
      {added
        ? 'Agregado ✓'
        : qty > 0
          ? `✓ En el pedido (${qty})`
          : 'Agregar al pedido'}
    </button>
  );
}
