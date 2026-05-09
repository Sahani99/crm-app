'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const isAuthenticated = !!(user || token || storedToken);

    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [mounted, user, token, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return null;
}