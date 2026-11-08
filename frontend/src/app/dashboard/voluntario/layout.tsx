'use client';

import React from 'react';
import { VoluntarioProvider } from '@/context/VoluntarioContext';

export default function VoluntarioLayout({ children }: { children: React.ReactNode }) {
  return (
    <VoluntarioProvider>
      {children}
    </VoluntarioProvider>
  );
}