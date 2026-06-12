import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Pencil, Trash2, X, Check } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  className?: string;
  hidden?: (row: any) => boolean;
}

interface HubTableProps {
  title: string;
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  loading: boolean;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  actions?: Action[];
  filters?: React.ReactNode;
}

export function HubTable({
  title, columns, data, total, page, totalPages,
  search, loading, onSearchChange, onPageChange,
  actions = [], filters,
}: HubTableProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#000273]">{title}</h1>
          <p className="text-gray-500 text-sm mt-1">{total} registros encontrados</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#004ef9] transition-all shadow-sm"
          />
        </div>
        {filters}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                {columns.map(col => (
                  <th key={col.key} className="text-left px-6 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="text-right px-6 py-4 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-16 text-gray-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-[#004ef9] border-t-transparent animate-spin" />
                      Carregando...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-16 text-gray-400 text-sm">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {actions
                            .filter(a => !a.hidden?.(row))
                            .map((action, ai) => (
                              <button
                                key={ai}
                                onClick={() => action.onClick(row)}
                                title={action.label}
                                className={`p-2 rounded-xl transition-all ${action.className || 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                              >
                                {action.icon}
                              </button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-gray-500 text-sm font-medium">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Modal genérico ──────────────────────────────────────────────────────────

interface ModalField {
  key: string;
  label: string;
  type?: string;
}

interface HubModalProps {
  title: string;
  fields: ModalField[];
  values: Record<string, any>;
  onClose: () => void;
  onSave: (values: Record<string, any>) => void;
  saving?: boolean;
}

export function HubModal({ title, fields, values: initialValues, onClose, onSave, saving }: HubModalProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-gray-900 font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {fields.map(field => (
            <div key={field.key}>
              <label className="block text-gray-700 text-sm font-semibold mb-2">{field.label}</label>
              <input
                type={field.type ?? 'text'}
                value={values[field.key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004ef9] transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-6 pt-0 mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(values)}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white font-medium hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ message, onConfirm, onCancel, loading }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white border border-gray-200 rounded-3xl w-full max-w-sm shadow-2xl p-8 text-center">
        <p className="text-gray-900 font-medium text-base mb-8">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 hover:shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
