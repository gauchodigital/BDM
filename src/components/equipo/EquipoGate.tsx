"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

type GateView = "loading" | "login" | "denied" | "ok" | "nofirebase";

export function EquipoGate({ children }: { children: ReactNode }) {
  const [view, setView] = useState<GateView>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [deniedEmail, setDeniedEmail] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setView("nofirebase");
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setView("nofirebase");
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setView("login");
        return;
      }
      void checkViewer(u);
    });
    return () => unsub();
  }, []);

  async function checkViewer(u: User) {
    const db = getFirebaseDb();
    const email = u.email;
    if (!db || !email) {
      setView("denied");
      setDeniedEmail(email || "");
      return;
    }
    try {
      const snap = await getDoc(doc(db, "allowedViewers", email));
      if (!snap.exists()) {
        setDeniedEmail(email);
        setView("denied");
        return;
      }
      setView("ok");
    } catch {
      setDeniedEmail(email);
      setView("denied");
    }
  }

  const login = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      alert(`Error de login: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const logout = () => {
    const auth = getFirebaseAuth();
    if (auth) void signOut(auth);
  };

  if (view === "loading") {
    return (
      <Center>
        <p className="text-sm text-[#6b6578]">Cargando…</p>
      </Center>
    );
  }

  if (view === "nofirebase") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">
            Firebase no configurado
          </h1>
          <p className="mb-0 text-sm text-[#6b6578]">
            Ver <code className="text-xs">docs/FIREBASE-SETUP.md</code>.
          </p>
        </LockBox>
      </Center>
    );
  }

  if (view === "login") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">
            Portal BDM
          </h1>
          <p className="mb-5 text-sm text-[#6b6578]">
            Área interna del equipo. Acceso restringido.
          </p>
          <button
            type="button"
            onClick={() => void login()}
            className="inline-flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#dadce0] bg-white px-5 py-3 text-[15px] font-semibold text-[#3c4043] shadow-sm hover:bg-[#f8f9fa]"
          >
            <GoogleIcon />
            Iniciar sesión con Google
          </button>
          <p className="mt-4 text-[13px] text-[#6b6578]">
            Solo cuentas autorizadas.
          </p>
        </LockBox>
      </Center>
    );
  }

  if (view === "denied") {
    return (
      <Center>
        <LockBox>
          <h1 className="m-0 mb-1.5 text-[22px] text-[#3d2d5c]">Sin acceso</h1>
          <p className="mb-4 text-sm text-[#6b6578]">
            La cuenta <b>{deniedEmail}</b> no está habilitada para el portal.
          </p>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer border-0 bg-transparent text-[13px] text-[#503C77] underline"
          >
            Salir y probar con otra cuenta
          </button>
        </LockBox>
      </Center>
    );
  }

  return (
    <div className="min-h-full">
      <header className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-br from-[#3d2d5c] to-[#503C77] px-7 py-[18px] text-white">
        <h1 className="m-0 text-xl font-bold">
          <a href="/equipo" className="text-white no-underline hover:opacity-90">
            Portal BDM
          </a>
          {" · "}
          <span className="font-normal">equipo</span>
        </h1>
        <div className="text-xs opacity-85">
          <span>{user?.email}</span>
          {" · "}
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer border-0 bg-transparent text-white underline"
          >
            Salir
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

function Center({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3.5 p-5 text-center">
      {children}
    </div>
  );
}

function LockBox({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[380px] rounded-2xl bg-white px-[34px] py-9 shadow-[0_10px_40px_rgba(0,0,0,.12)]">
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.9 6.1C12.3 13.2 17.6 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.3 5.7C43.6 38 46.5 31.8 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.9-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.3-5.7c-2 1.4-4.7 2.3-7.9 2.3-6.4 0-11.7-3.7-13.6-8.9l-7.9 6.1C6.4 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}
