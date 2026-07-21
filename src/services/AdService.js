import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds, { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

/**
 * Service de gestion des publicités
 * Simule l'intégration avec des services de publicité comme AdMob
 */
class AdService {
  constructor() {
    this.isInitialized = false;
    this.interstitialAd = null;
    
    // IDs des unités publicitaires
    this.adUnitIds = {
      interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-5791149705686966/6876354715'
    };
    
    this.adFrequency = {
      interstitial: 2, // Afficher une pub toutes les 2 manches
      lastInterstitialRound: 0
    };
  }

  /**
   * Initialiser le service de publicités
   */
  async initialize() {
    try {
      // Initialisation du service de publicités AdMob
      
      // Initialiser le SDK Mobile Ads
      await mobileAds().initialize();
      
      // Créer l'instance de publicité interstitielle
      this.interstitialAd = InterstitialAd.createForAdRequest(this.adUnitIds.interstitial);
      
      // Charger les préférences de publicité
      const lastAdRound = await AsyncStorage.getItem('lastAdRound');
      if (lastAdRound) {
        this.adFrequency.lastInterstitialRound = parseInt(lastAdRound);
      }
      
      this.isInitialized = true;
      // Service de publicités AdMob initialisé avec succès
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des publicités AdMob:', error);
      return false;
    }
  }

  /**
   * Vérifier si une publicité interstitielle doit être affichée
   * @param {number} currentRound - Manche actuelle
   * @returns {boolean}
   */
  shouldShowInterstitialAd(currentRound) {
    if (!this.isInitialized) return false;
    
    const roundsSinceLastAd = currentRound - this.adFrequency.lastInterstitialRound;
    return roundsSinceLastAd >= this.adFrequency.interstitial;
  }

  /**
   * Afficher une publicité interstitielle
   * @param {number} currentRound - Manche actuelle
   * @returns {Promise<boolean>} - True si la pub a été affichée
   */
  async showInterstitialAd(currentRound) {
    if (!this.shouldShowInterstitialAd(currentRound) || !this.interstitialAd) {
      return false;
    }

    try {
      // Chargement de la publicité interstitielle AdMob
      
      // Charger la publicité
      await this.interstitialAd.load();
      
      return new Promise((resolve) => {
        // Écouter les événements de la publicité
        const unsubscribe = this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
          // Publicité interstitielle fermée
          // Enregistrer que la pub a été vue
          this.adFrequency.lastInterstitialRound = currentRound;
          AsyncStorage.setItem('lastAdRound', currentRound.toString());
          
          // Recréer l'instance pour la prochaine fois
          this.interstitialAd = InterstitialAd.createForAdRequest(this.adUnitIds.interstitial);
          
          unsubscribe();
          resolve(true);
        });
        
        // Afficher la publicité
        this.interstitialAd.show();
      });
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la publicité AdMob:', error);
      // Fallback vers une alerte en cas d'erreur
      return this.showFallbackInterstitialAd(currentRound);
    }
  }
  
  /**
   * Afficher une publicité de fallback (simulation)
   * @param {number} currentRound - Manche actuelle
   * @returns {Promise<boolean>}
   */
  async showFallbackInterstitialAd(currentRound) {
    return new Promise((resolve) => {
      Alert.alert(
        '📺 Publicité',
        'Merci de regarder cette courte publicité pour soutenir le jeu !\n\n🎮 Hot Potato - Le jeu le plus amusant !',
        [
          {
            text: 'Fermer (5s)',
            onPress: async () => {
              this.adFrequency.lastInterstitialRound = currentRound;
              await AsyncStorage.setItem('lastAdRound', currentRound.toString());
              // Publicité de fallback fermée
              resolve(true);
            }
          }
        ],
        { cancelable: false }
      );
    });
  }

  /**
   * Afficher une publicité récompensée (désactivée)
   * @returns {Promise<boolean>} - Toujours false
   */
  async showRewardedAd() {
    // Publicités récompensées désactivées
    return false;
  }

  /**
   * Vérifier si les publicités sont disponibles
   * @returns {boolean}
   */
  isAdAvailable() {
    return this.isInitialized;
  }

  /**
   * Obtenir les statistiques des publicités
   * @returns {Object}
   */
  async getAdStats() {
    try {
      const lastAdRound = await AsyncStorage.getItem('lastAdRound');
      return {
        lastInterstitialRound: lastAdRound ? parseInt(lastAdRound) : 0,
        adFrequency: this.adFrequency.interstitial,
        isInitialized: this.isInitialized
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats publicitaires:', error);
      return null;
    }
  }

  /**
   * Configurer la fréquence des publicités
   * @param {number} frequency - Nombre de manches entre chaque pub
   */
  setAdFrequency(frequency) {
    if (frequency > 0) {
      this.adFrequency.interstitial = frequency;
      // Fréquence des publicités mise à jour
    }
  }

  /**
   * Réinitialiser les compteurs de publicités
   */
  async resetAdCounters() {
    try {
      this.adFrequency.lastInterstitialRound = 0;
      await AsyncStorage.removeItem('lastAdRound');
      // Compteurs de publicités réinitialisés
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des compteurs:', error);
    }
  }
}

// Instance singleton
const adService = new AdService();

export default adService;