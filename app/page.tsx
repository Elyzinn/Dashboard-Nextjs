import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { login } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

const errors: Record<string, string> = {
  credenciais: "E-mail ou senha incorretos. Confira seus dados e tente novamente.",
};

async function LoginContent({
  searchParams,
}: PageProps<"/">) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const { erro } = await searchParams;
  const errorMessage = typeof erro === "string" ? errors[erro] : undefined;

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[1fr_0.92fr]">
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-16 xl:px-24">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#12251d] text-[#c4f27a]">
            <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
              <path d="M4 13.5 9.5 8l4 4L20 5.5M14.5 5.5H20v5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-[#17261e]">pulso<span className="text-[#80b947]">.</span></span>
        </Link>

        <div className="mx-auto my-auto w-full max-w-[410px] py-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#71944c]">Bem-vindo de volta</p>
          <h1 className="text-[32px] font-semibold tracking-tight text-[#17261e] sm:text-4xl">Entre na sua conta</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Acesse seu espaço e acompanhe tudo de perto.</p>

          <form action={login} className="mt-9 space-y-5">
            {errorMessage && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="voce@email.com" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">Senha</label>
                <span className="text-xs text-slate-400">Mínimo de 8 caracteres</span>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128} placeholder="Sua senha" className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#8ebc5e] focus:ring-4 focus:ring-[#8ebc5e]/10" />
            </div>
            <button type="submit" className="flex h-12 w-full items-center justify-center rounded-xl bg-[#173425] text-sm font-semibold text-white transition hover:bg-[#234b34] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71944c]">Entrar na plataforma <span className="ml-2" aria-hidden="true">→</span></button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Ainda não tem uma conta?{" "}
            <Link href="/cadastro" className="font-semibold text-[#315d3b] hover:underline">Criar conta</Link>
          </p>
        </div>
        <p className="text-xs text-slate-400">Simples, organizado e do seu jeito.</p>
      </section>

      <aside className="relative hidden min-h-screen overflow-hidden bg-[#12251d] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute -right-36 -top-32 size-[520px] rounded-full border border-white/[0.06]" />
        <div className="absolute -right-16 -top-12 size-[360px] rounded-full border border-white/[0.07]" />
        <div className="absolute -bottom-48 -left-36 size-[500px] rounded-full border border-white/[0.06]" />
        <div className="relative z-10 ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs text-slate-300">
          <span className="size-2 rounded-full bg-[#c4f27a]" /> Seu espaço, em tempo real
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="mb-7 flex size-12 items-center justify-center rounded-2xl bg-[#c4f27a] text-xl text-[#12251d]">✳</span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4f27a]">Organize. Acompanhe. Cresça.</p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.14] tracking-tight xl:text-[52px]">Sua comunidade merece um lugar à altura.</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Uma visão clara de quem faz parte do seu projeto — sem perder de vista o que realmente importa.</p>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["ML", "RA", "JC", "BN"].map((item, index) => (
                <span key={item} className={`flex size-10 items-center justify-center rounded-full border-[3px] border-[#12251d] text-[10px] font-semibold text-[#203127] ${["bg-[#e9c9b3]", "bg-[#c6d9cd]", "bg-[#d9c9e8]", "bg-[#e8daab]"][index]}`}>{item}</span>
              ))}
            </div>
            <p className="text-sm text-slate-300"><span className="font-semibold text-white">Pessoas conectadas</span><br />começam com uma boa organização.</p>
          </div>
        </div>
        <p className="relative z-10 text-xs text-slate-500">Pulso · Pessoas no centro de tudo</p>
      </aside>
    </main>
  );
}

export default function LoginPage(props: PageProps<"/">) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-white">
          <p role="status" className="text-sm text-slate-500">Preparando seu espaço...</p>
        </main>
      }
    >
      <LoginContent {...props} />
    </Suspense>
  );
}
