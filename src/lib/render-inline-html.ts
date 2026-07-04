import DOMPurify from "isomorphic-dompurify";

const ALLOWED_STYLE_PROPS = new Set(["color", "font-size", "font-family"]);

function sanitizeInlineStyle(style: string): string {
  return style
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => {
      const colon = part.indexOf(":");
      if (colon === -1) return false;
      const prop = part.slice(0, colon).trim().toLowerCase();
      return ALLOWED_STYLE_PROPS.has(prop);
    })
    .join("; ");
}

let hooksReady = false;

function ensureHooks() {
  if (hooksReady) return;
  DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
    if (data.attrName !== "style" || node.tagName !== "SPAN") return;
    const safe = sanitizeInlineStyle(data.attrValue);
    if (safe) {
      data.attrValue = safe;
    } else {
      data.keepAttr = false;
    }
  });
  hooksReady = true;
}

/** Güvenli satır içi HTML (span style: renk, punto, font). */
export function renderInlineHtml(text: string): string {
  if (!text || !text.includes("<")) return text;
  ensureHooks();
  return DOMPurify.sanitize(text, {
    ADD_TAGS: ["span"],
    ADD_ATTR: ["style"],
  });
}

export function hasInlineHtml(text: string): boolean {
  return Boolean(text && text.includes("<span"));
}

/** Meta title/description için etiketleri kaldırır. */
export function stripInlineHtml(text: string): string {
  if (!text) return "";
  return text.replace(/<[^>]+>/g, "").trim();
}
