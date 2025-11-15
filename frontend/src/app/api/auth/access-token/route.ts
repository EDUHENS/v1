// Returns an API access token for the logged-in user so the
// frontend can call the backend with Authorization: Bearer <token>.
// Maps SDK shape { token, expiresAt, ... } -> { accessToken, expiresAt, ... } expected by authApi.ts
import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  console.info('[Auth0] /api/auth/access-token request');
  try {
    const tokenSet = await auth0.getAccessToken();
    if (!tokenSet?.token) {
      console.warn('[Auth0] /api/auth/access-token missing token');
      return NextResponse.json(
        { error: 'No access token', accessToken: '' },
        { status: 401 }
      );
    }

    console.info('[Auth0] /api/auth/access-token success', {
      scope: tokenSet.scope,
      expiresAt: tokenSet.expiresAt,
    });

    return NextResponse.json({
      accessToken: tokenSet.token,
      scope: tokenSet.scope,
      expiresAt: tokenSet.expiresAt,
      token_type: tokenSet.token_type,
      audience: tokenSet.audience,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get access token';
    console.error('[Auth0] /api/auth/access-token error', { message });
    return NextResponse.json({ error: message, accessToken: '' }, { status: 401 });
  }
}

