import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestPurchase, getProducts, initConnection, endConnection, purchaseUpdatedListener, purchaseErrorListener, finishTransaction, getAvailablePurchases } from 'react-native-iap';
// import adService from './AdService'; // Temporairement commenté pour éviter la dépendance circulaire

const PREMIUM_KEY = '@HotPotato:isPremium';
const CUSTOM_THEMES_KEY = '@HotPotato:customThemes';

class PremiumService {
  constructor() {
    this.isPremium = false;
    this.isHardcoreMode = false;
    this.listeners = [];
    this.init();
  }

  async init() {
    try {
      // Initialiser la connexion IAP
      await initConnection();
      
      // Charger le statut premium depuis le stockage local
      const premiumStatus = await AsyncStorage.getItem(PREMIUM_KEY);
      this.isPremium = premiumStatus === 'true';
      
      // Configurer les listeners pour les achats
      this.setupPurchaseListeners();
    } catch (error) {
      // Erreur lors de l'initialisation du service premium
    }
  }

  // Vérifier si l'utilisateur est premium (permanent ou temporaire)
  async checkPremiumStatus() {
    try {
      const premiumStatus = await AsyncStorage.getItem(PREMIUM_KEY);
      const permanentPremium = premiumStatus === 'true';
      const temporaryPremium = await this.hasTemporaryPremium();
      
      this.isPremium = permanentPremium || temporaryPremium;
      return this.isPremium;
    } catch (error) {
      // Erreur lors de la vérification du statut premium
      return false;
    }
  }

