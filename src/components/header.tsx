import { prisma } from '@/lib/prisma';
import { SocialLinks } from './social-links';
import { CartLink } from './cart-link';

export async function SiteHeader() {
  const logo = await prisma.setting.findUnique({
    where: { key: 'logoUrl' },
  });
  return (
    <header className="border-b-4 border-hotpink bg-cream px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex w-24 justify-start sm:w-36">
          {logo ? (
            <img
              src={logo.value}
              alt="Pink Aura"
              className="h-24 w-24 rounded-full border-4 border-hotpink object-cover shadow-[4px_4px_0_rgba(233,58,154,0.3)] sm:h-32 sm:w-32"
            />
          ) : null}
        </div>
        <div className="flex-1 text-center">
          <h1 className="font-logo text-4xl text-hotpink drop-shadow-[3px_3px_0_rgba(132,204,22,0.35)] sm:text-5xl">
            PINK AURA
          </h1>
          <p className="mt-1 font-round text-sm font-semibold text-neutral-500">
            Catálogo de productos
          </p>
          <div className="mt-3">
            <SocialLinks />
          </div>
        </div>
        <div className="flex w-24 flex-col items-end gap-2 sm:w-36">
          <CartLink />
          <a
            href="/admin"
            className="rounded-full border-2 border-hotpink bg-white px-4 py-1 font-round text-xs font-bold text-hotpink transition hover:bg-hotpink hover:text-white"
          >
            Admin
          </a>
        </div>
      </div>
    </header>
  );
}
