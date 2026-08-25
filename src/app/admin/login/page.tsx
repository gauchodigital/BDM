"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions";

const initialState = { ok: false, error: undefined as string | undefined };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.push("/admin");
  }, [state.ok, router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-[family-name:var(--font-headline)] text-xl font-bold text-white">
            BastaDeMeningitis
          </p>
          <p className="mt-1 text-sm text-white/40">Panel de administración</p>
        </div>

        <form action={formAction} className="space-y-4">
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
          />
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {pending ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/30">
          Configurá <code className="text-white/50">ADMIN_TOKEN</code> en{" "}
          <code className="text-white/50">.env.local</code>
        </p>
      </div>
    </div>
  );
}
