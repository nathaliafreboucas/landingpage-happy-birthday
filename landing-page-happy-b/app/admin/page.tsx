"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, reauthenticateWithCredential, updatePassword, updateProfile, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase-auth";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { FiCopy, FiCheck } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ────────────────────────────────────────────────────────────────────

type RSVPRecord = {
  id: string;
  name: string;
  phone: string;
  attending: "yes" | "no";
  additionalGuests: string[];
  totalGuests: number;
  message: string;
  createdAt: string | null;
};

type Filter = "all" | "yes" | "no";

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return p;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl px-6 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
      <p className={`text-3xl font-semibold tracking-tight ${color}`}>{value}</p>
      <p className="text-[#86868b] text-sm mt-0.5">{label}</p>
    </div>
  );
}

function Badge({ attending }: { attending: "yes" | "no" }) {
  return attending === "yes" ? (
    <span className="inline-flex items-center gap-1 text-[#34c759] text-sm font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-[#34c759] inline-block" />
      Confirmado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[#ff3b30] text-sm font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] inline-block" />
      Não vai
    </span>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({ rsvp, onClose }: { rsvp: RSVPRecord; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.14)] w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[#1d1d1f] text-xl font-semibold tracking-tight">{rsvp.name}</h2>
            <p className="text-[#86868b] text-sm mt-0.5">{formatPhone(rsvp.phone)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center hover:bg-[#e8e8ed] transition-colors text-sm leading-none"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-[#f5f5f7] mb-5" />

        {/* Fields */}
        <div className="space-y-4">
          <Row label="Presença">
            <Badge attending={rsvp.attending} />
          </Row>

          {rsvp.attending === "yes" && (
            <Row label="Total de pessoas">
              <span className="text-[#1d1d1f] text-sm">{rsvp.totalGuests}</span>
            </Row>
          )}

          {rsvp.additionalGuests.length > 0 && (
            <Row label="Acompanhantes">
              <ul className="text-sm text-[#1d1d1f] space-y-0.5">
                {rsvp.additionalGuests.map((g, i) => (
                  <li key={i}>· {g}</li>
                ))}
              </ul>
            </Row>
          )}

          {rsvp.message && (
            <Row label="Mensagem">
              <p className="text-[#1d1d1f] text-sm italic leading-relaxed">"{rsvp.message}"</p>
            </Row>
          )}

          <Row label="Respondido em">
            <span className="text-[#1d1d1f] text-sm">{formatDate(rsvp.createdAt)}</span>
          </Row>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[#86868b] text-sm shrink-0">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("As senhas não coincidem."); return; }
    if (next.length < 6)  { setError("A nova senha deve ter ao menos 6 caracteres."); return; }

    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Sem usuário ativo.");
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, next);
      setSuccess(true);
    } catch {
      setError("Senha atual incorreta ou erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[22px] shadow-[0_8px_40px_rgba(0,0,0,0.14)] w-full max-w-sm p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1d1d1f] text-xl font-semibold tracking-tight">Alterar senha</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center hover:bg-[#e8e8ed] transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="text-center py-4">
            <p className="text-[#34c759] text-base font-medium">Senha alterada com sucesso!</p>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: "Senha atual",   val: current, set: setCurrent, auto: "current-password" },
              { label: "Nova senha",    val: next,    set: setNext,    auto: "new-password" },
              { label: "Confirmar nova senha", val: confirm, set: setConfirm, auto: "new-password" },
            ].map(({ label, val, set, auto }) => (
              <input
                key={label}
                type="password"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={label}
                required
                autoComplete={auto}
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] text-[#1d1d1f] text-[15px] placeholder:text-[#86868b] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            ))}

            {error && <p className="text-[#ff3b30] text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Salvando…" : "Salvar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router  = useRouter();
  const [rsvps, setRsvps]               = useState<RSVPRecord[]>([]);
  const [filter, setFilter]             = useState<Filter>("all");
  const [selected, setSelected]         = useState<RSVPRecord | null>(null);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [authChecked, setAuthChecked]   = useState(false);
  const [userName, setUserName]         = useState("");
  const [userEmail, setUserEmail]       = useState("");
  const [copied, setCopied]             = useState(false);

  // Guard: redirect if not authenticated; fetch profile from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace("/admin/login"); return; }
      setUserEmail(user.email ?? "");
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setUserName(snap.data().name ?? "");
      } catch { /* perfil não encontrado, sem problema */ }
      setAuthChecked(true);
    });
    return unsub;
  }, [router]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(userEmail);
    } catch {
      // fallback para navegadores antigos / iOS sem permissão
      const el = document.createElement("textarea");
      el.value = userEmail;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const fetchRSVPs = useCallback(async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "rsvps"));
      const data: RSVPRecord[] = snap.docs
        .map((d) => {
          const r = d.data();
          return {
            id: d.id,
            name: r.name as string,
            phone: r.phone as string,
            attending: r.attending as "yes" | "no",
            additionalGuests: (r.additionalGuests ?? []) as string[],
            totalGuests: (r.totalGuests ?? 0) as number,
            message: (r.message ?? "") as string,
            createdAt: r.createdAt?.toDate?.()?.toISOString() ?? null,
          };
        })
        .sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.localeCompare(a.createdAt);
        });
      setRsvps(data);
    } catch (err) {
      console.error("[fetchRSVPs]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked) fetchRSVPs();
  }, [authChecked, fetchRSVPs]);

  async function handleLogout() {
    await signOut(auth);
    await fetch("/api/admin/clear-session", { method: "POST" });
    router.replace("/admin/login");
  }

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filtered = rsvps.filter((r) => filter === "all" || r.attending === filter);
  const totalConfirmed = rsvps.filter((r) => r.attending === "yes").length;
  const totalDeclined  = rsvps.filter((r) => r.attending === "no").length;
  const totalGuests    = rsvps
    .filter((r) => r.attending === "yes")
    .reduce((sum, r) => sum + r.totalGuests, 0);

  // ── PDF ────────────────────────────────────────────────────────────────────
  function downloadPDF() {
    const doc = new jsPDF();
    const filterLabel = filter === "all" ? "Todos" : filter === "yes" ? "Confirmados" : "Não vão";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.setTextColor(29, 29, 31);
    doc.text("Lista de Convidados", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(134, 134, 139);
    doc.text(`Festa da Helena · Filtro: ${filterLabel} · ${filtered.length} ${filtered.length === 1 ? "resposta" : "respostas"}`, 14, 31);

    autoTable(doc, {
      startY: 40,
      head: [["Nome", "Telefone", "Presença", "Pessoas", "Respondido em"]],
      body: filtered.map((r) => [
        r.name,
        formatPhone(r.phone),
        r.attending === "yes" ? "Confirmado" : "Não vai",
        r.attending === "yes" ? String(r.totalGuests) : "—",
        formatDate(r.createdAt),
      ]),
      styles: {
        font: "helvetica",
        fontSize: 10,
        textColor: [29, 29, 31],
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [0, 113, 227],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 247] },
      columnStyles: {
        2: { cellWidth: 28 },
        3: { cellWidth: 22, halign: "center" },
        4: { cellWidth: 34 },
      },
    });

    doc.save(`convidados-${filterLabel.toLowerCase()}-helena.pdf`);
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!authChecked) return null;

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Todos",         count: rsvps.length },
    { key: "yes", label: "Confirmados",   count: totalConfirmed },
    { key: "no",  label: "Não vão",       count: totalDeclined },
  ];

  return (
    <div style={{ fontFamily: FONT }} className="min-h-screen bg-[#f5f5f7]">

      {/* Top Nav */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#d2d2d7]/60 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images-admin/simple-logo-hgt.png"
              alt="HGT"
              width={50}
              height={50}
              className="object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[#1d1d1f] text-[14px] font-semibold tracking-tight">
                {userName ? `Olá, ${userName}` : "Olá!"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[#86868b] text-[12px]">{userEmail}</span>
                <button
                  onClick={copyEmail}
                  title="Copiar e-mail"
                  className="text-[#86868b] hover:text-[#0071e3] transition-colors"
                >
                  {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePwd(true)}
              className="px-3.5 py-1.5 rounded-lg text-[#0071e3] text-[13px] font-medium hover:bg-[#f5f5f7] transition-colors"
            >
              Alterar senha
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg text-[#86868b] text-[13px] font-medium hover:bg-[#f5f5f7] transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Respostas"    value={rsvps.length}     color="text-[#1d1d1f]" />
          <StatCard label="Confirmados"  value={totalConfirmed}   color="text-[#34c759]" />
          <StatCard label="Não vão"      value={totalDeclined}    color="text-[#ff3b30]" />
          <StatCard label="Total de pessoas" value={totalGuests}  color="text-[#0071e3]" />
        </div>

        {/* Filters + PDF button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-[0_1px_6px_rgba(0,0,0,0.06)] w-fit">
            {FILTERS.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  filter === key
                    ? "bg-[#0071e3] text-white shadow-sm"
                    : "text-[#86868b] hover:text-[#1d1d1f]"
                }`}
              >
                {label}
                <span className={`ml-1.5 text-[11px] ${filter === key ? "text-white/70" : "text-[#c7c7cc]"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={downloadPDF}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] text-[13px] font-medium hover:bg-[#f5f5f7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
          >
            <span>↓</span>
            Baixar PDF
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_8px_rgba(0,0,0,0.06)] overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-[#86868b] text-sm">Carregando…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-[#86868b] text-sm">Nenhuma resposta encontrada.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f5f7] border-b border-[#e8e8ed]">
                  {["Nome", "Telefone", "Presença", "Pessoas", "Data"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[#86868b] text-xs font-medium uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`cursor-pointer hover:bg-[#f5f5f7] transition-colors ${
                      i < filtered.length - 1 ? "border-b border-[#f5f5f7]" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[#1d1d1f] text-sm font-medium">{r.name}</td>
                    <td className="px-5 py-3.5 text-[#86868b] text-sm">{formatPhone(r.phone)}</td>
                    <td className="px-5 py-3.5"><Badge attending={r.attending} /></td>
                    <td className="px-5 py-3.5 text-[#86868b] text-sm text-center">
                      {r.attending === "yes" ? r.totalGuests : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-[#86868b] text-sm">{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>

      {/* Modals */}
      {selected && <DetailModal rsvp={selected} onClose={() => setSelected(null)} />}
      {showChangePwd && <ChangePasswordModal onClose={() => setShowChangePwd(false)} />}
    </div>
  );
}
