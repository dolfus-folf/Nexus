import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { EntradaDiario } from "../types/campaign";
import {
  BookOpen,
  PlusCircle,
  Clock,
  MapPin,
  User,
  Feather,
  Sparkles,
  Calendar,
  Search,
} from "lucide-react";

export const DiarioView: React.FC = () => {
  const { estado, lugares, anadirEntradaDiario } = useCampaign();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New entry form state
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [nuevoAutor, setNuevoAutor] = useState("Eldrin Sombraluz");
  const [nuevoLugar, setNuevoLugar] = useState(
    lugares.find((l) => l.id === estado.lugar_actual_id)?.nombre || "Sendero de Triboar"
  );
  const [nuevoDia, setNuevoDia] = useState(estado.tiempo_juego.dia);
  const [nuevaHora, setNuevaHora] = useState(
    `${estado.tiempo_juego.hora.toString().padStart(2, "0")}:00`
  );

  const entries: EntradaDiario[] = estado.diario || [];

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.titulo.toLowerCase().includes(term) ||
      e.texto.toLowerCase().includes(term) ||
      e.lugar.toLowerCase().includes(term) ||
      e.autor.toLowerCase().includes(term)
    );
  });

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoTexto.trim()) return;

    anadirEntradaDiario({
      dia: nuevoDia,
      hora: nuevaHora,
      lugar: nuevoLugar,
      titulo: nuevoTitulo.trim(),
      texto: nuevoTexto.trim(),
      autor: nuevoAutor,
    });

    setNuevoTitulo("");
    setNuevoTexto("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25211c] pb-4">
        <div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            Crónicas y Diario de la Compañía ({entries.length})
          </h2>
          <p className="text-xs text-[#9d978a] mt-0.5">
            Registro cronológico de los sucesos y descubrimientos del grupo
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d786d]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en el diario..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#141620] border border-[#28251f] text-xs text-[#e2dfd2] placeholder-[#6b665c] focus:outline-none focus:border-[#d4af37] w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#282114] hover:bg-[#382e1b] border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-semibold text-xs transition flex items-center gap-2 shadow-md flex-shrink-0"
          >
            <Feather className="w-4 h-4 text-[#d4af37]" />
            <span>Nueva Entrada</span>
          </button>
        </div>
      </div>

      {/* Entries Timeline */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredEntries.map((entry, idx) => (
          <div
            key={entry.id || idx}
            className="border border-[#2b2721] bg-[#14151c] rounded-xl p-5 sm:p-6 shadow-xl space-y-3 relative overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#221f1a] pb-3">
              <h3 className="font-['Cinzel'] font-bold text-lg text-[#f5ebd9]">
                {entry.titulo}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8e887d]">
                <span className="flex items-center gap-1 font-semibold text-[#fcd34d] bg-[#221e14] px-2 py-0.5 rounded border border-[#3e341f]">
                  <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Día {entry.dia}</span>
                </span>
                <span className="flex items-center gap-1 bg-[#181a24] px-2 py-0.5 rounded border border-[#252838]">
                  <Clock className="w-3.5 h-3.5 text-[#93c5fd]" />
                  <span>{entry.hora}</span>
                </span>
              </div>
            </div>

            {/* Narrative text */}
            <p className="text-sm sm:text-base text-[#cfc9be] leading-relaxed font-serif italic whitespace-pre-line py-1">
              "{entry.texto}"
            </p>

            {/* Footer with location & author */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#221f1a] text-xs text-[#8e887d]">
              <span className="flex items-center gap-1 text-[#e5c07b]">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="text-[#e2dfd2]">{entry.lugar}</span>
              </span>

              <span className="flex items-center gap-1.5 font-['Cinzel'] text-[#a8a397]">
                <Feather className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Registrado por: <strong>{entry.autor}</strong></span>
              </span>
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="p-12 text-center border border-[#25211c] rounded-xl bg-[#14151c] text-[#8e887d]">
            No hay entradas de diario que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* Modal: New Journal Entry */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#14151c] border border-[#d4af37]/40 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#25211c] pb-3">
              <h3 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd9] flex items-center gap-2">
                <Feather className="w-5 h-5 text-[#d4af37]" />
                Escribir en la Bitácora
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8e887d] hover:text-white transition text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9d978a] font-['Cinzel'] uppercase font-bold tracking-wider mb-1">
                  Título del suceso
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Emboscada en el recodo del sendero"
                  value={nuevoTitulo}
                  onChange={(e) => setNuevoTitulo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[#8e887d] mb-1">Día</label>
                  <input
                    type="number"
                    min="1"
                    value={nuevoDia}
                    onChange={(e) => setNuevoDia(parseInt(e.target.value) || 1)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9]"
                  />
                </div>
                <div>
                  <label className="block text-[#8e887d] mb-1">Hora</label>
                  <input
                    type="text"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[#8e887d] mb-1">Autor del registro</label>
                  <select
                    value={nuevoAutor}
                    onChange={(e) => setNuevoAutor(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9]"
                  >
                    {estado.party.map((p) => (
                      <option key={p.pj_id} value={p.nombre}>
                        {p.nombre} ({p.clase})
                      </option>
                    ))}
                    <option value="Dungeon Master">Dungeon Master</option>
                    <option value="Crónica General">Crónica General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8e887d] mb-1">Lugar</label>
                <input
                  type="text"
                  value={nuevoLugar}
                  onChange={(e) => setNuevoLugar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[#9d978a] font-['Cinzel'] uppercase font-bold tracking-wider mb-1">
                  Crónica / Narrativa
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Relata lo acontecido, decisiones tomadas, enemigos derrotados o pistas encontradas..."
                  value={nuevoTexto}
                  onChange={(e) => setNuevoTexto(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1c26] border border-[#2d2922] text-[#f5ebd9] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#25211c]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#2d2922] text-[#8e887d] hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#282114] border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-bold hover:bg-[#362b19] transition"
                >
                  Guardar en el Diario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
