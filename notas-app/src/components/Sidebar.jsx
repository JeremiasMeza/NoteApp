import React from 'react';

export default function Sidebar({ active, onChangeView, onToggleTheme, isDark }) {
  return (
    <aside className="w-48 bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-primary dark:text-white mb-4">Menú</h2>

      <button
        onClick={() => onChangeView('view')}
        className={`py-2 px-4 rounded-xl text-left transition ${
          active === 'view'
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }`}
      >
        Ver notas
      </button>

      <button
        onClick={() => onChangeView('add')}
        className={`py-2 px-4 rounded-xl text-left transition ${
          active === 'add'
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
        }`}
      >
        Agregar nota
      </button>

      <button
        onClick={onToggleTheme}
        className="mt-auto py-2 px-4 rounded-xl bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-500 transition"
      >
        {isDark ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
    </aside>
  );
}
