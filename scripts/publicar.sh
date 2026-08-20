#!/usr/bin/env bash
#
# Publica salixweb.com.
#
#   npm run publicar
#
# El sitio NO tiene deploy automático: vive en Hostinger y se sube por SSH/rsync.
# Un push al repositorio no cambia nada de lo que ve la gente — hasta el
# 2026-08-19 eso se hacía a mano por FTP y era el paso que se olvidaba.
#
# Qué hace, en orden: prepara la marca (versión del logo + imagen de compartir),
# construye, y sincroniza `dist/` contra el servidor SIN borrar nada que no esté
# en el build (los `_astro/*` con hash de deploys viejos quedan y no molestan).
#
# Antes de tocar el servidor deja un respaldo con fecha en ~/respaldos-salixweb.
#
# El destino sale de variables de entorno para no tener nada del servidor escrito
# en el repositorio. El default es el alias del ~/.ssh/config de la máquina de Sal.
set -euo pipefail

SSH_ALIAS="${SALIXWEB_SSH:-hostinger-herreelec}"
REMOTO="${SALIXWEB_RUTA:-domains/salixweb.com/public_html}"

cd "$(dirname "$0")/.."

if ! ssh -o BatchMode=yes -o ConnectTimeout=15 "$SSH_ALIAS" true 2>/dev/null; then
  echo "✗ No hay acceso SSH a '$SSH_ALIAS'."
  echo "  Configuralo en ~/.ssh/config, o pasá otro alias:  SALIXWEB_SSH=mi-alias npm run publicar"
  exit 1
fi

echo "→ Preparando la marca…"
node scripts/marca.mjs

echo "→ Construyendo…"
npx astro build

# Red de seguridad: si algo sale mal, el sitio anterior está entero en un .tgz.
FECHA=$(date +%Y-%m-%d-%H%M)
echo "→ Respaldando lo que está publicado…"
ssh -o BatchMode=yes "$SSH_ALIAS" \
  "mkdir -p ~/respaldos-salixweb && tar czf ~/respaldos-salixweb/salixweb-$FECHA.tgz -C ~/$REMOTO ."

echo "→ Subiendo…"
rsync -az --no-perms --no-times --checksum --stats \
  -e "ssh -o BatchMode=yes" \
  dist/ "$SSH_ALIAS:$REMOTO/" | grep -E "Number of files transferred|Total transferred"

echo
echo "✓ Publicado. Respaldo: ~/respaldos-salixweb/salixweb-$FECHA.tgz"
echo "  Verificá:  curl -s https://salixweb.com/ | grep -c logo-salix"
