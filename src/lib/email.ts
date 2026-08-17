import { Resend } from 'resend';

type OrderForEmail = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string;
  observaciones: string | null;
  total: number;
  items: {
    cantidad: number;
    nombreSnapshot: string;
    precioSnapshot: number;
    subtotal: number;
  }[];
};

const money = (n: number) => '$' + n.toLocaleString('es-AR');

export async function sendOrderEmail(order: OrderForEmail) {
  const detalle = order.items
    .map(
      (l) =>
        `${l.cantidad} x ${l.nombreSnapshot} - ${money(l.precioSnapshot)} c/u = ${money(l.subtotal)}`
    )
    .join('\n');
  const text = `Nuevo pedido #${order.id}
Cliente: ${order.nombre} ${order.apellido}
Email: ${order.email}
Celular: ${order.celular}
Productos:
${detalle}
Total: ${money(order.total)}
Observaciones: ${order.observaciones ?? '-'}`;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) {
    console.log(`\n==== NUEVO PEDIDO PINK AURA #${order.id} ====\n${text}\n=====`);
    return;
  }

  const filas = order.items
    .map(
      (l) =>
        `<tr>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;">${l.cantidad} x ${l.nombreSnapshot}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right;">${money(l.subtotal)}</td>
        </tr>`
    )
    .join('');

  const resend = new Resend(key);
  await resend.emails.send({
    from: 'Pedidos Pink Aura <onboarding@resend.dev>',
    to: [to],
    subject: `Nuevo pedido #${order.id} · ${order.nombre} ${order.apellido}`,
    text,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#222;">
      <h2 style="color:#e93a9a;">Nuevo pedido #${order.id}</h2>
      <p><b>Cliente:</b> ${order.nombre} ${order.apellido}<br/>
      <b>Email:</b> ${order.email}<br/>
      <b>Celular:</b> ${order.celular}</p>
      <table style="width:100%;border-collapse:collapse;">${filas}
        <tr><td style="padding:8px;"><b>Total</b></td>
        <td style="padding:8px;text-align:right;"><b>${money(order.total)}</b></td></tr>
      </table>
      ${order.observaciones ? `<p><b>Observaciones:</b> ${order.observaciones}</p>` : ''}
    </div>`,
  });
}
