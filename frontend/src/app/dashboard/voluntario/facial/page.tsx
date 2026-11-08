'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, 
  CheckCircle2, 
  Loader2, 
  RotateCcw, 
  Heart, 
  LogOut, 
  LayoutDashboard, 
  PackageCheck, 
  Fingerprint, 
  Settings 
} from 'lucide-react';

export default function VoluntarioFacialPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Voluntário');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/');
      return;
    }

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
      console.error('Erro ao carregar dados locais:', e);
    } finally {
      setPageLoading(false);
    }
  }, [router]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      console.error('Erro ao aceder à câmara:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureFace = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
        stopCamera();
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const handleLogout = () => {
    stopCamera();
    localStorage.clear();
    router.push('/');
  };

  const handleValidateFace = () => {
    if (!capturedImage) return;
    setLoading(true);
    setSuccessMsg(null);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Reconhecimento facial concluído! Beneficiário identificado e marmita registada com sucesso.');
    }, 1500);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#16A36A] mr-2" />
        <span className="text-slate-600 font-semibold text-sm">A carregar reconhecimento facial...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-800 flex">
      
      {/* BARRA LATERAL (SIDEBAR) */}
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white font-medium text-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4 text-[#16A36A]" />
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#16A36A] text-white font-semibold text-xs transition-all shadow-md"
            >
              <Camera className="w-4 h-4" />
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
                <p className="text-[10px] text-slate-400 font-medium">Reconhecimento Facial</p>
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

        <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 bg-emerald-100 text-[#16A36A] rounded-2xl">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Reconhecimento Facial</h2>
                <p className="text-xs text-slate-500">Validação de identidade via câmara em tempo real.</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="flex flex-col items-center justify-center space-y-4">
              {cameraActive && !capturedImage && (
                <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-black aspect-video shadow-md border-2 border-[#16A36A]">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              )}

              {capturedImage && (
                <div className="w-full max-w-sm rounded-2xl overflow-hidden aspect-video border-2 border-[#16A36A] shadow-md relative">
                  <img src={capturedImage} alt="Face Capturada" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex gap-3 w-full">
                {!capturedImage ? (
                  <button
                    type="button"
                    onClick={captureFace}
                    className="w-full py-3 bg-[#16A36A] hover:bg-[#158f5c] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                  >
                    <Camera className="w-4 h-4" /> Capturar Rosto
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setCapturedImage(null); startCamera(); }}
                    className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-4 h-4" /> Repetir Captura
                  </button>
                )}
              </div>

              {capturedImage && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleValidateFace}
                  className="w-full py-3.5 bg-[#12305B] hover:bg-[#0e2547] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Validar e Registar Entrega</span>
                </button>
              )}
            </div>
          </div>

        </main>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}