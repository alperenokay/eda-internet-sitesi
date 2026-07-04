/** Admin formları: font, punto, renk araç çubuğu (içerik + blog). */
const FONT_MAP: Record<string, string> = {
  inter: "Inter, sans-serif",
  display: "'Cormorant Garamond', serif",
};

function wrapSelection(
  field: HTMLInputElement | HTMLTextAreaElement,
  open: string,
  close: string
) {
  const start = field.selectionStart ?? 0;
  const end = field.selectionEnd ?? 0;
  const value = field.value;
  const selected = value.slice(start, end) || "metin";
  const wrapped = `${open}${selected}${close}`;
  field.value = value.slice(0, start) + wrapped + value.slice(end);
  field.focus();
  const cursorStart = start + open.length;
  field.setSelectionRange(cursorStart, cursorStart + selected.length);
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function findTargetField(root: Element): HTMLInputElement | HTMLTextAreaElement | null {
  const direct = root.querySelector("[data-rich-input]") as HTMLInputElement | HTMLTextAreaElement | null;
  if (direct && document.activeElement === direct) return direct;
  if (direct) return direct;
  const active = document.activeElement;
  if (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement
  ) {
    if (root.contains(active) && active.hasAttribute("data-rich-input")) return active;
  }
  return root.querySelector("[data-rich-input]") as HTMLInputElement | HTMLTextAreaElement | null;
}

function bindRichTextRoots() {
  document.querySelectorAll("[data-rich-text-root]").forEach((root) => {
    if (root.hasAttribute("data-rich-bound")) return;
    root.setAttribute("data-rich-bound", "true");

    const fontSelect = root.querySelector("[data-rich-font]") as HTMLSelectElement | null;
    const sizeSelect = root.querySelector("[data-rich-size]") as HTMLSelectElement | null;
    const applyBtn = root.querySelector("[data-rich-apply]") as HTMLButtonElement | null;
    if (!fontSelect || !sizeSelect || !applyBtn) return;

    let color = "#17323a";

    const applyStyle = () => {
      const field = findTargetField(root);
      if (!field) return;
      const font = FONT_MAP[fontSelect.value] ?? FONT_MAP.inter;
      const size = sizeSelect.value || "16px";
      const style = `font-family: ${font}; font-size: ${size}; color: ${color}`;
      wrapSelection(field, `<span style="${style}">`, "</span>");
    };

    applyBtn.addEventListener("click", applyStyle);

    root.querySelectorAll("[data-rich-color]").forEach((btn) => {
      btn.addEventListener("click", () => {
        color = (btn as HTMLButtonElement).dataset.richColor || color;
        const field = findTargetField(root);
        if (field && field.selectionStart !== field.selectionEnd) {
          applyStyle();
        }
      });
    });
  });
}

bindRichTextRoots();
document.addEventListener("astro:page-load", bindRichTextRoots);
