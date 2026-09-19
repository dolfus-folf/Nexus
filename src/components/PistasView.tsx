import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Pista } from "../types/campaign";
import {
  Compass,
  Search,
  Users,
  MapPin,
  ArrowRight,
  Eye,
  Lock,
  Sparkles,
  Tag,
  Key,
} from "lucide-react";

export const PistasView: React.FC = () => {
  const {
    pistas,
    npcs,
    lugares,
    estado,
    dmMode,
    isPistaVisible,
    revelarPista,
  } = useCampaign();

  const [filterType, setFilterType] = useState<string>("todas");

  const visiblePistas = pistas.filter((p) => isPistaVisible(p.id));
  const hiddenPistas = pistas.filter((p) => !isPistaVisible(p.id));

  const filteredPistas = visiblePistas.filter((p) => {
    if (filterType === "todas") return true;
    return p.tipo === filterType;
  });

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "ubicacion":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-700/50";
      case "objeto":
        return "bg-amber-950/80 text-amber-300 border-amber-700/50";
      case "identidad":
        return "bg-purple-950/80 text-purple-300 border-purple-700/50";
      case "evento":
        return "bg-blue-950/80 text-blue-300 border-blue-700/50";
      case "rumor":
        return "bg-stone-900 text-stone-300 border-stone-700/50";
      default:
        return "bg-stone-900 text-stone-300 border-stone-700/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Type Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25211c] pb-4">
        <div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#d4af37]" />
            Pistas y Secretos Revelados ({visiblePistas.length})
          </h2>
          <p className="text-xs text-[#9d978a] mt-0.5">
            Hallazgos, testimonios de prisioneros y rastros descubiertos durante la aventura
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#141620] border border-[#26231d] p-1 rounded-lg self-start sm:self-auto overflow-x-auto">
          {["todas", "ubicacion", "identidad", "objeto", "rumor"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition whitespace-nowrap ${
                filterType === t
                  ? "bg-[#282114] border border-[#d4af37]/40 text-[#edd88b]"
                  : "text-[#8e887d] hover:text-[#d6d0c4] border border-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Clues Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPistas.map((pista) => {
          const fuentes = npcs.filter((n) => pista.fuente_ids.includes(n.id));
          const destinos = lugares.filter((l) => pista.conduce_a.includes(l.id));

          return (
            <div
              key={pista.id}
              className="border border-[#2c2823] bg-[#14151c] rounded-xl p-5 shadow-xl space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border capitalize ${getBadgeColor(
                        pista.tipo
                      )}`}
                    >
                      {pista.tipo}
                    </span>
                  </div>
                  <Key className="w-4 h-4 text-[#d4af37]" />
                </div>

                <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9]">
                  {pista.nombre}
                </h3>

                <p className="text-xs sm:text-sm text-[#cfc9be] leading-relaxed font-serif">
                  "{pista.contenido}"
                </p>
              </div>

              {/* Sources & Destinations */}
              <div className="pt-3 border-t border-[#23201a] space-y-2 text-xs">
                {fuentes.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[#9d978a]">
                    <Users className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                    <span>
                      Fuente:{" "}
                      <strong className="text-[#e2dfd2]">
                        {fuentes.map((f) => f.nombre).join(", ")}
                      </strong>
                    </span>
                  </div>
                )}

                {destinos.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[#9d978a]">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
                    <span>
                      Apunta hacia:{" "}
                      <strong className="text-[#edd88b]">
                        {destinos.map((d) => d.nombre).join(", ")}
                      </strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPistas.length === 0 && (
        <div className="p-12 text-center border border-[#25211c] rounded-xl bg-[#14151c] text-[#8e887d]">
          No hay pistas reveladas para este filtro todavía.
        </div>
      )}

      {/* DM Mode: Hidden Clues Section */}
      {dmMode && hiddenPistas.length > 0 && (
        <div className="mt-8 pt-6 border-t border-[#35191c] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-['Cinzel'] font-bold text-sm text-[#f87171] uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Pistas Aún Ocultas por la Niebla de Guerra ({hiddenPistas.length})
            </h3>
            <span className="text-xs text-[#9d978a]">Visible sólo para el Dungeon Master</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hiddenPistas.map((pista) => (
              <div
                key={pista.id}
                className="p-4 rounded-xl border border-[#481e23] bg-[#1a0e10] text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-['Cinzel'] font-bold text-[#fca5a5]">
                      {pista.nombre}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#351115] text-[#fca5a5]">
                      {pista.tipo}
                    </span>
                  </div>
                  <p className="text-[#fbcfe8] mt-1 italic">
                    "{pista.contenido}"
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#3f191d]">
                  <span className="text-[11px] text-[#b07d83]">
                    Fuentes: {pista.fuente_ids.join(", ")}
                  </span>
                  <button
                    onClick={() => revelarPista(pista.id)}
                    className="px-2.5 py-1 rounded bg-[#8b1e23] hover:bg-[#a32228] text-white font-medium flex items-center gap-1 text-[11px] transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Revelar Pista</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
