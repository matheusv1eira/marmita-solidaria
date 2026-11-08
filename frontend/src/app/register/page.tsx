'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import api from '../../services/api';
import { compressImage } from '@/utils/imageCompressor';
import { 
  Heart, 
  Shield, 
  Box, 
  CheckCircle2, 
  Mail, 
  Lock, 
  UserPlus,
  ArrowLeft,
  Loader2,
  Camera,
  RotateCcw,
  User,
  Phone,
  CreditCard
} from 'lucide-react';

// Função utilitária para validar CPF rigorosamente (algoritmo oficial dos dígitos verificadores)
const isValidCPF = (cpf: string) => {
  const cleanCpf = cpf.replace(/[^\d]/g, '');
  if (cleanCpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleanCpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

  return true;
};

// Máscara automática de CPF
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+$/, '$1');
};

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    phone: '',
    cpf: '',
    account_type: 'voluntario',
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Ativar a câmara
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      setCameraActive(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error('Erro ao aceder à câmara:', err);
      setErrorMessage('Não foi possível aceder à câmara. Verifique se o browser tem permissão.');
      setCameraActive(false);
    }
  };

  // Desativar a câmara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capturar e Comprimir a foto automaticamente
  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'perfil.jpg', { type: 'image/jpeg' });
          const optimizedBase64 = await compressImage(file, 400, 400, 0.75);
          setProfileImage(optimizedBase64);
        } catch (err) {
          console.error('Erro na compressão da imagem da webcam, usando original:', err);
          setProfileImage(dataUrl);
        }

        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setProfileImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setFormData({ ...formData, cpf: maskCPF(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validação estrita do CPF
    if (!isValidCPF(formData.cpf)) {
      setErrorMessage('O CPF introduzido é inválido. Introduza um CPF real para continuar.');
      return;
    }

    // Validação estrita de tamanho e regras de senha
    if (formData.password.length < 6) {
      setErrorMessage('A senha é muito curta. Deve conter pelo menos 6 dígitos/carateres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não coincidem. Verifique os campos de senha.');
      return;
    }

    if (!profileImage) {
      setErrorMessage('A captura da foto de perfil via webcam é obrigatória.');
      return;
    }

    setLoading(true);

    try {
      const baseURL = api.defaults.baseURL || 'http://127.0.0.1:8000/api/';
      const userKey = formData.username || formData.email;

      // Envia os dados para o backend Django com o CPF formatado
      await axios.post(`${baseURL}auth/register/`, {
        username: userKey,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        phone: formData.phone,
        cpf: formData.cpf,
        account_type: formData.account_type,
        profile_image: profileImage,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Vincula a foto tirada exclusivamente a este utilizador no localStorage
      if (profileImage) {
        localStorage.setItem(`profile_image_${userKey}`, profileImage);
      }

      toast.success('Conta criada com sucesso!', {
        description: 'Faça login com as suas credenciais para continuar.',
      });
      router.push('/');
    } catch (error: any) {
      console.error('Erro no registo:', error);
      const serverError = error.response?.data;
      const status = error.response?.status;

      if (serverError) {
        console.error('Payload do erro do servidor:', serverError);

        if (typeof serverError === 'object' && serverError !== null) {
          if (serverError.cpf) {
            const msg = Array.isArray(serverError.cpf) ? serverError.cpf[0] : serverError.cpf;
            setErrorMessage(`Este CPF já está a ser utilizado por outra conta no sistema. (${msg})`);
          } else if (serverError.email) {
            const msg = Array.isArray(serverError.email) ? serverError.email[0] : serverError.email;
            setErrorMessage(`Este e-mail já está registado no sistema. (${msg})`);
          } else if (serverError.username) {
            const msg = Array.isArray(serverError.username) ? serverError.username[0] : serverError.username;
            setErrorMessage(`Este nome de utilizador já existe. (${msg})`);
          } else if (serverError.password) {
            const msg = Array.isArray(serverError.password) ? serverError.password[0] : serverError.password;
            setErrorMessage(`A senha não cumpre os requisitos do sistema: ${msg}`);
          } else {
            const firstKey = Object.keys(serverError)[0];
            const firstMessage = serverError[firstKey];
            setErrorMessage(
              Array.isArray(firstMessage)
                ? firstMessage[0]
                : (serverError.detail || serverError.error || 'Erro ao realizar o registo. Verifique os dados preenchidos.')
            );
          }
        } else {
          setErrorMessage('Erro ao comunicar com o servidor.');
        }
      } else if (status === 401 || status === 400) {
        setErrorMessage('Falha no registo. Verifique se o CPF, e-mail ou nome de utilizador já estão em uso.');
      } else if (error.request) {
        setErrorMessage('Não foi possível conectar ao servidor Django. Verifique se o backend está ativo.');
      } else {
        setErrorMessage(`Ocorreu um erro inesperado: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 font-sans">
      
      {/* PAINEL ESQUERDO: Identidade Visual */}
      <div className="lg:col-span-5 bg-[#12305B] text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
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

        <div className="my-auto py-8 relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#16A36A]/20 text-[#16A36A] text-xs font-semibold mb-6 border border-[#16A36A]/30">
            Cadastro de Novo Membro
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Faça parte desta <span className="text-[#16A36A]">corrente do bem</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Preencha os seus dados, valide o seu CPF e tire a foto oficial de perfil para se juntar à nossa equipa.
          </p>

          <div className="space-y-3">
            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A]"><Shield className="w-4 h-4" /></div>
              <span className="text-xs text-slate-200 font-medium">Validação segura de identidade por CPF e Foto</span>
            </div>

            <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-[#16A36A]/20 text-[#16A36A]"><Box className="w-4 h-4" /></div>
              <span className="text-xs text-slate-200 font-medium">Acesso às funções de voluntariado e gestão</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <button 
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Login
          </button>
          <span>UniFBV • Transformação Digital</span>
        </div>
      </div>

      {/* PAINEL DIREITO: Formulário de Registo */}
      <div className="lg:col-span-7 bg-white p-8 lg:p-12 flex flex-col justify-between shadow-2xl z-20 overflow-y-auto">
        
        <div className="max-w-xl w-full mx-auto my-auto py-4">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Criar Nova Conta</h3>
            <p className="text-xs text-slate-500 mt-1">Insira os seus dados pessoais e confirme com uma foto de perfil.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium animate-fadeIn">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Nome Completo *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><User className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    name="first_name" 
                    required 
                    value={formData.first_name} 
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Nome de Utilizador *</label>
                <input 
                  type="text" 
                  name="username" 
                  required 
                  value={formData.username} 
                  onChange={handleChange}
                  placeholder="ex: joaosilva"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">E-mail *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Mail className="w-4 h-4" /></span>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">CPF Válido *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><CreditCard className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    name="cpf" 
                    required 
                    maxLength={14}
                    value={formData.cpf} 
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Telefone / Telemóvel</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Phone className="w-4 h-4" /></span>
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    placeholder="(81) 99999-9999"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Tipo de Conta *</label>
                <select 
                  name="account_type" 
                  value={formData.account_type} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                >
                  <option value="voluntario">Voluntário</option>
                  <option value="administrador">Administrador</option>
                  <option value="beneficiario">Beneficiário</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Senha (Mín. 6 dígitos) *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Lock className="w-4 h-4" /></span>
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Confirmar Senha *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"><Lock className="w-4 h-4" /></span>
                  <input 
                    type="password" 
                    name="confirmPassword" 
                    required 
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A36A]/20 focus:border-[#16A36A]"
                  />
                </div>
              </div>
            </div>

            {/* SECTOR DA CÂMARA DE PERFIL */}
            <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 text-center">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Foto de Perfil (Obrigatória via Webcam) *
              </label>

              <div className="flex flex-col items-center justify-center">
                {!profileImage && !cameraActive && (
                  <div className="py-6 border-2 border-dashed border-slate-200 rounded-2xl w-full flex flex-col items-center bg-white">
                    <div className="w-12 h-12 rounded-full bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center mb-2">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-500 mb-3">Captura obrigatória em tempo real</p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="py-2.5 px-5 bg-[#12305B] hover:bg-[#0e2547] text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" /> Ligar Câmara
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <div className="w-full flex flex-col items-center space-y-3">
                    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-black aspect-video shadow-md border-2 border-[#16A36A]">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="py-2 px-5 bg-[#16A36A] hover:bg-[#158f5c] text-white rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer shadow"
                      >
                        <Camera className="w-4 h-4" /> Tirar Foto
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {profileImage && (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#16A36A] shadow-md">
                      <img src={profileImage} alt="Foto de perfil" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={retakePhoto}
                      className="py-1.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Repetir Foto
                    </button>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#16A36A] hover:bg-[#158f5c] disabled:opacity-70 text-white font-medium rounded-xl shadow-lg shadow-[#16A36A]/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A registar conta...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Concluir Registo</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>MarmitaSolidária © 2026</span>
          <span className="flex items-center gap-1 text-[#16A36A] font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Sistema Protegido</span>
        </div>

      </div>

    </main>
  );
}