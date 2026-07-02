"""Beyaz arka planı şeffaf PNG'ye çevirir (yalnızca Pillow)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\alper\.cursor\projects\c-Users-alper-OneDrive-Desktop-internet-sitesi\assets\c__Users_alper_AppData_Roaming_Cursor_User_workspaceStorage_5cef01345b8f3681c1ede169b39e11c9_images_ChatGPT_Image_1_Tem_2026_23_49_47-41c1b88d-a2c5-4046-a2ec-1ba3c73a2116.png"
)
OUT_PUBLIC = ROOT / "public" / "logo.png"
OUT_ROOT = ROOT / "logo.png"


def sample_bg(pixels, w, h):
    samples = []
    for x, y in [
        (0, 0),
        (w - 1, 0),
        (0, h - 1),
        (w - 1, h - 1),
        (5, 5),
        (w - 6, 5),
        (5, h - 6),
        (w - 6, h - 6),
    ]:
        samples.append(pixels[x, y][:3])
    r = sum(c[0] for c in samples) / len(samples)
    g = sum(c[1] for c in samples) / len(samples)
    b = sum(c[2] for c in samples) / len(samples)
    return r, g, b


def remove_white_bg(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    bg = sample_bg(px, w, h)
    br, bgc, bb = bg

    threshold = 30.0
    soft = 20.0

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            dr, dg, db = r - br, g - bgc, b - bb
            dist = (dr * dr + dg * dg + db * db) ** 0.5
            spread = max(abs(r - g), abs(g - b), abs(r - b))
            bright = (r + g + b) / 3.0

            t = (dist - threshold) / soft
            if t < 0:
                alpha = 0
            elif t > 1:
                alpha = 255
            else:
                alpha = int(t * 255)

            if spread < 14 and bright > 242:
                alpha = 0
            if spread > 9 and bright > 185 and dist < threshold + soft:
                alpha = max(alpha, 210)

            px[x, y] = (r, g, b, alpha)

    bbox = rgba.getbbox()
    return rgba.crop(bbox) if bbox else rgba


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Kaynak bulunamadı: {SRC}")

    result = remove_white_bg(Image.open(SRC))
    for path in (OUT_PUBLIC, OUT_ROOT):
        path.parent.mkdir(parents=True, exist_ok=True)
        result.save(path, format="PNG", optimize=True)

    print(f"OK -> {result.size[0]}x{result.size[1]} px")


if __name__ == "__main__":
    main()
