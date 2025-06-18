 📱 Mis Notas - App Personal de Notas

Una aplicación móvil que desarrollé para gestionar mis notas personales. Es mi primer proyecto completo de React + Capacitor que se convierte en una APK real para Android.

 🎯 ¿Qué hace la app?

- Crear notas rápidamente
- Vista circular única para navegar entre las notas arrastrando
- Editar y eliminar notas con un popup elegante
- Guarda todo localmente - funciona sin internet
- Interfaz moderna con gradientes y animaciones

 🛠️ Cómo la construí

 Tecnologías que usé:
- React 19 - Para toda la interfaz
- Vite - Como build tool (mucho más rápido que Create React App)
- Tailwind CSS - Para los estilos (configurado via CDN)
- Capacitor - Para convertir mi React app en APK para Android
- Capacitor Preferences - Para guardar las notas de forma segura

 El proceso que seguí:
1. Desarrollé en React - Primero hice todo funcionando en el navegador
2. Agregué Capacitor - Para poder generar APKs
3. Implementé almacenamiento robusto - Que funciona tanto en web como en móvil
4. Diseñé el ícono - SVG personalizado con los colores de la app
5. Generé la APK - Sin necesidad de Android Studio

 Decisiones técnicas importantes:
- Almacenamiento híbrido: Usa Capacitor Preferences en móvil y localStorage en web
- Vista circular: Implementé arrastre táctil personalizado con matemáticas de círculo
- Sin base de datos externa: Todo se guarda localmente para privacidad total
- Responsive design: Funciona perfecto en móviles

 🚀 Cómo ejecutar el proyecto localmente

 Prerrequisitos
- Node.js 18 o superior
- Java JDK 17 (solo si quieres generar APK)

 Pasos:

1. Clona el repositorio
```bash
git clone https://github.com/JeremiasMeza/NoteApp.git
cd mis-notas
```

2. Instala las dependencias
```bash
npm install
```

3. Ejecuta en modo desarrollo
```bash
npm run dev
```

4. Abre en tu navegador
```
http://localhost:5173
```

 Para generar APK (opcional):

```bash
# Build y preparar para Android
npm run build:android

# Generar APK
cd android
gradlew.bat assembleDebug  # Windows
./gradlew assembleDebug    # Linux/Mac
```

El APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

 📱 APK Lista para Instalar

Si solo quieres probar la app sin compilar nada, descarga directamente la APK desde la sección Releases de este repositorio.

Para instalar:
1. Descarga el archivo `app-debug.apk`
2. En tu Android, ve a Configuración > Seguridad > Permitir fuentes desconocidas
3. Instala la APK

 📁 Estructura del código

```
src/
├── components/          # Componentes reutilizables
│   ├── BottomBar.jsx   # Navegación inferior con botones
│   ├── CircularNotesView.jsx  # La vista circular que se puede arrastrar
│   ├── NoteCard.jsx    # Cada nota individual en el círculo
│   ├── NoteForm.jsx    # Formulario para crear notas
│   └── NotePopup.jsx   # Modal para ver/editar notas
├── views/              # Pantallas principales
│   ├── Welcome.jsx     # Pantalla de bienvenida con animaciones
│   └── Home.jsx        # Pantalla principal de la app
├── utils/
│   └── storage.js      # Manejo del almacenamiento (Capacitor + localStorage)
└── App.jsx            # Componente raíz que maneja la navegación
```

 🎨 Características que me enorgullecen

- Vista circular interactiva: La idea más original del proyecto, puedes arrastrar para rotar
- Almacenamiento inteligente: Detecta automáticamente si está en móvil o web
- Animaciones fluidas: Gradientes animados de fondo como la pantalla de bienvenida
- Ícono personalizado: Diseñé el ícono en SVG con los colores exactos de la app
- Código limpio: Componentes organizados y reutilizables

 🔮 Ideas para el futuro

- Sincronización en la nube
- Categorías de notas
- Búsqueda
- Recordatorios
- Modo nocturno completo
- Compartir notas

 🤝 ¿Quieres contribuir?

¡Siéntete libre sugerir ideas! Es mi primer proyecto grande así que cualquier feedback es bienvenido.

---

Nota personal: Este proyecto me enseñó muchísimo sobre React, desarrollo móvil, y cómo convertir una idea simple en una app real que uso todos los días. ¡Espero que te sirva de inspiración para tus propios proyectos! 

⭐ Si te gusta, dale una estrella al repo
