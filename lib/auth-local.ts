export type TipoTitular = "cidadao" | "empresa" | "instituicao";

export type OperadorCarteira = "mpesa" | "emola" | "mkesh";

export type CarteiraMovel = {
  id: string;
  operador: OperadorCarteira;
  telefone: string;
  principal: boolean;
};

export type PerfilTitular = {
  tipo: TipoTitular;
  nome: string;
  nuit: string;
  documentoIdentificacao: string;
  numeroRegisto: string;
  tipoInstituicao: string;
  endereco: string;
};

export type ContaLocal = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  passwordHash: string;
  criadoEm: string;
  perfil: PerfilTitular;
  carteiras: CarteiraMovel[];
};

export type DadosRegisto = {
  nome: string;
  email: string;
  telefone?: string;
  password: string;
  tipoTitular?: TipoTitular;
  nuit?: string;
  documentoIdentificacao?: string;
  numeroRegisto?: string;
  tipoInstituicao?: string;
  endereco?: string;
  operadorCarteira?: OperadorCarteira | "";
  telefoneCarteira?: string;
};

export type SessaoLocal = {
  id: string;
  nome: string;
  email: string;
};

const CHAVE_CONTAS = "namaacha_contas";
const CHAVE_SESSAO = "namaacha_sessao";

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

function tipoValido(valor: unknown): TipoTitular {
  if (valor === "empresa" || valor === "instituicao") return valor;
  return "cidadao";
}

function operadorValido(
  valor: unknown
): valor is OperadorCarteira {
  return valor === "mpesa" || valor === "emola" || valor === "mkesh";
}

function normalizarConta(valor: unknown): ContaLocal | null {
  if (!valor || typeof valor !== "object") return null;

  const item = valor as Record<string, unknown>;
  const nome = texto(item.nome);
  const email = texto(item.email).toLowerCase();
  const telefone = texto(item.telefone);
  const id = texto(item.id);

  if (!id || !nome || !email) return null;

  const perfilAntigo =
    item.perfil && typeof item.perfil === "object"
      ? (item.perfil as Record<string, unknown>)
      : {};

  const tipo = tipoValido(perfilAntigo.tipo ?? item.tipoTitular);

  const perfil: PerfilTitular = {
    tipo,
    nome: texto(perfilAntigo.nome) || nome,
    nuit: texto(perfilAntigo.nuit),
    documentoIdentificacao: texto(
      perfilAntigo.documentoIdentificacao
    ),
    numeroRegisto: texto(perfilAntigo.numeroRegisto),
    tipoInstituicao: texto(perfilAntigo.tipoInstituicao),
    endereco: texto(perfilAntigo.endereco),
  };

  const carteirasAntigas = Array.isArray(item.carteiras)
    ? item.carteiras
    : [];

  const carteiras: CarteiraMovel[] = carteirasAntigas
    .filter(
      (carteira): carteira is Record<string, unknown> =>
        !!carteira && typeof carteira === "object"
    )
    .filter(
      (carteira) =>
        operadorValido(carteira.operador) &&
        !!texto(carteira.telefone)
    )
    .map((carteira, indice) => ({
      id: texto(carteira.id) || crypto.randomUUID(),
      operador: carteira.operador as OperadorCarteira,
      telefone: texto(carteira.telefone),
      principal: carteira.principal === true || indice === 0,
    }));

  return {
    id,
    nome,
    email,
    telefone,
    passwordHash: texto(item.passwordHash),
    criadoEm: texto(item.criadoEm) || new Date().toISOString(),
    perfil,
    carteiras,
  };
}

function obterContas(): ContaLocal[] {
  if (typeof window === "undefined") return [];

  try {
    const dados = localStorage.getItem(CHAVE_CONTAS);
    if (!dados) return [];

    const resultado: unknown = JSON.parse(dados);
    if (!Array.isArray(resultado)) return [];

    const contas = resultado
      .map(normalizarConta)
      .filter((conta): conta is ContaLocal => conta !== null);

    // Guarda o formato atualizado, incluindo contas antigas.
    localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));

    return contas;
  } catch {
    return [];
  }
}

function guardarContas(contas: ContaLocal[]) {
  localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
}

async function criarHash(password: string): Promise<string> {
  const dados = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", dados);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function validarTelefone(telefone: string): boolean {
  const limpo = telefone.replace(/[\s()-]/g, "");
  return /^\+?258\d{9}$/.test(limpo) || /^8\d{8}$/.test(limpo) || /^2\d{8}$/.test(limpo);
}

