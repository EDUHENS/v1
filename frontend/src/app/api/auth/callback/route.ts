import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  console.info('[Auth0] /api/auth/callback', {
    hasCode: params.has('code'),
    hasError: params.has('error'),
    statePresent: params.has('state'),
  });
  return (auth0 as any).authClient.handleCallback(req);
}
