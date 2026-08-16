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
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
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
          ? 'rounded-lg border border-pink-400 bg-pink-500/10 px-3 py-2 text-sm font-semibold text-pink-400 hover:bg-pink-500/20'
          : 'rounded-lg bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-600'
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
