import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Oreli — Espace vendeur',
  description: 'Gérez votre boutique Oreli',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-obsidian text-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
