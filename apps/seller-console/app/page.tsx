'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSellerContext } from '@/lib/seller-context';

export default function RootPage() {
  const { isLoading, isAuthenticated, isSeller } = useSellerContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isSeller) {
      router.replace('/onboarding');
    } else {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, isSeller, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
