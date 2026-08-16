export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('pa_cart');
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem('pa_cart', JSON.stringify(items));
  window.dispatchEvent(new Event('pa-cart-change'));
}
