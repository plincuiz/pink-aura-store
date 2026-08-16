'use client';
import { useEffect, useState } from 'react';
import { readCart } from '@/lib/cart';

export function CartLink() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () =>
      setCount(readCart().reduce((acc, i) => acc + i.qty, 0));
    update();
    window.addEventListener('pa-cart-change', update);
    return () => window.removeEventListener('pa-cart-change', update);
  }, []);
  return (
    <a
      href="/carrito"
      className="rounded-full bg-hotpink px-4 py-1 font-round text-xs font-bold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
    >
      Carrito{count > 0 ? ` (${count})` : ''}
    </a>
  );
}
