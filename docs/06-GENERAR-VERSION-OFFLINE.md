# Cómo regenerar el zip offline

## 1. Sincronizar código (sin pisar lo offline)
Ejecutar todo en una sola línea:

rsync -a --delete --exclude '.env' --exclude 'prisma/schema.prisma' --exclude 'src/app/globals.css' --exclude 'next.config.ts' --exclude 'node_modules' --exclude '.next' --exclude 'dist' --exclude 'prisma/dev.db' --exclude 'prisma/migrations' --exclude 'scripts/data.json' ~/pink-aura-workspace/pink-aura-store/ ~/pink-aura-workspace/pink-aura-offline/

Quedan excluidos los 4 archivos que son distintos en offline:
.env, schema sqlite, globals sin Google Fonts y next.config
con standalone.

## 2. Si cambiaron tablas o campos
- Replicar el cambio en prisma/schema.prisma de offline
  (mantener provider sqlite)
- npx prisma migrate dev --name nombre_del_cambio

## 3. Datos frescos en el zip
cd ~/pink-aura-workspace/pink-aura-store && node scripts/export-data.mjs && cp scripts/data.json ../pink-aura-offline/scripts/data.json && cd ../pink-aura-offline && node scripts/import-offline.mjs

## 4. Build y armado
cd ~/pink-aura-workspace/pink-aura-offline && npm run build

cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static && cp -r node_modules/.prisma .next/standalone/node_modules/.prisma && cp -r node_modules/@prisma .next/standalone/node_modules/@prisma

rm -rf dist/PinkAura-Offline && mkdir -p dist/PinkAura-Offline/app && cp -r .next/standalone/. dist/PinkAura-Offline/app/ && mkdir -p dist/PinkAura-Offline/app/data && cp prisma/dev.db dist/PinkAura-Offline/app/data/dev.db

## 5. Node portables y scripts
- Si dist/node existe de la vez anterior, NO bajar de nuevo.
- INICIAR.bat / iniciar.sh / LEEME.txt quedan en dist/;
  si no están, recrearlos como en la Parte 3 del chat.

## 6. Zip y prueba final
cd dist && zip -r PinkAura-Offline.zip PinkAura-Offline

Probar siempre antes de entregar: descomprimir en
~/prueba-pink-aura y correr ./iniciar.sh
