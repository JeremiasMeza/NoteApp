import React, { useState } from 'react';

export default function NoteForm({ onAddNote }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();


    if (text.trim() === '') return;

    onAddNote(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        id="note"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="resize-none p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        rows="6"
        placeholder="Escribe tu nota aquí..."
      ></textarea>
      <button
        type="submit"
        className="self-end bg-primary text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition"
      >
        Agregar
      </button>
    </form>
  );
}
