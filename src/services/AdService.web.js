// Version web du service AdMob (mock)
// Les publicités ne sont pas supportées sur le web

class AdService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    // Mock initialization pour le web
    this.initialized = true;
    console.log('AdService: Web version - ads disabled');
  }

  async showInterstitial() {
    // Mock pour le web - ne fait rien
    console.log('AdService: Interstitial ad would show on mobile');
    return Promise.resolve();
  }

  canShowAd() {
    // Sur le web, on considère qu'on peut toujours "montrer" une pub (même si c'est un mock)
    return true;
  }

  updateAdFrequency() {
    // Mock pour le web
  }

  resetAdFrequency() {
    // Mock pour le web
  }
}

// Instance singleton
const adService = new AdService();
export default adService;