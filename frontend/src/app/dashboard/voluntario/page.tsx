'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, LogOut, User, Clock, CheckCircle2, Utensils, PlusCircle } from 'lucide-react';

interface DeliveryRecord {
  id: number;
  time: string;
  date: string;
  location: string;
  status: string;
}

export default function VoluntarioDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('Voluntário');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('07:00');
  const [history, setHistory] = useState<DeliveryRecord[]>([
    { id: 1, time: '07:00', date: '29/10/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue' },
    { id: 2, time: '12:30', date: '28/10/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (!token || role?.toLowerCase() !== 'voluntario') {
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

  const handleAddDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeneficiary) return;

    const newRecord: DeliveryRecord = {
      id: Date.now(),
      time: deliveryTime,
      date: new Date().toLocaleDateString('pt-BR'),
      location: 'Ponto Central',
      status: 'Entregue'
    };

    setHistory([newRecord, ...history]);
    alert(`Marmita registada com sucesso para ${selectedBeneficiary} às ${deliveryTime}!`);
    setSelectedBeneficiary('');
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
              <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Painel do Voluntário</p>
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700">Voluntário</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Registe com agilidade as entregas de marmitas realizadas.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#16A36A]" /> Registar Entrega de Marmita
            </h3>
            <form onSubmit={handleAddDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Nome do Beneficiário *</label>
                <input 
                  type="text" 
                  required 
                  value={selectedBeneficiary}
                  onChange={(e) => setSelectedBeneficiary(e.target.value)}
                  placeholder="Digite o nome ou CPF"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Horário da Retirada *</label>
                <input 
                  type="time" 
                  required 
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#16A36A] hover:bg-[#158f5c] text-white font-medium rounded-xl text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Confirmar Registo de Marmita
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#12305B]" /> Últimas Entregas Registadas
            </h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><Utensils className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{item.location}</p>
                      <p className="text-[10px] text-slate-500">{item.date} às {item.time}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full text-[10px]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}