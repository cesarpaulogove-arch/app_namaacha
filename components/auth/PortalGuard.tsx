
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obterSessao } from "@/lib/auth-local";

export function PortalGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  const verificarSessao = useCallback(() => {
    const sessao = obterSessao();

    if (!sessao) {
      setAutorizado(false);
      router.replace("/entrar");
      return;
    }

    setAutorizado(true);
  }, [router]);

  useEffect(() => {
    verificarSessao();

    const verificarAoRetomar = () => {
      if (document.visibilityState === "visible") {
        verificarSessao();
      }
    };

    window.addEventListener("pageshow", verificarAoRetomar);
    document.addEventListener(
      "visibilitychange",
      verificarAoRetomar
    );

    return () => {
      window.removeEventListener("pageshow", verificarAoRetomar);
      document.removeEventListener(
        "visibilitychange",
        verificarAoRetomar
      );
    };
  }, [verificarSessao]);

  if (!autorizado) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background p-6">
        <p className="text-sm text-slate-500">
          A verificar a autenticação...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
