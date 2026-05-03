import "server-only";
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p", "br", "b", "strong", "i", "em", "u",
  "ul", "ol", "li",
  "h2", "h3", "h4",
  "a", "blockquote",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

const URL_RX = /^(https?:|mailto:|tel:|\/)/i;

export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: URL_RX,
  });
}

export function stripHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/** Mesaj/yorum içerikleri için: HTML yerine düz metin, sadece newline korunur. */
export function sanitizeText(text: string, maxLen = 4000): string {
  return stripHtml(text).slice(0, maxLen);
}
