import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/admin-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  const jar = await cookies();
  const token = jar.get("admin_session")?.value;
  if (!token || !(await verifySessionToken(token))) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const snap = await getDocs(collection(db, "rsvps"));

    const rsvps = snap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name as string,
          phone: data.phone as string,
          attending: data.attending as "yes" | "no",
          additionalGuests: (data.additionalGuests ?? []) as string[],
          totalGuests: (data.totalGuests ?? 0) as number,
          message: (data.message ?? "") as string,
          createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
        };
      })
      .sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt.localeCompare(a.createdAt);
      });

    return Response.json(rsvps);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[admin/rsvps]", err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
