import { useState } from 'react';
import { Plus, Edit2, Lock, Unlock, Clock, DollarSign, Save } from 'lucide-react';

export function Disponibilidade() {
  const [selectedDay, setSelectedDay] = useState('Segunda');
  const [selectedCourt, setSelectedCourt] = useState('Quadra 1');
  const [showModal, setShowModal] = useState(false);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const courts = ['Quadra 1', 'Quadra 2', 'Quadra 3', 'Quadra 4'];
  const hours = Array.from({ length: 15 }, (_, i) => i + 6); // 6h às 20h

  const scheduleData: Record<string, Record<string, { available: boolean; price: number; sport: string }>> = {
    'Quadra 1': {
      '8': { available: true, price: 150, sport: 'Beach Tennis' },
      '9': { available: true, price: 150, sport: 'Beach Tennis' },
      '10': { available: true, price: 150, sport: 'Beach Tennis' },
      '14': { available: false, price: 150, sport: 'Beach Tennis' },
      '15': { available: true, price: 180, sport: 'Beach Tennis' },
      '16': { available: true, price: 180, sport: 'Beach Tennis' },
      '18': { available: true, price: 200, sport: 'Beach Tennis' },
      '19': { available: true, price: 200, sport: 'Beach Tennis' },
    },
    'Quadra 2': {
      '7': { available: true, price: 120, sport: 'Vôlei' },
      '8': { available: true, price: 120, sport: 'Vôlei' },
      '9': { available: false, price: 120, sport: 'Vôlei' },
      '10': { available: true, price: 120, sport: 'Vôlei' },
      '16': { available: true, price: 150, sport: 'Vôlei' },
      '17': { available: true, price: 150, sport: 'Vôlei' },
      '18': { available: true, price: 180, sport: 'Vôlei' },
    },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-2">
              Disponibilidade das Quadras
            </h1>
            <p className="text-gray-600">Gerencie horários, preços e disponibilidade</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white hover:shadow-xl transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Adicionar Horário
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Day Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-[#000273] mb-4">Dia da Semana</h3>
          <div className="grid grid-cols-4 gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedDay === day
                    ? 'bg-gradient-to-r from-[#004ef9] to-[#0066ff] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Court Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-[#000273] mb-4">Quadra</h3>
          <div className="grid grid-cols-2 gap-2">
            {courts.map((court) => (
              <button
                key={court}
                onClick={() => setSelectedCourt(court)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCourt === court
                    ? 'bg-gradient-to-r from-[#ff4b00] to-[#ff6b00] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {court}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-[#000273]">
            Grade Horária - {selectedCourt} ({selectedDay})
          </h3>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all">
            <Save className="w-4 h-4" />
            Publicar Disponibilidade
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-3 mb-4 font-semibold text-sm text-gray-600">
              <div>Horário</div>
              <div>Status</div>
              <div>Esporte</div>
              <div>Duração</div>
              <div>Preço Base</div>
              <div>Intervalo</div>
              <div className="col-span-2">Ações</div>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {hours.map((hour) => {
                const slot = scheduleData[selectedCourt]?.[hour.toString()];
                const isAvailable = slot?.available ?? false;
                
                return (
                  <div
                    key={hour}
                    className={`grid grid-cols-8 gap-3 p-4 rounded-xl border-2 transition-all ${
                      isAvailable
                        ? 'bg-green-50 border-green-200 hover:shadow-lg'
                        : slot
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    {/* Horário */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-[#000273]">
                        {hour}:00
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm">
                          <Unlock className="w-3 h-3" />
                          Disponível
                        </span>
                      ) : slot ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-200 text-gray-700 text-sm">
                          <Lock className="w-3 h-3" />
                          Bloqueado
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">Não config.</span>
                      )}
                    </div>

                    {/* Esporte */}
                    <div className="flex items-center text-sm text-gray-700">
                      {slot?.sport || '-'}
                    </div>

                    {/* Duração */}
                    <div className="flex items-center text-sm text-gray-700">
                      1h
                    </div>

                    {/* Preço */}
                    <div className="flex items-center gap-1 text-sm">
                      {slot?.price ? (
                        <>
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-[#000273]">
                            R$ {slot.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>

                    {/* Intervalo */}
                    <div className="flex items-center text-sm text-gray-700">
                      10min
                    </div>

                    {/* Ações */}
                    <div className="col-span-2 flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all text-sm">
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-all text-sm">
                        {isAvailable ? (
                          <>
                            <Lock className="w-3 h-3" />
                            Bloquear
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3" />
                            Liberar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-600 mb-1">Horários Disponíveis</p>
            <p className="text-2xl font-semibold text-blue-700">8</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Horários Bloqueados</p>
            <p className="text-2xl font-semibold text-gray-700">2</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-600 mb-1">Receita Potencial (Dia)</p>
            <p className="text-2xl font-semibold text-green-700">R$ 1.420</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="font-semibold text-[#000273] mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#004ef9]" />
          Como Funciona
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-[#004ef9] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
            <span>Configure os horários disponíveis para cada quadra e dia da semana</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-[#004ef9] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
            <span>Defina esporte, duração, preço e intervalo entre reservas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-[#004ef9] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
            <span>Publique a disponibilidade para sincronizar automaticamente com o portal dos atletas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-[#004ef9] text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</span>
            <span>Bloqueie horários temporariamente para manutenção ou eventos especiais</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
