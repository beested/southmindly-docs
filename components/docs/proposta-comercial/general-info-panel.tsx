'use client';

import { DatePicker } from '@/components/ui/date-picker';
import { PropostaComercialData } from '@/types/docs';

import {
  Field,
  MultiSelectField,
  SelectField,
  TextAreaField,
} from './form-fields';
import { AssessorItem, ClienteItem, SelectOption } from './types';

interface GeneralInfoPanelProps {
  data: PropostaComercialData;
  onChange: (patch: Partial<PropostaComercialData>) => void;
  clientes: ClienteItem[];
  assessores: AssessorItem[];
  statusOptions: SelectOption<PropostaComercialData['status']>[];
}

export function GeneralInfoPanel({
  data,
  onChange,
  clientes,
  assessores,
  statusOptions,
}: GeneralInfoPanelProps) {
  const selectedAssessorIds = data.assessorId
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <div className="overflow-y-auto border-b border-[#1E2130] bg-[#13161D] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-[28px_24px]">
      <div className="text-[10px] font-mono text-[#34D399] tracking-[0.15em] uppercase mb-5 pb-3.5 border-b border-[#1E2130]">
        Informações gerais
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Field
          label="Número"
          value={data.numeroProposta}
          onChange={(numeroProposta) => onChange({ numeroProposta })}
          placeholder="Ex: 1024"
        />
        <Field
          label="Revisão"
          value={data.revisao}
          onChange={(revisao) => onChange({ revisao })}
          placeholder="0"
        />
      </div>

      <SelectField
        label="Status"
        value={data.status}
        onChange={(status) => onChange({ status })}
        options={statusOptions}
        placeholder="Selecione o status"
      />

      <Field
        label="Cidade"
        value={data.cidade}
        onChange={(cidade) => onChange({ cidade })}
        placeholder="Ex: São Paulo"
      />

      <SelectField
        label="Cliente"
        value={data.clienteId}
        onChange={(clienteId) => onChange({ clienteId })}
        options={clientes.map((cliente) => ({
          value: cliente.id,
          label: cliente.razaoSocial || cliente.id,
        }))}
        placeholder="Selecione o cliente"
      />

      <MultiSelectField
        label="Assessores"
        values={selectedAssessorIds}
        onChange={(assessorIds) =>
          onChange({ assessorId: assessorIds.join(', ') })
        }
        options={assessores.map((assessor) => ({
          value: assessor.id,
          label: assessor.nome || assessor.id,
        }))}
        placeholder="Selecione um ou mais assessores"
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="mb-4">
          <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
            Data da proposta
          </label>
          <DatePicker
            value={data.dataProposta}
            onChange={(dataProposta) => onChange({ dataProposta })}
            placeholder="dd/mm/aaaa"
            accentColor="#34D399"
          />
        </div>
        <Field
          label="Prazo (meses)"
          value={data.prazoContratoMeses}
          onChange={(prazoContratoMeses) => onChange({ prazoContratoMeses })}
          placeholder="Ex: 12"
        />
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="mb-4">
          <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
            Data do aceite
          </label>
          <DatePicker
            value={data.dataAceite}
            onChange={(dataAceite) => onChange({ dataAceite })}
            placeholder="dd/mm/aaaa"
            accentColor="#34D399"
          />
        </div>
        <Field
          label="Total mensal"
          value={data.valorTotalMensal}
          onChange={(valorTotalMensal) => onChange({ valorTotalMensal })}
          placeholder="Ex: 4500"
        />
      </div>

      <Field
        label="Responsável (aceite)"
        value={data.nomeResponsavelAssinatura}
        onChange={(nomeResponsavelAssinatura) =>
          onChange({ nomeResponsavelAssinatura })
        }
        placeholder="Nome do responsável"
      />

      <TextAreaField
        label="Observações"
        value={data.observacoes}
        onChange={(observacoes) => onChange({ observacoes })}
        placeholder="Notas adicionais, condições, links..."
        rows={4}
      />
    </div>
  );
}
