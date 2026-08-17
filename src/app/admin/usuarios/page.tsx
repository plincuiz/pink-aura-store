import { prisma } from '@/lib/prisma';
import { logoutAction } from '../actions';
import { AdminNav } from '../nav';
import { ConfirmSubmit } from '../confirm-buttons';
import { createUser, deleteUser, updateUser } from './actions';

export const dynamic = 'force-dynamic';
const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';
const errores: Record<string, string> = {
  datos: 'Completá nombre, email y una contraseña de al menos 4 caracteres.',
  duplicado: 'Ya existe un usuario con ese email.',
  clave: 'La contraseña nueva debe tener al menos 4 caracteres.',
  vos: 'No podés eliminarte a vos mismo.',
  'ultimo-super': 'El sistema siempre debe conservar al menos un superadmin.',
};
const rolNombre: Record<string, string> = {
  superadmin: 'Superadmin',
  admin: 'Admin',
  ventas: 'Ventas',
};
const rolColor: Record<string, string> = {
  superadmin: 'border-hotpink bg-pink-100 text-hotpink',
  admin: 'border-azul bg-blue-100 text-azul',
  ventas: 'border-lima bg-lime-100 text-lime-700',
};

function RoleSelect({ current }: { current?: string }) {
  return (
    <select name="role" className={input} defaultValue={current ?? 'ventas'}>
      <option value="ventas">Ventas (pedidos y ventas)</option>
      <option value="admin">Admin (gestión sin redes/usuarios)</option>
      <option value="superadmin">Superadmin (todo)</option>
    </select>
  );
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string; error?: string }>;
}) {
  const params = await searchParams;
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  const editId = parseInt(params.editar ?? '', 10);
  const editing = !isNaN(editId)
    ? await prisma.user.findUnique({ where: { id: editId } })
    : null;
  return (
    <main className="min-h-screen bg-cream text-neutral-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-4 border-hotpink px-6 py-4">
        <h1 className="font-logo text-xl text-hotpink">USUARIOS</h1>
        <div className="flex flex-wrap items-center gap-4">
          <AdminNav current="usuarios" />
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
            action={updateUser}
            className="rounded-2xl border-4 border-azul bg-white p-6 shadow-[5px_5px_0_rgba(37,99,235,0.25)]"
          >
            <h2 className="font-round text-sm font-extrabold text-azul">
              Editar usuario: {editing.name}
            </h2>
            <input type="hidden" name="id" value={editing.id} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={label}>Nombre</label>
                <input name="name" required defaultValue={editing.name} className={input} />
              </div>
              <div>
                <label className={label}>Email</label>
                <input name="email" type="email" required defaultValue={editing.email} className={input} />
              </div>
              <div>
                <label className={label}>Rol</label>
                <RoleSelect current={editing.role} />
              </div>
              <div>
                <label className={label}>Contraseña nueva</label>
                <input name="password" type="password" placeholder="vacío = no cambiar" className={input} />
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
                href="/admin/usuarios"
                className="rounded-full border-2 border-neutral-400 px-4 py-2 font-round text-sm font-bold text-neutral-500 hover:bg-neutral-100"
              >
                Cancelar
              </a>
            </div>
          </form>
        ) : (
          <form
            action={createUser}
            className="rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[5px_5px_0_rgba(233,58,154,0.25)]"
          >
            <h2 className="font-round text-sm font-extrabold text-azul">
              Nuevo usuario
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={label}>Nombre</label>
                <input name="name" required placeholder="Ej: Ana" className={input} />
              </div>
              <div>
                <label className={label}>Email</label>
                <input name="email" type="email" required placeholder="ana@email.com" className={input} />
              </div>
              <div>
                <label className={label}>Rol</label>
                <RoleSelect />
              </div>
              <div>
                <label className={label}>Contraseña</label>
                <input name="password" type="password" required className={input} />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 rounded-full bg-hotpink px-4 py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-105"
            >
              + Crear usuario
            </button>
          </form>
        )}

        <div className="overflow-x-auto rounded-2xl border-4 border-hotpink bg-white shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
          <table className="w-full text-left font-round text-sm">
            <thead className="bg-pink-100 text-neutral-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-200">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-bold text-azul">{u.name}</td>
                  <td className="px-4 py-3 text-neutral-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border-2 px-2 py-0.5 text-xs font-extrabold ${rolColor[u.role] ?? ''}`}
                    >
                      {rolNombre[u.role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={`/admin/usuarios?editar=${u.id}`}
                        className="rounded-full border-2 border-azul px-3 py-1 font-round text-xs font-bold text-azul hover:bg-blue-100"
                      >
                        Editar
                      </a>
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={u.id} />
                        <ConfirmSubmit
                          label="Eliminar"
                          message={`¿Eliminar el usuario ${u.name}?`}
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
