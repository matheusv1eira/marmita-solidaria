'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DeliveryRecord {
  id: number;
  beneficiaryName: string;
  time: string;
  date: string;
  location: string;
  status: string;
  method: string;
}

interface VoluntarioContextData {
  pontoAtual: string;
  setPontoAtual: (ponto: string) => void;
  pontosDisponiveis: string[];
  stats: {
    entregasHoje: number;
    totalMes: number;
    nivelImpacto: string;
  };
  history: DeliveryRecord[];
  addDelivery: (beneficiaryName: string, quantity: number, method: string) => void;
}

const VoluntarioContext = createContext<VoluntarioContextData | undefined>(undefined);

export const VoluntarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pontosDisponiveis = [
    'Ponto Central - Boa Vista',
    'Ponto Norte - Casa Amarela',
    'Unidade Móvel 01',
    'Ponto Sul - Boa Viagem'
  ];

  const [pontoAtual, setPontoState] = useState<string>('Ponto Central - Boa Vista');
  const [stats, setStats] = useState({
    entregasHoje: 0,
    totalMes: 0,
    nivelImpacto: 'Voluntário Ativo'
  });
  const [history, setHistory] = useState<DeliveryRecord[]>([]);

  // Carrega estado inicial do localStorage ao montar
  useEffect(() => {
    const savedPonto = localStorage.getItem('voluntario_ponto_atual');
    if (savedPonto) {
      setPontoState(savedPonto);
    }

    const savedStats = localStorage.getItem('voluntario_stats');
    if (savedStats) {
      try { setStats(JSON.parse(savedStats)); } catch (e) { console.error(e); }
    }

    const savedHistory = localStorage.getItem('voluntario_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const setPontoAtual = (novoPonto: string) => {
    setPontoState(novoPonto);
    localStorage.setItem('voluntario_ponto_atual', novoPonto);
  };

  const addDelivery = (beneficiaryName: string, quantity: number, method: string) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const newRecord: DeliveryRecord = {
      id: Date.now(),
      beneficiaryName,
      time: `${hours}:${minutes}`,
      date: now.toLocaleDateString('pt-BR'),
      location: pontoAtual,
      status: 'Entregue',
      method
    };

    const updatedHistory = [newRecord, ...history];
    const updatedStats = {
      ...stats,
      entregasHoje: stats.entregasHoje + quantity,
      totalMes: stats.totalMes + quantity
    };

    setHistory(updatedHistory);
    setStats(updatedStats);

    localStorage.setItem('voluntario_history', JSON.stringify(updatedHistory));
    localStorage.setItem('voluntario_stats', JSON.stringify(updatedStats));
  };

  return (
    <VoluntarioContext.Provider value={{ pontoAtual, setPontoAtual, pontosDisponiveis, stats, history, addDelivery }}>
      {children}
    </VoluntarioContext.Provider>
  );
};

export const useVoluntario = () => {
  const context = useContext(VoluntarioContext);
  if (!context) {
    throw new Error('useVoluntario deve ser usado dentro de um VoluntarioProvider');
  }
  return context;
};