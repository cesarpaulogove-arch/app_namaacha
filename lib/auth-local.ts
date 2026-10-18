
export type TipoTitular = "cidadao" | "empresa" | "instituicao";

export type OperadorCarteira = "mpesa" | "emola" | "mkesh";

export type CarteiraMovel = {
  id: string;
  operador: OperadorCarteira;
  telefone: string;
  principal: boolean;
};

export type DocumentoCarregado = {
  nome: string;
  tipo: string;
  tamanho: number;
  dados: string;
};

export type PerfilTitular = {
  tipo: TipoTitular;
  nome: string;
  nuit: string;
  documentoIdentificacao: string;
  numeroRegisto: string;
  tipoInstituicao: string;
  endereco: string;
  documentoBI: DocumentoCarregado | null;
  documentoNuit: DocumentoCarregado | null;
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
  documentoBI?: DocumentoCarregado | null;
  documentoNuit?: DocumentoCarregado | null;
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
  if (valor === "empresa" || valor === "instituicao") {
    return valor;
  }

  return "cidadao";
}

function operadorValido(
  valor: unknown
): valor is OperadorCarteira {
  return (
    valor === "mpesa" ||
    valor === "emola" ||
    valor === "mkesh"
  );
}

function normalizarDocumento(
  valor: unknown
): DocumentoCarregado | null {
  if (!valor || typeof valor !== "object") {
    return null;
  }

  const item = valor as Record<string, unknown>;
  const nome = texto(item.nome);
  const tipo = texto(item.tipo);
  const dados =
    typeof item.dados === "string" ? item.dados : "";
  const tamanho =
    typeof item.tamanho === "number" ? item.tamanho : 0;

  if (!nome || !tipo || !dados) {
    return null;
  }

  return { nome, tipo, tamanho, dados };
}

function criarId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizarConta(valor: unknown): ContaLocal {
  const item =
    valor && typeof valor === "object"
      ? (valor as Record<string, unknown>)
      : {};

  const perfilOriginal =
    item.perfil && typeof item.perfil === "object"
      ? (item.perfil as Record<string, unknown>)
      : {};

  const carteirasOriginais = Array.isArray(item.carteiras)
    ? item.carteiras
    : [];

  const carteiras: CarteiraMovel[] = carteirasOriginais
    .filter(
      (carteira): carteira is Record<string, unknown> =>
        !!carteira && typeof carteira === "object"
    )
    .filter((carteira) => operadorValido(carteira.operador))
    .map((carteira) => ({
      id: texto(carteira.id) || criarId(),
      operador: carteira.operador as OperadorCarteira,
      telefone: texto(carteira.telefone),
      principal: carteira.principal === true,
    }));

  const nome = texto(item.nome);

  return {
    id: texto(item.id) || criarId(),
    nome,
    email: texto(item.email).toLowerCase(),
    telefone: texto(item.telefone),
    passwordHash: texto(item.passwordHash),
    criadoEm: texto(item.criadoEm),
    perfil: {
      tipo: tipoValido(perfilOriginal.tipo),
      nome: texto(perfilOriginal.nome) || nome,
      nuit: texto(perfilOriginal.nuit),
      documentoIdentificacao: texto(
        perfilOriginal.documentoIdentificacao
      ),
      numeroRegisto: texto(perfilOriginal.numeroRegisto),
      tipoInstituicao: texto(perfilOriginal.tipoInstituicao),
      endereco: texto(perfilOriginal.endereco),
      documentoBI: normalizarDocumento(
        perfilOriginal.documentoBI
      ),
      documentoNuit: normalizarDocumento(
        perfilOriginal.documentoNuit
      ),
    },
    carteiras,
  };
}

function obterContas(): ContaLocal[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const dados = localStorage.getItem(CHAVE_CONTAS);

    if (!dados) {
      return [];
    }

    const contas: unknown = JSON.parse(dados);

    if (!Array.isArray(contas)) {
      return [];
    }

    return contas.map(normalizarConta);
  } catch (erro) {
    console.error("Erro ao ler contas locais:", erro);
    return [];
  }
}

function guardarContas(contas: ContaLocal[]): void {
  if (typeof window === "undefined") {
    throw new Error("O armazenamento local não está disponível.");
  }

  try {
    localStorage.setItem(CHAVE_CONTAS, JSON.stringify(contas));
  } catch (erro) {
    console.error("Erro ao guardar contas:", erro);

    throw new Error(
      "Não foi possível guardar os dados. Verifique o espaço disponível no dispositivo."
    );
  }
}

