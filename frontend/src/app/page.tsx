// frontend/src/app/page.tsx
'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { SplashLayout } from '@/shared/components/layout';
import { HensLoader } from '@/shared/components/ui';

const SPLASH_DURATION_MS = 3000; // Show loader for 3 seconds before redirecting to Auth0

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [isFromAuth, setIsFromAuth] = useState(false);

  const normalizedReturnTo = useMemo(() => {
    const raw = searchParams?.get('returnTo') || '/dashboard-selection';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }, [searchParams]);

  // Check if we're coming from auth callback
  useEffect(() => {
    if (searchParams?.get('_auth') === '1') {
      setIsFromAuth(true);
      // Don't show splash if coming from auth - go straight to checking user
      setShowSplash(false);
    }
  }, [searchParams]);

  // Show splash screen for 3 seconds (unless coming from auth)
  useEffect(() => {
    if (isFromAuth) return; // Skip splash if coming from auth
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [isFromAuth]);

  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete
    if (!user) return; // No user yet, will be handled by next effect
    
    try {
      const payload = {
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
      };
      sessionStorage.setItem('eduhens.user', JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
    // Use replace to avoid adding to history
    router.replace(normalizedReturnTo);
  }, [isLoading, user, normalizedReturnTo, router]);

  // If not authenticated and splash is done, redirect to Auth0
  useEffect(() => {
    // Only redirect if we're sure there's no user (not loading and no user)
    if (isLoading) return; // Still checking auth state
    if (user) return; // User exists, will be handled by previous effect
    if (showSplash) return; // Still showing splash
    
    // Check if we're coming from a callback (might have authError param)
    const authError = searchParams?.get('authError');
    if (authError) {
      // Don't redirect to login if there's an auth error, let user see it
      return;
    }
    
    // Redirect directly to Auth0 login
    const returnTo = encodeURIComponent(normalizedReturnTo);
    window.location.href = `/api/auth/login?returnTo=${returnTo}`;
  }, [isLoading, user, showSplash, normalizedReturnTo, searchParams]);

  // Always show loader (either waiting for auth state or about to redirect)
  return (
    <SplashLayout>
      <HensLoader />
    </SplashLayout>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<SplashLayout><HensLoader /></SplashLayout>}>
      <HomeContent />
    </Suspense>
  );
}
