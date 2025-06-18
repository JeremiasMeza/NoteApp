import React from 'react';

export default function NoteCard({ 
  note, 
  index, 
  angle, 
  color, 
  isDragging, 
  hasMoved = false, // Nueva prop
  onClick,
  radius = 120,
  rotation = 0
}) {
  // Calcular posición en el círculo
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  // Preview del contenido (más caracteres para tarjetas más grandes)
  const getPreview = (content, maxLength = 60) => {
    if (!content) return 'Nota vacía';
    
    // Limpiar saltos de línea para el preview
    const cleanContent = content.replace(/\n/g, ' ').trim();
    
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    
    // Cortar en la última palabra completa
    const truncated = cleanContent.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > maxLength * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    
    return truncated + '...';
  };

  const preview = getPreview(note.content);

  // Formatear fecha para mostrar en la tarjeta
  const formatCardDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `${diffDays - 1}d`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)}sem`;
    
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Manejar clic simplificado
  const handleClick = (e) => {
    e.stopPropagation();
    
    if (!hasMoved && onClick) {
      console.log('📱 NoteCard: Procesando clic en nota', note.id);
      onClick(note);
    } else {
      console.log('📱 NoteCard: Clic ignorado - hasMoved:', hasMoved);
    }
  };

  return (
    <div
      className={`
        absolute w-32 h-24 rounded-xl shadow-xl cursor-pointer
        transition-all duration-200 ease-out
        ${isDragging && hasMoved
          ? 'pointer-events-none scale-95 opacity-80' 
          : 'hover:scale-110 hover:shadow-2xl hover:z-20 active:scale-105'
        }
        ${color}
        border border-white/30
        backdrop-blur-sm
        select-none
      `}
      style={{
        left: `calc(50% + ${x}px - 64px)`,
        top: `calc(50% + ${y}px - 48px)`,
        transform: `rotate(${-rotation}deg)`,
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        width: '128px',
        height: '96px',
        opacity: isDragging && hasMoved ? '0.8' : '0.95',
        zIndex: isDragging ? 5 : 10,
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Nota ${index + 1}: ${preview}`}
    >
      {/* Contenido de la tarjeta */}
      <div className="w-full h-full p-4 flex flex-col justify-between text-white relative overflow-hidden">
        
        {/* Indicador de posición */}
        <div className="absolute top-3 right-3 w-2 h-2 bg-white/40 rounded-full shadow-sm"></div>
        
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col justify-between min-h-0">
          {/* Preview del texto */}
          <div className="text-base font-medium leading-snug overflow-hidden">
            <p className="line-clamp-3 text-shadow-sm drop-shadow-sm">
              {preview}
            </p>
          </div>
          
          {/* Footer con información */}
          <div className="flex items-center justify-between mt-3 text-sm opacity-90">
            <span className="text-white/90 font-semibold text-shadow-sm">
              #{index + 1}
            </span>
            <span className="text-white/80 text-sm font-medium">
              {formatCardDate(note.id)}
            </span>
          </div>
        </div>

        {/* Efecto de brillo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-xl pointer-events-none"></div>
        
        {/* Indicador de interacción */}
        {!isDragging && (
          <div className="absolute inset-0 bg-white/0 hover:bg-white/15 rounded-xl transition-colors duration-200 pointer-events-none"></div>
        )}
      </div>
    </div>
  );
}

// Colores predefinidos para las notas - Paleta monocromática púrpura/azul elegante
export const noteColors = [
  'bg-gradient-to-br from-indigo-500/80 to-indigo-600/80',
  'bg-gradient-to-br from-purple-500/80 to-purple-600/80',
  'bg-gradient-to-br from-blue-500/80 to-blue-600/80',
  'bg-gradient-to-br from-violet-500/80 to-violet-600/80',
  'bg-gradient-to-br from-slate-500/80 to-slate-600/80',
  'bg-gradient-to-br from-indigo-400/80 to-indigo-500/80',
  'bg-gradient-to-br from-purple-400/80 to-purple-500/80',
  'bg-gradient-to-br from-blue-400/80 to-blue-500/80',
  'bg-gradient-to-br from-violet-400/80 to-violet-500/80',
  'bg-gradient-to-br from-sky-500/80 to-sky-600/80',
  'bg-gradient-to-br from-indigo-600/80 to-purple-600/80',
  'bg-gradient-to-br from-purple-600/80 to-blue-600/80',
  'bg-gradient-to-br from-blue-600/80 to-violet-600/80',
  'bg-gradient-to-br from-slate-600/80 to-indigo-600/80',
  'bg-gradient-to-br from-gray-500/80 to-gray-600/80',
];