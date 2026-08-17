'use client';
export function ConfirmSubmit({
  label,
  className,
  message,
}: {
  label: string;
  className: string;
  message: string;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
