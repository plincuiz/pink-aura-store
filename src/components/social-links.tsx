import { prisma } from '@/lib/prisma';
import { SocialIcon } from './social-icons';

export async function SocialLinks() {
  const [redes, phone, email] = await Promise.all([
    prisma.socialNetwork.findMany({
      where: { active: true },
      orderBy: { id: 'asc' },
    }),
    prisma.setting.findUnique({ where: { key: 'contactPhone' } }),
    prisma.setting.findUnique({ where: { key: 'contactEmail' } }),
  ]);
  const items = redes.map((r) => ({
    key: `red-${r.id}`,
    href: r.url,
    icon: r.iconName,
    title: r.name,
    external: true,
  }));
  if (phone?.value) {
    items.push({
      key: 'phone',
      href: `https://wa.me/${phone.value.replace(/\D/g, '')}`,
      icon: 'whatsapp',
      title: 'WhatsApp',
      external: true,
    });
  }
  if (email?.value) {
    items.push({
      key: 'email',
      href: `mailto:${email.value}`,
      icon: 'mail',
      title: 'Email',
      external: false,
    });
  }
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {items.map((i) => (
        <a
          key={i.key}
          href={i.href}
          target={i.external ? '_blank' : undefined}
          rel={i.external ? 'noopener noreferrer' : undefined}
          title={i.title}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-hotpink bg-white text-hotpink shadow-[2px_2px_0_rgba(233,58,154,0.25)] transition hover:scale-110 hover:bg-hotpink hover:text-white"
        >
          <SocialIcon name={i.icon} className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
