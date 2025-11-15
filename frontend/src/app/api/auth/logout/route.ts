import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  console.info('[Auth0] /api/auth/logout');
  return (auth0 as any).authClient.handleLogout(req);
}