async function gerarHash(password: string): Promise<string> {
  if (
    typeof crypto === "undefined" ||
    !crypto.subtle
  ) {
    throw new Error(
      "Não foi possível proteger a palavra-passe neste navegador."
    );
  }

  const dados = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", dados);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ======================================================
// REGISTAR CONTA
// Os dados da conta continuam guardados no localStorage.
// ======================================================

export async function registarConta(
  dados: DadosRegisto
): Promise<ContaLocal> {
  if (typeof window === "undefined") {
    throw new Error("O registo só pode ser feito no navegador.");
  }

  const nome = texto(dados.nome);
  const email = texto(dados.email).toLowerCase();
  const telefone = texto(dados.telefone);
  const password = dados.password;
  const tipo = tipoValido(dados.tipoTitular);

  if (!nome || !email || !password) {
    throw new Error(
      "Preencha o nome, o email e a palavra-passe."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Introduza um endereço de email válido.");
  }

  if (password.length < 8) {
    throw new Error(
      "A palavra-passe deve ter pelo menos 8 caracteres."
    );
  }

  const contas = obterContas();

  if (contas.some((conta) => conta.email === email)) {
    throw new Error("Já existe uma conta com este email.");
  }

  const telefoneNormalizado = telefone.replace(/\s+/g, "");

  if (
    telefoneNormalizado &&
    contas.some(
      (conta) =>
        conta.telefone.replace(/\s+/g, "") ===
        telefoneNormalizado
    )
  ) {
    throw new Error(
      "Já existe uma conta com este número de telefone."
    );
  }

  const operador = dados.operadorCarteira;
  const telefoneCarteira = texto(dados.telefoneCarteira);

  const carteiras: CarteiraMovel[] =
    operador && operadorValido(operador) && telefoneCarteira
      ? [
          {
            id: criarId(),
            operador,
            telefone: telefoneCarteira,
            principal: true,
          },
        ]
      : [];

  const novaConta: ContaLocal = {
    id: criarId(),
    nome,
    email,
    telefone,
    passwordHash: await gerarHash(password),
    criadoEm: new Date().toISOString(),
    perfil: {
      tipo,
      nome,
      nuit: texto(dados.nuit),
      documentoIdentificacao: texto(
        dados.documentoIdentificacao
      ),
      numeroRegisto: texto(dados.numeroRegisto),
      tipoInstituicao: texto(dados.tipoInstituicao),
      endereco: texto(dados.endereco),
      documentoBI: normalizarDocumento(dados.documentoBI),
      documentoNuit: normalizarDocumento(dados.documentoNuit),
    },
    carteiras,
  };

  guardarContas([...contas, novaConta]);

  return novaConta;
}

// ======================================================
// INICIAR SESSÃO
// Aceita email ou número de telefone.
// A sessão fica no sessionStorage, não nas contas.
// ======================================================

export async function iniciarSessao(
  identificador: string,
  password: string
): Promise<SessaoLocal> {
  if (typeof window === "undefined") {
    throw new Error("O início de sessão só funciona no navegador.");
  }

  const valor = texto(identificador).toLowerCase();
  const telefoneIntroduzido = texto(identificador).replace(
    /\s+/g,
    ""
  );

  if (!valor || !password) {
    throw new Error(
      "Introduza o email ou telefone e a palavra-passe."
    );
  }

  const contas = obterContas();

  const conta = contas.find((item) => {
    const email = texto(item.email).toLowerCase();
    const telefone = texto(item.telefone).replace(/\s+/g, "");

    return (
      (email !== "" && email === valor) ||
      (telefone !== "" && telefone === telefoneIntroduzido)
    );
  });

  if (!conta) {
    throw new Error(
      "Conta não encontrada. Verifique o email ou telefone."
    );
  }

  const hash = await gerarHash(password);

  if (conta.passwordHash !== hash) {
    throw new Error("Palavra-passe incorreta.");
  }

  const sessao: SessaoLocal = {
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
  };

  try {
    // Remover eventual sessão antiga persistida.
    localStorage.removeItem(CHAVE_SESSAO);

    // Guardar a sessão apenas no armazenamento temporário.
    sessionStorage.setItem(
      CHAVE_SESSAO,
      JSON.stringify(sessao)
    );
  } catch (erro) {
    console.error("Erro ao guardar a sessão:", erro);

    throw new Error(
      "Não foi possível iniciar a sessão neste dispositivo."
    );
  }

  return sessao;
}

// ======================================================
// OBTER SESSÃO
// Valida se a sessão existe e se a conta continua registada.
// ======================================================

export function obterSessao(): SessaoLocal | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Eliminar apenas a sessão antiga do localStorage.
    // Não mexe nas contas nem nos documentos.
    localStorage.removeItem(CHAVE_SESSAO);

    const dados = sessionStorage.getItem(CHAVE_SESSAO);

    if (!dados) {
      return null;
    }

    const sessao: unknown = JSON.parse(dados);

    if (!sessao || typeof sessao !== "object") {
      sessionStorage.removeItem(CHAVE_SESSAO);
      return null;
    }

    const item = sessao as Record<string, unknown>;
    const id = texto(item.id);

    if (!id) {
      sessionStorage.removeItem(CHAVE_SESSAO);
      return null;
    }

    // Confirmar que a conta ainda existe.
    const conta = obterContas().find(
      (item) => item.id === id
    );

    if (!conta) {
      sessionStorage.removeItem(CHAVE_SESSAO);
      return null;
    }

    return {
      id: conta.id,
      nome: conta.nome,
      email: conta.email,
    };
  } catch (erro) {
    console.error("Erro ao validar a sessão:", erro);
    return null;
  }
}

