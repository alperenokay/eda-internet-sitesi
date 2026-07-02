"""Header için tagline'siz logo kırpımı + kenar temizliği."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo.png"
OUT_HEADER = ROOT / "public" / "logo-header.png"


def trim_transparent(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    bbox = rgba.getbbox()
    return rgba.crop(bbox) if bbox else rgba


def crop_wordmark(im: Image.Image) -> Image.Image:
    """Alt tagline satırını kes; yalnızca ikon + ME Package."""
    w, h = im.size
    # Tagline + ayırıcı alt ~%28; güvenli kesim
    cut = int(h * 0.72)
    return im.crop((0, 0, w, cut))


def clean_fringe(im: Image.Image) -> Image.Image:
    rgba = im.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            bright = (r + g + b) / 3
            spread = max(abs(r - g), abs(g - b), abs(r - b))
            if bright > 248 and spread < 18:
                px[x, y] = (r, g, b, 0)
    return rgba


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Kaynak yok: {SRC}")

    base = clean_fringe(trim_transparent(Image.open(SRC)))
    header = trim_transparent(crop_wordmark(base))
    header.save(OUT_HEADER, format="PNG", optimize=True)
    base.save(SRC, format="PNG", optimize=True)
    print(f"OK header={header.size} full={base.size}")


if __name__ == "__main__":
    main()
