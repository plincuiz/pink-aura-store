export type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

let memoryCart: CartItem[] = [];

function storageOk(): boolean {
  try {
    localStorage.setItem('pa_test', '1');
    localStorage.removeItem('pa_test');
    return true;
  } catch {
    return false;
  }
}

export function readCart(): CartItem[] {
  if (!storageOk()) return memoryCart;
  try {
    const raw = localStorage.getItem('pa_cart');
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return memoryCart;
  }
}

export function writeCart(items: CartItem[]) {
  memoryCart = items;
  try {
    localStorage.setItem('pa_cart', JSON.stringify(items));
  } catch {
    // sin almacenamiento local, queda en memoria
  }
  window.dispatchEvent(new Event('pa-cart-change'));
}
