import { NextResponse } from 'next/server';

const HB_API_KEY = process.env.HYPERBEAM_API_KEY;

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookie = req.cookies.get('csrfToken');
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }
  try {
    const apiRes = await fetch('https://engine.hyperbeam.com/v0/vm', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HB_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data = await apiRes.json();
    if (!apiRes.ok) {
      return NextResponse.json({ error: 'Hyperbeam error', details: data }, { status: 502 });
    }
    return NextResponse.json({
      embed_url: data.embed_url,
      session_id: data.id,
      admin_token: data.admin_token
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}
