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
  CheckCircle2, 
  Loader2, 
  User 
} from 'lucide-react';

export default function VoluntarioBiometriaPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Voluntário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      console.error('Erro ao carregar dados locais:', e);
    } finally {
      setPageLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleBiometricScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf) return;

    setLoading(true);
    setSuccessMsg(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMsg(`Biometria validada com sucesso para o CPF: ${cpf}! Marmita registada.`);
      setCpf('');
    } catch (err) {
      console.error('Erro ao registar biometria:', err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" />
        <span className="text-slate-600 font-semibold text-sm">A carregar leitor biométrico...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800 flex">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col justify-between hidden lg:flex shrink-0 shadow-xl z-30">
        <div>
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <PackageCheck className="w-4 h-4 text-[#16A36A]" />
              <span>Gestão de Entregas</span>
            </Link>

            <Link 
              href="/dashboard/voluntario/biometria"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#16A36A] text-white font-semibold text-xs transition-all shadow-md"
            >
              <Fingerprint className="w-4 h-4" />
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

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
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
                <p className="text-[10px] text-slate-400 font-medium">Leitor Biométrico</p>
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

        <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <div className="bg-[#0A192F] text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                Atendimento Presencial
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight">Leitor Biométrico Presencial</h1>
              <p className="text-xs text-slate-300">Validação rápida de beneficiários por impressão digital ou inserção de CPF.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg hidden sm:flex">
              <Fingerprint className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleBiometricScan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Identificação do Beneficiário (CPF) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <Fingerprint className="w-12 h-12 text-[#16A36A] mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-slate-700">Aguardando leitura no sensor biométrico...</p>
                <p className="text-[10px] text-slate-400">Posicione o dedo do beneficiário no leitor conectado.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>A processar leitura...</span>
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" />
                    <span>Confirmar Atendimento Biométrico</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}