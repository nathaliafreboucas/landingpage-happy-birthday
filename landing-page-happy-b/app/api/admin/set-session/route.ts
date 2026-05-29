import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/admin-auth";

export async function POST() {
  const token = await createSessionToken();
  const jar = await cookies();
  jar.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
  return Response.json({ ok: true });
}
