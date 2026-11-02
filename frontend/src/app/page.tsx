'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';
import { 
  Heart, 
  Shield, 
  Box, 
  TrendingUp, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      console.log('A enviar requisição de login para:', email);

      const response = await api.post('auth/login/', {
        username: email,
        password: password,
      });

      console.log('Resposta do servidor:', response.data);

      if (response.data && response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }

        const accountType = response.data.account_type || 'administrador';
        const firstName = response.data.first_name || email.split('@')[0];

        const normalizedRole = String(accountType)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        localStorage.setItem('user_role', normalizedRole);
        localStorage.setItem('user_name', firstName);

        // Redirecionamento forçado para garantir fluidez
        if (normalizedRole === 'administrador' || normalizedRole === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (normalizedRole === 'voluntario') {
          window.location.href = '/dashboard/voluntario';
        } else {
          window.location.href = '/dashboard/admin';
        }
      } else {
        setErrorMessage('Resposta inválida do servidor de autenticação.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Erro detalhado no login:', error.response?.data || error);
      setLoading(false);
      
      // Captura detalhada do erro vindo do Django (caso seja 500 ou 400)
      const serverError = error.response?.data;
      if (typeof serverError === 'object' && serverError !== null) {
        const firstKey = Object.keys(serverError)[0];
        const firstMessage = serverError[firstKey];
        setErrorMessage(Array.isArray(firstMessage) ? firstMessage[0] : (serverError.detail || 'Erro interno no servidor Django. Verifique o terminal do backend.'));
      } else {
        setErrorMessage('Credenciais inválidas ou erro ao conectar com o servidor.');
      }
    }
  };

  const handleOpenRegister = () => {
    router.push('/register');
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans">
      
      {/* PAINEL ESQUERDO: Institucional & Missão da ONG */}
      <div className="lg:col-span-7 bg-[#12305B] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#16A36A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16A36A] to-[#12305B] flex items-center justify-center shadow-lg border border-white/10">
            <Heart className="w-6 h-6 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Marmita<span className="text-[#16A36A]">Solidária</span></h1>
            <p className="text-xs text-slate-300 font-medium">Juntos contra a fome</p>
          </div>
        </div>

        <div className="my-auto py-12 relative z-10 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full bg-[#16A36A]/20 text-[#16A36A] text-xs font-semibold mb-6 border border-[#16A36A]/30">
            Plataforma de Gestão Social
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Transformando vidas através da <span className="text-[#16A36A]">solidariedade</span>
          </h2>
          <p className="text-slate-300 text-base lg:text-lg leading-relaxed mb-10">
            O MarmitaSolidária é uma plataforma de gestão inteligente que conecta pessoas, voluntários e doadores para levar refeições e dignidade a quem mais precisa.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A] mt-0.5">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Organize seus atendimentos</h3>
                <p className="text-xs text-slate-400 mt-1">Cadastre beneficiários, voluntários e administradores.</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A] mt-0.5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Controle o estoque</h3>
                <p className="text-xs text-slate-400 mt-1">Gerencie a produção e distribuição das marmitas.</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A] mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Mais transparência</h3>
                <p className="text-xs text-slate-400 mt-1">Relatórios e histórico completo de atendimentos.</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A] mt-0.5">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Faça a diferença</h3>
                <p className="text-xs text-slate-400 mt-1">Juntos podemos alimentar esperança.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <p className="italic font-serif text-slate-300">"Porque toda refeição é um ato de amor!"</p>
          <span>UniFBV • Lab. de Transformação Digital</span>
        </div>
      </div>

      {/* PAINEL DIREITO: Formulário de Autenticação */}
      <div className="lg:col-span-5 bg-white p-8 lg:p-16 flex flex-col justify-between shadow-2xl z-20">
        
        <div className="flex justify-end items-center">
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">v1.0 MVP</span>
        </div>

        <div className="my-auto max-w-md w-full mx-auto py-8">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 fill-[#16A36A]/20" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta!</h3>
            <p className="text-sm text-slate-500 mt-1">Faça login para aceder à sua conta no sistema.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                E-mail ou utilizador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#16A36A] hover:bg-[#158f5c] disabled:opacity-70 text-white font-medium rounded-xl shadow-lg shadow-[#16A36A]/20 transition-all flex items-center justify-center gap-2 group text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A entrar...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative px-4 bg-white text-xs text-slate-400 uppercase tracking-widest font-semibold">ou</span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
            <p className="text-xs text-slate-600 mb-3">Ainda não tem uma conta na equipa?</p>
            <button 
              type="button"
              onClick={handleOpenRegister}
              className="w-full py-2.5 px-4 bg-[#12305B] hover:bg-[#0e2547] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Solicitar Acesso / Criar Conta</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <Shield className="w-4 h-4 text-[#16A36A] mb-1" />
            <span className="text-[10px] font-semibold text-slate-700">Seguro</span>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-4 h-4 text-[#16A36A] mb-1" />
            <span className="text-[10px] font-semibold text-slate-700">Social</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-[#16A36A] mb-1" />
            <span className="text-[10px] font-semibold text-slate-700">Confiável</span>
          </div>
        </div>
      </div>
    </main>
  );
}