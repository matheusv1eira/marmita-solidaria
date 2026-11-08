'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProfileData {
  userName: string;
  userEmail: string;
  userRole: string;
  userPhoto: string | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileData>({
    userName: 'Matheus',
    userEmail: 'matheusvieira1417@gmail.com',
    userRole: 'Administrador',
    userPhoto: null,
  });

  const loadProfile = useCallback(() => {
    if (typeof window === 'undefined') return;

    const name =
      localStorage.getItem('user_name') ||
      localStorage.getItem('first_name') ||
      'Matheus';

    const email =
      localStorage.getItem('user_email') ||
      'matheusvieira1417@gmail.com';

    const role =
      localStorage.getItem('user_role') ||
      localStorage.getItem('account_type') ||
      'Administrador';

    const photo =
      localStorage.getItem('profile_image') ||
      localStorage.getItem('user_photo') ||
      localStorage.getItem('photo') ||
      localStorage.getItem('foto') ||
      '';

    setProfile({
      userName: name,
      userEmail: email,
      userRole: role,
      userPhoto: photo && photo !== 'null' && photo !== 'undefined' ? photo : null,
    });
  }, []);

  useEffect(() => {
    loadProfile();

    // Ouve eventos de atualização personalizada do perfil na mesma aba
    const handleProfileUpdate = () => loadProfile();
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [loadProfile]);

  // Função para atualizar a foto e notificar todos os componentes instantaneamente
  const updatePhoto = (newPhotoBase64: string) => {
    localStorage.setItem('profile_image', newPhotoBase64);
    localStorage.setItem('user_photo', newPhotoBase64);
    
    // Dispara evento global para que Sidebar, Header e Dashboard atualizem no mesmo milissegundo
    window.dispatchEvent(new Event('profileUpdated'));
  };

  return {
    ...profile,
    reloadProfile: loadProfile,
    updatePhoto,
  };
}