'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, CheckCircle2, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { compressImage } from '@/utils/imageCompressor';

interface BiometricScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaptureSuccess: (capturedImageBase64: string) => void;
}

export default function BiometricScannerModal({
  isOpen,
  onClose,
  onCaptureSuccess,
}: BiometricScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicia a câmara quando o modal abre
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCapturedImage(null);
    setError(null);
    setLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Erro ao aceder à câmara:', err);
      setError('Não foi possível aceder à câmara. Verifique as permissões do navegador.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Converte o canvas para DataURL bruto
      const rawDataUrl = canvas.toDataURL('image/jpeg');
      
      // Converte para File para reutilizar o nosso compressor otimizado do Passo 2
      const res = await fetch(rawDataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'biometria.jpg', { type: 'image/jpeg' });

      // Comprime a imagem gerada pela câmara
      const optimizedBase64 = await compressImage(file, 400, 400, 0.8);
      setCapturedImage(optimizedBase64);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCaptureSuccess(capturedImage);
      stopCamera();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-[#16A36A]" />
            <h3 className="text-lg font-bold text-slate-900">Leitor Biométrico / Facial</h3>
          </div>
          <button 
            onClick={() => { stopCamera(); onClose(); }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de Vídeo / Pré-visualização */}
        <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner">
          {error ? (
            <div className="text-center p-6 text-red-300 space-y-2">
              <AlertTriangle className="w-10 h-10 mx-auto text-red-400" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          ) : loading && !capturedImage ? (
            <div className="text-center text-slate-300 space-y-2">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#16A36A]" />
              <p className="text-xs">A ligar câmara...</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captura Biométrica" className="w-full h-full object-cover" />
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Botões de Controlo */}
        <div className="flex items-center gap-3">
          {capturedImage ? (
            <>
              <button 
                onClick={startCamera}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Repetir Foto
              </button>
              <button 
                onClick={handleConfirm}
                className="flex-1 py-3 bg-[#16A36A] hover:bg-[#158f5c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Validar Biometria
              </button>
            </>
          ) : (
            <button 
              onClick={captureFrame}
              disabled={loading || !!error}
              className="w-full py-3.5 bg-[#0F2847] hover:bg-[#16A36A] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" /> Capturar Rosto para Validação
            </button>
          )}
        </div>

      </div>
    </div>
  );
}