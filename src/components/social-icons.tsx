type IconProps = { name: string; className?: string };

export function SocialIcon({ name, className }: IconProps) {
  const cls = className ?? 'h-5 w-5';
  const common = {
    className: cls,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name.toLowerCase()) {
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
          <path d="M9 8.5c0 4 2.5 6.5 6.5 6.5" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M9 17H7A5 5 0 0 1 7 7h2" />
          <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
          <line x1="8" x2="16" y1="12" y2="12" />
        </svg>
      );
  }
}
