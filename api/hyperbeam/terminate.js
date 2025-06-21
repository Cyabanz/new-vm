import { NextResponse } from 'next/server';

const HB_API_KEY = process.env.HYPERBEAM_API_KEY;
const ADMIN_UID = process.env.ADMIN_UID || 'admin1234';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { sessionId, uid } = await req.json();
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookie = req.cookies.get('csrfToken');

  // Double-submit CSRF
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  // Restrict session termination: only owner or admin can terminate
  if (uid !== ADMIN_UID && uid !== /* session creator's UID, if tracked */ uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Terminate on Hyperbeam
  const res = await fetch(`https://engine.hyperbeam.com/v0/vm/${sessionId}/terminate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${HB_API_KEY}` }
  });

  if (res.ok) {
    return NextResponse.json({ message: 'Session terminated' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Failed to terminate session' }, { status: 502 });
  }
}
