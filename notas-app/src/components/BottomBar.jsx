import React from 'react';

export default function BottomBar({ active, onChangeView, onExit }) {
  // Botón para la barra principal
  const NavButton = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={`
        flex flex-col items-center justify-center
        py-3 px-4
        text-sm font-medium
        transition-all duration-300 ease-out
        ${
          isActive
            ? 'text-white scale-105'
            : 'text-white/70 hover:text-white hover:scale-105'
        }
        focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent
        active:scale-95
      `}
      type="button"
    >
      <div className="flex flex-col items-center gap-1">
        {icon}
        <span className="text-xs select-none font-medium">{label}</span>
      </div>
    </button>
  );

  // Botón central prominente para agregar
  const CentralAddButton = () => (
    <button
      onClick={() => onChangeView('add')}
      className={`
        relative
        flex flex-col items-center justify-center
        w-16 h-16
        bg-white
        text-primary
        rounded-full
        shadow-lg
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-white/50
        ${active === 'add' ? 'scale-110 shadow-xl bg-gradient-to-tr from-white to-gray-50' : ''}
        -mt-6
        border-4 border-primary/10
      `}
      type="button"
      aria-label="Agregar nueva nota"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="6" x2="12" y2="18" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </svg>
    </button>
  );

  // Íconos optimizados
  const icons = {
    view: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
      </svg>
    ),
    exit: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="relative">
        {/* Forma orgánica usando CSS puro - más eficiente */}
        <div className="relative mx-4 mb-4">
          <div 
            className="
              bg-gradient-to-r from-primary via-secondary to-primary
              rounded-full
              shadow-2xl
              px-6 py-4
              backdrop-blur-lg
              border border-white/10
            "
          >
            {/* Contenedor de botones */}
            <div className="flex items-center justify-between">
              {/* Botón izquierdo */}
              <div className="flex-1 flex justify-center">
                <NavButton
                  label="Ver Notas"
                  icon={icons.view}
                  isActive={active === 'view'}
                  onClick={() => onChangeView('view')}
                />
              </div>
              
              {/* Botón central prominente */}
              <div className="flex-shrink-0 px-4">
                <CentralAddButton />
              </div>
              
              {/* Botón derecho - Ahora es Salir */}
              <div className="flex-1 flex justify-center">
                <NavButton
                  label="Salir"
                  icon={icons.exit}
                  isActive={false}
                  onClick={onExit}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Espaciado inferior para contenido */}
        <div className="h-4"></div>
      </div>
    </nav>
  );
}