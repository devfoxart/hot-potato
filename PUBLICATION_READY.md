# 🎯 Hot Potato - Prêt pour Publication

## ✅ Configuration Terminée

Votre application **Hot Potato** est maintenant **prête pour la publication** sur le Google Play Store !

### 📁 Fichiers Créés

1. **`PLAY_STORE_SETUP.md`** - Guide complet de publication
2. **`STORE_ASSETS.md`** - Spécifications des assets nécessaires
3. **`PRIVACY_POLICY.md`** - Politique de confidentialité complète
4. **`BUILD_PRODUCTION.md`** - Script de compilation finale

### ⚙️ Configurations Validées

#### EAS Build ✅
- Configuration production dans `eas.json`
- Profils de build Android (APK + AAB)
- Signing automatique configuré

#### Application ✅
- Package Android : `com.dronsart.hotpotato`
- Version : 1.0.0
- VersionCode : 1
- Permissions : Internet, Network, Vibrate
- Icône et splash screen configurés

#### AdMob ⚠️
- ID Android configuré en production
- ID iOS encore sur l'ID de test Google — à remplacer si publication iOS prévue
- Service publicitaire implémenté
- Gestion des interstitiels

#### IAP (In-App Purchase) ✅
- Service d'achat implémenté
- Produit `hot_potato_premium` configuré
- Gestion des erreurs et restauration

## 🚀 Prochaines Étapes

### 1. Remplacer les IDs de Test (OBLIGATOIRE)

**AdMob - Créer un compte :**
1. Aller sur https://admob.google.com
2. Créer une application "Hot Potato"
3. Créer une unité publicitaire "Interstitiel"
4. Remplacer dans `app.json` :
   ```json
   "android_app_id": "ca-app-pub-VOTRE_ID~XXXXXXXX"
   ```
5. Remplacer dans `src/services/AdService.js` :
   ```javascript
   const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-VOTRE_ID/XXXXXXXX';
   ```

### 2. Configurer Google Play Console

**Créer le produit IAP :**
1. Compte développeur Google Play (25$)
2. Créer l'application "Hot Potato"
3. Produits > Produits gérés > Nouveau produit
   - ID : `hot_potato_premium`
   - Prix : 2,99€

### 3. Publier la Politique de Confidentialité

**Options recommandées :**
- GitHub Pages (gratuit)
- Google Sites (gratuit)
- Votre site web

**Étapes :**
1. ~~Modifier `PRIVACY_POLICY.md` (remplacer les placeholders)~~ ✅ Fait
2. Publier en ligne
3. Obtenir l'URL publique

### 3bis. Classification de contenu (OBLIGATOIRE)

⚠️ Hot Potato est un jeu à boire (gorgées + notice de prévention alcool intégrée). Dans le questionnaire de classification Play Console, déclarer la présence de contenu lié à l'alcool et viser une classification adulte (16+/18+), **pas** "Tout public". Voir `PLAY_STORE_SETUP.md` section 4bis.

### 3ter. Crash Reporting (RECOMMANDÉ)

Un scaffold Sentry est intégré (`App.js`, `@sentry/react-native`). Pour l'activer :
1. Créer un compte gratuit sur https://sentry.io et un projet React Native
2. Copier `.env.example` en `.env` et renseigner `EXPO_PUBLIC_SENTRY_DSN`
3. (Optionnel) Renseigner `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` pour l'upload des source maps lors des builds EAS

Sans DSN renseigné, Sentry reste désactivé (no-op) et l'app fonctionne normalement.

### 4. Créer les Assets du Store

**Obligatoires :**
- 5 screenshots (1080x1920 ou 1080x2340)
- Feature graphic (1024x500)
- Description courte (80 caractères)
- Description complète (4000 caractères)

**Voir `STORE_ASSETS.md` pour les détails**

### 5bis. Tester la New Architecture (OBLIGATOIRE avant build final)

⚠️ `newArchEnabled` a été activé (requis par `react-native-reanimated` v4) et `react-native-worklets` a été ajouté en conséquence. Cette combinaison n'a pas pu être testée sur un appareil réel depuis cet environnement — **installer un build de développement et tester en profondeur** (animations, AdMob, IAP) avant de compiler la version finale.

### 5. Compiler l'APK Final

```bash
# Se connecter à Expo
eas login

# Naviguer vers le projet
cd "F:\DRONSART Thomas\App mobile\Hot potato\HotPotatoExpo"

# Build de production
eas build --platform android --profile production
```

### 6. Tester et Publier

1. **Test** : Installer l'AAB via Play Console > Test interne
2. **Vérifier** : Publicités, achats, gameplay
3. **Publier** : Soumettre pour révision Google

## 📊 Résumé des Coûts

- **Google Play Developer** : 25$ (une fois)
- **EAS Build** : Gratuit (plan hobby)
- **AdMob** : Gratuit
- **Hébergement politique** : Gratuit

**Total : 25$**

## ⏱️ Temps Estimé

- **Configuration AdMob** : 30 min
- **Play Console setup** : 1 heure
- **Assets création** : 2-3 heures
- **Build et test** : 1 heure
- **Publication** : 30 min
- **Révision Google** : 1-3 jours

**Total : ~5-6 heures + révision**

## 🎮 Fonctionnalités de l'App

### Gameplay ✅
- Jeu à boire par équipe façon "Catégories" : thèmes, chrono, gorgées
- Mode Hardcore et thèmes personnalisés (Premium)
- Interface intuitive et responsive
- Animations et effets visuels

### Monétisation ✅
- Publicités interstitielles (AdMob)
- Version premium sans pub (IAP)
- Gestion des achats et restauration

### Technique ✅
- React Native + Expo (New Architecture)
- Compatible Android 5.0+
- Optimisé pour tous les écrans
- Persistance locale via AsyncStorage (services dédiés)

## 📞 Support

Si vous rencontrez des problèmes :

1. **Documentation** : Consultez les fichiers `.md` créés
2. **Expo Docs** : https://docs.expo.dev/
3. **AdMob Help** : https://support.google.com/admob/
4. **Play Console** : https://support.google.com/googleplay/android-developer/

---

## 🏆 Félicitations !

Votre application **Hot Potato** est techniquement prête pour le Google Play Store. Il ne reste plus qu'à :

1. Remplacer les IDs de test
2. Créer les assets visuels
3. Compiler et publier

**Bonne chance pour votre lancement ! 🚀**