#!/bin/bash
# Trae a public/capturas/ las capturas que muestran las páginas de la casa (portada, productos y
# sitios). Todas son las que cada producto ya publica en su web: se copian tal cual, sin retoques.
# Las de los sitios de clientes las saca `pruebas/sitios-largo.mjs` (carpeta de pruebas) y se pasan
# con el segundo argumento. Uso: bash scripts/capturas-casa.sh [carpeta-con-capturas-de-sitios]
set -euo pipefail
cd "$(dirname "$0")/.."
DEV="${DEV:-$HOME/dev}"
DEST=public/capturas
FLUX="$DEV/soft-salix/productos/flux/public/vitrina/capturas"
MENU="$DEV/soft-salix/productos/menu/public/video"
NUVIX="$DEV/soft-nuvia/web/public/capturas/es"

# Flux, en la computadora (1512 de ancho) y en el teléfono (660), en claro y en oscuro.
for n in presupuesto orden facturacion calendario oportunidades presupuestos actividades metricas asistencias; do
  cp "$FLUX/mac/claro/$n-1512.webp" "$DEST/flux-$n.webp"
  cp "$FLUX/mac/oscuro/$n-1512.webp" "$DEST/flux-$n-oscuro.webp"
done
for n in recorrido orden chat; do
  cp "$FLUX/iphone/claro/$n-660.webp" "$DEST/flux-tel-$n.webp"
  cp "$FLUX/iphone/oscuro/$n-660.webp" "$DEST/flux-tel-$n-oscuro.webp"
done

# Menu: los pósters de sus videos (un solo modo).
for n in comensal agotado-panel agotado-carta ia visitas; do
  cp "$MENU/funcion-$n-poster.webp" "$DEST/menu-$n.webp"
done

# Nuvix, en español, en claro y en oscuro.
for n in recorrido aplicacion-muslos aplicacion-brazos avisos peso medidas agua bienestar rutinas estudios estudio-valor ia-dia ia-limites; do
  cp "$NUVIX/claro/$n-660.webp" "$DEST/nuvix-$n.webp"
  cp "$NUVIX/oscuro/$n-660.webp" "$DEST/nuvix-$n-oscuro.webp"
done

# Los sitios de clientes: la página entera y la primera pantalla en el teléfono.
if [ -n "${1:-}" ]; then
  for n in herreelec tph; do
    cp "$1/sitio-$n-largo.webp" "$DEST/sitio-$n-largo.webp"
    cp "$1/sitio-$n-largo-oscuro.webp" "$DEST/sitio-$n-largo-oscuro.webp"
    cp "$1/sitio-$n-tel.webp" "$DEST/sitio-$n-tel.webp"
    cp "$1/sitio-$n-tel-oscuro.webp" "$DEST/sitio-$n-tel-oscuro.webp"
  done
  # Porco Rosso no cambia con el tema: una sola.
  cp "$1/sitio-porcorosso-largo.webp" "$DEST/sitio-porcorosso-largo.webp"
  cp "$1/sitio-porcorosso-tel.webp" "$DEST/sitio-porcorosso-tel.webp"
fi
echo "Capturas al día en $DEST"
