import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class VibrationService {
  constructor() {
    this.vibrationEnabled = true;
    this.init();
  }

  async init() {
    try {
      // Charger les préférences utilisateur depuis gameSettings
      const settings = await AsyncStorage.getItem('gameSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        this.vibrationEnabled = parsedSettings.vibrationEnabled ?? true;
      } else {
        this.vibrationEnabled = true;
      }
    } catch (error) {
      // Erreur lors du chargement des paramètres, utiliser la valeur par défaut
      this.vibrationEnabled = true;
    }
  }

  // Vibrations de base
  vibrate(duration = 100) {
    if (!this.vibrationEnabled) return;
    
    try {
      Vibration.vibrate(duration);
    } catch (error) {
      // Erreur lors de la vibration
    }
  }

  // Vibrations avec patterns
  vibratePattern(pattern) {
    if (!this.vibrationEnabled) return;
    
    try {
      Vibration.vibrate(pattern);
    } catch (error) {
      // Erreur lors de la vibration pattern
    }
  }

  // Vibrations spécifiques
  vibrateButtonClick() {
    this.vibrate(50); // Vibration courte pour les clics
  }

  vibrateButtonHover() {
    this.vibrate(25); // Vibration très courte pour le survol
  }

  vibrateSuccess() {
    this.vibratePattern([0, 100, 50, 100]); // Double vibration pour succès
  }

  vibrateError() {
    this.vibratePattern([0, 200, 100, 200, 100, 200]); // Triple vibration pour erreur
  }

  vibrateWarning() {
    this.vibratePattern([0, 150, 75, 150]); // Double vibration moyenne pour avertissement
  }

  vibrateGameStart() {
    this.vibratePattern([0, 200, 100, 100, 100, 100]); // Pattern de démarrage
  }

  vibrateGameEnd() {
    this.vibratePattern([0, 300, 150, 300]); // Pattern de fin
  }

  vibrateTick() {
    this.vibrate(30); // Vibration très courte pour le tick
  }

  vibrateSelection() {
    this.vibrate(75); // Vibration moyenne pour sélection
  }

  vibrateUnselection() {
    this.vibrate(40); // Vibration courte pour désélection
  }

  vibrateModalOpen() {
    this.vibratePattern([0, 80, 40, 80]); // Pattern d'ouverture
  }

  vibrateModalClose() {
    this.vibratePattern([0, 60, 30, 60]); // Pattern de fermeture
  }

  // Gestion des préférences
  async setVibrationEnabled(enabled) {
    this.vibrationEnabled = enabled;
    
    try {
      // Charger les paramètres existants
      const settings = await AsyncStorage.getItem('gameSettings');
      let currentSettings = { soundEnabled: true, vibrationEnabled: true };
      
      if (settings) {
        currentSettings = JSON.parse(settings);
      }
      
      // Mettre à jour uniquement la vibration
      currentSettings.vibrationEnabled = enabled;
      
      // Sauvegarder les paramètres mis à jour
      await AsyncStorage.setItem('gameSettings', JSON.stringify(currentSettings));
    } catch (error) {
      // Erreur lors de la sauvegarde des paramètres de vibration
    }
    
    if (!enabled) {
      // Arrêter toutes les vibrations en cours
      Vibration.cancel();
    }
  }

  getVibrationEnabled() {
    return this.vibrationEnabled;
  }

  // Arrêter toutes les vibrations
  cancelAll() {
    try {
      Vibration.cancel();
    } catch (error) {
      // Erreur lors de l'initialisation des vibrations
    }
  }
}

// Instance singleton
const vibrationService = new VibrationService();
export default vibrationService;