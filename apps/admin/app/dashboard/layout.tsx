'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: '▤' },
  { href: '/dashboard/orders', label: 'Commandes', icon: '◫' },
  { href: '/dashboard/sellers', label: 'Vendeurs / KYB', icon: '◻' },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex-shrink-0 bg-charcoal border-r border-warm flex flex-col">
        <div className="px-5 py-6 border-b border-warm">
          <span className="text-xl font-bold text-gold">oreli</span>
          <p className="text-xs text-danger mt-1 font-medium">Admin</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? 'bg-stone text-cream font-medium' : 'text-muted hover:text-cream hover:bg-stone/50'}`}>
                <span>{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
