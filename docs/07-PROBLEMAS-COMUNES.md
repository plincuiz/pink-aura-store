# Problemas comunes y soluciones

- Vercel falla por prisma.config.ts: rm prisma.config.ts + push
  (Prisma 6 no lo usa).
- P3019 (provider no coincide): rm -rf prisma/migrations y
  migrate dev con nombre nuevo.
- "URL must start with file: o postgres://": el .env no coincide
  con el provider del schema; revisar con cat .env.
- "table does not exist" en Neon: npx prisma migrate deploy.
- Puerto 3000 ocupado: npm run dev -- -p 3001
  (o cambiar PORT en los scripts del zip).
- Botones no andan en el celu contra la PC por Wi-Fi:
  limitación del modo desarrollo; probar con la URL de Vercel.
- NO subir a Prisma 7 (rompe la config). Si pasó por error:
  npm i prisma@6 @prisma/client@6 && npx prisma generate
- Resend no envía: revisar RESEND_API_KEY y NOTIFY_EMAIL en
  Vercel + Redeploy. Sin dominio propio solo envía a la casilla
  registrada (revisar Spam).
- Íconos de marcas de lucide: reemplazados por SVG propios en
  social-icons.tsx (no tocar).
- Actualizar zip sin perder datos: zip nuevo en otra carpeta y
  copiarle encima el app/data/dev.db viejo.
- Backup del cliente offline: copiar app/data/dev.db.
