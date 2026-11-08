'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVoluntario } from '@/context/VoluntarioContext';
import { 
  Heart, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Utensils, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  Award, 
  AlertCircle,
  Fingerprint,
  Camera,
  Search,
  Loader2,
  ChevronDown,
  LayoutDashboard,
  Settings,
  PackageCheck
} from 'lucide-react';

export default function VoluntarioDashboard() {
  const router = useRouter();
  
  // Consumindo o Contexto Global do Voluntário
  const { pontoAtual, setPontoAtual, pontosDisponiveis, stats, history, addDelivery } = useVoluntario();

  const [userName, setUserName] = useState('Voluntário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditingPonto, setIsEditingPonto] = useState(false);
  const [searchBeneficiary, setSearchBeneficiary] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(pontoAtual);
  const [marmitasQuantity, setMarmitasQuantity] = useState(1);
  const [deliveryTime, setDeliveryTime] = useState('12:00');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      router.push('/');
      return;
    }

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setDeliveryTime(`${hours}:${minutes}`);

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
      console.error('Erro ao ler dados locais:', e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Sincroniza a localização selecionada com o contexto global
  useEffect(() => {
    setSelectedLocation(pontoAtual);
  }, [pontoAtual]);

  const handlePontoChange = (novoPonto: string) => {
    setPontoAtual(novoPonto);
    setSelectedLocation(novoPonto);
    setIsEditingPonto(false);
  };

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
      // Adiciona através do Contexto Global (atualiza estado e localStorage automaticamente)
      addDelivery(searchBeneficiary, marmitasQuantity, 'Manual (Voluntário)');

      setSuccessMsg(`Marmita (${marmitasQuantity}x) confirmada com sucesso para ${searchBeneficiary}!`);
      setSearchBeneficiary('');
      setMarmitasQuantity(1);
    } catch (err) {
      setSuccessMsg('Erro ao registar entrega.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" />
        <span className="text-slate-600 font-semibold text-sm">A carregar painel...</span>
      </div>
    );
  }

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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#16A36A] text-white font-semibold text-xs transition-all shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
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
        
        {/* HEADER SUPERIOR (Móvel) */}
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
                <p className="text-[10px] text-slate-400 font-medium">Espaço do Voluntário</p>
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

            {/* BOTÕES DE BIOMETRIA E RECONHECIMENTO FACIAL */}
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

          {/* MÉTRICAS (COM SELETOR DE PONTO ATUAL INTERATIVO GLOBAL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-[#16A36A] rounded-xl"><Utensils className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Marmitas Entregues Hoje</p>
                <h4 className="text-xl font-extrabold text-slate-900">{stats.entregasHoje}</h4>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Calendar className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total no Mês</p>
                <h4 className="text-xl font-extrabold text-slate-900">{stats.totalMes}</h4>
              </div>
            </div>

            {/* CARD DE PONTO ATUAL GLOBAL */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 relative">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><MapPin className="w-6 h-6" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                  <span>Ponto Atual</span>
                  <button 
                    onClick={() => setIsEditingPonto(!isEditingPonto)}
                    className="text-[10px] text-[#16A36A] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Alterar <ChevronDown className="w-3 h-3" />
                  </button>
                </p>
                
                {!isEditingPonto ? (
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 cursor-pointer" onClick={() => setIsEditingPonto(true)} title="Clique para alterar">
                    {pontoAtual}
                  </h4>
                ) : (
                  <select 
                    autoFocus
                    value={pontoAtual}
                    onChange={(e) => handlePontoChange(e.target.value)}
                    onBlur={() => setIsEditingPonto(false)}
                    className="mt-1 w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-[#16A36A]"
                  >
                    {pontosDisponiveis.map((ponto) => (
                      <option key={ponto} value={ponto}>{ponto}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Nível de Impacto</p>
                <h4 className="text-xs font-bold text-emerald-600 uppercase">{stats.nivelImpacto}</h4>
              </div>
            </div>
          </div>

          {/* REGISTO & HISTÓRICO GLOBAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
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
                    {pontosDisponiveis.map((ponto) => (
                      <option key={ponto} value={ponto}>{ponto}</option>
                    ))}
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

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#0F2847]" /> Suas Últimas Entregas
                  </span>
                  <span className="text-xs text-slate-400 font-normal">{history.length} registos</span>
                </h3>

                {history.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500">Nenhuma entrega registada no sistema ainda.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Faça o seu primeiro registo manual ao lado.</p>
                  </div>
                ) : (
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
                )}
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">Aviso da Operação</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Lembre-se de dar prioridade ao uso da biometria facial e leitor presencial para agilizar a fila.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}