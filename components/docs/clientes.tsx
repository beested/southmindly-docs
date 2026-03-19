'use client';

import { Button } from '@/components/ui/button';
import { Field, ToggleField } from '@/components/ui/inputs';
import { CnpjInput } from '@/components/ui/inputs/cnpj-input';
import { PhoneInput } from '@/components/ui/inputs/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/inputs/select';
import {
  Building2,
  Edit,
  FilePlus2,
  ImageUp,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Cliente = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  nomeContato: string;
  cargoContato: string;
  emailContato: string;
  telefoneContato: string;
  logoUrl: string;
  cidade: string;
  ativo: boolean;
  createdAt: string;
};

interface ClientesProps {
  onBack: () => void;
}

type ClienteForm = {
  razaoSocial: string;
  cnpj: string;
  nomeContato: string;
  cargoContato: string;
  emailContato: string;
  telefoneContato: string;
  logoUrl: string;
  cidade: string;
  ativo: boolean;
};

const emptyForm: ClienteForm = {
  razaoSocial: '',
  cnpj: '',
  nomeContato: '',
  cargoContato: '',
  emailContato: '',
  telefoneContato: '',
  logoUrl: '',
  cidade: '',
  ativo: true,
};

export default function Clientes({ onBack }: ClientesProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [show, setShow] = useState<'ativos' | 'todos'>('ativos');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClienteForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const setLogoUrl = (url: string) => {
    setForm((f) => ({ ...f, logoUrl: url }));
    setLogoPreview(url ? url : null);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/clientes?all=${show === 'todos' ? '1' : '0'}`,
        {
          cache: 'no-store',
        },
      );
      const json = (await res.json().catch(() => ({}))) as {
        items?: Cliente[];
        error?: string;
      };
      if (!res.ok) {
        setStatusMsg(json.error ?? 'Erro ao carregar clientes');
        setClientes([]);
        return;
      }
      setClientes(Array.isArray(json.items) ? json.items : []);
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter((c) =>
      [
        c.razaoSocial,
        c.cnpj,
        c.cidade,
        c.nomeContato,
        c.emailContato,
        c.telefoneContato,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [clientes, query]);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setLogoPreview(null);
    setStatusMsg(null);
  };

  const startEdit = (c: Cliente) => {
    setEditingId(c.id);
    setForm({
      razaoSocial: c.razaoSocial,
      cnpj: c.cnpj,
      nomeContato: c.nomeContato,
      cargoContato: c.cargoContato,
      emailContato: c.emailContato,
      telefoneContato: c.telefoneContato,
      logoUrl: c.logoUrl,
      cidade: c.cidade,
      ativo: c.ativo,
    });
    setLogoPreview(c.logoUrl || null);
    setStatusMsg(null);
  };

  const handleLogoFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatusMsg('Selecione um arquivo de imagem (PNG/JPG/SVG).');
      return;
    }
    const maxBytes = 600_000;
    if (file.size > maxBytes) {
      setStatusMsg('A imagem é muito grande. Use até ~600KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        setStatusMsg('Não foi possível ler a imagem.');
        return;
      }
      setLogoUrl(result);
      setStatusMsg('Logo selecionada.');
      setTimeout(() => setStatusMsg(null), 2000);
    };
    reader.onerror = () => setStatusMsg('Erro ao carregar a imagem.');
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.razaoSocial.trim()) {
      setStatusMsg('Preencha a razão social.');
      return;
    }

    setSaving(true);
    setStatusMsg(null);
    try {
      const url = editingId ? `/api/clientes/${editingId}` : '/api/clientes';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          cliente: {
            razaoSocial: form.razaoSocial.trim(),
            cnpj: form.cnpj.trim(),
            nomeContato: form.nomeContato.trim(),
            cargoContato: form.cargoContato.trim(),
            emailContato: form.emailContato.trim(),
            telefoneContato: form.telefoneContato.trim(),
            logoUrl: form.logoUrl.trim(),
            cidade: form.cidade.trim(),
            ativo: form.ativo,
          },
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatusMsg(json.error ?? 'Erro ao salvar cliente');
        return;
      }

      setStatusMsg(editingId ? 'Cliente atualizado' : 'Cliente cadastrado');
      await refresh();
      startNew();
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Desativar este cliente?')) return;
    const res = await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F14] font-sans text-[#E8EAF0] flex flex-col">
      <header className="border-b border-[#1E2130] bg-[#0D0F14EE] px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="h-auto bg-transparent hover:bg-transparent border-none text-[#6B7280] cursor-pointer text-lg p-1 px-2 flex items-center transition-colors duration-200 hover:text-[#E8EAF0]"
            >
              ←
            </Button>
            <div className="w-px h-5 bg-[#1E2130]" />
            <div>
              <div className="text-[10px] font-mono text-[#6B7280] tracking-[0.1em] uppercase">
                Cadastro
              </div>
              <div className="text-[13px] font-sans text-[#E8EAF0] font-medium">
                Clientes
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={startNew}
              className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer bg-transparent text-[13px] font-sans font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#A78BFA55] hover:bg-transparent hover:text-[#A78BFA]"
              title="Novo cliente"
            >
              <FilePlus2 className="size-4" />
              Novo
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSave}
              disabled={saving}
              className="h-auto px-4.5 py-1.5 rounded-lg border border-[#A78BFA44] cursor-pointer bg-[#A78BFA18] text-[13px] font-sans font-medium text-[#A78BFA] transition-all duration-200 hover:bg-[#A78BFA33] hover:text-[#A78BFA] disabled:opacity-60"
              title="Salvar cliente"
            >
              <Save className="size-4" />
              {editingId ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </header>

      {statusMsg && (
        <div className="px-4 py-3 border-b border-[#1E2130] text-[12px] text-[#9CA3AF] bg-[#13161D] sm:px-6 lg:px-8">
          {statusMsg}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="grid min-h-[calc(100vh-60px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
          <div className="border-b border-[#1E2130] bg-[#13161D] p-4 overflow-y-auto sm:p-5 lg:border-b-0 lg:border-r lg:p-[28px_24px]">
            <div className="text-[10px] font-mono text-[#A78BFA] tracking-[0.15em] uppercase mb-5 pb-3.5 border-b border-[#1E2130]">
              Dados do cliente
            </div>

            <Field
              label="Razão social"
              value={form.razaoSocial}
              onChange={(v) => setForm((f) => ({ ...f, razaoSocial: v }))}
              placeholder="Ex: SouthMindly LTDA"
            />

            <Field
              label="CNPJ"
              value={form.cnpj}
              onChange={(v) => setForm((f) => ({ ...f, cnpj: v }))}
              placeholder="00.000.000/0000-00"
              renderInput={(inputProps) => <CnpjInput {...inputProps} />}
            />

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <Field
                label="Cidade"
                value={form.cidade}
                onChange={(v) => setForm((f) => ({ ...f, cidade: v }))}
                placeholder="Ex: São Paulo"
              />
              <ToggleField
                label="Status"
                checked={form.ativo}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, ativo: checked }))
                }
                checkedLabel="Ativo"
                uncheckedLabel="Inativo"
              />
            </div>

            <div className="text-[10px] font-mono text-[#A78BFA] tracking-[0.15em] uppercase mb-4 mt-6 pt-5 border-t border-[#1E2130]">
              Contato
            </div>

            <Field
              label="Nome do contato"
              value={form.nomeContato}
              onChange={(v) => setForm((f) => ({ ...f, nomeContato: v }))}
              placeholder="Ex: Felipe Susin"
            />
            <Field
              label="Cargo"
              value={form.cargoContato}
              onChange={(v) => setForm((f) => ({ ...f, cargoContato: v }))}
              placeholder="Ex: Diretor"
            />
            <Field
              label="E-mail"
              value={form.emailContato}
              onChange={(v) => setForm((f) => ({ ...f, emailContato: v }))}
              placeholder="Ex: contato@empresa.com"
              type="email"
            />
            <Field
              label="Telefone"
              value={form.telefoneContato}
              onChange={(v) => setForm((f) => ({ ...f, telefoneContato: v }))}
              placeholder="Ex: (11) 99999-9999"
              renderInput={(inputProps) => <PhoneInput {...inputProps} />}
            />
            <Field
              label="Logo URL"
              value={form.logoUrl}
              onChange={(v) => setLogoUrl(v)}
              placeholder="https://... (ou selecione um arquivo abaixo)"
              type="url"
            />

            <div className="mb-4">
              <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                Logo (arquivo)
              </div>
              <div className="flex items-center gap-2">
                <label className="h-[48px] flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleLogoFile(e.target.files?.[0] ?? null)
                    }
                  />
                  <div className="h-[48px] w-full bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 flex items-center justify-between text-sm text-[#9CA3AF] hover:border-[#252A3A] transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <ImageUp className="size-4 text-[#6B7280]" />
                      <span>Selecionar logo</span>
                    </div>
                    <span className="text-xs font-mono text-[#6B7280]">
                      PNG/JPG/SVG
                    </span>
                  </div>
                </label>
                {form.logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setLogoUrl('')}
                    className="size-[48px] bg-[#191C25] border border-[#1E2130] rounded-lg hover:bg-[#191C25] hover:border-[#252A3A]"
                    title="Remover logo"
                  >
                    <X className="size-4 text-[#6B7280]" />
                  </Button>
                )}
              </div>

              {logoPreview && (
                <div className="mt-3 p-3 bg-[#191C25] border border-[#1E2130] rounded-xl flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0D0F14] border border-[#252A3A] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={logoPreview}
                      alt="Logo do cliente"
                      className="max-w-[44px] max-h-[44px] object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-medium text-[#E8EAF0]">
                      Pré-visualização
                    </div>
                    <div className="text-[11px] font-mono text-[#6B7280] truncate">
                      {form.logoUrl.startsWith('data:')
                        ? 'Imagem carregada (data URL)'
                        : form.logoUrl}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-auto p-4 sm:p-5 lg:p-[28px_32px]">
            <div className="mb-5 flex flex-col gap-4 border-b border-[#1E2130] pb-3.5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#A78BFA] tracking-[0.15em] uppercase">
                  Lista
                </div>
                <div className="text-[13px] font-sans text-[#E8EAF0] font-medium mt-1">
                  {loading ? 'Carregando...' : `${filtered.length} cliente(s)`}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-[160px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6B7280]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="h-[35px] w-full bg-[#191C25] border border-[#1E2130] rounded-lg pl-10 pr-3.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] focus-visible:border-[#A78BFA] focus-visible:ring-[3px] focus-visible:ring-[#A78BFA22]"
                  />
                </div>

                <Select
                  value={show}
                  onValueChange={(v) => setShow(v as 'ativos' | 'todos')}
                >
                  <SelectTrigger className=" w-full bg-[#191C25] border-[#1E2130] text-[#E8EAF0] rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0] hover:border-[#252A3A] sm:w-[160px]">
                    <SelectValue placeholder="Filtro" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#13161D] border-[#1E2130] text-[#E8EAF0] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden">
                    <SelectItem
                      value="ativos"
                      className="text-[13px] font-sans text-[#E8EAF0] focus:bg-[#1E2130] focus:text-[#E8EAF0]"
                    >
                      Ativos
                    </SelectItem>
                    <SelectItem
                      value="todos"
                      className="text-[13px] font-sans text-[#E8EAF0] focus:bg-[#1E2130] focus:text-[#E8EAF0]"
                    >
                      Todos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-[#13161D] border border-[#1E2130] rounded-xl flex flex-col gap-4 hover:bg-[#191C25] transition-colors duration-200 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-[#E8EAF0] truncate">
                        {c.razaoSocial || 'Sem razão social'}
                      </div>
                      {!c.ativo && (
                        <span className="text-[10px] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono bg-[#252A3A] text-[#6B7280]">
                          Inativo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                      {c.cnpj ? `${c.cnpj} · ` : ''}
                      {c.cidade ? `${c.cidade} · ` : ''}
                      {c.nomeContato ? c.nomeContato : 'Sem contato'}{' '}
                      {c.emailContato ? `· ${c.emailContato}` : ''}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => startEdit(c)}
                      className="mt-0 w-auto"
                    >
                      <Edit className="size-3.5" />
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => handleDeactivate(c.id)}
                      className="mt-0 w-auto"
                      title="Desativar"
                    >
                      <Trash2 className="size-3.5" />
                      Desativar
                    </Button>
                  </div>
                </div>
              ))}

              {!loading && filtered.length === 0 && (
                <div className="text-center p-[56px_24px] text-[#6B7280] text-sm border border-dashed border-[#1E2130] rounded-xl">
                  <div className="text-4xl mb-3 opacity-35">
                    <Building2 className="mx-auto size-10" />
                  </div>
                  <div className="mb-1.5 font-medium">Nenhum cliente</div>
                  <div className="text-xs text-[#1E2130]">
                    Cadastre um novo cliente para começar
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
