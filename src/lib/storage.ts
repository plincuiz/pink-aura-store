import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

export async function saveFile(file: File, folder: string): Promise<string> {
  const clean = file.name.replace(/[^a-zA-Z0-9.]+/g, '-').toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${clean}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${name}`, file, { access: 'public' });
    return blob.url;
  }
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, name),
    Buffer.from(await file.arrayBuffer())
  );
  return `/uploads/${folder}/${name}`;
}
