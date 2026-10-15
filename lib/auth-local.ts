
export type ContaLocal = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  passwordHash: string;
  criadoEm: string;
};

const CHAVE_CONTAS = "namaacha_contas";
const CHAVE_SESSAO = "namaacha_sessao";

function obterContas(): ContaLocal[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_CONTAS);
    return dados ? JSON.parse(dados) : [];
  } catch {
    return [];
  }
}

async function criarHash(password: string): Promise<string> {
  const dados = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", dados);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registarConta(dados: {
  nome: string;
  email: string;
  telefone?: string;
  password: string;
}) {
  if (typeof window === "undefined") {
    throw new Error("O registo só pode ser feito no navegador.");
  }

  const nome = dados.nome.trim();
  const email = dados.email.trim().toLowerCase();
  const telefone = dados.telefone?.trim() || "";

  if (!nome || !email || !dados.password) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Introduza um email válido.");
  }

  if (dados.password.length < 8) {
    throw new Error("A palavra-passe deve ter pelo menos 8 caracteres.");
  }

  const contas = obterContas();

  if (contas.some((conta) => conta.email === email)) {
    throw new Error("Já existe uma conta com este email.");
  }

  const novaConta: ContaLocal = {
    id: crypto.randomUUID(),
    nome,
    email,
    telefone,
    passwordHash: await criarHash(dados.password),
    criadoEm: new Date().toISOString(),
  };

  contas.push(novaConta);
  localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));

  return {
    id: novaConta.id,
    nome: novaConta.nome,
    email: novaConta.email,
  };
}

export async function iniciarSessao(emailInput: string, password: string) {
  if (typeof window === "undefined") {
    throw new Error("O login só pode ser feito no navegador.");
  }

  const email = emailInput.trim().toLowerCase();
  const contas = obterContas();
  const conta = contas.find((item) => item.email === email);

  if (!conta) {
    throw new Error("Email ou palavra-passe incorretos.");
  }

  const passwordHash = await criarHash(password);

  if (passwordHash !== conta.passwordHash) {
    throw new Error("Email ou palavra-passe incorretos.");
  }

  const sessao = {
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
  };

  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

  return sessao;
}

export function obterSessao() {
  if (typeof window === "undefined") return null;

  try {
    const dados = localStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  } catch {
    return null;
  }
}

export function terminarSessao() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHAVE_SESSAO);
  }
}
