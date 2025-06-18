import React, { useState, useEffect } from 'react';
import BottomBar from '../components/BottomBar';
import NoteForm from '../components/NoteForm';
import CircularNotesView from '../components/CircularNotesView';
import NotePopup from '../components/NotePopup';
import storage from '../utils/storage';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('view'); // 'view' | 'add'
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    loadAppData();
  }, []);

  // Función para cargar todos los datos de la app
  const loadAppData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar notas y tema en paralelo para mejor rendimiento
      const [loadedNotes, loadedTheme] = await Promise.all([
        storage.loadNotes(),
        storage.loadTheme()
      ]);

      setNotes(loadedNotes);
      setDarkMode(loadedTheme === 'dark');
      
      // Obtener info del almacenamiento para debug
      const storageInfo = await storage.getStorageInfo();
      console.log('💾 Info del almacenamiento:', storageInfo);
      
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      
      // Fallback a valores por defecto si hay error
      setNotes([]);
      setDarkMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar notas cuando cambien (con debounce automático)
  useEffect(() => {
    if (!isLoading && notes.length >= 0) {
      saveNotesWithDelay();
    }
  }, [notes, isLoading]);

  // Guardar tema cuando cambie
  useEffect(() => {
    if (!isLoading) {
      storage.saveTheme(darkMode ? 'dark' : 'light');
      
      // Aplicar clase al documento para el tema
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, isLoading]);

  // Función para guardar notas con un pequeño delay (evita guardado excesivo)
  const saveNotesWithDelay = () => {
    clearTimeout(window.notesSaveTimeout);
    window.notesSaveTimeout = setTimeout(async () => {
      await storage.saveNotes(notes);
    }, 500); // Esperar 500ms antes de guardar
  };

  // Alternar tema
  const toggleTheme = () => setDarkMode(!darkMode);

  // Agregar nueva nota
  const addNote = async (text) => {
    if (!text.trim()) return;

    const newNote = {
      id: Date.now(), // Usar timestamp como ID único
      content: text.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes(prevNotes => {
      const updatedNotes = [newNote, ...prevNotes];
      console.log('✅ Nueva nota agregada:', newNote.id);
      return updatedNotes;
    });
    
    setView('view'); // Cambiar a vista de notas después de agregar
  };

  // Editar nota existente
  const editNote = async (noteId, newContent) => {
    if (!newContent.trim()) return;

    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => 
        note.id === noteId 
          ? { 
              ...note, 
              content: newContent.trim(),
              updatedAt: new Date().toISOString()
            }
          : note
      );
      
      console.log('✏️ Nota editada:', noteId);
      return updatedNotes;
    });
  };

  // Eliminar nota
  const deleteNote = async (noteId) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.id !== noteId);
      console.log('🗑️ Nota eliminada:', noteId);
      return updatedNotes;
    });
  };

  // Abrir popup con nota seleccionada
  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowPopup(true);
  };

  // Cerrar popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedNote(null);
  };

  // Cambiar vista desde BottomBar
  const handleChangeView = (newView) => {
    setView(newView);
  };

  // Función para manejar la salida de la app
  const handleExit = async () => {
    try {
      // Crear backup antes de salir
      const backup = await storage.createBackup();
      console.log('💾 Backup creado antes de salir:', backup);
      
      // Limpiar timeout si existe
      if (window.notesSaveTimeout) {
        clearTimeout(window.notesSaveTimeout);
      }
      
      // Guardar datos finales
      await storage.saveNotes(notes);
      await storage.saveTheme(darkMode ? 'dark' : 'light');
      
      // Recargar la aplicación
      window.location.reload();
    } catch (error) {
      console.error('❌ Error al salir:', error);
      window.location.reload();
    }
  };

  // Mostrar pantalla de carga mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-gray-900 text-white">
        {/* Fondo animado igual que Welcome */}
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] left-[60%] w-[400px] h-[400px] bg-indigo-600 opacity-20 rounded-full filter blur-2xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-[60%] left-[30%] w-[350px] h-[350px] bg-darkpurple opacity-30 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>

        {/* Contenido de carga */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Cargando tus notas...
            </h2>
            <p className="text-gray-400">
              Inicializando el almacenamiento seguro
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900 text-white">
      {/* Fondo animado igual que Welcome */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-[20%] left-[60%] w-[400px] h-[400px] bg-indigo-600 opacity-20 rounded-full filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[60%] left-[30%] w-[350px] h-[350px] bg-darkpurple opacity-30 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Contenido principal sobre el fondo animado */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header ultra limpio - Solo título sin extras */}
        <header className="flex-shrink-0 pt-12 pb-6 px-6 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {view === 'add' ? 'Nueva Nota' : 'Mis Notas'}
          </h1>
          
          {/* Indicador de estado del almacenamiento (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2 text-xs text-gray-400">
              📱 {storage.isCapacitorAvailable ? 'Almacenamiento móvil activo' : 'Almacenamiento web activo'} • {notes.length} nota{notes.length !== 1 ? 's' : ''}
            </div>
          )}
        </header>

        {/* Contenido principal con mejor espaciado */}
        <main className="flex-grow overflow-hidden pb-16">
          {view === 'view' ? (
            <CircularNotesView 
              notes={notes} 
              onNoteClick={handleNoteClick}
            />
          ) : (
            <div className="max-w-md mx-auto px-6">
              <NoteForm onAddNote={addNote} />
            </div>
          )}
        </main>

        {/* Navegación inferior */}
        <BottomBar
          active={view}
          onChangeView={handleChangeView}
          onExit={handleExit}
        />

        {/* Popup para mostrar/editar nota */}
        <NotePopup
          note={selectedNote}
          isOpen={showPopup}
          onClose={handleClosePopup}
          onEdit={editNote}
          onDelete={deleteNote}
        />
      </div>
    </div>
  );
}