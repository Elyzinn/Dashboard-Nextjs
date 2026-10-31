import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { register } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

const errors: Record<string, string> = {
  dados: "Confira os dados: use um nome válido, e-mail correto e senha com pelo menos 8 caracteres.",
  email: "Este e-mail já está cadastrado. Tente entrar na sua conta.",
};

async function RegisterContent({
  searchParams,
}: PageProps<"/cadastro">) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const { erro } = await searchParams;
  const errorMessage = typeof erro === "string" ? errors[erro] : undefined;

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/" className="mx-auto flex w-fit items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#12251d] text-[#c4f27a]">
          <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
            <path d="M4 13.5 9.5 8l4 4L20 5.5M14.5 5.5H20v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-lg font-semibold tracking-tight text-[#17261e]">pulso<span className="text-[#80b947]">.</span></span>
      </Link>
      <section className="mx-auto mt-10 w-full max-w-[480px] rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_-45px_rgba(16,35,26,0.28)] sm:mt-14 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#71944c]">Vamos começar</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#17261e]">Crie sua conta</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Cadastre-se para acessar o dashboard e acompanhar sua comunidade.</p>

        <form action={register} className="mt-8 space-y-5">
          {errorMessage && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{errorMessage}</p>
          )}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Nome completo</label>
            <input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} placeholder="Como podemos te chamar?" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@email.com" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Senha</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} placeholder="Crie uma senha com 8 caracteres ou mais" className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
          </div>
          <button type="submit" className="flex h-12 w-full items-center justify-center rounded-xl bg-[#173425] text-sm font-semibold text-white transition hover:bg-[#234b34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71944c]">Criar conta <span className="ml-2" aria-hidden="true">→</span></button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">Já tem uma conta? <Link href="/" className="font-semibold text-[#315d3b] hover:underline">Fazer login</Link></p>
      </section>
    </main>
  );
}

export default function RegisterPage(props: PageProps<"/cadastro">) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f7f8fa]">
          <p role="status" className="text-sm text-slate-500">Preparando seu cadastro...</p>
        </main>
      }
    >
      <RegisterContent {...props} />
    </Suspense>
  );
}
