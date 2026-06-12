// ============================================================================
//  waycareApi.js  -  camada de acesso ao backend WayCare
// ============================================================================
//  A URL do backend vem de variável de ambiente (Vite).
//
//  LOCAL (dev):  arquivo .env na raiz do projeto com:
//      VITE_API_URL=https://waycare-fiap.duckdns.org
//
//  DEPLOY (Vercel): defina a MESMA variável em
//      Project Settings > Environment Variables
//
//  Use sempre a URL HTTPS: uma página local (http) pode chamar um backend
//  https sem problema; o que o navegador bloqueia é o contrário.
// ============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || "https://waycare-fiap.duckdns.org";

// Estado atual da hidratação (polling a cada ~3s)
export async function getStatus() {
  const r = await fetch(`${BASE_URL}/status`);
  if (!r.ok) throw new Error("Falha ao buscar status");
  return r.json();
}

// Histórico para o gráfico (últimas `horas` horas)
export async function getHistory(horas = 24) {
  const r = await fetch(`${BASE_URL}/history?horas=${horas}`);
  if (!r.ok) throw new Error("Falha ao buscar histórico");
  return r.json();
}

// Aciona a tara no dispositivo (botão do site, substitui o botão físico)
export async function postTara() {
  const r = await fetch(`${BASE_URL}/tara`, { method: "POST" });
  if (!r.ok) throw new Error("Falha ao enviar tara");
  return r.json();
}

// ---- Perfil / meta personalizada -----------------------------------------

// Lê o perfil ativo e a meta calculada
export async function getPerfil() {
  const r = await fetch(`${BASE_URL}/perfil`);
  if (!r.ok) throw new Error("Falha ao buscar perfil");
  return r.json();
}

// Salva o perfil (peso, genero, atividade, cidade) e recalcula a meta no backend
export async function postPerfil(dados) {
  const r = await fetch(`${BASE_URL}/perfil`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error("Falha ao salvar perfil");
  return r.json();
}

// Só prevê a meta sem salvar (preview enquanto o usuário preenche o form)
export async function calcularMetaPreview(dados) {
  const r = await fetch(`${BASE_URL}/calcular-meta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (!r.ok) throw new Error("Falha ao calcular meta");
  return r.json();
}
