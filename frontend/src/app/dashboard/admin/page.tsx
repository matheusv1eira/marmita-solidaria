'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart, LogOut, User, Utensils, Users, TrendingUp, ShieldAlert,
  UserCheck, FileText, CheckCircle2, Search, Bell, Moon, Sun,
  Calendar, Check, X, LayoutDashboard, History, Package, Send, 
  Building2, FileCheck, ShieldCheck, Settings, Award, ArrowUpRight
} from 'lucide-react';
import api from '../../../services/api';

interface RealUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  account_type: string;
  cpf?: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();

  // Estados Reais
  const [userName, setUserName] = useState<string>('Administrador');
  const [userRole, setUserRole] = useState<string>('Administrador');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Estados de Dados Reais do Backend
  const [realUsers, setRealUsers] = useState<RealUser[]>([]);
  const [stats, setStats] = useState({
    beneficiarios: 0,
    voluntarios: 0,
    administradores: 0,
    marmitasTotal: 0, // Pode ser ligado a um modelo de Marmitas no Django se criado
    estoque: 0,
  });

  // Modais
  const [showModalCadastrar, setShowModalCadastrar] = useState<boolean>(false);
  const [showModalEstoque, setShowModalEstoque] = useState<boolean>(false);
  const [novoEstoqueQtd, setNovoEstoqueQtd] = useState<number>(50);

  // Formulário para criar novo utilizador real via painel
  const [novoUser, setNovoUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    cpf: '',
    account_type: 'beneficiario'
  });

  // 1. Carregar Dados Reais da API do Django ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role') || '';
    const normalizedRole = role.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!token || (normalizedRole !== 'administrador' && normalizedRole !== 'admin')) {
      router.push('/');
      return;
    }

    // Nome real do utilizador logado
    let storedName = localStorage.getItem('user_name') || localStorage.getItem('first_name');
    let storedPhoto = localStorage.getItem('profile_image');
    if (storedName) setUserName(storedName.trim());
    if (storedPhoto) setUserPhoto(storedPhoto);

    fetchDashboardData();
  }, [router]);

  // Função para buscar utilizadores reais do Django
  const fetchDashboardData = async () => {
    try {
      // Endpoint que lista os utilizadores no Django (certifique-se de ter uma rota ViewSet ou ListAPIView para users)
      const response = await api.get('auth/users/');
// ou 'accounts/users/' dependendo de como prefixou as URLs no core/urls.py
      const users: RealUser[] = response.data;
      
      setRealUsers(users);

      // Calcular estatísticas reais baseadas na base de dados
      const beneficiariosCount = users.filter(u => u.account_type === 'beneficiario').length;
      const voluntariosCount = users.filter(u => u.account_type === 'voluntario').length;
      const adminsCount = users.filter(u => u.account_type === 'administrador').length;

      setStats(prev => ({
        ...prev,
        beneficiarios: beneficiariosCount,
        voluntarios: voluntariosCount,
        administradores: adminsCount
      }));

    } catch (error) {
      console.error('Erro ao carregar dados reais do backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // Aprovar / Ativar Utilizador Real
  const handleActivateUser = async (id: number, name: string) => {
    try {
      await api.patch(`auth/users/${id}/`, { is_active: true });
      setRealUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: true } : u));
      alert(`Utilizador ${name} ativado com sucesso!`);
    } catch (error) {
      alert('Erro ao ativar utilizador.');
    }
  };

  // Criar Novo Utilizador Real na Base de Dados
  const handleCriarUtilizador = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('auth/register/', novoUser);
      alert('Utilizador cadastrado com sucesso na base de dados!');
      setShowModalCadastrar(false);
      setNovoUser({ username: '', email: '', password: '', first_name: '', cpf: '', account_type: 'beneficiario' });
      fetchDashboardData(); // Recarrega os dados reais
    } catch (error) {
      alert('Erro ao cadastrar utilizador. Verifique os dados.');
    }
  };

  const handleAtualizarEstoque = (e: React.FormEvent) => {
    e.preventDefault();
    setStats(prev => ({ ...prev, estoque: prev.estoque + Number(novoEstoqueQtd) }));
    setShowModalEstoque(false);
    alert(`Estoque atualizado com sucesso (+${novoEstoqueQtd} unidades)!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white font-medium">
          <div className="w-8 h-8 border-4 border-[#16A36A] border-t-transparent rounded-full animate-spin"></div>
          A carregar dados reais da base de dados...
        </div>
      </div>
    );
  }

  const filteredUsers = realUsers.filter(u =>
    u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F4F7FA] font-sans text-slate-800">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#0A192F] text-slate-300 flex flex-col justify-between p-4 shrink-0 shadow-xl hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#16A36A] flex items-center justify-center text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Marmita<span className="text-[#16A36A]">Solidária</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Dados Reais do Sistema</span>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Utilizadores Reais', icon: Users },
              { label: 'Entregas', icon: Send },
              { label: 'Estoque', icon: Package },
              { label: 'Relatórios', icon: FileText },
              { label: 'Configurações', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive ? 'bg-[#1E3A8A] text-white shadow-md font-semibold' : 'hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#16A36A]' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-[#16A36A]" />
              <span className="text-xs font-bold text-white">Base de Dados Ativa</span>
            </div>
            <p className="text-[11px] text-slate-400">Ligado ao Django REST Framework.</p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-[#16A36A] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                {userPhoto ? <img src={userPhoto} alt={userName} className="w-full h-full object-cover" /> : userName.charAt(0)}
              </div>
              <div className="truncate max-w-[110px]">
                <h4 className="text-xs font-bold text-white truncate">{userName}</h4>
                <p className="text-[10px] text-slate-400 capitalize truncate">{userRole}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar utilizadores reais por nome ou email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#16A36A] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Calendar className="w-4 h-4 text-[#16A36A]" />
            <span className="text-xs font-semibold">Sáb, 24 de Out de 2026</span>
          </div>
        </header>

        <main className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* BANNER BOAS-VINDAS DINÂMICO */}
          <div className="bg-gradient-to-r from-[#0F2847] to-[#1E3A8A] rounded-3xl p-6 lg:p-8 text-white shadow-lg flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-extrabold">Olá, {userName}!</h2>
              <p className="text-xs text-slate-200 mt-1">Painel administrativo alimentado com dados reais da base de dados.</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
              Administrador Autenticado
            </div>
          </div>

          {/* MÉTRICAS REAIS DA BASE DE DADOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Beneficiários Reais</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.beneficiarios}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Voluntários Reais</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.voluntarios}</h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><UserCheck className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Administradores</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.administradores}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Estoque Atual</p>
                <h3 className="text-2xl font-bold text-slate-900">{stats.estoque}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Package className="w-6 h-6" /></div>
            </div>
          </div>

          {/* AÇÕES RÁPIDAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => setShowModalCadastrar(true)} className="p-4 bg-[#0F2847] text-white rounded-2xl text-xs font-bold flex justify-between items-center cursor-pointer shadow">
              <span>+ Cadastrar Novo Utilizador Real</span>
              <Users className="w-5 h-5" />
            </button>
            <button onClick={() => setShowModalEstoque(true)} className="p-4 bg-purple-700 text-white rounded-2xl text-xs font-bold flex justify-between items-center cursor-pointer shadow">
              <span>+ Atualizar Estoque de Marmitas</span>
              <Package className="w-5 h-5" />
            </button>
            <button onClick={fetchDashboardData} className="p-4 bg-[#16A36A] text-white rounded-2xl text-xs font-bold flex justify-between items-center cursor-pointer shadow">
              <span>🔄 Atualizar Dados do Servidor</span>
              <RefreshCwIcon className="w-5 h-5" />
            </button>
          </div>

          {/* TABELA DE UTILIZADORES REAIS DA BASE DE DADOS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#16A36A]" /> Utilizadores Registados na Base de Dados
            </h3>

            {filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">Nenhum utilizador encontrado na base de dados.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                      <th className="py-3 px-3">Nome / Username</th>
                      <th className="py-3 px-3">E-mail</th>
                      <th className="py-3 px-3">Tipo de Conta</th>
                      <th className="py-3 px-3">CPF</th>
                      <th className="py-3 px-3 text-right">Estado / Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-900">{u.first_name || u.username}</td>
                        <td className="py-3 px-3 text-slate-600">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-bold text-[10px] uppercase">
                            {u.account_type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono">{u.cpf || 'Não informado'}</td>
                        <td className="py-3 px-3 text-right">
                          {u.is_active ? (
                            <span className="text-emerald-600 font-bold text-[11px]">Ativo</span>
                          ) : (
                            <button onClick={() => handleActivateUser(u.id, u.first_name || u.username)} className="px-3 py-1 bg-[#16A36A] text-white rounded-lg text-[10px] font-bold cursor-pointer">
                              Aprovar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* MODAL CADASTRAR UTILIZADOR REAL */}
      {showModalCadastrar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Novo Utilizador na Base de Dados</h3>
              <button onClick={() => setShowModalCadastrar(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCriarUtilizador} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Nome / Username</label>
                <input type="text" required value={novoUser.username} onChange={e => setNovoUser({...novoUser, username: e.target.value, first_name: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">E-mail</label>
                <input type="email" required value={novoUser.email} onChange={e => setNovoUser({...novoUser, email: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Password</label>
                <input type="password" required value={novoUser.password} onChange={e => setNovoUser({...novoUser, password: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Tipo de Conta</label>
                <select value={novoUser.account_type} onChange={e => setNovoUser({...novoUser, account_type: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs mt-1 bg-white">
                  <option value="beneficiario">Beneficiário</option>
                  <option value="voluntario">Voluntário</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-[#16A36A] text-white font-bold rounded-xl text-xs shadow-md mt-2 cursor-pointer">Guardar na Base de Dados</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ESTOQUE */}
      {showModalEstoque && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Adicionar ao Estoque</h3>
              <button onClick={() => setShowModalEstoque(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAtualizarEstoque} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Quantidade</label>
                <input type="number" min="1" value={novoEstoqueQtd} onChange={e => setNovoEstoqueQtd(Number(e.target.value))} className="w-full p-2.5 border rounded-xl text-xs mt-1" />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer">Atualizar</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function RefreshCwIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>;
}