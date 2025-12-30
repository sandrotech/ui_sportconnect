import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Historico() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
      className="px-8 py-8"
    >
      <div className="mb-6">
        <h1 className="font-montserrat italic font-semibold text-3xl text-[#000273] mb-1">Histórico</h1>
        <p className="text-gray-600">Gerencie suas atividades profissionais</p>
      </div>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut', delay: 0.1 }}
          className="bg-white rounded-2xl p-10 shadow-lg ring-1 ring-black/5 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#004ef9] to-[#ff4b00] flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-montserrat italic font-semibold text-2xl text-[#000273] mb-1">
            Módulo Histórico
          </h2>
          <p className="text-gray-600">Interface em desenvolvimento</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
