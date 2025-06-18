import React, { useState, useRef, useEffect, useCallback } from 'react';
import NoteCard, { noteColors } from './NoteCard';

export default function CircularNotesView({ notes, onNoteClick }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef(null);
  const fullScreenAreaRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const startTouchRef = useRef({ x: 0, y: 0 });

  const radius = 180;
  const initialAngle = 180;

  // Calcular ángulo más simple
  const calculateAngle = (centerX, centerY, pointX, pointY) => {
    return Math.atan2(pointY - centerY, pointX - centerX) * (180 / Math.PI);
  };

  // Obtener centro
  const getNotesCenter = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // Detectar si está sobre una nota (simplificado)
  const isPointNearNote = (clientX, clientY) => {
    const center = getNotesCenter();
    const rotationRad = rotation * (Math.PI / 180);
    
    for (let i = 0; i < notes.length; i++) {
      const baseAngle = (360 / notes.length) * i;
      const angle = (initialAngle + baseAngle) * (Math.PI / 180);
      
      const noteX = center.x + Math.cos(angle + rotationRad) * radius;
      const noteY = center.y + Math.sin(angle + rotationRad) * radius;
      
      const dx = clientX - noteX;
      const dy = clientY - noteY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 60) {
        return i;
      }
    }
    return -1;
  };

  // Touch Start - Muy simple
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    
    setIsDragging(true);
    setHasMoved(false);
    
    const center = getNotesCenter();
    const angle = calculateAngle(center.x, center.y, touch.clientX, touch.clientY);
    setStartAngle(angle - rotation);
    
    startTouchRef.current = { x: touch.clientX, y: touch.clientY };
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Touch Move - Sin validaciones complejas
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const center = getNotesCenter();
    
    // Calcular distancia desde el inicio
    const dx = touch.clientX - startTouchRef.current.x;
    const dy = touch.clientY - startTouchRef.current.y;
    const totalDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Si se movió más de 5px, es arrastre
    if (totalDistance > 5) {
      setHasMoved(true);
      e.preventDefault();
      
      // Calcular nueva rotación
      const angle = calculateAngle(center.x, center.y, touch.clientX, touch.clientY);
      const newRotation = angle - startAngle;
      setRotation(newRotation);
    }
    
    lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Touch End - Solo clic si no se movió
  const handleTouchEnd = (e) => {
    if (!hasMoved) {
      const touch = e.changedTouches[0];
      const noteIndex = isPointNearNote(touch.clientX, touch.clientY);
      
      if (noteIndex >= 0 && onNoteClick) {
        onNoteClick(notes[noteIndex]);
      }
    }
    
    // Reset inmediato
    setIsDragging(false);
    setHasMoved(false);
  };

  // Mouse events (copia de touch pero para mouse)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    
    const center = getNotesCenter();
    const angle = calculateAngle(center.x, center.y, e.clientX, e.clientY);
    setStartAngle(angle - rotation);
    
    startTouchRef.current = { x: e.clientX, y: e.clientY };
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const center = getNotesCenter();
    
    const dx = e.clientX - startTouchRef.current.x;
    const dy = e.clientY - startTouchRef.current.y;
    const totalDistance = Math.sqrt(dx * dx + dy * dy);
    
    if (totalDistance > 5) {
      setHasMoved(true);
      
      const angle = calculateAngle(center.x, center.y, e.clientX, e.clientY);
      const newRotation = angle - startAngle;
      setRotation(newRotation);
    }
    
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e) => {
    if (!hasMoved) {
      const noteIndex = isPointNearNote(e.clientX, e.clientY);
      
      if (noteIndex >= 0 && onNoteClick) {
        onNoteClick(notes[noteIndex]);
      }
    }
    
    setIsDragging(false);
    setHasMoved(false);
  };

  // Eventos
  useEffect(() => {
    const fullScreenArea = fullScreenAreaRef.current;
    
    if (fullScreenArea) {
      // Touch events
      fullScreenArea.addEventListener('touchstart', handleTouchStart, { passive: true });
      fullScreenArea.addEventListener('touchmove', handleTouchMove, { passive: false });
      fullScreenArea.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      // Mouse events
      fullScreenArea.addEventListener('mousedown', handleMouseDown);
    }

    // Mouse global events
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (fullScreenArea) {
        fullScreenArea.removeEventListener('touchstart', handleTouchStart);
        fullScreenArea.removeEventListener('touchmove', handleTouchMove);
        fullScreenArea.removeEventListener('touchend', handleTouchEnd);
        fullScreenArea.removeEventListener('mousedown', handleMouseDown);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startAngle, rotation, notes]);

  // Click en nota (simplificado)
  const handleNoteClick = (note) => {
    onNoteClick && onNoteClick(note);
  };

  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 min-h-[60vh]">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
          No hay notas aún
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          ¡Agrega tu primera nota para ver el círculo mágico!
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center min-h-[70vh]">
      {/* Área de arrastre */}
      <div
        ref={fullScreenAreaRef}
        className="absolute inset-0 z-5"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y pinch-zoom', // Permite scroll vertical pero controla horizontal
        }}
      />

      {/* Contenedor de notas */}
      <div className="relative w-full h-full flex items-center z-20">
        <div
          ref={containerRef}
          className="absolute -right-5"
          style={{ 
            top: '60%',
            transform: 'translateY(-50%)',
            width: '100px',
            height: '380px',
            pointerEvents: 'none',
            zIndex: 30
          }}
        >
          {/* Línea guía */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 border border-gray-200/10 dark:border-gray-700/10 rounded-full"></div>
          </div>

          {/* Círculo de notas */}
          <div
            className="relative w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            {notes.map((note, index) => {
              const baseAngle = (360 / notes.length) * index;
              const angle = initialAngle + baseAngle;
              const colorIndex = index % noteColors.length;
              
              return (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  angle={angle}
                  color={noteColors[colorIndex]}
                  isDragging={isDragging}
                  hasMoved={hasMoved}
                  onClick={handleNoteClick}
                  radius={radius}
                  rotation={rotation}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}