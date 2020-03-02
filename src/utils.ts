import DOMPurify from "dompurify";

export function flatten(str: string): string {
  return DOMPurify.sanitize(str || "", {
    ALLOWED_TAGS: ['#text'],
    KEEP_CONTENT: true,
    FORBID_TAGS: ['script', 'style'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  });
}