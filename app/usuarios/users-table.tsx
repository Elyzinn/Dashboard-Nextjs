"use client";

import { useMemo, useState } from "react";
import type { User } from "@/lib/database";
import { UserAvatar } from "@/components/dashboard-shell";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value.replace(" ", "T")}Z`));
}

export function UsersTable({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");
    if (!query) return users;
    return users.filter(
      (user) =>
        user.name.toLocaleLowerCase("pt-BR").includes(query) ||
        user.email.toLocaleLowerCase("pt-BR").includes(query),
    );
  }, [search, users]);

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold text-[#17261e]">Todos os usuários</h2>
          <p className="mt-1 text-xs text-slate-500">{users.length} {users.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}</p>
        </div>
        <label className="relative block w-full sm:max-w-[300px]">
          <span className="sr-only">Buscar por nome ou e-mail</span>
          <svg viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar usuário..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
        </label>
      </div>
      {filteredUsers.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="bg-[#fafbfc] text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                <th scope="col" className="px-6 py-3.5">Usuário</th>
                <th scope="col" className="px-6 py-3.5">E-mail</th>
                <th scope="col" className="px-6 py-3.5">Data de cadastro</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} className="size-9 text-[10px]" />
                      <span className="whitespace-nowrap text-sm font-medium text-slate-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6e8] px-2.5 py-1 text-xs font-medium text-[#4c7337]">
                      <span className="size-1.5 rounded-full bg-[#79a952]" /> Ativo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-[#eff6e8] text-[#548039]" aria-hidden="true">⌕</span>
          <p className="mt-4 text-sm font-medium text-slate-800">{users.length ? "Nenhum usuário encontrado" : "Sua lista ainda está vazia"}</p>
          <p className="mt-1 text-sm text-slate-500">{users.length ? "Tente buscar por outro nome ou e-mail." : "Crie a primeira conta para começar a acompanhar os cadastros."}</p>
        </div>
      )}
      <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">Exibindo {filteredUsers.length} de {users.length} usuários</div>
    </section>
  );
}