  // Activer le premium
  async activatePremium() {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, 'true');
      this.isPremium = true;
      this.notifyListeners();
      return true;
    } catch (error) {
      // Erreur lors de l'activation du premium
      return false;
    }
  }

  /**
   * Activer le premium temporaire via publicité récompensée
   */
  async activateTemporaryPremium() {
    try {
      // const adWatched = await adService.showRewardedAd(); // Temporairement commenté
      const adWatched = true; // Simulation pour éviter la dépendance circulaire
      
      if (adWatched) {
        // Accorder 24h de premium
        const expirationTime = Date.now() + (24 * 60 * 60 * 1000); // 24 heures
        await AsyncStorage.setItem('temporaryPremiumExpiration', expirationTime.toString());
        // Premium temporaire activé pour 24h
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'activation du premium temporaire:', error);
      return false;
    }
  }

  /**
   * Vérifier si l'utilisateur a un accès premium temporaire valide
   */
  async hasTemporaryPremium() {
    try {
      const expirationTime = await AsyncStorage.getItem('temporaryPremiumExpiration');
      
      if (expirationTime) {
        const expiration = parseInt(expirationTime);
        const now = Date.now();
        
        if (now < expiration) {
          return true;
        } else {
          // Expiration dépassée, nettoyer
          await AsyncStorage.removeItem('temporaryPremiumExpiration');
        }
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification du premium temporaire:', error);
      return false;
    }
  }

  // Désactiver le premium
  async deactivatePremium() {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, 'false');
      await AsyncStorage.removeItem('temporaryPremiumExpiration');
      this.isPremium = false;
      this.isHardcoreMode = false;
      this.notifyListeners();
      // Premium désactivé avec succès
      return true;
    } catch (error) {
      // Erreur lors de la désactivation du premium
      return false;
    }
  }

  // Obtenir le statut premium actuel
  getPremiumStatus() {
    return this.isPremium;
  }

  // Limites pour la version gratuite
  getPlayerLimit() {
    return this.isPremium ? null : 3; // null = illimité
  }

  // Vérifier si une fonctionnalité est disponible
  isFeatureAvailable(feature) {
    if (this.isPremium) return true;
    
    const freeFeatures = [
      'basic_themes',
      'basic_gameplay',
      'limited_players'
    ];
    
    return freeFeatures.includes(feature);
  }

  // Gestion des thèmes personnalisés
  async getCustomThemes() {
    try {
      const customThemes = await AsyncStorage.getItem(CUSTOM_THEMES_KEY);
      return customThemes ? JSON.parse(customThemes) : [];
    } catch (error) {
      // Erreur lors du chargement des thèmes personnalisés
      return [];
    }
  }

  async saveCustomTheme(theme) {
    try {
      const customThemes = await this.getCustomThemes();
      const newTheme = {
        id: Date.now().toString(),
        name: theme.name,
        questions: theme.questions,
        createdAt: Date.now().toString()
      };
      
      customThemes.push(newTheme);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
      return newTheme;
    } catch (error) {
      console.log('Erreur lors de la sauvegarde du thème personnalisé:', error);
      return null;
    }
  }

  async deleteCustomTheme(themeId) {
    try {
      const customThemes = await this.getCustomThemes();
      const filteredThemes = customThemes.filter(theme => theme.id !== themeId);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(filteredThemes));
      return true;
    } catch (error) {
      // Erreur lors de la sauvegarde du thème personnalisé
      return false;
    }
  }

  // Système d'écoute pour les changements de statut premium
  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.isPremium));
  }

  // Configurer les listeners pour les achats in-app
  setupPurchaseListeners() {
    this.purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      // Achat mis à jour
      
      if (purchase.productId === 'hot_potato_premium') {
        try {
          // Valider l'achat côté serveur si nécessaire
          await this.activatePremium();
          
          // Finaliser la transaction
          await finishTransaction({ purchase, isConsumable: false });
          
          // Premium activé avec succès
        } catch (error) {
          console.error('Erreur lors de la finalisation de l\'achat:', error);
        }
      }
    });

    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.error('Erreur d\'achat:', error);
    });
  }

  // Nettoyer les listeners
  cleanup() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
    }
    endConnection();
  }

  // Acheter le premium
  async purchasePremium() {
    try {
      // ID du produit premium (à configurer dans Google Play Console)
      const productId = 'hot_potato_premium';
      
      // Demander l'achat
      await requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'achat premium:', error);
      return false;
    }
  }

  // Restaurer les achats
  async restorePurchases() {
    try {
      // Obtenir les achats disponibles
      const availablePurchases = await getAvailablePurchases();
      
      // Vérifier si l'utilisateur a déjà acheté le premium
      const premiumPurchase = availablePurchases.find(purchase => 
        purchase.productId === 'hot_potato_premium'
      );
      
      if (premiumPurchase) {
        await this.activatePremium();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la restauration des achats:', error);
      return false;
    }
  }

  /**
   * Obtenir les informations du premium
   */
  async getPremiumInfo() {
    try {
      const permanentPremium = await AsyncStorage.getItem(PREMIUM_KEY) === 'true';
      const temporaryPremium = await this.hasTemporaryPremium();
      const isPremium = permanentPremium || temporaryPremium;
      const customThemes = await this.getCustomThemes();
      
      let premiumType = 'none';
      let expirationTime = null;
      
      if (permanentPremium) {
        premiumType = 'permanent';
      } else if (temporaryPremium) {
        premiumType = 'temporary';
        const expiration = await AsyncStorage.getItem('temporaryPremiumExpiration');
        expirationTime = expiration ? parseInt(expiration) : null;
      }
      
      return {
        isPremium,
        premiumType,
        expirationTime,
        customThemesCount: customThemes.length,
        maxPlayers: isPremium ? 50 : 3,
        features: {
          unlimitedPlayers: isPremium,
          customThemes: isPremium,
          allSubthemes: isPremium,
          noAds: permanentPremium // Seul le premium permanent supprime les pubs
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos premium:', error);
      return null;
    }
  }

  // Ajouter un thème personnalisé
  async addCustomTheme(theme) {
    try {
      const customThemes = await this.getCustomThemes();
      const newTheme = {
        id: Date.now().toString(),
        name: theme.name,
        questions: theme.questions,
        createdAt: Date.now().toString()
      };
      
      customThemes.push(newTheme);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du thème personnalisé:', error);
      return false;
    }
  }

  // Supprimer un thème personnalisé
  async removeCustomTheme(themeId) {
    try {
      const customThemes = await this.getCustomThemes();
      const updatedThemes = customThemes.filter(theme => theme.id !== themeId);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(updatedThemes));
      return true;
    } catch (error) {
      // Erreur lors de la suppression du thème personnalisé
      return false;
    }
  }

  // Supprimer tous les thèmes personnalisés
  async clearAllCustomThemes() {
    try {
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les thèmes personnalisés:', error);
      return false;
    }
  }

  // Gestion du mode hardcore
  setHardcoreMode(enabled) {
    this.isHardcoreMode = enabled;
    this.notifyListeners();
  }

  getHardcoreMode() {
    return this.isHardcoreMode;
  }

  isHardcoreModeAvailable() {
    return this.isPremium;
  }

  // Configuration du mode hardcore
  getHardcoreConfig() {
    return {
      timePerRound: 60, // 1 minute
      randomTheme: true,
      wordsToSips: true, // nombre de mots = nombre de gorgées
      failurePenalty: 'finish_drink' // finir son verre en cas d'erreur
    };
  }
}

// Instance singleton
const premiumService = new PremiumService();
export default premiumService;