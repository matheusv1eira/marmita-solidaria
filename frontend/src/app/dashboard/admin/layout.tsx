'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Heart, LogOut, Users, HeartHandshake, Package, FileText, Settings, 
  LayoutDashboard, Calendar, Search
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [userName, setUserName] = useState<string>('Administrador');
  const [userRole, setUserRole] = useState<string>('Administrador');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [currentDateString, setCurrentDateString] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setCurrentDateString(
        now.toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
    };

    updateDate();
    const timer = setInterval(updateDate, 60000);

    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role') || 'Administrador';
    
    if (!token) {
      router.push('/');
      return;
    }

    const storedName = localStorage.getItem('user_name') || localStorage.getItem('first_name') || 'Matheus';
    
    // Varre todas as chaves possíveis onde a foto do cadastro possa ter sido guardada
    const storedPhoto = localStorage.getItem('user_photo') || 
                        localStorage.getItem('profile_image') || 
                        localStorage.getItem('photo') || 
                        localStorage.getItem('foto') || '';
    
    if (storedName) setUserName(storedName.trim());
    if (role) setUserRole(role);
    if (storedPhoto && storedPhoto !== 'null' && storedPhoto !== 'undefined') {
      setUserPhoto(storedPhoto);
    }

    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Utilizadores Reais', path: '/dashboard/admin/users', icon: Users },
    { label: 'Entregas', path: '/dashboard/admin/entregas', icon: HeartHandshake },
    { label: 'Estoque', path: '/dashboard/admin/estoque', icon: Package },
    { label: 'Relatórios', path: '/dashboard/admin/relatorios', icon: FileText },
    { label: 'Configurações', path: '/dashboard/admin/configuracoes', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#F4F7FA] font-sans text-slate-800">
      
      {/* SIDEBAR LATERAL FIXA */}
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
              <span className="text-[10px] text-slate-400 font-medium">Gestão Social</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
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
              <span className="text-xs font-bold text-white">Sistema Ativo</span>
            </div>
            <p className="text-[11px] text-slate-400">Django REST + Next.js</p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              
              {/* Foto Real do Cadastro (Sem mostrar letra se a imagem existir) */}
              <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-[#16A36A] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt={userName} 
                    className="w-full h-full object-cover" 
                    onError={() => setUserPhoto(null)} 
                  />
                ) : (
                  <span>{(userName[0] || 'U').toUpperCase()}</span>
                )}
              </div>

              <div className="truncate max-w-[110px]">
                {/* Nome Clicável que redireciona para Configurações */}
                <Link 
                  href="/dashboard/admin/configuracoes" 
                  className="block text-xs font-bold text-white truncate hover:text-[#16A36A] transition-colors cursor-pointer"
                  title="Ir para Configurações"
                >
                  {userName}
                </Link>
                <p className="text-[10px] text-slate-400 capitalize truncate">{userRole}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400 cursor-pointer shrink-0" title="Terminar Sessão">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL COM HEADER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar no sistema..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#16A36A] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Calendar className="w-4 h-4 text-[#16A36A]" />
            <span className="text-xs font-semibold capitalize">{currentDateString || 'Carregando data...'}</span>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}