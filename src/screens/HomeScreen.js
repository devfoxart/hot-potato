import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import CustomModal from '../components/CustomModal';
import PremiumCongratulationsModal from '../components/PremiumCongratulationsModal';
import AlcoholPreventionModal from '../components/AlcoholPreventionModal';
import premiumService from '../services/PremiumService';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showAlcoholPreventionModal, setShowAlcoholPreventionModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Fonction pour désactiver le premium


  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await premiumService.checkPremiumStatus();
    setIsPremium(premium);
  };

  const handlePremiumUpgrade = async () => {
    setShowPremiumModal(false);
    const success = await premiumService.purchasePremium();
    if (success) {
      setIsPremium(true);
      audioService.playSuccess();
      setShowCongratulationsModal(true);
    }
  };

  const openAppStore = () => {
    const appId = Platform.OS === 'ios' ? 'YOUR_IOS_APP_ID' : 'com.yourcompany.hotpotato';
    const url = Platform.OS === 'ios' 
      ? `https://apps.apple.com/app/id${appId}?action=write-review`
      : `market://details?id=${appId}`;
    
    Linking.openURL(url).catch(() => {
      // Fallback pour Android si Google Play Store n'est pas installé
      if (Platform.OS === 'android') {
        Linking.openURL(`https://play.google.com/store/apps/details?id=${appId}`);
      }
    });
  };

  const reportBug = () => {
    const appId = Platform.OS === 'ios' ? 'YOUR_IOS_APP_ID' : 'com.yourcompany.hotpotato';
    const url = Platform.OS === 'ios'
      ? `https://apps.apple.com/app/id${appId}?action=write-review`
      : `market://details?id=${appId}`;
    
    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'android') {
        Linking.openURL(`https://play.google.com/store/apps/details?id=${appId}`);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.overlay}>
          {/* Bouton No-Ads en haut à droite */}
          {!isPremium && (
            <TouchableOpacity
              style={styles.noAdsButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                setShowPremiumModal(true);
              }}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../../assets/no-ads-icon.png')} 
                style={styles.noAdsIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

          {/* Bouton d'aide "?" */}
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              vibrationService.vibrateButtonClick();
              audioService.playButtonClick();
              setShowHelpModal(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>



          <View style={styles.titleContainer}>
            <View style={styles.logoContainer}>
              <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
            </View>
            <Text style={styles.title}>🔥 HOT POTATO 🔥</Text>
            <Text style={styles.subtitle}>Time's Up à Boire</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                audioService.playButtonClick();
                navigation.navigate('Config');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.playButtonText}>🎮 JOUER</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rulesButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                audioService.playButtonClick();
                navigation.navigate('Rules');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.rulesButtonText}>📋 RÈGLES</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                audioService.playButtonClick();
                navigation.navigate('Settings');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.settingsButtonText}>⚙️ PARAMÈTRES</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                audioService.playButtonClick();
                vibrationService.vibrateButtonClick();
                setShowAlcoholPreventionModal(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerText}>Buvez avec modération 🍻</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal Premium */}
      <CustomModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        showCloseButton={false}
        title="🌟 Fonctionnalité Premium"
        message={`Cette fonctionnalité nécessite le premium

🎯 Débloquez toutes les fonctionnalités :

• 🎮 Jusqu'à 50 joueurs (au lieu de 3)

• ⏱️ Chronomètre jusqu'à 2 minutes (au lieu de 30s)

• 🎲 Jusqu'à 20 manches (au lieu de 3)

• 🎨 Tous les thèmes premium disponibles

• 🎯 Sélection multiple de thèmes par manche

• 🎲 Mode thème aléatoire intelligent

• 🔥 Mode Hardcore ultra-intense

• ✨ Création de thèmes personnalisés

• 🚫 Suppression des publicités`}
        buttons={[
          {
            text: 'Plus tard',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              setShowPremiumModal(false);
            },
            style: 'secondary'
          },
          {
            text: 'Acheter Premium - 2.99€',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              handlePremiumUpgrade();
            },
            style: 'primary'
          }
        ]}
      />

      {/* Modal de Félicitations Premium */}
      <PremiumCongratulationsModal
        visible={showCongratulationsModal}
        onClose={() => setShowCongratulationsModal(false)}
      />

      {/* Modal de Prévention Alcool */}
      <AlcoholPreventionModal
        visible={showAlcoholPreventionModal}
        onClose={() => setShowAlcoholPreventionModal(false)}
      />

      {/* Modal d'Aide */}
      <CustomModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        showCloseButton={true}
        title="❓ Aide & Support"
        message="Comment pouvons-nous vous aider ?"
        buttons={[
          {
            text: '🐛 Signaler un bug',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              setShowHelpModal(false);
              reportBug();
            },
            style: 'secondary'
          },
          {
            text: '⭐ Noter l\'application',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              setShowHelpModal(false);
              openAppStore();
            },
            style: 'primary'
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a2e',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffd93d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '80%',
  },
  playButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: '100%',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rulesButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffd93d',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
  },
  rulesButtonText: {
    color: '#ffd93d',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4ecdc4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    marginTop: 15,
  },
  settingsButtonText: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#ccc',
    fontSize: 14,
    fontStyle: 'italic',
  },
  noAdsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  noAdsIcon: {
    width: 30,
    height: 30,
  },
  helpButton: {
    position: 'absolute',
    top: 85,
    right: 25,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    zIndex: 1,
  },
  helpButtonText: {
    color: 'rgba(255, 217, 61, 0.8)',
    fontSize: 18,
    fontWeight: '500',
  },

});

export default HomeScreen;