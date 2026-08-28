import { useEffect } from 'react';
import { Section, Wrap, Eyebrow, H2, Lead, Button, ink, sub, line, brass, card } from './ui';
import { TIPO_LABEL } from '../store/pedidos';

const mono = "var(--font-mono)";

// Tela de confirmação compartilhada pelos dois fluxos de pedido.
export default function Confirmacao({ pedido, go, resumo }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  return (
    <Section>
      <Wrap narrow>
        <Eyebrow>Pedido enviado</Eyebrow>
        <H2 style={{ marginTop: 14 }}>Recebemos seu pedido.</H2>
        <Lead style={{ marginTop: 16 }}>
          O ateliê vai confirmar disponibilidade e valores e entrar em contato por
          e-mail e telefone. Guarde o protocolo para acompanhar o andamento.
        </Lead>

        <div style={{ margin: '28px 0', border: `1px solid ${line}`, background: card, padding: '20px 22px' }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: sub, fontFamily: mono }}>Protocolo</p>
          <p style={{ margin: '8px 0 0', fontFamily: mono, fontSize: 30, fontWeight: 600, color: brass, letterSpacing: '0.06em' }}>{pedido.protocolo}</p>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: sub }}>
            {TIPO_LABEL[pedido.tipo]} · {resumo}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={() => go('acompanhar', pedido.protocolo)}>Acompanhar pedido</Button>
          <Button variant="ghost" onClick={() => go('home')}>Voltar ao início</Button>
        </div>
      </Wrap>
    </Section>
  );
}
