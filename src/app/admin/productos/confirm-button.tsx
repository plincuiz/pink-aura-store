'use client';
export function ConfirmDeleteButton() {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm('¿Eliminar este producto?')) e.preventDefault();
      }}
      className="rounded-full border-2 border-red-500 px-3 py-1 font-round text-xs font-bold text-red-500 hover:bg-red-100"
    >
      Eliminar
    </button>
  );
}
