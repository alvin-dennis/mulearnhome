/** Extracts a human-readable message from Django's `{ message: { general: [...] } }` / DRF `{ detail: "..." }` envelope. */
export function extractDjangoMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  const msg = d.message;
  if (msg && typeof msg === "object") {
    const msgObj = msg as Record<string, unknown>;
    if (Array.isArray(msgObj.general) && typeof msgObj.general[0] === "string") {
      return msgObj.general[0];
    }
    for (const key of Object.keys(msgObj)) {
      const val = msgObj[key];
      if (Array.isArray(val) && typeof val[0] === "string") return val[0];
      if (typeof val === "string") return val;
    }
  }
  if (typeof msg === "string") return msg;
  if (typeof d.detail === "string") return d.detail;
  return null;
}
