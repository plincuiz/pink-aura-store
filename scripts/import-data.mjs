import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const data = JSON.parse(fs.readFileSync('scripts/data.json', 'utf8'));

await prisma.orderItem.deleteMany();
await prisma.order.deleteMany();
await prisma.sale.deleteMany();
await prisma.purchase.deleteMany();
await prisma.productImage.deleteMany();
await prisma.product.deleteMany();
await prisma.socialNetwork.deleteMany();
await prisma.setting.deleteMany();

for (const p of data.products) {
  await prisma.product.create({
    data: {
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      imageUrl: p.imageUrl,
      stock: p.stock,
      minStock: p.minStock,
      cost: p.cost,
      marginPercent: p.marginPercent,
      price: p.price,
      active: p.active,
      featured: p.featured,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      images: {
        create: (p.images ?? []).map((img) => ({
          id: img.id,
          url: img.url,
          createdAt: new Date(img.createdAt),
        })),
      },
    },
  });
}
for (const c of data.purchases) {
  await prisma.purchase.create({
    data: {
      id: c.id,
      productId: c.productId,
      quantity: c.quantity,
      unitCost: c.unitCost,
      total: c.total,
      date: new Date(c.date),
      notes: c.notes,
      createdAt: new Date(c.createdAt),
    },
  });
}
for (const v of data.sales) {
  await prisma.sale.create({
    data: {
      id: v.id,
      productId: v.productId,
      quantity: v.quantity,
      unitPrice: v.unitPrice,
      total: v.total,
      date: new Date(v.date),
      notes: v.notes,
      createdAt: new Date(v.createdAt),
    },
  });
}
for (const o of data.orders) {
  await prisma.order.create({
    data: {
      id: o.id,
      nombre: o.nombre,
      apellido: o.apellido,
      email: o.email,
      celular: o.celular,
      observaciones: o.observaciones,
      total: o.total,
      estado: o.estado,
      createdAt: new Date(o.createdAt),
      items: {
        create: (o.items ?? []).map((i) => ({
          id: i.id,
          productId: i.productId,
          nombreSnapshot: i.nombreSnapshot,
          precioSnapshot: i.precioSnapshot,
          cantidad: i.cantidad,
          subtotal: i.subtotal,
        })),
      },
    },
  });
}
for (const s of data.socials) {
  await prisma.socialNetwork.create({
    data: {
      id: s.id,
      name: s.name,
      url: s.url,
      iconName: s.iconName,
      active: s.active,
      createdAt: new Date(s.createdAt),
    },
  });
}
for (const s of data.settings) {
  await prisma.setting.create({
    data: { id: s.id, key: s.key, value: s.value },
  });
}

const tables = [
  'Product',
  'ProductImage',
  'Purchase',
  'Sale',
  'Order',
  'OrderItem',
  'SocialNetwork',
  'Setting',
];
for (const t of tables) {
  await prisma.$executeRawUnsafe(
    `SELECT setval('"${t}_id_seq"', COALESCE((SELECT MAX(id) FROM "${t}"), 0) + 1, false)`
  );
}

console.log('Import OK:', {
  productos: data.products.length,
  compras: data.purchases.length,
  ventas: data.sales.length,
  pedidos: data.orders.length,
  redes: data.socials.length,
  ajustes: data.settings.length,
});
await prisma.$disconnect();
