import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from './adminApi';
import { HubTable, HubModal, ConfirmDialog } from './HubTable';
import { Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'APPROVED', label: 'Aprovada' },
  { value: 'REJECTED', label: 'Rejeitada' },
];

const statusBadge: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

const statusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovada',
  REJECTED: 'Rejeitada',
};

export function HubArenas() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20', search };
      if (statusFilter) params.status = statusFilter;
      const result = await adminApi.getArenas(token, params);
      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleSave = async (values: Record<string, any>) => {
    if (!token || !editRow) return;
    setSaving(true);
    try {
      await adminApi.updateArena(token, editRow.id, values);
      setEditRow(null);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteRow) return;
    setSaving(true);
    try {
      await adminApi.deleteArena(token, deleteRow.id);
      setDeleteRow(null);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleAprovar = async (row: any) => {
    if (!token) return;
    try {
      await adminApi.aprovarArena(token, row.id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejeitar = async (row: any) => {
    if (!token) return;
    try {
      await adminApi.rejeitarArena(token, row.id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Responsável',
      render: (row: any) => (
        <div>
          <p className="text-gray-900 font-medium text-sm">{row.user?.name}</p>
          <p className="text-gray-500 text-xs">{row.user?.email}</p>
        </div>
      ),
    },
    { key: 'nomeArena', label: 'Nome da Arena', render: (row: any) => <span className="text-gray-900">{row.nomeArena}</span> },
    { key: 'cnpj', label: 'CNPJ', render: (row: any) => row.cnpj ?? '—' },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge[row.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
          {statusLabel[row.status] ?? row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Cadastro',
      render: (row: any) => new Date(row.user?.createdAt).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <>
      <HubTable
        title="Arenas"
        columns={columns}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        search={search}
        loading={loading}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onPageChange={setPage}
        filters={
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9] shadow-sm"
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        }
        actions={[
          {
            label: 'Aprovar',
            icon: <CheckCircle className="w-5 h-5" />,
            onClick: handleAprovar,
            className: 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50',
            hidden: (row) => row.status === 'APPROVED',
          },
          {
            label: 'Rejeitar',
            icon: <XCircle className="w-5 h-5" />,
            onClick: handleRejeitar,
            className: 'text-gray-400 hover:text-amber-600 hover:bg-amber-50',
            hidden: (row) => row.status === 'REJECTED',
          },
          {
            label: 'Editar',
            icon: <Pencil className="w-5 h-5" />,
            onClick: (row) => setEditRow(row),
            className: 'text-gray-400 hover:text-[#004ef9] hover:bg-blue-50',
          },
          {
            label: 'Deletar',
            icon: <Trash2 className="w-5 h-5" />,
            onClick: (row) => setDeleteRow(row),
            className: 'text-gray-400 hover:text-rose-600 hover:bg-rose-50',
          },
        ]}
      />

      {editRow && (
        <HubModal
          title={`Editar Arena — ${editRow.nomeArena}`}
          fields={[
            { key: 'name', label: 'Nome do responsável' },
            { key: 'email', label: 'E-mail', type: 'email' },
            { key: 'nomeArena', label: 'Nome da Arena' },
            { key: 'cnpj', label: 'CNPJ' },
          ]}
          values={{
            name: editRow.user?.name ?? '',
            email: editRow.user?.email ?? '',
            nomeArena: editRow.nomeArena ?? '',
            cnpj: editRow.cnpj ?? '',
          }}
          onClose={() => setEditRow(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteRow && (
        <ConfirmDialog
          message={`Tem certeza que deseja remover a arena "${deleteRow.nomeArena}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRow(null)}
          loading={saving}
        />
      )}
    </>
  );
}
