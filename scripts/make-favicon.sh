#!/usr/bin/env bash
# Renders scripts/favicon.html into the three icon files Next's App Router picks up
# automatically: src/app/favicon.ico, src/app/icon.png, src/app/apple-icon.png.
#
# Reusable across the fleet: edit the custom properties at the top of favicon.html
# (--ground, --mark, --accent and the letter) and re-run. Nothing here is
# site-specific except the output paths.
#
# Requires headless Chrome and ImageMagick 7 (`magick`).
#
# Usage:  ./scripts/make-favicon.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SRC="$REPO_ROOT/scripts/favicon.html"
MASTER="$(mktemp -t favicon-master).png"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME" >&2
  exit 1
fi

# --virtual-time-budget is what gives Google Fonts time to resolve; without it the
# letterform renders in a fallback face and the mark comes out wrong.
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=6000 --force-device-scale-factor=1 \
  --window-size=512,512 --screenshot="$MASTER" "$SRC" 2>/dev/null

magick "$MASTER" -resize 256x256 -strip "$REPO_ROOT/src/app/icon.png"
magick "$MASTER" -resize 180x180 -strip "$REPO_ROOT/src/app/apple-icon.png"
magick "$MASTER" -define icon:auto-resize=48,32,16 "$REPO_ROOT/src/app/favicon.ico"

echo "Wrote:"
echo "  src/app/favicon.ico   (16/32/48)"
echo "  src/app/icon.png      (256)"
echo "  src/app/apple-icon.png (180)"
