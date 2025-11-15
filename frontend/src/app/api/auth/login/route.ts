import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  const returnTo = req.nextUrl.searchParams.get('returnTo');
  console.info('[Auth0] /api/auth/login', { returnTo });
  return (auth0 as any).authClient.handleLogin(req);
}
