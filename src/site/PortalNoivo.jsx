// ── Portal do noivo (somente leitura) ────────────────────────────────────────
// Mesma informação do preview "Portal do noivo" dos pacotes padronizados do
// sistema interno (src/components/Locacoes.jsx → PortalNoivoPreview), adaptada
// à linguagem editorial da vitrine. Renderiza sem Section/Wrap — é usado dentro
// de uma aba da Área do cliente.
import { Tape, onImgError, ink, sub, muted, line, card, brass } from './ui';
import { comparecimentoPacote, integranteCompareceu } from '../logic';
import { CATALOGO } from './siteData';
import { fmtDate } from '../constants';

const mono = 'var(--font-mono)';
const MONO_FEAT = { fontFamily: mono, fontFeatureSettings: "'tnum' 1, 'zero' 1" };
const hojeISO = () => new Date().toISOString().slice(0, 10);

// agrupa os integrantes por papel, pegando o traje de cada papel (1º integrante)
function categoriasDoGrupo(integrantes) {
  const vistos = new Set();
  const lista = [];
  integrantes.forEach((i) => {
    if (vistos.has(i.papel)) return;
    vistos.add(i.papel);
    lista.push({ papel: i.papel, produto: CATALOGO.find((p) => p.id === i.produtoId) });
  });
  return lista;
}

export default function PortalNoivo({ pacote }) {
  const integrantes = pacote.integrantes || [];
  const { total, compareceram, faltam } = comparecimentoPacote(pacote);
  const atrasado = faltam > 0 && pacote.limiteComparecimento && hojeISO() > pacote.limiteComparecimento;
  const categorias = categoriasDoGrupo(integrantes);
  const confidencial = !!pacote.trajeConfidencial;

  return (
    <div>
      {/* Cabeçalho do pacote */}
      <div style={{ border: `1px solid ${line}`, background: card }}>
        <Tape height={8} style={{ opacity: 0.5 }} />
        <div style={{ padding: '22px 24px' }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>
            Seu pacote
          </p>
          <p style={{ margin: '10px 0 2px', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)', fontWeight: 500, color: ink, letterSpacing: '-0.01em' }}>
            {pacote.noivos}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: sub }}>Evento em {fmtDate(pacote.dataEvento)}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
            <Metric v={total} l="participantes" />
            <Metric v={compareceram} l="já compareceram" />
            <Metric v={faltam} l="ainda faltam" />
          </div>
        </div>
      </div>

      {atrasado && (
        <div style={{
          margin: '16px 0', padding: '14px 16px',
          border: `1px solid var(--status-orange-border)`, background: 'var(--status-orange-bg)',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--status-orange-fg)', lineHeight: 1.5 }}>
            <b>A data-limite chegou.</b> Ainda falta{faltam > 1 ? 'm' : ''} {faltam} integrante{faltam > 1 ? 's' : ''} comparecer{faltam > 1 ? 'em' : ''} ao ateliê para retirar o traje.
          </p>
        </div>
      )}

      {/* Padronização escolhida */}
      <div style={{ border: `1px solid ${line}`, background: card, marginTop: 16, padding: '22px 24px' }}>
        <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>
          Roupas do casamento
        </p>
        <p style={{ margin: '8px 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: ink }}>
          Padronização escolhida
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 14 }}>
          {categorias.map((c) => (
            <CategoriaCard key={c.papel} categoria={c} confidencial={confidencial} />
          ))}
        </div>
      </div>

      {/* Acompanhamento do grupo */}
      <div style={{ border: `1px solid ${line}`, background: card, marginTop: 16, padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>
              Acompanhamento
            </p>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: ink }}>
              Seu grupo
            </p>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: sub, fontFamily: mono }}>
            Limite: {fmtDate(pacote.limiteComparecimento)}
          </p>
        </div>

        <div style={{ marginTop: 12 }}>
          {integrantes.map((i, idx) => {
            const compareceu = integranteCompareceu(i);
            const selo = compareceu
              ? `Contrato ${i.numeroContrato}`
              : i.nome.split(' ')[0].toUpperCase();
            return (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                padding: '13px 0', borderBottom: idx < integrantes.length - 1 ? `1px solid var(--border-soft)` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <span style={{
                    flexShrink: 0, minWidth: 90, textAlign: 'center', padding: '6px 10px', borderRadius: 2,
                    fontSize: 10.5, fontWeight: 700, ...MONO_FEAT,
                    background: compareceu ? 'var(--gold)' : 'transparent',
                    color: compareceu ? 'var(--accent-ink)' : muted,
                    border: compareceu ? '1px solid var(--gold)' : `1px dashed ${line}`,
                  }}>
                    {compareceu ? selo : 'Aguardando'}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: ink }}>{i.nome}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: sub }}>{i.papel}</p>
                  </div>
                </div>
                <span style={{
                  flexShrink: 0, padding: '4px 10px', borderRadius: 2, fontSize: 10.5, fontWeight: 600, ...MONO_FEAT,
                  background: compareceu ? 'var(--status-green-bg)' : 'var(--status-orange-bg)',
                  color: compareceu ? 'var(--status-green-fg)' : 'var(--status-orange-fg)',
                  border: `1px solid ${compareceu ? 'var(--status-green-border)' : 'var(--status-orange-border)'}`,
                }}>
                  {compareceu ? 'Compareceu' : 'Ainda precisa ir'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: muted, margin: '20px 0 0' }}>
        Este portal mostra somente o pacote de {pacote.noivos}. Alterações devem ser solicitadas ao ateliê.
      </p>
    </div>
  );
}

function Metric({ v, l }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', border: `1px solid ${line}`, padding: '14px 16px' }}>
      <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: brass, ...MONO_FEAT }}>{v}</p>
      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: sub }}>{l}</p>
    </div>
  );
}

function CategoriaCard({ categoria: c, confidencial }) {
  const isNoivo = String(c.papel).toLowerCase().startsWith('noivo');
  const oculto = confidencial && isNoivo;

  return (
    <div style={{ border: `1px solid ${line}`, overflow: 'hidden' }}>
      <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {oculto || !c.produto?.foto ? (
          <span style={{ fontSize: 22, color: brass }}>✦</span>
        ) : (
          <img src={c.produto.foto} alt={c.produto.nome} loading="lazy" onError={onImgError} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      <div style={{ padding: '11px 13px' }}>
        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: brass, fontFamily: mono }}>
          {String(c.papel).toUpperCase()}
        </p>
        <p style={{ margin: '4px 0 2px', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: ink }}>
          {oculto ? 'Surpresa do noivo' : (c.produto?.nome || 'Modelo a definir')}
        </p>
        <p style={{ margin: 0, fontSize: 10.5, color: sub }}>
          {oculto ? 'Mantido confidencial' : [c.produto?.linha, c.produto?.colecao].filter(Boolean).join(' · ')}
        </p>
      </div>
    </div>
  );
}