export async function registarConta(dados: DadosRegisto) {
  if (typeof window === "undefined") {
    throw new Error("O registo só pode ser feito no navegador.");
  }

  const nome = texto(dados.nome);
  const email = texto(dados.email).toLowerCase();
  const telefone = texto(dados.telefone);
  const tipoTitular = tipoValido(dados.tipoTitular);

  if (!nome || !email || !telefone || !dados.password) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Introduza um email válido.");
  }

  if (!validarTelefone(telefone)) {
    throw new Error(
      "Introduza um número de telefone válido de Moçambique."
    );
  }

  if (dados.password.length < 8) {
    throw new Error(
      "A palavra-passe deve ter pelo menos 8 caracteres."
    );
  }

  const nuit = texto(dados.nuit);
  const documentoIdentificacao = texto(dados.documentoIdentificacao);
  const numeroRegisto = texto(dados.numeroRegisto);
  const tipoInstituicao = texto(dados.tipoInstituicao);
  const endereco = texto(dados.endereco);

  if (tipoTitular === "cidadao" && !documentoIdentificacao) {
    throw new Error(
      "Introduza o número do documento de identificação."
    );
  }

  if (tipoTitular !== "cidadao" && !nuit) {
    throw new Error("Introduza o NUIT da entidade.");
  }

  if (tipoTitular === "empresa" && !numeroRegisto) {
    throw new Error(
      "Introduza o número de registo da empresa."
    );
  }

  if (tipoTitular === "instituicao" && !tipoInstituicao) {
    throw new Error("Indique o tipo de instituição.");
  }

  const contas = obterContas();

  if (contas.some((conta) => conta.email === email)) {
    throw new Error("Já existe uma conta com este email.");
  }

  const operadorCarteira = dados.operadorCarteira || "";
  const telefoneCarteira = texto(dados.telefoneCarteira);
  const carteiras: CarteiraMovel[] = [];

  if (operadorCarteira && !telefoneCarteira) {
    throw new Error(
      "Introduza o número da carteira móvel selecionada."
    );
  }

  if (!operadorCarteira && telefoneCarteira) {
    throw new Error(
      "Selecione M-Pesa, e-Mola ou mKesh para o número indicado."
    );
  }

  if (operadorCarteira && telefoneCarteira) {
    if (!operadorValido(operadorCarteira)) {
      throw new Error("Selecione um operador de pagamento válido.");
    }

    if (!validarTelefone(telefoneCarteira)) {
      throw new Error(
        "Introduza um número de pagamento válido de Moçambique."
      );
    }

    carteiras.push({
      id: crypto.randomUUID(),
      operador: operadorCarteira,
      telefone: telefoneCarteira,
      principal: true,
    });
  }

  const novaConta: ContaLocal = {
    id: crypto.randomUUID(),
    nome,
    email,
    telefone,
    passwordHash: await criarHash(dados.password),
    criadoEm: new Date().toISOString(),
    perfil: {
      tipo: tipoTitular,
      nome,
      nuit,
      documentoIdentificacao,
      numeroRegisto,
      tipoInstituicao,
      endereco,
    },
    carteiras,
  };

  contas.push(novaConta);
  guardarContas(contas);

  return {
    id: novaConta.id,
    nome: novaConta.nome,
    email: novaConta.email,
  };
}

export async function iniciarSessao(
  emailInput: string,
  password: string
): Promise<SessaoLocal> {
  if (typeof window === "undefined") {
    throw new Error("O login só pode ser feito no navegador.");
  }

  const email = emailInput.trim().toLowerCase();
  const contas = obterContas();
  const conta = contas.find((item) => item.email === email);

  if (!conta || !conta.passwordHash) {
    throw new Error("Email ou palavra-passe incorretos.");
  }

  const passwordHash = await criarHash(password);

  if (passwordHash !== conta.passwordHash) {
    throw new Error("Email ou palavra-passe incorretos.");
  }

  const sessao: SessaoLocal = {
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
  };

  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));

  return sessao;
}

export function obterSessao(): SessaoLocal | null {
  if (typeof window === "undefined") return null;

  try {
    const dados = localStorage.getItem(CHAVE_SESSAO);
    if (!dados) return null;

    const sessao: unknown = JSON.parse(dados);

    if (!sessao || typeof sessao !== "object") return null;

    const item = sessao as Record<string, unknown>;

    if (
      typeof item.id !== "string" ||
      typeof item.email !== "string" ||
      typeof item.nome !== "string"
    ) {
      return null;
    }

    return {
      id: item.id,
      nome: item.nome,
      email: item.email,
    };
  } catch {
    return null;
  }
}

export function obterConta(id: string): ContaLocal | null {
  return obterContas().find((conta) => conta.id === id) ?? null;
}

export function obterContaAtual(): ContaLocal | null {
  const sessao = obterSessao();
  if (!sessao) return null;

  return obterConta(sessao.id);
}

export function atualizarCarteiras(
  carteirasNovas: CarteiraMovel[]
): ContaLocal {
  if (typeof window === "undefined") {
    throw new Error("Esta operação só pode ser feita no navegador.");
  }

  const sessao = obterSessao();

  if (!sessao) {
    throw new Error("Inicie sessão para configurar os pagamentos.");
  }

  const contas = obterContas();
  const indice = contas.findIndex((conta) => conta.id === sessao.id);

  if (indice < 0) {
    throw new Error("Não foi possível encontrar a conta.");
  }

  if (carteirasNovas.some(
    (carteira) => !operadorValido(carteira.operador) ||
      !validarTelefone(carteira.telefone)
  )) {
    throw new Error("Verifique os operadores e números de pagamento.");
  }

  const ids = new Set<string>();
  for (const carteira of carteirasNovas) {
    if (ids.has(carteira.operador)) {
      throw new Error(
        "Configure apenas um número por operador de pagamento."
      );
    }
    ids.add(carteira.operador);
  }

  const principalCount = carteirasNovas.filter(
    (carteira) => carteira.principal
  ).length;

  if (carteirasNovas.length > 0 && principalCount !== 1) {
    throw new Error(
      "Selecione exatamente um número de pagamento principal."
    );
  }

  const contaAtualizada: ContaLocal = {
    ...contas[indice],
    carteiras: carteirasNovas.map((carteira) => ({
      ...carteira,
      id: carteira.id || crypto.randomUUID(),
    })),
  };

  contas[indice] = contaAtualizada;
  guardarContas(contas);

  return contaAtualizada;
}

export function terminarSessao() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHAVE_SESSAO);
  }
}