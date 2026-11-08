'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  LogOut, 
  Fingerprint, 
  Camera, 
  LayoutDashboard, 
  PackageCheck, 
  Settings, 
  ShieldCheck,
  ArrowRight,
  Loader2,
  Box,
  Utensils
} from 'lucide-react';

export default function VoluntarioEntregasPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Voluntário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const rawUserData = localStorage.getItem('user_data');
      if (rawUserData) {
        const parsed = JSON.parse(rawUserData);
        if (parsed.username) setUserName(parsed.username);
        if (parsed.profile_image) setUserPhoto(parsed.profile_image);
      } else {
        const currentUserKey = localStorage.getItem('current_user_key');
        if (currentUserKey) {
          const specificPhoto = localStorage.getItem(`profile_image_${currentUserKey}`);
          if (specificPhoto) setUserPhoto(specificPhoto);
        }
      }
    } catch (e) {
      console.error('Erro ao ler dados do utilizador:', e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" />
        <span className="text-slate-600 font-semibold text-sm">A carregar Gestão de Entregas...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800 flex">
      
      {/* BARRA LATERAL (SIDEBAR) INTEGRADA */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col justify-between hidden lg:flex shrink-0 shadow-xl z-30">
        <div>
          {/* Topo da Sidebar */}
          <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Marmita<span className="text-[#16A36A]">Solidária</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Painel do Voluntário</p>
            </div>
          </div>

          {/* Navegação */}
          <nav className="p-4 space-y-1.5">
            <Link 
              href="/dashboard/voluntario"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#16A36A]" />
              <span>Visão Geral</span>
            </Link>

            <Link 
              href="/dashboard/voluntario/entregas"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#16A36A] text-white font-semibold text-xs transition-all shadow-md"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Gestão de Entregas</span>
            </Link>

            <Link 
              href="/dashboard/voluntario/biometria"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <Fingerprint className="w-4 h-4 text-[#16A36A]" />
              <span>Leitor Biométrico</span>
            </Link>

            <Link 
              href="/dashboard/voluntario/facial"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <Camera className="w-4 h-4 text-[#16A36A]" />
              <span>Reconhecimento Facial</span>
            </Link>

            <Link 
              href="/dashboard/voluntario/configuracoes"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <Settings className="w-4 h-4 text-[#16A36A]" />
              <span>Configurações</span>
            </Link>
          </nav>
        </div>

        {/* Perfil e Sair na Sidebar */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-[#16A36A] overflow-hidden flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userPhoto ? (
                <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <span>{(userName[0] || 'V').toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <p className="text-[10px] text-emerald-400 font-medium truncate">Voluntário Ativo</p>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full py-2.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Mobile */}
        <header className="bg-[#0A192F] text-white shadow-md sticky top-0 z-50 lg:hidden">
          <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg">
                <Heart className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  Marmita<span className="text-[#16A36A]">Solidária</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">Gestão de Entregas</p>
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-4 h-4" /> <span>Sair</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* BANNER DE BOAS-VINDAS */}
          <div className="bg-gradient-to-r from-[#0F2847] to-[#1E3A8A] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-[#16A36A] overflow-hidden shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{(userName[0] || 'V').toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold">Gestão de Entregas</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Módulo Ativo
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Selecione o método de validação para registar a entrega de marmitas aos beneficiários.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              <Link 
                href="/dashboard/voluntario/biometria"
                className="px-4 py-2.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Fingerprint className="w-4 h-4" /> Leitor Biométrico Presencial
              </Link>

              <Link 
                href="/dashboard/voluntario/facial"
                className="px-4 py-2.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Camera className="w-4 h-4" /> Reconhecimento Facial
              </Link>
            </div>
          </div>

          {/* OPÇÕES PRINCIPAIS DE GESTÃO DE ENTREGAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Opção Leitor Biométrico */}
            <Link 
              href="/dashboard/voluntario/biometria"
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-[#16A36A] hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#16A36A] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Fingerprint className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#16A36A] transition-colors">
                    Leitor Biométrico Presencial
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Utilize o leitor físico conectado para identificar o beneficiário através da impressão digital ou validação por CPF de forma instantânea.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16A36A]">
                <span>Aceder ao Leitor Biométrico</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Opção Reconhecimento Facial */}
            <Link 
              href="/dashboard/voluntario/facial"
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Reconhecimento Facial
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ative a câmara do dispositivo local para capturar a imagem do beneficiário e realizar a validação por biometria facial em tempo real.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Aceder ao Reconhecimento Facial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>

          {/* BOX DE INFORMAÇÃO */}
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#16A36A] shrink-0" />
            <p className="text-xs font-semibold text-emerald-900">
              Todas as entregas validadas por este módulo são integradas diretamente ao histórico geral do ponto de atendimento.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}