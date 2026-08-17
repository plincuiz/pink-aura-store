import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
let sec = await prisma.section.findFirst({ where: { name: 'Maquillaje' } });
if (!sec) {
  sec = await prisma.section.create({ data: { name: 'Maquillaje' } });
}
await prisma.product.updateMany({
  where: { sectionId: null },
  data: { sectionId: sec.id },
});
console.log('Seccion default OK:', sec.name);
await prisma.$disconnect();
