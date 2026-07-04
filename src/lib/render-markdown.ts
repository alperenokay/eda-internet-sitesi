import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

marked.setOptions({ gfm: true, breaks: false });

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

DOMPurify.addHook("uponSanitizeAttribute", (node, data) => {
  if (data.attrName !== "style" || node.tagName !== "SPAN") return;
  const safe = sanitizeInlineStyle(data.attrValue);
  if (safe) {
    data.attrValue = safe;
  } else {
    data.keepAttr = false;
  }
});

export function renderMarkdown(md: string): string {
  const raw = marked.parse(md) as string;
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ["span"],
    ADD_ATTR: ["style"],
  });
}
