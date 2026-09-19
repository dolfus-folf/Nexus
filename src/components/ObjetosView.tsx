import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Objeto } from "../types/campaign";
import {
  Package,
  Coins,
  Shield,
  Sparkles,
  Weight,
  User,
  FlaskConical,
  Gem,
  Backpack,
} from "lucide-react";

export const ObjetosView: React.FC = () => {
  const { objetos, estado, dmMode } = useCampaign();

  const [filter, setFilter] = useState<"todos" | "party" | "mundo">("todos");

  // Get all item IDs currently carried by party members
  const partyItemsMap = new Map<string, string>();
  estado.party.forEach((pj) => {
    pj.inventario?.forEach((itemId) => {
      partyItemsMap.set(itemId, pj.nombre);
    });
  });

  const getRarityBadge = (rareza: string) => {
    switch (rareza) {
      case "poco_comun":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-700/50";
      case "rara":
        return "bg-blue-950/80 text-blue-300 border-blue-700/50";
      case "muy_rara":
        return "bg-purple-950/80 text-purple-300 border-purple-700/50";
      case "legendaria":
        return "bg-amber-950/80 text-amber-300 border-amber-700/50";
      default:
        return "bg-stone-900 text-stone-300 border-stone-700/50";
    }
  };

  const getItemIcon = (tipo: string) => {
    switch (tipo) {
      case "pocion":
        return <FlaskConical className="w-4 h-4 text-[#ef4444]" />;
      case "tesoro":
        return <Gem className="w-4 h-4 text-[#d4af37]" />;
      case "equipo":
        return <Backpack className="w-4 h-4 text-[#60a5fa]" />;
      default:
        return <Package className="w-4 h-4 text-[#a8a397]" />;
    }
  };

  const filteredObjetos = objetos.filter((obj) => {
    const isCarried = partyItemsMap.has(obj.id);
    if (filter === "party") return isCarried;
    if (filter === "mundo") return !isCarried;
    return true;
  });

  // Calculate total carried gold value
  const totalValueCarried = objetos
    .filter((o) => partyItemsMap.has(o.id))
    .reduce((acc, curr) => acc + (curr.valor_po || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#25211c] pb-4">
        <div>
          <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#d4af37]" />
            Inventario del Grupo y Objetos de Campaña
          </h2>
          <p className="text-xs text-[#9d978a] mt-0.5">
            Registro de tesoros, consumibles y equipamiento recuperado
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Quick value counter */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#181a24] border border-[#2c2822] text-xs">
            <Coins className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#bfb8a9]">
              Valor del grupo: <strong className="text-[#fcd34d]">{totalValueCarried} po</strong>
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#141620] border border-[#26231d] p-1 rounded-lg">
            {(["todos", "party", "mundo"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition ${
                  filter === tab
                    ? "bg-[#282114] border border-[#d4af37]/40 text-[#edd88b]"
                    : "text-[#8e887d] hover:text-[#d6d0c4] border border-transparent"
                }`}
              >
                {tab === "party" ? "En el Grupo" : tab === "mundo" ? "Encontrados" : "Todos"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredObjetos.map((item) => {
          const carriedBy = partyItemsMap.get(item.id);

          return (
            <div
              key={item.id}
              className={`border rounded-xl p-5 shadow-xl space-y-3 flex flex-col justify-between ${
                carriedBy
                  ? "bg-[#141822] border-[#293652]"
                  : "bg-[#14151c] border-[#26231d]"
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getItemIcon(item.tipo)}
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border capitalize ${getRarityBadge(
                        item.rareza
                      )}`}
                    >
                      {item.rareza.replace("_", " ")}
                    </span>
                  </div>

                  {item.valor_po !== null && (
                    <span className="flex items-center gap-1 text-xs font-mono font-bold text-[#fcd34d]">
                      <Coins className="w-3 h-3 text-[#d4af37]" />
                      <span>{item.valor_po} po</span>
                    </span>
                  )}
                </div>

                <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9]">
                  {item.nombre}
                </h3>

                <p className="text-xs sm:text-sm text-[#bfb8a9] leading-relaxed font-serif">
                  "{item.descripcion_jugadores}"
                </p>

                {item.efecto_mecanico && (
                  <div className="p-2.5 rounded-lg bg-[#1a1b26] border border-[#303348] text-xs text-[#93c5fd] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Efecto:</strong> {item.efecto_mecanico}
                    </span>
                  </div>
                )}
              </div>

              {/* Carrier info & Weight */}
              <div className="pt-3 border-t border-[#23201a] flex items-center justify-between text-xs text-[#8e887d]">
                {carriedBy ? (
                  <span className="flex items-center gap-1.5 text-[#60a5fa] font-medium">
                    <User className="w-3.5 h-3.5" />
                    <span>Llevado por: {carriedBy}</span>
                  </span>
                ) : (
                  <span className="italic text-[#756f63]">Objeto del mundo / Botín</span>
                )}

                {item.peso && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Weight className="w-3 h-3" />
                    <span>{item.peso} lb</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
