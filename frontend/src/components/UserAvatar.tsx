'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  src: string | null;
  name: string;
  size?: number; // Tamanho em pixéis (ex: 36, 40, 64)
  className?: string;
}

export default function UserAvatar({
  src,
  name,
  size = 40,
  className = '',
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initial = (name?.[0] || 'U').toUpperCase();

  const isBase64 = src?.startsWith('data:image');
  const isUrl = src?.startsWith('http://') || src?.startsWith('https://') || src?.startsWith('/');

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`rounded-full bg-slate-700 border-2 border-[#16A36A] overflow-hidden shrink-0 flex items-center justify-center text-white font-bold shadow-sm relative ${className}`}
    >
      {src && !imageError && (isBase64 || isUrl) ? (
        <Image
          src={src}
          alt={`Foto de ${name}`}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setImageError(true)}
          priority={size > 48} // Prioridade para avatares maiores (ex: no perfil)
        />
      ) : (
        <span style={{ fontSize: `${Math.round(size * 0.4)}px` }}>
          {initial}
        </span>
      )}
    </div>
  );
}