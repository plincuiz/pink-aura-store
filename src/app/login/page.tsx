import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { loginAction } from './actions';
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect('/admin');
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 text-neutral-800">
      <div className="w-full max-w-sm rounded-2xl border-4 border-hotpink bg-white p-6 shadow-[6px_6px_0_rgba(233,58,154,0.25)]">
        <h1 className="text-center font-logo text-2xl text-hotpink">
          PINK AURA
        </h1>
        <p className="mt-1 text-center font-round text-sm font-bold text-neutral-500">
          Acceso administrador
        </p>
        <form action={loginAction} className="mt-6 space-y-4">
          <div>
            <label
              className="mb-1 block font-round text-sm font-bold text-neutral-600"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold outline-none focus:border-azul"
            />
          </div>
          <div>
            <label
              className="mb-1 block font-round text-sm font-bold text-neutral-600"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold outline-none focus:border-azul"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-hotpink py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-[1.02]"
          >
            Ingresar
          </button>
        </form>
        {params.error ? (
          <p className="mt-3 text-center font-round text-xs font-bold text-red-500">
            Email o contraseña incorrectos
          </p>
        ) : null}
        <a
          href="/"
          className="mt-4 block text-center font-round text-xs font-bold text-neutral-500 hover:text-hotpink"
        >
          Volver al catálogo
        </a>
      </div>
    </main>
  );
}
