"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { auth } from "@/lib/firebase-auth";

const FONT = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      await fetch("/api/admin/set-session", { method: "POST" });
      router.push("/admin");
    } catch {
      setError("E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ fontFamily: FONT }}
      className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div className="bg-white rounded-[22px] shadow-[0_2px_24px_rgba(0,0,0,0.08)] px-10 py-12">
          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images-admin/main-logo-hgt.png"
              alt="Logo Have A Good Time"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <h1 className="text-[#1d1d1f] text-2xl font-semibold text-center mb-1 tracking-tight">
            Área Administrativa
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] text-[15px] placeholder:text-[#86868b] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] text-[15px] placeholder:text-[#86868b] outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
              />
            </div>

            {error && (
              <p className="text-[#ff3b30] text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-full bg-[#0071e3] text-white text-[15px] font-medium tracking-tight hover:bg-[#0077ed] active:bg-[#006edb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#86868b] text-xs mt-6">
          Acesso restrito aos organizadores da festa
        </p>
      </div>
    </div>
  );
}
