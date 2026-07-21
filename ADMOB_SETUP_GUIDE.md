# Guide d'intégration AdMob - Hot Potato

## ✅ Configuration terminée

Votre application est maintenant configurée pour utiliser Google AdMob avec votre ID d'unité publicitaire : `ca-app-pub-5791149705686966/6876354715`

## 📋 Ce qui a été fait

### 1. Installation des packages
- ✅ `react-native-google-mobile-ads` - SDK AdMob pour React Native
- ✅ `expo-dev-client` - Nécessaire pour les builds de développement
- ✅ `eas-cli` - Outil de build Expo

### 2. Configuration app.json
- ✅ Ajout des App IDs AdMob (actuellement en mode test)
- ✅ Configuration du plugin expo-dev-client
- ✅ Optimisations d'initialisation AdMob

### 3. Mise à jour AdService.js
- ✅ Remplacement de la simulation par de vraies publicités AdMob
- ✅ Intégration de votre ID d'unité publicitaire
- ✅ Gestion des erreurs avec fallback
- ✅ Support des publicités interstitielles et récompensées

## 🚀 Prochaines étapes pour tester

### Étape 1: Remplacer les App IDs de test
Dans `app.json`, remplacez les App IDs de test par vos vrais App IDs AdMob :
```json
"react-native-google-mobile-ads": {
  "android_app_id": "ca-app-pub-VOTRE_VRAI_ID~ANDROID",
  "ios_app_id": "ca-app-pub-VOTRE_VRAI_ID~IOS"
}
```

### Étape 2: Créer des Ad Units séparées
Actuellement, le même ID est utilisé pour les interstitielles et récompensées. Créez des Ad Units séparées dans AdMob :
- Une pour les publicités interstitielles
- Une pour les publicités récompensées

Puis mettez à jour `AdService.js` ligne 18-19.

### Étape 3: Build de développement
```bash
# Se connecter à Expo (si pas déjà fait)
eas login

# Configurer le projet
eas build:configure

# Build Android de développement
eas build --platform android --profile development --local

# Ou build dans le cloud
eas build --platform android --profile development
```

### Étape 4: Installation et test
1. Installez l'APK généré sur un appareil Android réel
2. Lancez l'app avec : `expo start --dev-client`
3. Testez les publicités dans l'application

## ⚠️ Points importants

### Limitations actuelles
- ❌ **Expo Go ne fonctionne plus** - Les publicités nécessitent du code natif
- ✅ **EAS Build requis** - Utilisez les development builds
- ✅ **Tests sur vrais appareils** - Les publicités ne fonctionnent pas sur simulateur

### IDs de test vs production
- En mode développement (`__DEV__ = true`) : IDs de test automatiques
- En mode production : Vos vrais IDs AdMob

### Gestion des erreurs
- Si AdMob échoue, l'app utilise des alertes de fallback
- Les logs détaillés sont disponibles dans la console

## 🎯 Fonctionnalités implémentées

### Publicités interstitielles
- Affichées toutes les 2 manches (configurable)
- Sauvegarde automatique du compteur
- Gestion des événements de fermeture

### Publicités récompensées
- Débloquent l'accès premium temporaire (24h)
- Vérification de la récompense obtenue
- Interface utilisateur intégrée

### Premium Service
- Intégration complète avec le système de premium
- Désactivation automatique après expiration
- Bouton de désactivation manuelle

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console
2. Assurez-vous d'utiliser de vrais App IDs AdMob
3. Testez sur un appareil physique
4. Vérifiez que votre compte AdMob est approuvé

Votre application est maintenant prête pour la monétisation avec AdMob ! 🎉