// ======================================================
// OBTER CONTA ACTUAL
// ======================================================

export function obterContaAtual(): ContaLocal | null {
  const sessao = obterSessao();

  if (!sessao) {
    return null;
  }

  return (
    obterContas().find((conta) => conta.id === sessao.id) ??
    null
  );
}

// ======================================================
// LISTAR CONTAS
// ======================================================

export function listarContas(): ContaLocal[] {
  return obterContas();
}

// ======================================================
// OBTER CONTA POR ID
// ======================================================

export function obterContaPorId(
  id: string
): ContaLocal | null {
  return (
    obterContas().find((conta) => conta.id === id) ?? null
  );
}

// ======================================================
// ACTUALIZAR PERFIL
// ======================================================

export function atualizarPerfil(
  id: string,
  alteracoes: Partial<
    Omit<PerfilTitular, "tipo" | "documentoBI" | "documentoNuit">
  > & {
    tipo?: TipoTitular;
    documentoBI?: DocumentoCarregado | null;
    documentoNuit?: DocumentoCarregado | null;
  }
): ContaLocal {
  const contas = obterContas();
  const indice = contas.findIndex((conta) => conta.id === id);

  if (indice === -1) {
    throw new Error("Conta não encontrada.");
  }

  const conta = contas[indice];

  contas[indice] = {
    ...conta,
    perfil: {
      ...conta.perfil,
      ...alteracoes,
      tipo:
        alteracoes.tipo !== undefined
          ? tipoValido(alteracoes.tipo)
          : conta.perfil.tipo,
      documentoBI:
        alteracoes.documentoBI !== undefined
          ? normalizarDocumento(alteracoes.documentoBI)
          : conta.perfil.documentoBI,
      documentoNuit:
        alteracoes.documentoNuit !== undefined
          ? normalizarDocumento(alteracoes.documentoNuit)
          : conta.perfil.documentoNuit,
    },
  };

  guardarContas(contas);

  return contas[indice];
}

// ======================================================
// TERMINAR SESSÃO
// Remove apenas a autenticação, preservando os dados.
// ======================================================

export function terminarSessao(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(CHAVE_SESSAO);
    localStorage.removeItem(CHAVE_SESSAO);
  } catch (erro) {
    console.error("Erro ao terminar a sessão:", erro);
  }
}

// ======================================================
// ELIMINAR CONTA
// Esta função só é chamada quando se pretende apagar uma conta.
// ======================================================

export function eliminarContaLocal(id: string): void {
  const contas = obterContas();
  const restantes = contas.filter((conta) => conta.id !== id);

  if (contas.length === restantes.length) {
    throw new Error("Conta não encontrada.");
  }

  guardarContas(restantes);

  const sessao = obterSessao();

  if (sessao?.id === id) {
    terminarSessao();
  }
}
