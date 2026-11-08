'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import UserAvatar from '@/components/UserAvatar';
import { Users, HeartHandshake, Package, Loader2, Settings } from 'lucide-react';

export default function AdminRootPage() {
  const router = useRouter();
  
  // Usando o nosso Hook Global para obter nome, email e foto sincronizados instantaneamente
  const { userName, userPhoto } = useUserProfile();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" /> A carregar painel...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans space-y-6">
      
      {/* Cabeçalho de Boas-Vindas com o UserAvatar otimizado */}
      <div className="bg-gradient-to-r from-[#0F2847] to-[#1E3A8A] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="flex items-center gap-5">
          {/* Componente de Avatar otimizado que suporta Base64, URLs do Django e fallback com iniciais */}
          <UserAvatar src={userPhoto} name={userName} size={64} className="border-4 border-[#16A36A]" />

          <div>
            <h2 className="text-3xl font-extrabold">Olá, {userName}!</h2>
            <p className="text-sm text-slate-200 mt-1">Bem-vindo ao painel central de administração do MarmitaSolidária.</p>
          </div>
        </div>

        <button 
          onClick={() => router.push('/dashboard/admin/configuracoes')}
          className="bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl text-xs font-bold border border-white/20 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Settings className="w-4 h-4" /> Configurações
        </button>
      </div>

      {/* Cartões de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => router.push('/dashboard/admin/estoque')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#16A36A] hover:shadow-md transition-all cursor-pointer group"
        >
          <Package className="w-8 h-8 text-[#16A36A] mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-lg">Gerenciar Estoque</h3>
          <p className="text-xs text-slate-500 mt-1">Controle de marmitas prontas, embalagens e insumos.</p>
        </div>

        <div 
          onClick={() => router.push('/dashboard/admin/users')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#16A36A] hover:shadow-md transition-all cursor-pointer group"
        >
          <Users className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-lg">Utilizadores Reais</h3>
          <p className="text-xs text-slate-500 mt-1">Gestão de beneficiários e voluntários cadastrados.</p>
        </div>

        <div 
          onClick={() => router.push('/dashboard/admin/entregas')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#16A36A] hover:shadow-md transition-all cursor-pointer group"
        >
          <HeartHandshake className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold text-slate-900 text-lg">Entregas & Biometria</h3>
          <p className="text-xs text-slate-500 mt-1">Distribuição presencial com reconhecimento facial.</p>
        </div>
      </div>

    </div>
  );
}