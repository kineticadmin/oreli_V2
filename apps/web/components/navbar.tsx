'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const { session, logout } = useAuth();

  return (
    <nav className="border-b border-warm bg-charcoal/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-gold font-semibold text-lg tracking-tight">
          Oreli
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/catalog" className="text-muted text-sm hover:text-cream transition-colors">
            Catalogue
          </Link>

          {session ? (
            <>
              <Link
                href="/orders"
                className="text-muted text-sm hover:text-cream transition-colors"
              >
                Mes commandes
              </Link>
              <button
                onClick={logout}
                className="text-muted text-sm hover:text-cream transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-gold text-obsidian font-semibold px-4 py-1.5 rounded-xl text-sm hover:bg-gold/90 transition-colors"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
