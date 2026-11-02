import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Marmita Solidária',
  description: 'Plataforma de Gestão Social e Apoio Contra a Fome',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}