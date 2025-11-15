import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  const cookieNames = req.cookies.getAll().map(({ name }) => name);
  console.info('[Auth0] /api/auth/me request', { cookieNames });
  const res = await (auth0 as any).authClient.handleProfile(req);
  console.info('[Auth0] /api/auth/me response', { status: res.status });
  return res;
}
