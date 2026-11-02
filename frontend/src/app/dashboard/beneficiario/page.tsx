'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, User, Clock, Calendar, CheckCircle2, Utensils, Award } from 'lucide-react';

interface DeliveryRecord {
  id: number;
  time: string;
  date: string;
  location: string;
  status: string;
}

export default function BeneficiarioDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Beneficiário');
  const [history] = useState<DeliveryRecord[]>([
    { id: 1, time: '07:00', date: '29/10/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue' },
    { id: 2, time: '12:30', date: '28/10/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (!token || role?.toLowerCase() !== 'beneficiario') {
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
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Portal do Beneficiário</p>
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">Beneficiário</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Consulte o registo de todas as suas retiradas de marmita.</p>
          </div>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#16A36A]" /> Meu Histórico de Refeições
            </h3>
            <p className="text-xs text-slate-500 mt-1">Acompanhe o horário e data de cada marmita retirada.</p>
          </div>

          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center font-bold">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Marmita Retirada</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.date}</span>
                      <span className="flex items-center gap-1 font-semibold text-[#12305B]"><Clock className="w-3.5 h-3.5" /> às {item.time}</span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirmado
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}