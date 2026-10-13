#!/usr/bin/env bash
# Rasterises the SVG sources in assets/ and public/ into the PNGs that social
# previews and iOS home-screen icons need (neither accepts SVG).
#
# Uses macOS qlmanage so there is no image-processing dependency in the project.
# On Linux, install librsvg and swap the render() body for:
#   rsvg-convert -w "$2" -h "$3" -o "$4" "$1"
set -euo pipefail
cd "$(dirname "$0")/.."

# qlmanage always emits a square canvas, letterboxing non-square art, so a
# non-square target needs an explicit centre crop afterwards.
render() { # svg  max-dimension  out.png  [crop-w crop-h]
  local tmp; tmp="$(mktemp -d)"
  qlmanage -t -s "$2" -o "$tmp" "$1" >/dev/null 2>&1
  mv "$tmp/$(basename "$1").png" "$3"
  rm -rf "$tmp"
  if [ $# -ge 5 ]; then
    sips -c "$5" "$4" "$3" >/dev/null   # sips takes height then width
  fi
  echo "  wrote $3 ($(sips -g pixelWidth -g pixelHeight "$3" | awk '/pixel/{printf "%s ", $2}'))"
}

# qlmanage zooms a non-square SVG instead of letterboxing it (the old card was cropped to its
# top-left), so the social card is rendered by the Playwright Chromium the e2e suite installs.
npx --no-install playwright screenshot --viewport-size=1200,630 \
  "file://$PWD/assets/og-image.svg" public/og-image.png >/dev/null
echo "  wrote public/og-image.png ($(sips -g pixelWidth -g pixelHeight public/og-image.png | awk '/pixel/{printf "%s ", $2}'))"
# The maskable install icon bleeds to every edge, so it has its own source with the artwork
# inside the 80% safe zone; Chromium renders it at exactly 512 px.
npx --no-install playwright screenshot --viewport-size=512,512 \
  "file://$PWD/assets/icon-maskable.svg" public/icon-maskable-512.png >/dev/null
echo "  wrote public/icon-maskable-512.png ($(sips -g pixelWidth -g pixelHeight public/icon-maskable-512.png | awk '/pixel/{printf "%s ", $2}'))"
render public/logo.svg      512 public/icon-512.png
render public/logo.svg      192 public/icon-192.png
render public/logo.svg      180 public/apple-touch-icon.png
echo "Done. Commit the PNGs — the build copies public/ verbatim."
