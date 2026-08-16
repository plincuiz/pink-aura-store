import { prisma } from '@/lib/prisma';
import { logoutAction } from '../actions';
import { AdminNav } from '../nav';
import {
  createSocial,
  deleteSocial,
  updateContact,
  updateLogo,
} from './actions';

export const dynamic = 'force-dynamic';
const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';

export default async function RedesPage() {
  const [redes, logo, phone, email] = await Promise.all([
    prisma.socialNetwork.findMany({ orderBy: { id: 'desc' } }),
    prisma.setting.findUnique({ where: { key: 'logoUrl' } }),
    prisma.setting.findUnique({ where: { key: 'contactPhone' } }),
    prisma.setting.findUnique({ where: { key: 'contactEmail' } }),
  ]);
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">
          REDES, LOGO Y CONTACTO
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="redes" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="font-round text-sm font-bold text-red-500 hover:underline"
            >
              Salir
            </button>
          </form>
        </div>
      </header>
      <section className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <form
          action={updateLogo}
          className="rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
        >
          <h2 className="font-round text-sm font-extrabold text-azul">
            Logo del negocio
          </h2>
          <div className="mt-4 flex items-center gap-4">
            {logo ? (
              <img
                src={logo.value}
                alt="Logo"
                className="h-20 w-20 rounded-full border-2 border-hotpink object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-pink-200 font-round text-xs font-bold text-neutral-500">
                Sin logo
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="logo"
                accept="image/*"
                required
                className="block w-full text-sm text-neutral-500 file:mr-3 file:rounded-full file:border-0 file:bg-hotpink file:px-4 file:py-2 file:font-round file:text-sm file:font-bold file:text-white hover:file:bg-[#d02a86]"
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
              >
                Guardar logo
              </button>
            </div>
          </div>
        </form>

        <form
          action={updateContact}
          className="rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
        >
          <h2 className="font-round text-sm font-extrabold text-azul">
            Datos de contacto
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="phone">
                Celular (WhatsApp)
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={phone?.value ?? ''}
                placeholder="5491122334455"
                className={input}
              />
            </div>
            <div>
              <label className={label} htmlFor="email">
                Email del negocio
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={email?.value ?? ''}
                placeholder="pinkaura@email.com"
                className={input}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
          >
            Guardar contacto
          </button>
          <p className="mt-3 font-round text-xs font-semibold text-neutral-500">
            El celular va con código de país y sin 0 (ej: 5491122334455).
          </p>
        </form>

        <form
          action={createSocial}
          className="grid gap-4 rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)] sm:grid-cols-4"
        >
          <div>
            <label className={label}>Nombre</label>
            <input name="name" required placeholder="Instagram" className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label}>URL</label>
            <input name="url" required placeholder="https://..." className={input} />
          </div>
          <div>
            <label className={label}>Ícono</label>
            <select name="iconName" className={input}>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="tiktok">TikTok</option>
              <option value="link">Otro (Link)</option>
            </select>
          </div>
          <div className="flex justify-end sm:col-span-4">
            <button
              type="submit"
              className="rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
            >
              + Agregar red
            </button>
          </div>
        </form>

        <div className="overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Red</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Ícono</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {redes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-neutral-500"
                  >
                    No hay redes cargadas
                  </td>
                </tr>
              ) : (
                redes.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-bold text-azul">{r.name}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-neutral-500">
                      {r.url}
                    </td>
                    <td className="px-4 py-3">{r.iconName}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={deleteSocial}>
                        <input type="hidden" name="id" value={r.id} />
                        <button
                          type="submit"
                          className="rounded-full border-2 border-red-500 px-3 py-1 font-round text-xs font-bold text-red-500 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
