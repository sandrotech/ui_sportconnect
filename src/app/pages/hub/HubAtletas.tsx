import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from './adminApi';
import { HubTable, HubModal, ConfirmDialog } from './HubTable';
import { Pencil, Trash2 } from 'lucide-react';

export function HubAtletas() {
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
      const result = await adminApi.getAtletas(token, {
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
      await adminApi.updateAtleta(token, editRow.id, values);
      setEditRow(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteRow) return;
    setSaving(true);
    try {
      await adminApi.deleteAtleta(token, deleteRow.id);
      setDeleteRow(null);
      fetchData();
    } catch (err) {
      console.error(err);
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
            <img src={row.user.avatar.startsWith('http') ? row.user.avatar : `${import.meta.env.VITE_API_URL}/${row.user.avatar}`} className="w-7 h-7 rounded-full object-cover shadow-sm border border-gray-100" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004ef9] text-xs font-bold">
              {row.user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-gray-900 font-medium">{row.user?.name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email', render: (row: any) => row.user?.email ?? '—' },
    { key: 'apelido', label: 'Apelido', render: (row: any) => row.apelido ?? '—' },
    { key: 'ranking', label: 'Ranking', render: (row: any) => (
      <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 text-[#004ef9] rounded-full text-xs font-medium">#{row.ranking}</span>
    )},
    { key: 'localizacao', label: 'Localização', render: (row: any) => row.localizacao ?? '—' },
    {
      key: 'createdAt',
      label: 'Cadastro',
      render: (row: any) => new Date(row.user?.createdAt).toLocaleDateString('pt-BR'),
    },
  ];

  return (
    <>
      <HubTable
        title="Atletas"
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
          title={`Editar Atleta — ${editRow.user?.name}`}
          fields={[
            { key: 'name', label: 'Nome completo' },
            { key: 'email', label: 'E-mail', type: 'email' },
            { key: 'apelido', label: 'Apelido' },
            { key: 'telefone', label: 'Telefone' },
            { key: 'localizacao', label: 'Localização' },
            { key: 'ranking', label: 'Ranking', type: 'number' },
          ]}
          values={{
            name: editRow.user?.name ?? '',
            email: editRow.user?.email ?? '',
            apelido: editRow.apelido ?? '',
            telefone: editRow.telefone ?? '',
            localizacao: editRow.localizacao ?? '',
            ranking: editRow.ranking ?? 0,
          }}
          onClose={() => setEditRow(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteRow && (
        <ConfirmDialog
          message={`Tem certeza que deseja remover o atleta "${deleteRow.user?.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRow(null)}
          loading={saving}
        />
      )}
    </>
  );
}
