import React, { useState } from "react";
import { useCampaign } from "../context/CampaignContext";
import {
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  AlertCircle,
  FileJson,
  Sparkles,
} from "lucide-react";

interface ImportExportModalProps {
  mode: "import" | "export";
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  mode,
  onClose,
}) => {
  const { estado, exportarEstado, importarEstado, reiniciarEstado } = useCampaign();

  const [jsonInput, setJsonInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const formattedStateJson = JSON.stringify(estado, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedStateJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      const ok = importarEstado(content);
      if (ok) {
        setImportStatus("success");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setImportStatus("error");
        setErrorMessage("El archivo JSON no coincide con el esquema válido de estado_partida.json.");
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    if (!jsonInput.trim()) return;
    const ok = importarEstado(jsonInput);
    if (ok) {
      setImportStatus("success");
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setImportStatus("error");
      setErrorMessage("Error de formato: Asegúrate de pegar un JSON válido con campaign_id y party.");
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas reiniciar el estado de la partida a los valores iniciales de la campaña? Se borrarán las entradas de diario y el progreso local.")) {
      reiniciarEstado();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#12131a] border border-[#d4af37]/40 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#25211c] pb-3">
          <div className="flex items-center gap-2">
            {mode === "export" ? (
              <Download className="w-5 h-5 text-[#d4af37]" />
            ) : (
              <Upload className="w-5 h-5 text-[#d4af37]" />
            )}
            <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd9]">
              {mode === "export" ? "Exportar Partida Guardada" : "Cargar Partida Guardada"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e887d] hover:text-white transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Mode: Export */}
        {mode === "export" ? (
          <div className="space-y-4 text-xs">
            <p className="text-[#bfb8a9] leading-relaxed">
              Descarga tu archivo <code>estado_partida.json</code> con todas las notas del diario, salud del grupo, lugares descubiertos y niebla de guerra para retomarlo en cualquier dispositivo.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={exportarEstado}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#282114] hover:bg-[#382e1b] border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4 text-[#d4af37]" />
                <span>Descargar estado_partida.json</span>
              </button>

              <button
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-lg border border-[#2d2922] bg-[#171922] hover:bg-[#222533] text-[#cfc9be] transition flex items-center gap-1.5"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copiado" : "Copiar JSON"}</span>
              </button>
            </div>

            <div className="space-y-1 pt-2">
              <span className="text-[11px] font-['Cinzel'] uppercase font-bold text-[#8e887d]">
                Vista previa del JSON:
              </span>
              <pre className="p-3 rounded-lg bg-[#090a0e] border border-[#222533] text-[11px] font-mono text-[#a8b4d8] max-h-52 overflow-y-auto scrollbar-thin">
                {formattedStateJson}
              </pre>
            </div>
          </div>
        ) : (
          /* Mode: Import */
          <div className="space-y-4 text-xs">
            <p className="text-[#bfb8a9] leading-relaxed">
              Sube un archivo <code>estado_partida.json</code> o pega el texto directamente para cargar el avance de la campaña.
            </p>

            {/* File Dropzone / Selector */}
            <div className="border-2 border-dashed border-[#342f27] hover:border-[#d4af37]/60 rounded-xl p-6 text-center bg-[#161722] transition cursor-pointer relative">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileJson className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
              <p className="font-['Cinzel'] font-semibold text-sm text-[#f5ebd9]">
                Arrastra tu archivo JSON aquí
              </p>
              <p className="text-[11px] text-[#7d786d] mt-1">
                o haz clic para explorar en tu equipo
              </p>
            </div>

            {/* Manual Paste Textarea */}
            <div className="space-y-1">
              <label className="text-[11px] font-['Cinzel'] uppercase font-bold text-[#8e887d]">
                O pega el contenido JSON aquí:
              </label>
              <textarea
                rows={4}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{ "partida_id": "save_001", "campaign_id": "camp_phandelver", ... }'
                className="w-full p-2.5 rounded-lg bg-[#090a0e] border border-[#26293a] text-[#f5ebd9] font-mono text-[11px] focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Status alerts */}
            {importStatus === "success" && (
              <div className="p-3 rounded-lg bg-[#112217] border border-[#1f4830] text-[#86efac] flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>¡Estado de partida cargado correctamente! Actualizando bitácora...</span>
              </div>
            )}

            {importStatus === "error" && (
              <div className="p-3 rounded-lg bg-[#241215] border border-[#481e23] text-[#fca5a5] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleReset}
                type="button"
                className="px-3 py-1.5 rounded-lg border border-[#3e1a1e] bg-[#1a0e10] hover:bg-[#2a1317] text-[#f87171] transition flex items-center gap-1.5"
                title="Restablece la partida al estado de inicio de campaña"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Campaña</span>
              </button>

              <button
                onClick={handleManualImport}
                disabled={!jsonInput.trim()}
                className="py-2 px-4 rounded-lg bg-[#282114] hover:bg-[#382e1b] disabled:opacity-50 border border-[#d4af37] text-[#edd88b] font-['Cinzel'] font-bold transition flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Aplicar JSON</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
