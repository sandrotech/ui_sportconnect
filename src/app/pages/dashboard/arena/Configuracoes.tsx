import { useState, useEffect } from "react";
import { Clock, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../lib/api";

export function Configuracoes() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [horaAbertura, setHoraAbertura] = useState("08:00");
  const [horaFechamento, setHoraFechamento] = useState("22:00");

  useEffect(() => {
    async function fetchConfig() {
      try {
        const data = await api.arena.dashboard();
        if (data.horaAbertura) setHoraAbertura(data.horaAbertura);
        if (data.horaFechamento) setHoraFechamento(data.horaFechamento);
      } catch (e) {
        console.error("Erro ao carregar configurações", e);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  async function handleSave() {
    try {
      setSaving(true);
      await api.arena.updateConfig({ horaAbertura, horaFechamento });
      toast.success("Configurações salvas com sucesso!");
    } catch (e: any) {
      toast.error(e.message || "Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie os horários e informações básicas da sua arena.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Horário de Funcionamento</h3>
              <p className="text-sm text-gray-500">Isso servirá como base para gerar seus horários de disponibilidade no calendário.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Abertura Padrão</label>
              <input
                type="time"
                value={horaAbertura}
                onChange={(e) => setHoraAbertura(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Fechamento Padrão</label>
              <input
                type="time"
                value={horaFechamento}
                onChange={(e) => setHoraFechamento(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Horários
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
