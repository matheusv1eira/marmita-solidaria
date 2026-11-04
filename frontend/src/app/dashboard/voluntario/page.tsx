'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../services/api';
import { 
  Heart, 
  LogOut, 
  User, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Award, 
  AlertCircle,
  Fingerprint,
  Search,
  Loader2
} from 'lucide-react';

interface DeliveryRecord {
  id: number;
  beneficiaryName: string;
  time: string;
  date: string;
  location: string;
  status: string;
  method: string;
}

export default function VoluntarioDashboard() {
  const router = useRouter();
  
  // Estados do Voluntário
  const [userName, setUserName] = useState('Voluntário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados de Formulário
  const [searchBeneficiary, setSearchBeneficiary] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Ponto Central - Boa Vista');
  const [marmitasQuantity, setMarmitasQuantity] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState('12:00');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Histórico de entregas do voluntário
  const [history, setHistory] = useState<DeliveryRecord[]>([
    { id: 1, beneficiaryName: 'Maria Silva', time: '12:15', date: '04/11/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue', method: 'Biometria' },
    { id: 2, beneficiaryName: 'João Pereira', time: '11:45', date: '04/11/2026', location: 'Ponto Central - Boa Vista', status: 'Entregue', method: 'Manual' },
    { id: 3, beneficiaryName: 'Ana Souza', time: '12:30', date: '03/11/2026', location: 'Ponto Norte - Casa Amarela', status: 'Entregue', method: 'Biometria' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role') || localStorage.getItem('account_type');
    
    if (!token) {
      router.push('/');
      return;
    }

    // Carrega nome e foto de forma resiliente
    const name = localStorage.getItem('user_name') || localStorage.getItem('first_name') || 'Voluntário';
    const photo = localStorage.getItem('profile_image') || 
                  localStorage.getItem('user_photo') || 
                  localStorage.getItem('photo') || 
                  localStorage.getItem('foto') || '';

    setUserName(name);
    if (photo && photo !== 'null' && photo !== 'undefined') {
      setUserPhoto(photo);
    }

    // Ajusta o horário atual padrão para a entrega
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDeliveryTime(`${hours}:${minutes}`);

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const handleAddDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchBeneficiary) return;

    setSubmitting(true);
    setSuccessMsg(null);

    try {
      // Tenta enviar o registro para a API Backend
      try {
        await api.post('entregas/', {
          beneficiary_name: searchBeneficiary,
          location: selectedLocation,
          quantity: marmitasQuantity,
          status: 'entregue',
          validation_method: 'manual_voluntario'
        });
      } catch (err) {
        console.warn('Backend indisponível. Registro armazenado em sessão local.');
      }

      const newRecord: DeliveryRecord = {
        id: Date.now(),
        beneficiaryName: searchBeneficiary,
        time: deliveryTime,
        date: new Date().toLocaleDateString('pt-BR'),
        location: selectedLocation,
        status: 'Entregue',
        method: 'Manual (Voluntário)'
      };

      setHistory([newRecord, ...history]);
      setSuccessMsg(`Marmita (${marmitasQuantity}x) confirmada com sucesso para ${searchBeneficiary}!`);
      setSearchBeneficiary('');
      setMarmitasQuantity(1);

    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" />
        <span className="text-slate-600 font-semibold text-sm">Carregando painel do voluntário...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800">
      
      {/* HEADER SUPERIOR */}
      <header className="bg-[#0A192F] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Marmita<span className="text-[#16A36A]">Solidária</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Espaço do Voluntário</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Foto e Perfil Rápido do Voluntário */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#16A36A] overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userPhoto ? (
                  <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <span>{(userName[0] || 'V').toUpperCase()}</span>
                )}
              </div>
              <span className="text-xs font-bold text-white hidden sm:inline">{userName}</span>
            </div>

            <button 
              onClick={handleLogout} 
              className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
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
                <h2 className="text-2xl font-extrabold">Olá, {userName}!</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Voluntário Ativo
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1">
                Obrigado pelo seu apoio no atendimento presencial e entrega de marmitas.
              </p>
            </div>
          </div>

          <Link 
            href="/dashboard/admin/entregas"
            className="px-4 py-2.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Fingerprint className="w-4 h-4" /> Leitor Biométrico Presencial
          </Link>
        </div>

        {/* MÉTRICAS RÁPIDAS DO VOLUNTÁRIO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-[#16A36A] rounded-xl"><Utensils className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Marmitas Entregues Hoje</p>
              <h4 className="text-xl font-extrabold text-slate-900">24</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total no Mês</p>
              <h4 className="text-xl font-extrabold text-slate-900">142</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><MapPin className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Ponto Atual</p>
              <h4 className="text-xs font-bold text-slate-900 truncate">Ponto Central</h4>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Award className="w-6 h-6" /></div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Nível de Impacto</p>
              <h4 className="text-xs font-bold text-emerald-600 uppercase">Voluntário Ouro</h4>
            </div>
          </div>
        </div>

        {/* BLOCO PRINCIPAL: REGISTO & HISTÓRICO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LADO ESQUERDO: REGISTO MANUAL DE ENTREGA */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#16A36A]" /> Registar Entrega Manual
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Beneficiário (Nome ou CPF) *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={searchBeneficiary}
                    onChange={(e) => setSearchBeneficiary(e.target.value)}
                    placeholder="Digite o nome do beneficiário..."
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Ponto de Distribuição *
                </label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                >
                  <option value="Ponto Central - Boa Vista">Ponto Central - Boa Vista</option>
                  <option value="Ponto Norte - Casa Amarela">Ponto Norte - Casa Amarela</option>
                  <option value="Unidade Movel 01">Unidade Móvel 01</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantidade</label>
                  <input 
                    type="number" 
                    min="1"
                    max="5"
                    value={marmitasQuantity}
                    onChange={(e) => setMarmitasQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Horário</label>
                  <input 
                    type="time" 
                    required
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold rounded-xl text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Confirmar Entrega</span>
              </button>
            </form>
          </div>

          {/* LADO DIREITO: HISTÓRICO & AVISOS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* HISTÓRICO DE ENTREGAS */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0F2847]" /> Suas Últimas Entregas
                </span>
                <span className="text-xs text-slate-400 font-normal">{history.length} registros</span>
              </h3>

              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-100 text-[#16A36A] rounded-xl shrink-0">
                        <Utensils className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.beneficiaryName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.location} • {item.date} às {item.time}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 bg-emerald-50 text-[#16A36A] font-bold rounded-full text-[10px] border border-emerald-200">
                        {item.status}
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{item.method}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMUNICADOS E AVISOS DO PONTO */}
            <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Aviso da Operação</h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Lembre-se de dar prioridade ao uso da biometria facial para reduzir o tempo de fila. Em caso de inconsistência no cadastro, utilize o registro manual acima.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}