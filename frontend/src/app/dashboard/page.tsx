'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    const role = localStorage.getItem('user_role')?.toLowerCase().trim();

    if (role === 'administrador') {
      router.push('/dashboard/admin');
    } else if (role === 'voluntario') {
      router.push('/dashboard/voluntario');
    } else {
      router.push('/dashboard/beneficiario');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#16A36A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 font-medium">A carregar o seu painel dedicado...</p>
      </div>
    </div>
  );
}