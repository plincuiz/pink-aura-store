# Instalación y deploy (cómo se hizo)

## 1. Proyecto local (Manjaro)
- Node instalado con pacman; proyecto creado con
  create-next-app (Next + TypeScript + Tailwind).
- Prisma 6 con SQLite al principio; seed con 33 productos.

## 2. GitHub
- sudo pacman -S github-cli && gh auth login (navegador).
- git init / branch -M main / add / commit.
- gh repo create pink-aura-store --private --source=. --remote=origin --push
- .gitignore protege: .env, proyecto.md, scripts/data.json.

## 3. Neon (base en la nube)
- neon.tech -> New Project "pink-aura" (región São Paulo).
- Copiar DOS strings: DIRECTA (migraciones) y POOLED (opcional).

## 4. Código listo para producción
- npm install @vercel/blob
- src/lib/storage.ts: Blob si hay token, public/uploads si no.
- npm pkg set scripts.postinstall="prisma generate"

## 5. Migración de datos local -> Neon
- node scripts/export-data.mjs (con .env en sqlite) -> data.json
- .env -> DATABASE_URL con la string DIRECTA de Neon
- sed para cambiar provider a postgresql en schema.prisma
- rm -rf prisma/migrations (error P3019 por cambio de provider)
- npx prisma migrate dev --name init_neon (crea tablas)
- node scripts/import-data.mjs (carga datos + resetea secuencias)

## 6. Vercel
- vercel.com -> Add New -> Project -> importar pink-aura-store.
- Environment Variables antes del deploy:
  DATABASE_URL (DIRECTA), ADMIN_EMAIL, ADMIN_PASSWORD,
  ADMIN_SECRET.
- Deploy -> Ready.
- Storage -> Create Blob (pink-aura-blob) -> copiar
  BLOB_READ_WRITE_TOKEN -> Settings -> Environment Variables
  -> agregar -> Redeploy.
- Cada git push a main redeploya solo.

## 7. Resend (emails)
- resend.com -> API Keys -> Create (copiar re_...).
- Variables en Vercel: RESEND_API_KEY y NOTIFY_EMAIL.
- Redeploy. Sin dominio propio, envía desde
  onboarding@resend.dev y solo llega a la casilla registrada.
