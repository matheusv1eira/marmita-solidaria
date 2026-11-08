'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Lock, 
  Camera, 
  CheckCircle2, 
  Loader2, 
  Shield, 
  Heart,
  Save,
  RotateCcw,
  LayoutDashboard,
  PackageCheck,
  Fingerprint,
  LogOut
} from 'lucide-react';

export default function VoluntarioConfiguracoesPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estados de alteração de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

    // Carrega dados atuais do utilizador logado
    const name = localStorage.getItem('user_name') || 'Voluntário';
    const currentUserKey = localStorage.getItem('current_user_key') || '';
    const photo = (currentUserKey ? localStorage.getItem(`profile_image_${currentUserKey}`) : null) || localStorage.getItem('profile_image') || '';

    setUserName(name);
    setUserEmail(currentUserKey || 'voluntario@marmitasolidaria.org');
    if (photo) setUserPhoto(photo);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    setTimeout(() => {
      localStorage.setItem('user_name', userName);
      const currentUserKey = localStorage.getItem('current_user_key');
      if (currentUserKey) {
        localStorage.setItem(`profile_image_${currentUserKey}`, userPhoto || '');
      }
      localStorage.setItem('profile_image', userPhoto || '');

      setLoading(false);
      setSuccessMsg('Perfil atualizado com sucesso!');
    }, 1000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg('As novas senhas não coincidem.');
      return;
    }

    setPasswordMsg('Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800 flex">
      
      {/* BARRA LATERAL (SIDEBAR) INTEGRADA */}
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#16A36A] text-white font-semibold text-xs transition-all shadow-md"
            >
              <Settings className="w-4 h-4" />
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
                <p className="text-[10px] text-slate-400 font-medium">Configurações</p>
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

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          {/* Cabeçalho */}
          <div className="bg-[#0A192F] text-white p-8 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                Definições da Conta
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight">Configurações do Perfil</h1>
              <p className="text-xs text-slate-300">Atualize as suas informações pessoais, fotografia e credenciais de acesso.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg hidden sm:flex">
              <Settings className="w-6 h-6" />
            </div>
          </div>

          {/* Formulário de Dados Pessoais e Foto */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-emerald-100 text-[#16A36A] rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Informações Pessoais</h2>
                <p className="text-xs text-slate-500">Altere o seu nome de exibição ou imagem de perfil.</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-[#16A36A] overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                  {userPhoto ? (
                    <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-slate-400">{(userName[0] || 'V').toUpperCase()}</span>
                  )}
                </div>
                <div className="space-y-2 text-center sm:text-left w-full">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Foto Oficial</label>
                  <p className="text-[11px] text-slate-500">Esta imagem é utilizada para identificação nas entregas e validação do ponto.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome de Exibição *</label>
                  <input 
                    type="text" 
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail de Acesso</label>
                  <input 
                    type="email" 
                    disabled
                    value={userEmail}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="py-3 px-6 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Guardar Alterações</span>
              </button>
            </form>
          </div>

          {/* Alteração de Senha */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Segurança e Palavra-passe</h2>
                <p className="text-xs text-slate-500">Atualize a sua senha de acesso ao sistema.</p>
              </div>
            </div>

            {passwordMsg && (
              <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{passwordMsg}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Senha Atual *</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nova Senha (Mín. 6 caracteres) *</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Nova Senha *</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="py-3 px-6 bg-[#0A192F] hover:bg-[#12305B] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Atualizar Senha</span>
              </button>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
}