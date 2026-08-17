# Documentación técnica

## Stack
- Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Turbopack)
- Prisma 6 (NO subir a Prisma 7: cambia la configuración y rompe)
- Base online: PostgreSQL en Neon
- Base offline/local: SQLite (archivo dev.db)
- Hosting: Vercel (serverless)
- Fotos: Vercel Blob (online) / public/uploads (local y offline)
- Emails: Resend
- Login: cookie HMAC propia (src/lib/auth.ts)

## Variables de entorno
| Variable                | Para qué                                |
|-------------------------|-----------------------------------------|
| DATABASE_URL            | postgres://... (Neon) o file:./dev.db   |
| ADMIN_EMAIL             | email del login admin                   |
| ADMIN_PASSWORD          | contraseña del login admin              |
| ADMIN_SECRET            | secreto de la cookie de sesión          |
| BLOB_READ_WRITE_TOKEN   | Vercel Blob para fotos nuevas           |
| RESEND_API_KEY          | envío de emails (re_...)                |
| NOTIFY_EMAIL            | casilla que recibe los pedidos          |

En Vercel: Settings -> Environment Variables.
En local: archivo .env en la raíz del proyecto.

## Modelos de base (Prisma)
- Product: producto con costo, margen %, precio calculado,
  stock, activo y destacado.
- ProductImage: fotos múltiples por producto.
- Purchase / Sale: compras y ventas con stock automático.
- Order / OrderItem: pedidos online con snapshot de precios.
- SocialNetwork: redes con ícono (instagram/facebook/whatsapp/
  tiktok/link).
- Setting: claves logoUrl, contactPhone, contactEmail.

## Diseño Y2K Fresh
Definido en src/app/globals.css con @theme de Tailwind v4:
- bg-cream (fondo crema), hotpink (rosa fuerte)
- azul (nombres), lima (precios)
- font-logo (Fugaz One, títulos), font-round (Baloo 2, textos)
La versión offline NO carga Google Fonts: funciona sin internet
con fuentes del sistema.

## Archivos importantes
- src/app/page.tsx                    catálogo
- src/app/producto/[id]/page.tsx      ficha + gallery.tsx
- src/app/carrito/                    carrito y createOrder
- src/app/admin/**                    panel, productos, compras,
                                      ventas, pedidos, redes
- src/lib/prisma.ts  auth.ts  cart.ts  storage.ts  email.ts  month.ts
- prisma/schema.prisma  prisma/seed.mjs (33 productos base)
- scripts/export-data.mjs / import-data.mjs / import-offline.mjs

## Lógica de fotos (src/lib/storage.ts)
Si existe BLOB_READ_WRITE_TOKEN -> sube a Vercel Blob.
Si no existe -> guarda en public/uploads.
Por eso el mismo código funciona online, local y offline.

## Lógica de emails (src/lib/email.ts)
Si existen RESEND_API_KEY y NOTIFY_EMAIL -> envía email real.
Si no -> imprime el pedido en la consola del servidor.

## Comandos útiles (en pink-aura-store)
npm run dev                          # servidor local :3000
npx prisma migrate dev --name X      # cambia el schema (Neon)
npx prisma db seed                   # recarga 33 productos base
npx prisma studio                    # ver la base en navegador
git add . && git commit -m "X" && git push   # deploy automático
