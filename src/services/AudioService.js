import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AudioService {
  constructor() {
    this.sounds = {};
    this.soundEnabled = true;
    this.volume = 0.7;
    this.init();
  }

  async init() {
    try {
      // Configurer l'audio pour l'application
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: 1, // DoNotMix
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1, // DoNotMix
        playThroughEarpieceAndroid: false,
      });

      // Charger les préférences utilisateur depuis gameSettings
      await this.syncWithSettings();

      // Précharger les sons essentiels
      await this.preloadSounds();
    } catch (error) {
      // Erreur lors de l'initialisation de l'audio
    }
  }

  async preloadSounds() {
    const soundFiles = {
      // Sons de jeu
      gameStart: require('../../assets/sounds/game-start.mp3'),
      roundEnd: require('../../assets/sounds/round-end.mp3'),
      victory: require('../../assets/sounds/victory.mp3'),
      defeat: require('../../assets/sounds/defeat.mp3'),
      tick: require('../../assets/sounds/tick.mp3'),
      // Sons d'interface
      buttonClick: require('../../assets/sounds/button-click.mp3'),
      buttonHover: require('../../assets/sounds/button-hover.mp3'),
      modalOpen: require('../../assets/sounds/modal-open.mp3'),
      modalClose: require('../../assets/sounds/modal-close.mp3'),
      // Sons de notification
      success: require('../../assets/sounds/success.mp3'),
      error: require('../../assets/sounds/error.mp3'),
      warning: require('../../assets/sounds/warning.mp3'),
      // Sons de sélection
      selection: require('../../assets/sounds/selection.mp3'),
      unselection: require('../../assets/sounds/unselection.mp3')
    };

    // Charger tous les sons
    for (const [soundName, filePath] of Object.entries(soundFiles)) {
      try {
        const { sound } = await Audio.Sound.createAsync(filePath, {
          shouldPlay: false,
          volume: this.volume,
        });
        this.sounds[soundName] = sound;
        // Son chargé avec succès
      } catch (error) {
        console.warn(`Impossible de charger le son ${soundName}:`, error.message);
        this.sounds[soundName] = null;
      }
    }

    // Service audio initialisé
  }

  // Méthode pour charger un son spécifique quand le fichier est disponible
  async loadSound(soundName, filePath) {
    try {
      const { sound } = await Audio.Sound.createAsync(filePath, {
        shouldPlay: false,
        volume: this.volume,
      });
      this.sounds[soundName] = sound;
      // Son chargé avec succès
    } catch (error) {
      // Erreur lors du chargement du son
      this.sounds[soundName] = null;
    }
  }

  async playSound(soundName, options = {}) {
    if (!this.soundEnabled) return;
    
    const sound = this.sounds[soundName];
    if (!sound) {
      // Son non trouvé
      return;
    }

    try {
      const { volume = this.volume, loop = false } = options;
      
      // Arrêter le son s'il est déjà en cours
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      
      // Configurer et jouer
      await sound.setVolumeAsync(volume);
      await sound.setIsLoopingAsync(loop);
      await sound.playAsync();
    } catch (error) {
      // Erreur lors de la lecture du son
    }
  }

  async stopSound(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (error) {
      // Erreur lors de l'arrêt du son
    }
    }
  }

  async stopAllSounds() {
    for (const [name, sound] of Object.entries(this.sounds)) {
      if (sound) {
        try {
          await sound.stopAsync();
        } catch (error) {
        // Erreur lors de l'arrêt du son
      }
      }
    }
  }

  // Sons spécifiques au jeu
  async playGameStart() {
    await this.playSound('gameStart', { volume: 0.8 });
  }

  async playRoundEnd() {
    await this.playSound('roundEnd', { volume: 0.7 });
  }

  async playVictory() {
    await this.playSound('victory', { volume: 0.9 });
  }

  async playDefeat() {
    await this.playSound('defeat', { volume: 0.8 });
  }

  async playTick() {
    await this.playSound('tick', { volume: 0.5 });
  }

  // Sons d'interface
  async playButtonClick() {
    await this.playSound('buttonClick', { volume: 0.6 });
  }

  async playButtonHover() {
    await this.playSound('buttonHover', { volume: 0.4 });
  }

  async playModalOpen() {
    await this.playSound('modalOpen', { volume: 0.6 });
  }

  async playModalClose() {
    await this.playSound('modalClose', { volume: 0.6 });
  }

  // Sons de notification
  async playSuccess() {
    await this.playSound('success', { volume: 0.7 });
  }

  async playError() {
    await this.playSound('error', { volume: 0.7 });
  }

  async playWarning() {
    await this.playSound('warning', { volume: 0.7 });
  }

  async playSelection() {
    await this.playSound('selection', { volume: 0.7 });
  }

  async playUnselection() {
    await this.playSound('unselection', { volume: 0.7 });
  }

  // Gestion des préférences
  async setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    
    // Mettre à jour gameSettings pour maintenir la cohérence
    try {
      const settings = await AsyncStorage.getItem('gameSettings');
      const currentSettings = settings ? JSON.parse(settings) : {};
      currentSettings.soundEnabled = enabled;
      await AsyncStorage.setItem('gameSettings', JSON.stringify(currentSettings));
    } catch (error) {
      // Erreur lors de la sauvegarde des paramètres audio
    }
    
    if (!enabled) {
      await this.stopAllSounds();
    }
  }

  // Synchroniser avec les paramètres depuis AsyncStorage
  async syncWithSettings() {
    try {
      const settings = await AsyncStorage.getItem('gameSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        this.soundEnabled = parsedSettings.soundEnabled ?? true;
      }
    } catch (error) {
      // Erreur lors de la synchronisation des paramètres audio
    }
  }

  getSoundEnabled() {
    return this.soundEnabled;
  }

  async setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Mettre à jour le volume de tous les sons chargés
    for (const sound of Object.values(this.sounds)) {
      if (sound) {
        try {
          await sound.setVolumeAsync(this.volume);
        } catch (error) {
      // Erreur lors de la mise à jour du volume
    }
      }
    }
  }

  getVolume() {
    return this.volume;
  }

  // Nettoyage des ressources
  async cleanup() {
    for (const sound of Object.values(this.sounds)) {
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (error) {
      // Erreur lors du nettoyage du son
    }
      }
    }
    this.sounds = {};
  }
}

// Instance singleton
const audioService = new AudioService();
export default audioService;