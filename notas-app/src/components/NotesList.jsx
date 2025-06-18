import React from 'react';

export default function NotesList({ notes }) {
  if (notes.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
        No hay notas para mostrar. ¡Agrega tu primera nota!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {notes.map(({ id, content }) => (
        <div
          key={id}
          className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
        >
          {content}
        </div>
      ))}
    </div>
  );
}
