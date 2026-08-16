'use client';
import { useState } from 'react';

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const safe = Math.min(current, images.length - 1);
  return (
    <div>
      <div className="flex items-center justify-center rounded-2xl border-4 border-hotpink bg-white p-3 shadow-[5px_5px_0_rgba(233,58,154,0.25)]">
        <img
          src={images[safe]}
          alt={name}
          className="max-h-[420px] w-full rounded-xl bg-pink-100 object-contain p-2"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`shrink-0 rounded-xl border-4 bg-white p-1 transition ${
                i === safe
                  ? 'border-hotpink'
                  : 'border-pink-200 hover:border-hotpink'
              }`}
            >
              <img
                src={src}
                alt={`${name} ${i + 1}`}
                className="h-16 w-16 rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
