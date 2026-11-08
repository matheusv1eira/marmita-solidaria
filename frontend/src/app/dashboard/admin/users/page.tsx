'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../../services/api';
import { Users, Search, Shield, Heart, User, Loader2, CheckCircle2, Phone, FileText, Fingerprint } from 'lucide-react';

interface RealUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  account_type: string;
  // Variações exaustivas para garantir compatibilidade total com o Django REST
  cpf?: string;
  documento?: string;
  nu_cpf?: string;
  nuDocumento?: string;
  telefone?: string;
  phone?: string;
  celular?: string;
  profile_image?: string;
  photo?: string;
  foto?: string;
  image?: string;
  is_active: boolean;
}

export default function UtilizadoresReaisPage() {
  const [users, setUsers] = useState<RealUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('auth/users/');
      const data = response.data.results || response.data;
      
      // LOG DE DIAGNÓSTICO PROFISSIONAL
      console.table(data); 
      
      setUsers(Array.isArray(data) ? data : []);
      toast.success('Lista de utilizadores sincronizada!');
    } catch (error) {
      console.error('Erro ao carregar utilizadores do servidor:', error);
      toast.error('Erro ao carregar os utilizadores do servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBiometry = (userId: number, userName: string) => {
    console.log(`Registar biometria para o utilizador ID: ${userId} (${userName})`);
    
    // Notificação elegante com Sonner em substituição ao alert nativo
    toast.success(`Módulo Biométrico: ${userName}`, {
      description: `Utilizador ID ${userId} pronto para captura facial/biométrica.`,
    });
  };

  const filteredUsers = users.filter((u) => {
    const nome = u.first_name || u.username || '';
    const documento = u.cpf || u.documento || u.nu_cpf || u.nuDocumento || '';
    const contato = u.telefone || u.phone || u.celular || '';
    const email = u.email || '';

    const matchesSearch = nome.toLowerCase().includes(search.toLowerCase()) ||
                          documento.includes(search) ||
                          contato.includes(search) ||
                          email.toLowerCase().includes(search.toLowerCase());
                          
    const matchesRole = filterRole === 'all' || u.account_type === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#16A36A]" />
            Utilizadores Reais e Cadastros
          </h1>
          <p className="text-slate-500 mt-1">Gestão centralizada com foto oficial, CPF, contacto, tipo de conta e biometria.</p>
        </div>
      </div>

      {/* Filtros e Barra de Pesquisa */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF, telefone ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A] focus:outline-none"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="all">Todos os Perfis</option>
          <option value="beneficiario">Beneficiários</option>
          <option value="voluntario">Voluntários</option>
          <option value="administrador">Administradores</option>
        </select>
      </div>

      {/* Tabela de Utilizadores */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#16A36A]" />
            <span className="text-xs">A carregar utilizadores reais...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">Nenhum utilizador encontrado com estes critérios.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Foto e Nome</th>
                <th className="p-4">CPF / Documento</th>
                <th className="p-4">Telefone / Contacto</th>
                <th className="p-4">Tipo de Conta</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Ações / Biometria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((user) => {
                const fotoPerfil = user.profile_image || user.photo || user.foto || user.image;
                const cpfUser = user.cpf || user.documento || user.nu_cpf || user.nuDocumento;
                const telefoneUser = user.telefone || user.phone || user.celular;
                const nomeExibicao = user.first_name || user.username;

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Coluna 1: Foto e Nome */}
                    <td className="p-4 pl-6 font-medium text-slate-900 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-[#16A36A]/40 overflow-hidden shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs shadow-sm">
                        {fotoPerfil ? (
                          <img src={fotoPerfil} alt="Foto de Cadastro" className="w-full h-full object-cover" />
                        ) : (
                          <span>{(nomeExibicao || 'U')[0].toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{nomeExibicao}</p>
                        <p className="text-xs text-slate-400">{user.email || 'Sem e-mail registado'}</p>
                      </div>
                    </td>
                    
                    {/* Coluna 2: CPF / Documento */}
                    <td className="p-4 text-slate-700 font-mono text-xs">
                      {cpfUser ? (
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-800 border border-slate-200">
                          <FileText className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>{cpfUser}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Não informado</span>
                      )}
                    </td>

                    {/* Coluna 3: Telefone / Contacto */}
                    <td className="p-4 text-slate-700 font-mono text-xs">
                      {telefoneUser ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#16A36A]" />
                          <span>{telefoneUser}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Não informado</span>
                      )}
                    </td>

                    {/* Coluna 4: Tipo de Conta */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.account_type === 'administrador' ? 'bg-purple-100 text-purple-700' :
                        user.account_type === 'voluntario' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-[#16A36A]'
                      }`}>
                        {user.account_type === 'administrador' && <Shield className="w-3 h-3" />}
                        {user.account_type === 'voluntario' && <Heart className="w-3 h-3" />}
                        {user.account_type === 'beneficiario' && <User className="w-3 h-3" />}
                        <span className="capitalize">{user.account_type || 'beneficiario'}</span>
                      </span>
                    </td>

                    {/* Coluna 5: Estado */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                      </span>
                    </td>

                    {/* Coluna 6: Botão de Adicionar Biometria */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAddBiometry(user.id, nomeExibicao)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12305B] hover:bg-[#0e2547] text-white text-xs font-medium rounded-xl shadow-sm transition-all cursor-pointer"
                        title="Registar ou atualizar biometria do utilizador"
                      >
                        <Fingerprint className="w-3.5 h-3.5 text-[#16A36A]" />
                        <span>Adicionar Biometria</span>
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}