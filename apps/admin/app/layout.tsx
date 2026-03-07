import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = { title: 'Oreli Admin', description: 'Backoffice Oreli' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-obsidian text-cream antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
