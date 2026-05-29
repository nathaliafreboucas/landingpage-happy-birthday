const SECRET = process.env.ADMIN_SESSION_SECRET ?? "helena-admin-dev-secret-change-in-prod";

async function hmacSign(message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(sig);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + 24 * 60 * 60 * 1000; // 24 h
  const payload = String(exp);
  const sig = await hmacSign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = parseInt(payload, 10);
  if (isNaN(exp) || Date.now() > exp) return false;
  const expected = await hmacSign(payload);
  return expected === sig;
}
