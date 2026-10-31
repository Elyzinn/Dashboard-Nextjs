import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth";
import { listUsers } from "@/lib/database";
import { UsersTable } from "./users-table";

async function UsersContent() {
  const user = await requireUser();
  const users = listUsers();

  return (
    <DashboardShell user={user} active="usuarios">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Sua comunidade</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#17261e] sm:text-[30px]">Usuários</h1>
          <p className="mt-2 text-sm text-slate-500">Gerencie e acompanhe as pessoas cadastradas no Pulso.</p>
        </div>
      </header>
      <UsersTable users={users} />
    </DashboardShell>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f7f8fa]">
          <p role="status" className="text-sm text-slate-500">Carregando os usuários...</p>
        </main>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
