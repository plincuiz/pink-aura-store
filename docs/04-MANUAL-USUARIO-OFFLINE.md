# Manual de usuario — Versión offline (zip)

## Qué es
El mismo sistema de Pink Aura funcionando en la PC del cliente,
sin internet. Pensado para quien solo quiere llevar su control
de stock, compras y ventas.

## Contenido del zip
- INICIAR.bat        (arranque en Windows)
- iniciar.sh         (arranque en Linux)
- LEEME.txt          (instrucciones cortas)
- node/              motor portable (no hay que instalar nada)
- app/               el sistema completo
- app/data/dev.db    la base de datos con todo el movimiento

## Instalación y arranque
1. Descomprimir el zip en cualquier carpeta
   (ej: C:\PinkAura o ~/PinkAura).
2. Windows: doble click en INICIAR.bat.
   Linux: doble click en iniciar.sh (o ./iniciar.sh en terminal).
3. Se abre el navegador en http://localhost:3000.
4. NO cerrar la ventana/terminal negra mientras se usa.
   Para apagar: cerrar esa ventana o Ctrl + C.

## Accesos
- Catálogo:  http://localhost:3000
- Admin:     http://localhost:3000/admin
  Email: admin@pinkaura.com  /  Contraseña: pinkaura2026

## Qué funciona sin internet
- Todo el admin: productos con fotos (se guardan en una carpeta
  de la PC), compras, ventas, pedidos, stock y totales del mes.
- El carrito/pedido queda guardado en el sistema; el email no se
  envía (no hay conexión), pero el pedido igual se registra.

## Backup (muy importante)
- TODOS los datos viven en un solo archivo: app/data/dev.db
- Backup = copiar ese archivo a un pendrive u otra carpeta.
- Restaurar = pisar el archivo con la copia y reiniciar.

## Preguntas comunes
- ¿Puedo moverlo de carpeta? Sí, moviendo la carpeta completa.
- ¿Puerto 3000 ocupado? Editar INICIAR.bat / iniciar.sh y
  cambiar PORT=3000 por PORT=3001 (y entrar a localhost:3001).
- ¿Se puede usar desde otra PC de la casa? Sí, el servidor
  escucha en toda la red: http://IP-DE-LA-PC:3000
- ¿El antivirus avisa sobre el .bat? Es normal con scripts
  desconocidos; el zip solo incluye el Node oficial y el sistema.
- ¿Cómo actualizo la versión? Descomprimir un zip nuevo en otra
  carpeta y copiarle encima el app/data/dev.db del viejo.
