import React, { useState, useEffect } from 'react';

export default function NotePopup({ note, isOpen, onClose, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Sincronizar contenido cuando se abre el popup
  useEffect(() => {
    if (note) {
      setEditedContent(note.content);
    }
  }, [note]);

  // Cerrar popup con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsEditing(false);
    setEditedContent(note?.content || '');
    onClose();
  };

  const handleSave = () => {
    if (editedContent.trim() && onEdit) {
      onEdit(note.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      onDelete(note.id);
      handleClose();
    }
  };

  // Formatear fecha de creación
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="
            relative w-full max-w-lg mx-4 
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-2xl 
            transform transition-all duration-300 ease-out
            animate-fade-in
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Nota' : 'Mi Nota'}
              </h2>
            </div>
            
            <button
              onClick={handleClose}
              className="
                p-2 rounded-full text-gray-400 hover:text-gray-600 
                hover:bg-gray-100 dark:hover:bg-gray-700 
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-primary/20
              "
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="
                    w-full h-40 p-4 
                    border border-gray-300 dark:border-gray-600 
                    rounded-xl resize-none
                    bg-white dark:bg-gray-700 
                    text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                  "
                  placeholder="Escribe tu nota aquí..."
                  autoFocus
                />
                
                {/* Botones de edición */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(note.content);
                    }}
                    className="
                      px-4 py-2 text-sm font-medium
                      text-gray-600 dark:text-gray-400
                      hover:text-gray-800 dark:hover:text-gray-200
                      transition-colors duration-200
                    "
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!editedContent.trim() || editedContent === note.content}
                    className="
                      px-6 py-2 text-sm font-medium text-white
                      bg-gradient-to-r from-primary to-secondary
                      rounded-lg shadow-md
                      hover:shadow-lg hover:scale-105
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-primary/50
                    "
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Contenido de la nota */}
                <div className="
                  p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl
                  border border-gray-200 dark:border-gray-600
                ">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>

                {/* Información adicional */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Creada: {formatDate(note.id)}</span>
                  <span>{note.content.length} caracteres</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          {!isEditing && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleDelete}
                className="
                  flex items-center gap-2 px-4 py-2 text-sm font-medium
                  text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-red-500/20
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="
                  flex items-center gap-2 px-6 py-2 text-sm font-medium text-white
                  bg-gradient-to-r from-primary to-secondary
                  rounded-lg shadow-md
                  hover:shadow-lg hover:scale-105
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}