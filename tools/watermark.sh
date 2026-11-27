#!/bin/bash
# Re-creates every watermarked photo in assets/ from the clean originals in assets-src/.
# Usage: bash tools/watermark.sh tools/watermark.png   (run from the repository root)
# assets-src/ holds the unwatermarked originals and is kept out of git on purpose:
# Cloudflare publishes the whole repository, so committing them would make them public.
WM="$1"
find assets-src -type f -name '*.jpg' | while read -r src; do
  out="${src#assets-src/}"
  W=$(identify -format '%w' "$src"); H=$(identify -format '%h' "$src")
  S=$(( W < H ? W : H ))
  LW=$(( S * 30 / 100 )); [ $LW -lt 150 ] && LW=150
  M=$(( S * 4 / 100 ))
  convert "$src" \( "$WM" -resize ${LW}x -channel A -evaluate multiply 0.72 +channel \) \
    -gravity southeast -geometry +${M}+${M} -composite -quality 86 "$out"
done
