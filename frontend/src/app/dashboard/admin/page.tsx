'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, User, Utensils, Users, TrendingUp, ShieldAlert, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

interface PendingUser {
  id: number;
  name: string;
  email: string;
  role: string;
  cpf: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Administrador');
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    { id: 1, name: 'Carlos Alberto', email: 'carlos@email.com', role: 'Voluntário', cpf: '123.456.789-00' },
    { id: 2, name: 'Mariana Souza', email: 'mariana@email.com', role: 'Beneficiário', cpf: '987.654.321-11' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (!token || role?.toLowerCase() !== 'administrador') {
      router.push('/');
      return;
    }
    const name = localStorage.getItem('user_name');
    if (name) setUserName(name);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleApprove = (id: number, name: string) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
    alert(`Utilizador ${name} aprovado com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-[#12305B] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Marmita<span className="text-[#16A36A]">Solidária</span></h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Painel Administrativo</p>
            </div>
          </div>
          <button onClick={handleLogout} className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer">
            <LogOut className="w-4 h-4" /> Terminar Sessão
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#12305B] text-white flex items-center justify-center text-xl font-bold border-2 border-[#16A36A]">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-900">Olá, {userName}!</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">Administrador</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Gestão centralizada de utilizadores, stock e relatórios da ONG.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50 text-[#16A36A]"><Utensils className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 font-medium">Total de Marmitas</p><h3 className="text-2xl font-bold text-slate-900">1,420</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Users className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 font-medium">Voluntários Ativos</p><h3 className="text-2xl font-bold text-slate-900">38</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Heart className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 font-medium">Beneficiários</p><h3 className="text-2xl font-bold text-slate-900">256</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><TrendingUp className="w-6 h-6" /></div>
            <div><p className="text-xs text-slate-500 font-medium">Média Diária</p><h3 className="text-2xl font-bold text-slate-900">180/dia</h3></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#16A36A]" /> Cadastros Pendentes
            </h3>
            {pendingUsers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">Nenhum cadastro pendente.</p>
            ) : (
              <div className="space-y-3">
                {pendingUsers.map(user => (
                  <div key={user.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{user.name}</h4>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-full">{user.role}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">E-mail: {user.email} | CPF: {user.cpf}</p>
                    </div>
                    <button onClick={() => handleApprove(user.id, user.name)} className="py-1.5 px-3 bg-[#16A36A] hover:bg-[#158f5c] text-white font-medium rounded-xl text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprovar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#12305B]" /> Relatórios & Auditoria
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Descarregue o relatório consolidado de entregas auditadas e verificação de fotos de perfil capturadas via webcam.
              </p>
            </div>
            <button onClick={() => alert('A descarregar relatório consolidado...')} className="w-full py-3 bg-[#12305B] hover:bg-[#0e2547] text-white font-medium rounded-xl text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" /> Descarregar Relatório Geral
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}