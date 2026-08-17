# PINK AURA — Resumen del proyecto

## Qué es
Sistema de gestión + tienda online para el emprendimiento de
maquillaje "Pink Aura".

Existen dos versiones:
- ONLINE: publicada en internet (Vercel + Neon), para el negocio
  y sus clientas.
- OFFLINE: zip instalable para clientas que solo quieren llevar
  stock/compras/ventas en su PC, sin internet.

## Qué hace el sistema

### Parte pública (clientas)
- Catálogo estilo Y2K con fotos, precios y cartel "Sin stock".
- Ficha de producto con galería de fotos y descripción.
- Carrito de pedido con datos de la clienta (nombre, apellido,
  email, celular y observaciones).
- Redes sociales, WhatsApp, email y logo del negocio.
- El costo y el margen NUNCA se muestran al público.

### Panel admin (dueña)
- Login: admin@pinkaura.com / pinkaura2026
- Panel con totales del mes (compras, ventas y resultado).
- Productos: crear/editar/eliminar, fotos múltiples,
  costo + margen % = precio automático, destacado (★ TOP),
  visible/oculto.
- Compras y ventas con stock automático y validación.
- Pedidos: confirmar (descuenta stock y registra venta),
  cancelar o marcar entregado.
- Redes, logo y contacto administrables sin código.
- Email real por Resend cuando llega un pedido.

## Historia del proyecto (etapas)
1. Base local: Next.js + Prisma + SQLite, 33 productos cargados
   desde la planilla con margen 70%.
2. Catálogo público + admin con login y CRUD de productos
   con fotos y precio automático.
3. Compras y ventas con stock automático y totales del mes.
4. Pedido online: carrito, formulario de clienta y gestión
   de pedidos en el admin.
5. Redes/logo/contacto + rediseño "Y2K Fresh".
6. Deploy: GitHub + Vercel + Neon + Vercel Blob + Resend.
7. Versión offline: zip standalone para Windows y Linux.

## URLs y accesos
- Tienda online: ver URL en vercel.com -> proyecto (Domains)
- Admin: <URL>/admin
- GitHub: github.com/plincuiz/pink-aura-store (privado)
- Neon: proyecto "pink-aura"
- Vercel Blob: pink-aura-blob
- Resend: cuenta con el email de NOTIFY_EMAIL

## Carpetas en la PC
- ~/pink-aura-workspace/pink-aura-store   -> versión online
- ~/pink-aura-workspace/pink-aura-offline -> versión offline + zip
- ~/prueba-pink-aura                      -> prueba del zip (borrable)
