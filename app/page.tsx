"use client";

import Link from "next/link";
import { useState } from "react";
import { Landmark, Mail, LockKeyhole, ArrowRight, UserRound } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("O formulário está pronto. Ligue o login ao seu serviço de autenticação para entrar.");
  }

  return (
    <main className="login-page">
      <div className="login-photo" aria-hidden="true" />
      <section className="login-panel">
        <div className="login-brand-mark"><Landmark size={27} /></div>
        <p className="login-eyebrow">PORTAL DO MUNÍCIPE</p>
        <h1>Município de <span>Namaacha</span></h1>
        <p className="login-intro">Os serviços municipais, sempre consigo.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <div className="login-input-wrap"><Mail size={18} /><input id="email" type="email" placeholder="nome@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <label htmlFor="password">Palavra-passe</label>
          <div className="login-input-wrap"><LockKeyhole size={18} /><input id="password" type="password" placeholder="Introduza a sua palavra-passe" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div>
          <div className="login-options"><label className="remember"><input type="checkbox" /> Manter sessão iniciada</label><button type="button" className="text-button" onClick={() => setMessage("A recuperação de palavra-passe deverá ser ligada ao serviço de autenticação.")}>Esqueceu-se?</button></div>
          <button className="login-submit" type="submit">Entrar <ArrowRight size={18} /></button>
          {message && <p className="login-message" role="status">{message}</p>}
        </form>
        <div className="login-divider"><span>ou</span></div>
        <Link href="/perfil" className="create-account"><UserRound size={18} /> Criar conta de munícipe</Link>
        <p className="login-footer">Ao continuar, aceita os termos de utilização e a política de privacidade do Município.</p>
      </section>
    </main>
  );
}
