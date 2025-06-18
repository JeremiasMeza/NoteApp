import React from 'react';

export default function Welcome({ onEnter }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* Círculos borrosos animados */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-purple-500 opacity-30 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute top-[20%] left-[60%] w-[400px] h-[400px] bg-indigo-600 opacity-20 rounded-full filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-[60%] left-[30%] w-[350px] h-[350px] bg-darkpurple opacity-30 rounded-full filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Contenido central */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <div className="w-full max-w-sm text-center px-6 py-10 bg-white/10 dark:bg-black/20 rounded-2xl shadow-xl backdrop-blur-xl border border-white/20">
          <h1 className="text-5xl font-extrabold text-white mb-4 animate-fade-in">
            ¡Tu espacio personal!
          </h1>
          <p className="text-indigo-100 text-base animate-fade-in delay-300">
            Comienza a crear, guardar y reflexionar sobre tus ideas, sin distracciones.
          </p>
          <button
            onClick={onEnter}
            className="w-full py-3 px-4 bg-primary text-white text-lg font-semibold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition transform focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

