import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import type { User } from "@/lib/database";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DashboardShell({
  user,
  active,
  children,
}: {
  user: User;
  active: "dashboard" | "usuarios";
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] lg:flex">
      <aside className="flex shrink-0 flex-col bg-[#101b2c] px-5 py-5 text-white lg:min-h-screen lg:w-[252px] lg:px-6 lg:py-7">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#c4f27a] text-[#122018]">
            <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
              <path d="M4 13.5 9.5 8l4 4L20 5.5M14.5 5.5H20v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight">pulso<span className="text-[#c4f27a]">.</span></span>
        </Link>

        <p className="mb-3 mt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
        <nav className="flex gap-2 lg:flex-col" aria-label="Navegação principal">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active === "dashboard" ? "bg-white/10 font-medium text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            aria-current={active === "dashboard" ? "page" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            <span>Visão geral</span>
          </Link>
          <Link
            href="/usuarios"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active === "usuarios" ? "bg-white/10 font-medium text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            aria-current={active === "usuarios" ? "page" : undefined}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
              <circle cx="9" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3.5 19v-1.25A4.75 4.75 0 0 1 8.25 13h1.5a4.75 4.75 0 0 1 4.75 4.75V19M15 5.2a3.25 3.25 0 0 1 0 6.3m2.25 2.2a4.75 4.75 0 0 1 3.25 4.5V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span>Usuários</span>
          </Link>
        </nav>

        <div className="mt-8 hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:block">
          <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-[#c4f27a]/15 text-xs font-semibold text-[#c4f27a]">✳</div>
          <p className="text-sm font-medium">Tudo em um só lugar</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Acompanhe seus usuários e mantenha sua comunidade por perto.</p>
        </div>

        <div className="mt-4 border-t border-white/10 pt-5 lg:mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#dce7f2] text-xs font-semibold text-[#20354b]">{initials(user.name)}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-slate-400">{user.email}</p>
            </div>
            <form action={logout}>
              <button type="submit" className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Sair da conta" title="Sair">
                <svg viewBox="0 0 24 24" fill="none" className="size-[18px]" aria-hidden="true">
                  <path d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        {children}
        <p className="mt-12 border-t border-slate-200 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} Pulso · Feito para conectar pessoas</p>
      </main>
    </div>
  );
}

export function UserAvatar({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-[#e8eef5] font-semibold text-[#476079] ${className}`}>
      {initials(name)}
    </span>
  );
}
