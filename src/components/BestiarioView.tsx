import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import type { Monstruo, Condicion } from "../types/campaign";
import {
  Skull,
  Shield,
  Heart,
  Zap,
  Book,
  Dices,
  Eye,
  Crosshair,
  Info,
  Sparkles,
} from "lucide-react";

export const BestiarioView: React.FC = () => {
  const { bestiario, condiciones, tablasAleatorias, dmMode } = useCampaign();

  const [activeSubTab, setActiveSubTab] = useState<"monstruos" | "condiciones" | "tablas">("monstruos");
  const [selectedMonstruoId, setSelectedMonstruoId] = useState<string>(bestiario[0]?.id || "");
  const [diceRollResult, setDiceRollResult] = useState<{ roll: number; text: string } | null>(null);

  const selectedMonstruo = bestiario.find((m) => m.id === selectedMonstruoId) || bestiario[0];

  const rollD20 = () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    let resultText = "Sin encuentro (1-16)";
    if (roll >= 17) {
      const sub = Math.floor(Math.random() * 12) + 1;
      resultText = `¡Encuentro en el camino! (d20=${roll}, d12=${sub})`;
    }
    setDiceRollResult({ roll, text: resultText });
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-[#25211c] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("monstruos")}
            className={`px-4 py-1.5 rounded-lg text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition ${
              activeSubTab === "monstruos"
                ? "bg-[#282114] border border-[#d4af37] text-[#edd88b]"
                : "bg-[#141620] border border-[#26231d] text-[#8e887d] hover:text-white"
            }`}
          >
            Bestiario ({bestiario.length})
          </button>
          <button
            onClick={() => setActiveSubTab("condiciones")}
            className={`px-4 py-1.5 rounded-lg text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition ${
              activeSubTab === "condiciones"
                ? "bg-[#282114] border border-[#d4af37] text-[#edd88b]"
                : "bg-[#141620] border border-[#26231d] text-[#8e887d] hover:text-white"
            }`}
          >
            Condiciones D&D 2024 ({condiciones.length})
          </button>
          <button
            onClick={() => setActiveSubTab("tablas")}
            className={`px-4 py-1.5 rounded-lg text-xs font-['Cinzel'] uppercase tracking-wider font-semibold transition ${
              activeSubTab === "tablas"
                ? "bg-[#282114] border border-[#d4af37] text-[#edd88b]"
                : "bg-[#141620] border border-[#26231d] text-[#8e887d] hover:text-white"
            }`}
          >
            Tablas Aleatorias ({tablasAleatorias.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: Bestiario */}
      {activeSubTab === "monstruos" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Monster List */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="font-['Cinzel'] text-xs font-bold text-[#d4af37] uppercase tracking-wider px-1">
              Criaturas y Enemigos
            </h3>
            <div className="space-y-1.5">
              {bestiario.map((mon) => {
                const isSelected = selectedMonstruo?.id === mon.id;
                return (
                  <button
                    key={mon.id}
                    onClick={() => setSelectedMonstruoId(mon.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#1f202b] border-[#d4af37] text-[#f5ebd9]"
                        : "bg-[#14151c] border-[#25221d] hover:bg-[#1a1b24] text-[#a8a397]"
                    }`}
                  >
                    <div>
                      <p className="font-['Cinzel'] font-bold text-sm">{mon.nombre}</p>
                      <p className="text-[11px] text-[#7d786d] capitalize">
                        {mon.tamano} • {mon.tipo}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#0d0e13] border border-[#221f1b] text-[#d4af37]">
                      VD {mon.desafio}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monster Statblock Sheet */}
          <div className="lg:col-span-8">
            {selectedMonstruo ? (
              <div className="border border-[#3e341f] bg-[#14151e] rounded-xl p-5 sm:p-6 shadow-2xl space-y-4">
                {/* Header */}
                <div className="border-b border-[#352c1b] pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-['Cinzel'] text-2xl font-bold text-[#f5ebd9]">
                      {selectedMonstruo.nombre}
                    </h2>
                    <span className="px-2.5 py-1 rounded bg-[#251e14] border border-[#d4af37]/40 font-mono text-xs font-bold text-[#fcd34d]">
                      Valor de Desafío {selectedMonstruo.desafio} ({selectedMonstruo.xp} XP)
                    </span>
                  </div>
                  <p className="text-xs text-[#a8a397] capitalize italic">
                    {selectedMonstruo.tamano} {selectedMonstruo.tipo}, {selectedMonstruo.alineamiento}
                  </p>
                </div>

                {/* Armor Class, HP, Speed */}
                <div className="space-y-1 text-xs text-[#cfc9be]">
                  <p>
                    <strong className="text-[#d4af37]">Clase de Armadura:</strong> {selectedMonstruo.clase_armadura}{" "}
                    {selectedMonstruo.clase_armadura_nota ? `(${selectedMonstruo.clase_armadura_nota})` : ""}
                  </p>
                  <p>
                    <strong className="text-[#d4af37]">Puntos de Golpe:</strong> {selectedMonstruo.puntos_golpe}{" "}
                    ({selectedMonstruo.puntos_golpe_dados})
                  </p>
                  <p>
                    <strong className="text-[#d4af37]">Velocidad:</strong> {selectedMonstruo.velocidad.caminar} pies
                    {selectedMonstruo.velocidad.escalar ? `, escalar ${selectedMonstruo.velocidad.escalar} pies` : ""}
                  </p>
                </div>

                {/* Characteristics Table */}
                <div className="p-3 rounded-lg bg-[#0e0f14] border border-[#2b2721] grid grid-cols-6 gap-2 text-center text-xs">
                  {Object.entries(selectedMonstruo.caracteristicas).map(([stat, val]) => {
                    const mod = selectedMonstruo.modificadores[stat as keyof typeof selectedMonstruo.modificadores];
                    return (
                      <div key={stat} className="p-1 rounded bg-[#181a24]">
                        <span className="text-[10px] uppercase font-bold text-[#8e887d] block">
                          {stat}
                        </span>
                        <span className="font-bold text-[#f5ebd9] block mt-0.5">{val}</span>
                        <span className="text-[10px] text-[#edd88b] font-mono">
                          {mod >= 0 ? `+${mod}` : mod}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Senses and Languages */}
                <div className="space-y-1 text-xs text-[#a8a397] border-b border-[#25211c] pb-3">
                  <p>
                    <strong className="text-[#cfc9be]">Sentidos:</strong>{" "}
                    {selectedMonstruo.sentidos.vision_oscuridad
                      ? `Visión en la oscuridad ${selectedMonstruo.sentidos.vision_oscuridad} pies, `
                      : ""}
                    Percepción pasiva {selectedMonstruo.sentidos.percepcion_pasiva}
                  </p>
                  <p>
                    <strong className="text-[#cfc9be]">Idiomas:</strong>{" "}
                    {selectedMonstruo.idiomas.join(", ") || "Ninguno"}
                  </p>
                </div>

                {/* Traits */}
                {selectedMonstruo.rasgos && selectedMonstruo.rasgos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-['Cinzel'] text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      Rasgos Especiales
                    </h4>
                    {selectedMonstruo.rasgos.map((rasgo, idx) => (
                      <div key={idx} className="text-xs text-[#cfc9be] leading-relaxed">
                        <strong className="text-[#f5ebd9] font-serif">{rasgo.nombre}.</strong>{" "}
                        {rasgo.descripcion}
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {selectedMonstruo.acciones && selectedMonstruo.acciones.length > 0 && (
                  <div className="space-y-2 border-t border-[#25211c] pt-3">
                    <h4 className="font-['Cinzel'] text-xs font-bold text-[#ef4444] uppercase tracking-wider">
                      Acciones
                    </h4>
                    {selectedMonstruo.acciones.map((acc, idx) => (
                      <div key={idx} className="text-xs text-[#cfc9be] leading-relaxed">
                        <strong className="text-[#fca5a5] font-serif">{acc.nombre}.</strong>{" "}
                        {acc.bonus !== null && (
                          <span className="text-[#86efac] font-mono mr-1">
                            +{acc.bonus} al ataque,
                          </span>
                        )}
                        {acc.alcance && <span className="mr-1">alcance {acc.alcance},</span>}
                        {acc.dano && (
                          <span className="text-[#fcd34d] font-mono mr-1">
                            impacto: {acc.dano}.
                          </span>
                        )}
                        {acc.notas && <span>{acc.notas}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Subtab 2: Condiciones D&D 2024 */}
      {activeSubTab === "condiciones" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {condiciones.map((cond) => (
            <div
              key={cond.id}
              className="border border-[#2c2823] bg-[#14151c] rounded-xl p-5 shadow-xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-['Cinzel'] font-bold text-base text-[#edd88b]">
                  {cond.nombre}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#241e15] text-[#d4af37] border border-[#3e341f]">
                  D&D 2024
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#bfb8a9] leading-relaxed">
                {cond.descripcion}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Tablas Aleatorias */}
      {activeSubTab === "tablas" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#171924] border border-[#2d2922] p-4 rounded-xl">
            <div>
              <h3 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9] flex items-center gap-2">
                <Dices className="w-5 h-5 text-[#d4af37]" />
                Tirador de Encuentros del Sendero de Triboar
              </h3>
              <p className="text-xs text-[#8e887d] mt-0.5">
                Regla oficial: 1d20 por día y noche. Un 17-20 desencadena encuentro de viaje.
              </p>
            </div>
            <button
              onClick={rollD20}
              className="px-4 py-2 rounded-lg bg-[#282114] hover:bg-[#382e1b] border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-bold text-xs transition flex items-center gap-2 shadow-lg"
            >
              <Dices className="w-4 h-4 text-[#d4af37]" />
              <span>Tirar 1d20</span>
            </button>
          </div>

          {diceRollResult && (
            <div className="p-4 rounded-xl bg-[#1b1c28] border border-[#3a3748] text-sm text-[#f5ebd9] flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#101116] font-bold font-mono text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                {diceRollResult.roll}
              </span>
              <div>
                <p className="font-semibold text-[#edd88b]">Resultado de la tirada:</p>
                <p className="text-xs text-[#cfc9be]">{diceRollResult.text}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tablasAleatorias.map((tab) => (
              <div
                key={tab.id}
                className="border border-[#2c2823] bg-[#14151c] rounded-xl p-5 shadow-xl space-y-3"
              >
                <h4 className="font-['Cinzel'] font-bold text-base text-[#f5ebd9]">
                  {tab.nombre} ({tab.dado})
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#292620] text-[#8e887d] font-['Cinzel'] uppercase text-[10px]">
                        <th className="py-2 px-3">Rango ({tab.dado})</th>
                        <th className="py-2 px-3">Resultado</th>
                        <th className="py-2 px-3">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#201d19]">
                      {tab.resultados.map((res, rIdx) => (
                        <tr key={rIdx} className="text-[#cfc9be]">
                          <td className="py-2 px-3 font-mono text-[#d4af37] font-bold">
                            {res.rango[0] === res.rango[1]
                              ? res.rango[0]
                              : `${res.rango[0]}-${res.rango[1]}`}
                          </td>
                          <td className="py-2 px-3">
                            {res.texto || `${res.cantidad}x ${res.monstruo_id}`}
                          </td>
                          <td className="py-2 px-3 text-[#8e887d]">{res.notas || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
