
"use client";

import { UserRound, ShieldCheck } from "lucide-react";

type ProfileHeaderProps = {
  nome: string;
  email: string;
};

export function ProfileHeader({
  nome,
  email,
}: ProfileHeaderProps) {
  const iniciais = nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-emerald-800 to-emerald-600 sm:h-28" />

      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex items-end gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-emerald-50 text-2xl font-bold text-emerald-800 shadow-sm">
            {iniciais || <UserRound size={36} />}
          </div>

          <div className="min-w-0 flex-1 pb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck size={14} />
              Munícipe
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h1 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
            {nome || "Munícipe"}
          </h1>

          <p className="mt-1 break-all text-sm text-slate-500">
            {email}
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Gira os seus dados pessoais e acompanhe a sua
            relação com o Município da Namaacha.
          </p>
        </div>
      </div>
    </section>
  );
}
