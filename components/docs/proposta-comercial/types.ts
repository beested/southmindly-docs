'use client';

import { PropostaComercialData } from '@/types/docs';

export type ClienteItem = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  endereco: string;
  nomeContato: string;
  cargoContato: string;
  emailContato: string;
  telefoneContato: string;
  logoUrl: string;
};

export type AssessorItem = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
};

export type PropostaListItem = {
  id: string;
  numeroProposta: number | null;
  revisao: number | null;
  status: string;
  cidade: string;
  dataProposta: string;
  updatedAt: string;
  clienteId: string;
  assessorId: string;
};

export type EscopoCatalogItem = {
  id: string;
  nome: string;
  descricao: string;
  tipoCobranca: string;
  valorPadrao: number | null;
  unidadeLabel: string;
  ordem: number;
};

export type SelectOption<TValue extends string = string> = {
  value: TValue;
  label: string;
};

export interface PropostaComercialProps {
  onBack: () => void;
}

export type PropostaResponse = {
  id: string;
  proposta: PropostaComercialData;
} | null;
