import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from './adminApi';
import { HubTable, HubModal, ConfirmDialog } from './HubTable';
import { Pencil, Trash2 } from 'lucide-react';

export function HubProfissionais() {
  const { token } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any | null>(null);
  const [deleteRow, setDeleteRow] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await adminApi.getProfissionais(token, {
        page: String(page),
        limit: '20',
        search,
      });
      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleSave = async (values: Record<string, any>) => {
    if (!token || !editRow) return;
    setSaving(true);
    try {
      await adminApi.updateProfissional(token, editRow.id, values);
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
      await adminApi.deleteProfissional(token, deleteRow.id);
      setDeleteRow(null);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: 'user',
      label: 'Nome',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          {row.user?.avatar ? (
            <img src={`${import.meta.env.VITE_API_URL}/${row.user.avatar}`} className="w-7 h-7 rounded-full object-cover shadow-sm border border-gray-100" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">
              {row.user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-gray-900 font-medium">{row.user?.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (row: any) => row.user?.email ?? '—' },
    {
      key: 'especialidade',
      label: 'Especialidade',
      render: (row: any) => (
        <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-xs font-medium">{row.especialidade}</span>
      ),
    },
    {
      key: 'valorHora',
      label: 'Valor/Hora',
      render: (row: any) =>
        row.valorHora != null
          ? <span className="font-medium text-gray-900">R$ {Number(row.valorHora).toFixed(2).replace('.', ',')}</span>
          : '—',
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
        title="Profissionais"
        columns={columns}
        data={data}
        total={total}
        page={page}
        totalPages={totalPages}
        search={search}
        loading={loading}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onPageChange={setPage}
        actions={[
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
          title={`Editar Profissional — ${editRow.user?.name}`}
          fields={[
            { key: 'name', label: 'Nome completo' },
            { key: 'email', label: 'E-mail', type: 'email' },
            { key: 'especialidade', label: 'Especialidade' },
            { key: 'valorHora', label: 'Valor por Hora (R$)', type: 'number' },
          ]}
          values={{
            name: editRow.user?.name ?? '',
            email: editRow.user?.email ?? '',
            especialidade: editRow.especialidade ?? '',
            valorHora: editRow.valorHora ?? 0,
          }}
          onClose={() => setEditRow(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteRow && (
        <ConfirmDialog
          message={`Tem certeza que deseja remover o profissional "${deleteRow.user?.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRow(null)}
          loading={saving}
        />
      )}
    </>
  );
}
