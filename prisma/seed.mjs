import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MARGIN = 70;

const calcPrice = (cost) => {
  if (cost == null) return null;
  return Math.round(cost * (1 + MARGIN / 100));
};

const products = [
  { name: 'GLOSS CAJA MINI TANGO', stock: 1, cost: 2500 },
  { name: 'GLOSS CON LLAVERO', stock: 0, cost: 2400 },
  { name: 'GLOSS BRILLO PINK 21', stock: 1, cost: 2400 },
  { name: 'MATTE LIPGLOSS TEI', stock: 0, cost: 2200 },
  { name: 'LIPBALM "DIOR"', stock: 0, cost: 1900 },
  { name: 'GLOSS "DIOR"', stock: 0, cost: 1900 },
  { name: 'TINTA DE LABIOS PINK 21', stock: 0, cost: 2100 },
  { name: 'LABIAL LIQUIDO MATTE TEI', stock: 1, cost: 2100 },
  { name: 'LABIAL EN BARRA MATTE', stock: 1, cost: 1000 },
  { name: 'DELINEADOR DE LABIOS ANGELS', stock: 2, cost: 800 },
  { name: 'DELINEADOR DE LABIOS MISS DEMI', stock: 1, cost: 800 },
  { name: 'POLVO COMPACTO BANANA', stock: 2, cost: 2500 },
  { name: 'POLVO COMPACTO TEI "CORAZON"', stock: 1, cost: 2500 },
  { name: 'POLVO COMPACTO TEI', stock: 1, cost: 4000 },
  { name: 'CORRECTO DE OJERAS TEI', stock: 2, cost: 1700 },
  { name: 'RUBOR "SHEGLAM" TEI', stock: 0, cost: 2800 },
  { name: 'DELINEADOR DE OJOS TEJAR', stock: 1, cost: 1800 },
  { name: 'RIMEL SKY HIGH', stock: 0, cost: 2700 },
  { name: 'RIMEL COOL BLACK', stock: 2, cost: 2000 },
  { name: 'TEI MATTE Lip Glos', stock: 1, cost: 2250 },
  { name: 'MISS BETTY Lip Glos', stock: 2, cost: 1800 },
  { name: 'TEI Lip Stack', stock: 1, cost: 2400 },
  { name: 'Pearlescent Lip Glaze', stock: 2, cost: 2600 },
  { name: 'MATTE Color Lipstick', stock: 1, cost: 1500 },
  { name: 'Blush Cream Stick PINK 21', stock: 1, cost: 2500 },
  { name: 'Liquid Contour TEI', stock: 1, cost: 2900 },
  { name: 'CORRECTOR DE OJERAS MISS EVER', stock: 0, cost: 1900 },
  { name: 'MASCARA DE PESTAÑA 4ANGELS', stock: 2, cost: 2200 },
  { name: 'PALETA DE SOMBRAS TEI', stock: 1, cost: 2500 },
  { name: 'Delineador de Labios PINK 21', stock: 5, cost: 1400 },
  { name: 'Super Gloss PINK 21', stock: 5, cost: null },
  { name: 'Lip Stick MISS BETTY', stock: 3, cost: null },
  { name: 'Matte Lipstick HUXIABEAUTY', stock: 2, cost: null },
];

async function main() {
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: null,
        category: null,
        imageUrl: null,
        stock: product.stock,
        minStock: 0,
        cost: product.cost,
        marginPercent: product.cost == null ? null : MARGIN,
        price: calcPrice(product.cost),
        active: true,
        featured: false,
      },
    });
  }

  const count = await prisma.product.count();
  console.log(`Seed OK: ${count} productos cargados`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
