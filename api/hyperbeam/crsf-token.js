import { NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

function randomToken(len = 32) {
  return Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map((v) => v.toString(16).padStart(2, '0')).join('');
}

export default async function handler(req) {
  const csrfToken = randomToken(16);
  const res = NextResponse.json({ csrfToken });
  res.cookies.set('csrfToken', csrfToken, { sameSite: 'Strict', path: '/' });
  return res;
}
