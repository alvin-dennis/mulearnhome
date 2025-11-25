export function cdnUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, "") || "";
  // Normalize backslashes to forward slashes and trim leading slashes
  const cleaned = path.replace(/\\/g, "/").replace(/^\/+/, "");
  // Use encodeURI so spaces and other characters are properly encoded
  return encodeURI(`${base}/${cleaned}`);
}
