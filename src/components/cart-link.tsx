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
      className="mt-2 rounded-full bg-hotpink px-7 py-3 font-round text-base font-extrabold text-white shadow-[4px_4px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
    >
      Carrito{count > 0 ? ` (${count})` : ''}
    </a>
  );
}
