import { Suspense } from "react";
import Link from "next/link";
import { DashboardShell, UserAvatar } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth";
import { getUserMetrics, listUsers } from "@/lib/database";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value.replace(" ", "T")}Z`));
}

async function DashboardContent() {
  const user = await requireUser();
  const metrics = getUserMetrics();
  const recentUsers = listUsers().slice(0, 5);

  return (
    <DashboardShell user={user} active="dashboard">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Seu espaço de gestão</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#17261e] sm:text-[30px]">Visão geral</h1>
        </div>
        <Link href="/usuarios" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#173425] px-4 text-sm font-semibold text-white transition hover:bg-[#234b34]">
          <span aria-hidden="true" className="text-lg leading-none">+</span> Ver usuários
        </Link>
      </header>

      <section className="relative isolate mt-8 overflow-hidden rounded-3xl bg-[#173425] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 size-72 rounded-full border border-white/[0.08] sm:size-96" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-12 size-56 rounded-full border border-white/[0.08] sm:size-72" />
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-medium text-[#c4f27a]">Olá, {user.name.split(" ")[0]} 👋</p>
          <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-[32px]">Bom ter você por aqui.</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">Acompanhe os cadastros recentes e veja como sua comunidade está crescendo.</p>
          <Link href="/usuarios" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#c4f27a] hover:underline">Explorar usuários <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section aria-label="Indicadores" className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Usuários cadastrados</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#17261e]">{metrics.total}</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#eff6e8] text-[#548039]">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <circle cx="9" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3.5 19v-1.25A4.75 4.75 0 0 1 8.25 13h1.5a4.75 4.75 0 0 1 4.75 4.75V19M16 11a3 3 0 1 0 0-6m1.25 8.2a4.75 4.75 0 0 1 3.25 4.5V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="rounded-full bg-[#eff6e8] px-2 py-1 font-semibold text-[#548039]">Total</span> pessoas na sua comunidade</p>
        </article>
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Novos nesta semana</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#17261e]">{metrics.newThisWeek}</p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#eff6e8] text-[#548039]">
              <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                <path d="M4 16.5 9 11l3.5 3.5L20 7m-5 0h5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="rounded-full bg-[#eff6e8] px-2 py-1 font-semibold text-[#548039]">7 dias</span> novos cadastros</p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h2 className="font-semibold text-[#17261e]">Cadastros recentes</h2>
            <p className="mt-1 text-xs text-slate-500">As pessoas que chegaram por último</p>
          </div>
          <Link href="/usuarios" className="text-sm font-semibold text-[#477346] hover:underline">Ver todos <span aria-hidden="true">→</span></Link>
        </div>
        {recentUsers.length ? (
          <ul className="divide-y divide-slate-100">
            {recentUsers.map((recentUser) => (
              <li key={recentUser.id} className="flex items-center gap-3 px-5 py-4 sm:px-6">
                <UserAvatar name={recentUser.name} className="size-10 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{recentUser.name}</p>
                  <p className="truncate text-xs text-slate-500">{recentUser.email}</p>
                </div>
                <p className="hidden text-xs text-slate-500 sm:block">{formatDate(recentUser.createdAt)}</p>
                <span className="ml-2 size-2 rounded-full bg-[#8dbb67]" title="Conta cadastrada" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-700">Ainda não há cadastros por aqui.</p>
            <p className="mt-1 text-sm text-slate-500">Os usuários aparecerão aqui assim que criarem uma conta.</p>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f7f8fa]">
          <p role="status" className="text-sm text-slate-500">Carregando seu dashboard...</p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
