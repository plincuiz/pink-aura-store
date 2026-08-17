'use client';
import type { Product, ProductImage } from '@prisma/client';
import { useState } from 'react';

const input =
  'w-full rounded-xl border-2 border-hotpink bg-white px-3 py-2 font-round text-sm font-semibold text-neutral-800 outline-none focus:border-azul';
const label = 'mb-1 block font-round text-sm font-bold text-neutral-600';

type Initial = Product & { images: ProductImage[] };
type Section = { id: number; name: string };

export function ProductForm({
  initial,
  action,
  sections,
}: {
  initial?: Initial;
  action: (formData: FormData) => Promise<void>;
  sections: Section[];
}) {
  const [cost, setCost] = useState(
    initial?.cost != null ? String(initial.cost) : ''
  );
  const [margin, setMargin] = useState(
    initial?.marginPercent != null ? String(initial.marginPercent) : '70'
  );
  const [previews, setPreviews] = useState<string[]>([]);
  const c = Number(cost);
  const m = Number(margin);
  const price =
    cost !== '' && !isNaN(c)
      ? Math.round(c * (1 + (isNaN(m) ? 70 : m) / 100))
      : null;

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  return (
    <form action={action} className="space-y-4">
      {initial ? <input type="hidden" name="id" value={initial.id} /> : null}
      <div>
        <label className={label} htmlFor="name">Nombre *</label>
        <input
          id="name"
          name="name"
          required
          defaultValue={initial?.name ?? ''}
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          className={input}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="sectionId">Sección</label>
          <select
            id="sectionId"
            name="sectionId"
            required
            defaultValue={
              initial?.sectionId != null
                ? String(initial.sectionId)
                : sections[0]
                  ? String(sections[0].id)
                  : ''
            }
            className={input}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="category">Categoría</label>
          <input
            id="category"
            name="category"
            defaultValue={initial?.category ?? ''}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min={0}
            defaultValue={initial?.stock ?? 0}
            className={input}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label} htmlFor="cost">Precio costo</label>
          <input
            id="cost"
            name="cost"
            type="number"
            min={0}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="marginPercent">Margen %</label>
          <input
            id="marginPercent"
            name="marginPercent"
            type="number"
            min={0}
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className={input}
          />
        </div>
      </div>
      <div className="rounded-xl border-2 border-lima bg-lime-50 px-3 py-2 font-round text-sm font-extrabold text-lime-700">
        Precio de venta: {price != null ? `$${price}` : '—'}
      </div>
      <div>
        <label className={label} htmlFor="image">
          Fotos (podés seleccionar varias)
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          multiple
          onChange={onFilesChange}
          className="block w-full text-sm text-neutral-500 file:mr-3 file:rounded-full file:border-0 file:bg-hotpink file:px-4 file:py-2 file:font-round file:text-sm file:font-bold file:text-white hover:file:bg-[#d02a86]"
        />
      </div>
      {initial && initial.images.length > 0 ? (
        <div>
          <p className={label}>Fotos actuales</p>
          <div className="grid grid-cols-3 gap-3">
            {initial.images.map((img) => (
              <div key={img.id}>
                <img
                  src={img.url}
                  alt={initial.name}
                  className="h-24 w-full rounded-xl border-2 border-pink-200 object-cover"
                />
                <label className="mt-1 flex items-center gap-1 font-round text-xs font-bold text-red-500">
                  <input
                    type="checkbox"
                    name="removeImages"
                    value={img.id}
                    className="h-3 w-3 accent-red-500"
                  />
                  Eliminar
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {previews.length > 0 ? (
        <div>
          <p className={label}>Vista previa de fotos nuevas</p>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Nueva foto ${i + 1}`}
                className="h-24 w-full rounded-xl border-2 border-lima object-cover"
              />
            ))}
          </div>
        </div>
      ) : null}
      <label className="flex items-center gap-2 font-round text-sm font-bold text-neutral-600">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial ? initial.active : true}
          className="h-4 w-4 accent-hotpink"
        />
        Visible en catálogo
      </label>
      <label className="flex items-center gap-2 font-round text-sm font-bold text-neutral-600">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={initial ? initial.featured : false}
          className="h-4 w-4 accent-hotpink"
        />
        Destacado (sticker ★ TOP en el catálogo)
      </label>
      <button
        type="submit"
        className="w-full rounded-full bg-hotpink py-2 font-round text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.15)] transition hover:scale-[1.02]"
      >
        Guardar
      </button>
    </form>
  );
}
