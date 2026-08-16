import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const data = {
  products: await prisma.product.findMany({ include: { images: true } }),
  purchases: await prisma.purchase.findMany(),
  sales: await prisma.sale.findMany(),
  orders: await prisma.order.findMany({ include: { items: true } }),
  socials: await prisma.socialNetwork.findMany(),
  settings: await prisma.setting.findMany(),
};
fs.writeFileSync('scripts/data.json', JSON.stringify(data, null, 2));
console.log('Export OK:', {
  productos: data.products.length,
  compras: data.purchases.length,
  ventas: data.sales.length,
  pedidos: data.orders.length,
  redes: data.socials.length,
  ajustes: data.settings.length,
});
await prisma.$disconnect();
