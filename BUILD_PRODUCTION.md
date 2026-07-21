# Script de Build Production - Hot Potato

## 🚀 Compilation pour Google Play Store

### Prérequis Obligatoires

#### 1. Compte Expo/EAS
```bash
# Se connecter à Expo (obligatoire)
eas login
```

#### 2. Vérifications Avant Build

**✅ Configuration vérifiée :**
- `eas.json` : Configuration production OK
- `app.json` : Package Android et permissions OK
- IDs AdMob : Configurés (à remplacer par les vrais)
- Version : 1.0.0
- VersionCode : 1

**⚠️ À faire avant le build final :**
1. Remplacer les IDs AdMob par les vrais dans :
   - `app.json` (lignes 44-45)
   - `src/services/AdService.js` (ligne 16)

2. Créer le produit IAP dans Google Play Console :
   - ID : `hot_potato_premium`
   - Prix : 2,99€

### Commandes de Build

#### Build de Test (AAB)
```bash
# Naviguer vers le dossier du projet
cd "F:\DRONSART Thomas\App mobile\Hot potato\HotPotatoExpo"

# Build de production (Android App Bundle)
eas build --platform android --profile production
```

#### Build APK (pour test local)
```bash
# Si vous voulez un APK pour tester localement
eas build --platform android --profile preview
```

### Processus de Build

1. **Initialisation** (1-2 min)
   - Vérification des configurations
   - Upload du code source

2. **Compilation** (10-15 min)
   - Build Android sur les serveurs Expo
   - Signature automatique
   - Génération de l'AAB

3. **Téléchargement**
   - Lien de téléchargement fourni
   - Fichier AAB prêt pour le Play Store

### Après le Build

#### 1. Télécharger l'AAB
```bash
# Le lien sera affiché dans le terminal
# Ou aller sur https://expo.dev/accounts/[username]/projects/hot-potato/builds
```

#### 2. Tester l'AAB
```bash
# Installer l'AAB sur un appareil de test
# Via Google Play Console > Test interne
```

#### 3. Upload vers Play Store
1. Aller sur Google Play Console
2. Créer une nouvelle release
3. Upload de l'AAB
4. Remplir les métadonnées
5. Soumettre pour révision

## 📋 Checklist Finale

### Avant le Build
- [ ] Compte Expo configuré (`eas login`)
- [ ] IDs AdMob remplacés par les vrais (iOS encore en ID de test)
- [ ] Produit IAP créé dans Play Console (`hot_potato_premium`)
- [ ] Version et versionCode corrects
- [ ] Build de développement testé sur appareil réel avec la New Architecture activée (voir `PUBLICATION_READY.md` section 5bis)

### Après le Build
- [ ] AAB téléchargé
- [ ] AAB testé sur appareil réel
- [ ] Screenshots créés (5 minimum)
- [ ] Descriptions rédigées
- [ ] Politique de confidentialité publiée en ligne
- [ ] Feature graphic créé (1024x500)

### Publication Play Store
- [ ] Compte développeur Google Play (25$)
- [ ] AAB uploadé
- [ ] Métadonnées complétées
- [ ] Classification du contenu
- [ ] Prix et disponibilité configurés
- [ ] Soumission pour révision

## 🔧 Dépannage

### Erreurs Communes

**"Not logged in"**
```bash
eas login
```

**"Invalid configuration"**
- Vérifier `eas.json`
- Vérifier `app.json`

**"Build failed"**
- Vérifier les logs détaillés
- Vérifier les dépendances

### Support
- Documentation EAS : https://docs.expo.dev/build/introduction/
- Forum Expo : https://forums.expo.dev/
- Discord Expo : https://chat.expo.dev/

## 📊 Estimation des Temps

- **Préparation** : 30 min
- **Build EAS** : 15 min
- **Tests** : 1 heure
- **Upload Play Store** : 30 min
- **Révision Google** : 1-3 jours

**Total : ~2 heures + temps de révision**

## 💰 Coûts

- **EAS Build** : Gratuit (plan hobby)
- **Google Play Developer** : 25$ (une fois)
- **AdMob** : Gratuit
- **Total** : 25$

---

## 🚨 IMPORTANT

**Ne pas oublier avant le build final :**
1. Remplacer TOUS les IDs de test
2. Tester avec les vrais IDs AdMob
3. Créer le produit IAP dans Play Console
4. Publier la politique de confidentialité en ligne

**Le build de production ne peut pas être modifié après upload !**