// ── Store de Pedidos ──────────────────────────────────────────────────────────
// Ponte entre o site do cliente (/) e o sistema interno (/sistema). Sem backend:
// os pedidos vivem em localStorage e são compartilhados entre as duas telas do
// mesmo navegador. Trocas em outra aba chegam via evento 'storage'; trocas na
// mesma aba via evento customizado 'apollo-pedidos'.
import { useEffect, useState, useCallback } from 'react';

const KEY = 'apollo-pedidos';
const EVT = 'apollo-pedidos';

export const STATUS_FLUXO = ['Novo', 'Em análise', 'Aprovado', 'Recusado'];

export const TIPO_LABEL = {
  locacao_avulsa: 'Locação',
  venda: 'Compra',
  locacao_padronizada: 'Pacote de casamento',
};

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(arr) {
  try {
    localStorage.setItem(KEY, JSON.stringify(arr));
  } catch { /* storage indisponível — mantém em memória na sessão */ }
  window.dispatchEvent(new CustomEvent(EVT));
}

// protocolo curto e legível para o cliente acompanhar: AR-7F3K2
function novoProtocolo(existentes) {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p;
  do {
    p = 'AR-' + Array.from({ length: 5 }, () => alfabeto[Math.floor(Math.random() * alfabeto.length)]).join('');
  } while (existentes.some((x) => x.protocolo === p));
  return p;
}

export function listPedidos() {
  return read().sort((a, b) => b.criadoEm - a.criadoEm);
}

export function getPedido(protocolo) {
  const alvo = String(protocolo || '').trim().toUpperCase();
  return read().find((p) => p.protocolo === alvo) || null;
}

// Cria um pedido a partir do site. `dados` traz tipo, cliente e os campos
// específicos da modalidade. Devolve o pedido criado (com protocolo).
export function criarPedido(dados) {
  const arr = read();
  const agora = Date.now();
  const pedido = {
    id: 'p' + agora + Math.floor(Math.random() * 1000),
    protocolo: novoProtocolo(arr),
    criadoEm: agora,
    status: 'Novo',
    transId: null,
    motivoRecusa: '',
    historico: [{ status: 'Novo', em: agora, nota: 'Pedido recebido pelo site.' }],
    ...dados,
  };
  write([pedido, ...arr]);
  return pedido;
}

// Atualiza status (uso interno, tela Pedidos). `extra` pode trazer transId/motivo.
export function atualizarStatus(id, status, nota = '', extra = {}) {
  const arr = read().map((p) => {
    if (p.id !== id) return p;
    return {
      ...p,
      status,
      ...extra,
      historico: [...p.historico, { status, em: Date.now(), nota }],
    };
  });
  write(arr);
}

export function removerPedido(id) {
  write(read().filter((p) => p.id !== id));
}

// Hook reativo — re-renderiza quando qualquer tela mexe no store.
export function usePedidos() {
  const [pedidos, setPedidos] = useState(listPedidos);

  useEffect(() => {
    const sync = () => setPedidos(listPedidos());
    const onStorage = (e) => { if (e.key === KEY) sync(); };
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return pedidos;
}

// Só o número de pedidos aguardando triagem — para o selo na navegação.
export function useContagemNovos() {
  const pedidos = usePedidos();
  return pedidos.filter((p) => p.status === 'Novo').length;
}

export function useAcao() {
  return useCallback((id, status, nota, extra) => atualizarStatus(id, status, nota, extra), []);
}
