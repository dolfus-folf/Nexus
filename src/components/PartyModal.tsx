import React from "react";
import { useCampaign } from "../context/CampaignContext";
import {
  Users,
  Shield,
  Heart,
  Sparkles,
  Award,
  Flag,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Lock,
} from "lucide-react";

interface PartyModalProps {
  onClose: () => void;
}

export const PartyModal: React.FC<PartyModalProps> = ({ onClose }) => {
  const {
    estado,
    dmMode,
    modificarPgPj,
    modificarInspiracionPj,
    toggleFlag,
    modificarReputacion,
    facciones,
  } = useCampaign();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12131a] border border-[#d4af37]/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#25211c] pb-3">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9]">
              Hoja de Grupo & Estado de la Partida
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e887d] hover:text-white transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {estado.party.map((pj) => {
            const hpPercent = Math.round((pj.pg / pj.pg_max) * 100);
            const hpColor =
              hpPercent > 50 ? "text-emerald-400" : hpPercent > 25 ? "text-amber-400" : "text-red-500";

            return (
              <div
                key={pj.pj_id}
                className="border border-[#2a2721] bg-[#171922] rounded-xl p-4 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9]">
                      {pj.nombre}
                    </h3>
                    <p className="text-xs text-[#a8a397]">
                      {pj.clase} • Nivel {pj.nivel}
                    </p>
                  </div>

                  <button
                    onClick={() => modificarInspiracionPj(pj.pj_id)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border transition flex items-center gap-1 ${
                      pj.inspiracion
                        ? "bg-[#2d2212] border-[#d4af37] text-[#edd88b] shadow-sm shadow-[#d4af37]/30"
                        : "bg-[#14151c] border-[#292520] text-[#6b6559]"
                    }`}
                    title="Alternar Inspiración heroica"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Inspiración</span>
                  </button>
                </div>

                {/* HP & AC Bar */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[#8e887d]">
                      <Heart className="w-3.5 h-3.5 text-[#ef4444]" />
                      <span>Puntos de Golpe:</span>
                    </span>
                    <span className={`font-mono font-bold ${hpColor}`}>
                      {pj.pg} / {pj.pg_max} PG
                    </span>
                  </div>

                  <div className="w-full bg-[#0d0e13] rounded-full h-2 overflow-hidden border border-[#23201a]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hpPercent > 50
                          ? "bg-emerald-500"
                          : hpPercent > 25
                          ? "bg-amber-500"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>

                  {/* HP modifiers */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => modificarPgPj(pj.pj_id, -1)}
                        className="px-1.5 py-0.5 rounded bg-[#201518] hover:bg-[#301b20] border border-[#481e22] text-[#fca5a5]"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => modificarPgPj(pj.pj_id, -5)}
                        className="px-1.5 py-0.5 rounded bg-[#201518] hover:bg-[#301b20] border border-[#481e22] text-[#fca5a5]"
                      >
                        -5
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[#60a5fa] bg-[#141824] px-2 py-0.5 rounded border border-[#21293d]">
                      <Shield className="w-3 h-3" />
                      <span>CA {pj.ca}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => modificarPgPj(pj.pj_id, +1)}
                        className="px-1.5 py-0.5 rounded bg-[#131f18] hover:bg-[#1a2d23] border border-[#1f4830] text-[#86efac]"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => modificarPgPj(pj.pj_id, +5)}
                        className="px-1.5 py-0.5 rounded bg-[#131f18] hover:bg-[#1a2d23] border border-[#1f4830] text-[#86efac]"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inventory badges */}
                <div className="pt-2 border-t border-[#23201a] text-[11px] text-[#8e887d]">
                  <span className="font-semibold text-[#a8a397] block mb-1">
                    Equipamiento portado:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pj.inventario && pj.inventario.length > 0 ? (
                      pj.inventario.map((itemId, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-[#12131a] border border-[#24211b] text-[#cfc9be] text-[10px]"
                        >
                          {itemId.replace("item_", "").replace(/_/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="italic text-[10px]">Sin objetos especiales</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Factions Reputation Section */}
        <div className="space-y-2 border-t border-[#25211c] pt-4">
          <h3 className="font-['Cinzel'] text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-[#d4af37]" />
            Reputación con las Facciones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {facciones.map((fac) => {
              const rep = estado.facciones_reputacion[fac.id] || 0;
              return (
                <div
                  key={fac.id}
                  className="p-3 rounded-lg bg-[#161720] border border-[#25221c] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#e2dfd2] truncate">
                      {fac.nombre}
                    </span>
                    <span className="font-mono font-bold text-[#fcd34d]">
                      {rep > 0 ? `+${rep}` : rep}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#221f1a]">
                    <span className="text-[10px] text-[#7d786d]">Rango: -10 a 10</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => modificarReputacion(fac.id, -1)}
                        className="w-5 h-5 rounded bg-[#1f1a18] border border-[#372b22] text-[#d4af37] flex items-center justify-center hover:bg-[#2b221d]"
                      >
                        -
                      </button>
                      <button
                        onClick={() => modificarReputacion(fac.id, +1)}
                        className="w-5 h-5 rounded bg-[#1f1a18] border border-[#372b22] text-[#d4af37] flex items-center justify-center hover:bg-[#2b221d]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Flags Section */}
        <div className="space-y-2 border-t border-[#25211c] pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Cinzel'] text-xs font-bold text-[#f5ebd9] uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#d4af37]" />
              Eventos y Banderas Globales ({Object.keys(estado.flags_globales).length})
            </h3>
            {!dmMode && (
              <span className="text-[10px] text-[#7d786d] flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Solo modificable en Modo DM
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(estado.flags_globales).map(([key, val]) => (
              <div
                key={key}
                onClick={() => dmMode && toggleFlag(key)}
                className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition ${
                  dmMode ? "cursor-pointer hover:border-[#d4af37]" : "cursor-default"
                } ${
                  val
                    ? "bg-[#121a15] border-[#1f4830] text-[#86efac]"
                    : "bg-[#161720] border-[#25221c] text-[#7d786d]"
                }`}
              >
                <span className="font-mono text-[11px] truncate">
                  {key.replace("flag_", "").replace(/_/g, " ")}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded font-mono text-[10px] uppercase font-bold border ${
                    val
                      ? "bg-[#14281c] border-[#2b5d3c] text-emerald-300"
                      : "bg-[#12131a] border-[#222533] text-[#6b6559]"
                  }`}
                >
                  {val ? "Verdadero" : "Falso"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
