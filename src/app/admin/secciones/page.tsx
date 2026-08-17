import { prisma } from '@/lib/prisma';
import { logoutAction } from '../actions';
import { AdminNav } from '../nav';
import { ConfirmSubmit } from '../confirm-buttons';
import { createSection, deleteSection, updateSection } from './actions';

export const dynamic = 'force-dynamic';
const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';
const errores: Record<string, string> = {
  datos: 'Poné un nombre para la sección.',
  duplicado: 'Ya existe una sección con ese nombre.',
  productos:
    'No se puede eliminar: tiene productos cargados. Pasalos a otra sección primero.',
  ultima: 'Debe quedar al menos una sección.',
};

export default async function SeccionesPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string; error?: string }>;
}) {
  const params = await searchParams;
  const sections = await prisma.section.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { products: true } } },
  });
  const editId = parseInt(params.editar ?? '', 10);
  const editing = !isNaN(editId)
    ? await prisma.section.findUnique({ where: { id: editId } })
    : null;
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">SECCIONES</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="secciones" />
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
        {params.error && errores[params.error] ? (
          <p className="rounded-xl border-2 border-red-500 bg-red-100 px-4 py-2 font-round text-sm font-bold text-red-600">
            {errores[params.error]}
          </p>
        ) : null}

        {editing ? (
          <form
            action={updateSection}
            className="rounded-2xl border-4 border-azul bg-white p-6 shadow-[5px_5px_0_rgba(37,99,235,0.25)]"
          >
            <h2 className="font-round text-sm font-extrabold text-azul">
              Editar sección: {editing.name}
            </h2>
            <input type="hidden" name="id" value={editing.id} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Nombre</label>
                <input name="name" required defaultValue={editing.name} className={input} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 font-round text-sm font-bold text-neutral-600">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editing.active}
                    className="h-4 w-4 accent-hotpink"
                  />
                  Visible en la tienda
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-azul px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
              >
                Guardar cambios
              </button>
              <a
                href="/admin/secciones"
                className="rounded-full border-2 border-neutral-400 px-4 py-2 font-round text-sm font-bold text-neutral-500 hover:bg-neutral-100"
              >
                Cancelar
              </a>
            </div>
          </form>
        ) : (
          <form
            action={createSection}
            className="rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
          >
            <h2 className="font-round text-sm font-extrabold text-azul">
              Nueva sección (ej: Lencería, Perfumes)
            </h2>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <div className="min-w-52 flex-1">
                <label className={label}>Nombre</label>
                <input name="name" required placeholder="Lencería" className={input} />
              </div>
              <button
                type="submit"
                className="rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
              >
                + Crear sección
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Sección</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {sections.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-bold text-azul">{s.name}</td>
                  <td className="px-4 py-3 font-bold">{s._count.products}</td>
                  <td className="px-4 py-3 font-bold">
                    {s.active ? 'Sí' : 'No'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/admin/secciones?editar=${s.id}`}
                        className="rounded-full border-2 border-azul px-3 py-1 font-round text-xs font-bold text-azul hover:bg-blue-100"
                      >
                        Editar
                      </a>
                      <form action={deleteSection}>
                        <input type="hidden" name="id" value={s.id} />
                        <ConfirmSubmit
                          label="Eliminar"
                          message={`¿Eliminar la sección ${s.name}?`}
                          className="rounded-full border-2 border-red-500 px-3 py-1 font-round text-xs font-bold text-red-500 hover:bg-red-100"
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
