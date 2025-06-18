// src/utils/storage.js
import { Preferences } from '@capacitor/preferences';

// Claves para el almacenamiento
const STORAGE_KEYS = {
  NOTES: 'notes-app-data',
  THEME: 'notes-app-theme',
  APP_VERSION: 'notes-app-version'
};

/**
 * Clase para manejar el almacenamiento de datos de forma robusta
 * Usa Capacitor Preferences con fallback a localStorage para desarrollo web
 */
class StorageManager {
  constructor() {
    this.isCapacitorAvailable = this.checkCapacitorAvailability();
  }

  /**
   * Verificar si Capacitor está disponible (móvil) o usar localStorage (web)
   */
  checkCapacitorAvailability() {
    try {
      return typeof Preferences !== 'undefined' && Preferences.get;
    } catch (error) {
      console.log('Capacitor no disponible, usando localStorage');
      return false;
    }
  }

  /**
   * Guardar datos en el almacenamiento
   * @param {string} key - Clave para identificar los datos
   * @param {any} value - Valor a guardar (se serializa automáticamente)
   */
  async setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (this.isCapacitorAvailable) {
        // Usar Capacitor Preferences para móviles
        await Preferences.set({
          key: key,
          value: serializedValue
        });
        console.log(`✅ Datos guardados con Capacitor: ${key}`);
      } else {
        // Fallback a localStorage para desarrollo web
        localStorage.setItem(key, serializedValue);
        console.log(`✅ Datos guardados con localStorage: ${key}`);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Error al guardar ${key}:`, error);
      return false;
    }
  }

  /**
   * Obtener datos del almacenamiento
   * @param {string} key - Clave de los datos a obtener
   * @param {any} defaultValue - Valor por defecto si no existe
   */
  async getItem(key, defaultValue = null) {
    try {
      let storedValue;
      
      if (this.isCapacitorAvailable) {
        // Usar Capacitor Preferences para móviles
        const result = await Preferences.get({ key: key });
        storedValue = result.value;
        console.log(`📱 Datos leídos con Capacitor: ${key}`);
      } else {
        // Fallback a localStorage para desarrollo web
        storedValue = localStorage.getItem(key);
        console.log(`🌐 Datos leídos con localStorage: ${key}`);
      }

      if (storedValue === null || storedValue === undefined) {
        return defaultValue;
      }

      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`❌ Error al leer ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Eliminar datos del almacenamiento
   * @param {string} key - Clave de los datos a eliminar
   */
  async removeItem(key) {
    try {
      if (this.isCapacitorAvailable) {
        await Preferences.remove({ key: key });
      } else {
        localStorage.removeItem(key);
      }
      console.log(`🗑️ Datos eliminados: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error al eliminar ${key}:`, error);
      return false;
    }
  }

  /**
   * Limpiar todo el almacenamiento
   */
  async clear() {
    try {
      if (this.isCapacitorAvailable) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
      console.log('🧹 Almacenamiento limpiado completamente');
      return true;
    } catch (error) {
      console.error('❌ Error al limpiar almacenamiento:', error);
      return false;
    }
  }

  /**
   * Obtener información del almacenamiento
   */
  async getStorageInfo() {
    try {
      if (this.isCapacitorAvailable) {
        const keys = await Preferences.keys();
        return {
          type: 'Capacitor Preferences',
          platform: 'Mobile',
          keysCount: keys.keys.length,
          keys: keys.keys
        };
      } else {
        const keys = Object.keys(localStorage);
        return {
          type: 'localStorage',
          platform: 'Web',
          keysCount: keys.length,
          keys: keys
        };
      }
    } catch (error) {
      console.error('❌ Error al obtener info del almacenamiento:', error);
      return null;
    }
  }

  // Métodos específicos para la aplicación de notas

  /**
   * Guardar notas
   * @param {Array} notes - Array de notas
   */
  async saveNotes(notes) {
    const success = await this.setItem(STORAGE_KEYS.NOTES, notes);
    if (success) {
      console.log(`📝 ${notes.length} notas guardadas`);
    }
    return success;
  }

  /**
   * Cargar notas
   * @returns {Array} Array de notas o array vacío
   */
  async loadNotes() {
    const notes = await this.getItem(STORAGE_KEYS.NOTES, []);
    console.log(`📖 ${notes.length} notas cargadas`);
    return Array.isArray(notes) ? notes : [];
  }

  /**
   * Guardar tema
   * @param {string} theme - 'light' o 'dark'
   */
  async saveTheme(theme) {
    return await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  /**
   * Cargar tema
   * @returns {string} 'light' o 'dark'
   */
  async loadTheme() {
    return await this.getItem(STORAGE_KEYS.THEME, 'light');
  }

  /**
   * Crear backup de todos los datos
   * @returns {Object} Objeto con todos los datos de la app
   */
  async createBackup() {
    try {
      const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          notes: await this.loadNotes(),
          theme: await this.loadTheme()
        }
      };
      
      console.log('💾 Backup creado:', backup);
      return backup;
    } catch (error) {
      console.error('❌ Error al crear backup:', error);
      return null;
    }
  }

  /**
   * Restaurar desde backup
   * @param {Object} backup - Objeto de backup
   */
  async restoreFromBackup(backup) {
    try {
      if (!backup || !backup.data) {
        throw new Error('Backup inválido');
      }

      await this.saveNotes(backup.data.notes || []);
      await this.saveTheme(backup.data.theme || 'light');
      
      console.log('🔄 Datos restaurados desde backup');
      return true;
    } catch (error) {
      console.error('❌ Error al restaurar backup:', error);
      return false;
    }
  }
}

// Crear instancia global del storage manager
const storage = new StorageManager();

export default storage;
export { STORAGE_KEYS };