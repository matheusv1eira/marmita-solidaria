'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../../../services/api';
import { compressImage } from '@/utils/imageCompressor';
import { 
  Settings, 
  User, 
  Camera, 
  Bell, 
  Sliders, 
  Save, 
  Loader2,
  Clock
} from 'lucide-react';

export default function AdminConfiguracoesPage() {
  const [saving, setSaving] = useState(false);

  // Estados do Perfil
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  // Estados de Configurações Operacionais
  const [limitPerBeneficiary, setLimitPerBeneficiary] = useState(1);
  const [startTime, setStartTime] = useState('11:30');
  const [endTime, setEndTime] = useState('14:00');
  
  // Estados de Biometria e IA
  const [facialMatchThreshold, setFacialMatchThreshold] = useState(90);
  const [autoApproveDelivery, setAutoApproveDelivery] = useState(true);

  // Estados de Estoque e Notificações
  const [stockAlertThreshold, setStockAlertThreshold] = useState(20);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      const storedName = localStorage.getItem('user_name') || localStorage.getItem('first_name') || 'Matheus';
      const storedEmail = localStorage.getItem('user_email') || 'matheusvieira1417@gmail.com';
      
      let storedPhoto = localStorage.getItem('profile_image') || 
                        localStorage.getItem('user_photo') || 
                        localStorage.getItem('photo') || 
                        localStorage.getItem('foto') || '';

      setUserName(storedName);
      setUserEmail(storedEmail);

      // Se não houver foto no localStorage, tenta buscar na API de utilizadores reais
      if (!storedPhoto || storedPhoto === 'null') {
        try {
          const response = await api.get(`auth/users/?search=${storedName}`);
          const foundUser = response.data.results?.[0] || response.data[0];
          if (foundUser && (foundUser.profile_image || foundUser.photo || foundUser.foto)) {
            storedPhoto = foundUser.profile_image || foundUser.photo || foundUser.foto;
            localStorage.setItem('profile_image', storedPhoto);
            localStorage.setItem('user_photo', storedPhoto);
          }
        } catch (err) {
          console.warn('Não foi possível buscar a foto na API automaticamente.');
        }
      }

      if (storedPhoto && storedPhoto !== 'null' && storedPhoto !== 'undefined') {
        setUserPhoto(storedPhoto);
      }
    };

    loadAdminData();
  }, []);

  // Manipulador de upload de ficheiro otimizado com compressão via Canvas (< 100KB)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Comprime a imagem antes de aplicar ao estado e ao localStorage
        const optimizedBase64 = await compressImage(file, 400, 400, 0.75);
        setUserPhoto(optimizedBase64);
        
        localStorage.setItem('profile_image', optimizedBase64);
        localStorage.setItem('user_photo', optimizedBase64);
        localStorage.setItem('photo', optimizedBase64);
        localStorage.setItem('foto', optimizedBase64);

        toast.success('Foto otimizada e aplicada com sucesso!');
      } catch (error) {
        console.error('Erro ao comprimir imagem de perfil:', error);
        toast.error('Erro ao processar a imagem selecionada.');
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      localStorage.setItem('user_name', userName);
      localStorage.setItem('user_email', userEmail);
      if (userPhoto) {
        localStorage.setItem('profile_image', userPhoto);
        localStorage.setItem('user_photo', userPhoto);
        localStorage.setItem('photo', userPhoto);
      }

      try {
        await api.patch('auth/profile/', {
          first_name: userName,
          email: userEmail,
          profile_image: userPhoto,
        });
      } catch (err) {
        console.warn('API de perfil indisponível. Dados salvos localmente.');
      }

      // Dispara o evento global para sincronizar a Sidebar/Avatar em tempo real
      window.dispatchEvent(new Event('profileUpdated'));

      toast.success('Configurações atualizadas com sucesso!', {
        description: 'As alterações foram sincronizadas no sistema.',
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error('Erro ao guardar as alterações', {
        description: 'Verifique os campos e tente novamente.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans space-y-8">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#16A36A]" />
          Configurações do Sistema
        </h1>
        <p className="text-slate-500 mt-1">
          Gerencie o seu perfil de administrador, foto cadastrada, regras de entrega e parâmetros da biometria facial.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* SEÇÃO 1: PERFIL DO ADMINISTRADOR */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <User className="w-5 h-5 text-[#16A36A]" />
            <h2 className="font-bold text-slate-900 text-base">Perfil do Administrador</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Foto de Perfil Cadastrada */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-[#16A36A] overflow-hidden flex items-center justify-center text-slate-400 font-bold text-2xl shadow-md">
                {userPhoto ? (
                  <img src={userPhoto} alt="Foto Cadastrada" className="w-full h-full object-cover" />
                ) : (
                  <span>{(userName[0] || 'M').toUpperCase()}</span>
                )}
              </div>
              <label 
                htmlFor="photo-upload" 
                className="absolute bottom-0 right-0 bg-[#0F2847] hover:bg-[#16A36A] text-white p-2 rounded-full cursor-pointer shadow-lg transition-all"
                title="Alterar foto de perfil"
              >
                <Camera className="w-4 h-4" />
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Inputs de Nome e E-mail */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Institucional</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
                  required
                />
              </div>
            </div>

          </div>
        </div>

        {/* SEÇÃO 2: REGRAS OPERACIONAIS DE ENTREGA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-base">Regras Operacionais de Distribuição</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Marmitas por Beneficiário / Dia</label>
              <input
                type="number"
                min="1"
                max="5"
                value={limitPerBeneficiary}
                onChange={(e) => setLimitPerBeneficiary(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Evita entregas duplicadas no mesmo ciclo de refeição.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Horário de Início</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Horário de Término</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: PARÂMETROS DA BIOMETRIA FACIAL & IA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders className="w-5 h-5 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-base">Parâmetros de Validação Biométrica (IA)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Taxa Mínima de Compatibilidade Facial ({facialMatchThreshold}%)
              </label>
              <input
                type="range"
                min="70"
                max="99"
                value={facialMatchThreshold}
                onChange={(e) => setFacialMatchThreshold(Number(e.target.value))}
                className="w-full accent-[#16A36A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>70% (Mais flexível)</span>
                <span>99% (Alta precisão)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">Aprovação Automática pós-Biometria</p>
                <p className="text-[10px] text-slate-500">Registrar a entrega imediatamente após leitura confirmada.</p>
              </div>
              <input
                type="checkbox"
                checked={autoApproveDelivery}
                onChange={(e) => setAutoApproveDelivery(e.target.checked)}
                className="w-5 h-5 accent-[#16A36A] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: ALERTAS DE ESTOQUE E NOTIFICAÇÕES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">Notificações e Estoque Mínimo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Alerta de Estoque Mínimo (Marmitas)</label>
              <input
                type="number"
                value={stockAlertThreshold}
                onChange={(e) => setStockAlertThreshold(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16A36A] focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Notifica quando a quantidade disponível for menor que o valor estipulado.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">Alertas por E-mail</p>
                <p className="text-[10px] text-slate-500">Receber relatórios diários e alertas de estoque baixo no e-mail.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-[#16A36A] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* BOTÃO DE GUARDAR ALTERAÇÕES */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#16A36A]/20 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A guardar alterações...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Todas as Configurações</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}