import React from 'react';
import { Download, X, Smartphone, CheckCircle, Apple, Monitor } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWA();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 border border-blue-100">
            <img src="/icon.svg" alt="Club MG" className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Instala Gestión Escolar y Acceso Club MG</h3>
          <p className="text-xs text-blue-200 mt-1">
            Experiencia nativa para Android, iOS y computadoras
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-slate-700">
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm">¡Aplicación ya instalada!</p>
                <p className="text-xs text-emerald-700">Ya estás ejecutando Club MG en modo nativo.</p>
              </div>
            </div>
          ) : (
            <>
              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-medium rounded-xl shadow-md transition text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Instalar directamente en este dispositivo
                </button>
              )}

              {/* Multi-platform guide */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Instrucciones según tu dispositivo
                </p>

                {/* iOS instructions */}
                <div className={`p-3.5 rounded-xl border ${isIOS ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400' : 'bg-slate-50 border-slate-200'} transition`}>
                  <div className="flex items-center gap-2 font-medium text-xs text-slate-900 mb-1.5">
                    <Apple className="w-4 h-4 text-slate-800" />
                    <span>iPhone / iPad (Safari)</span>
                    {isIOS && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full ml-auto">Tu dispositivo</span>}
                  </div>
                  <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside pl-1">
                    <li>Presiona el botón <strong>Compartir</strong> <span className="text-slate-400">(ícono cuadrado con flecha arriba)</span>.</li>
                    <li>Desplázate hacia abajo y selecciona <strong>"Agregar al inicio"</strong>.</li>
                    <li>Confirma haciendo clic en <strong>Agregar</strong> en la esquina superior.</li>
                  </ol>
                </div>

                {/* Android instructions */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-medium text-xs text-slate-900 mb-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Android (Chrome / Edge)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Toca los <strong>tres puntos (⋮)</strong> en la esquina superior del navegador y selecciona <strong>"Instalar aplicación"</strong> o "Agregar a la pantalla principal".
                  </p>
                </div>

                {/* Desktop instructions */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-medium text-xs text-slate-900 mb-1.5">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    <span>Computadora (Chrome / Edge)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Haz clic en el ícono de instalación <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[11px]">⊕</span> en la barra de direcciones superior del navegador.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Entendido, volver al sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
