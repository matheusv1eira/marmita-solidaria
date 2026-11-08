import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';
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
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900 selection:bg-[#16A36A] selection:text-white font-sans">
        <AuthProvider>
          {children}
          {/* Sistema global de notificações flutuantes */}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}