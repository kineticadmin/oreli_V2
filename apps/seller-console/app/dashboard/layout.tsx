'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSellerContext } from '@/lib/seller-context';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: '▤' },
  { href: '/dashboard/orders', label: 'Commandes', icon: '◫' },
  { href: '/dashboard/products', label: 'Produits', icon: '◻' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙' },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, isSeller, session, logout } = useSellerContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace('/login');
    else if (!isSeller) router.replace('/onboarding');
  }, [isLoading, isAuthenticated, isSeller, router]);

  if (isLoading || !isAuthenticated || !isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sellerName = session?.sellerProfile?.displayName ?? 'Ma boutique';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-charcoal border-r border-warm flex flex-col">
        <div className="px-5 py-6 border-b border-warm">
          <span className="text-xl font-bold text-gold">oreli</span>
          <p className="text-xs text-muted mt-1 truncate">{sellerName}</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-stone text-cream font-medium'
                    : 'text-muted hover:text-cream hover:bg-stone/50'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-5 border-t border-warm pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <span>→</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
