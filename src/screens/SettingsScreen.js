import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';
import CustomModal from '../components/CustomModal';

const SettingsScreen = ({ navigation }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showCGUModal, setShowCGUModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('gameSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setSoundEnabled(parsedSettings.soundEnabled ?? true);
        setVibrationEnabled(parsedSettings.vibrationEnabled ?? true);
        
        // Synchroniser les services avec les paramètres chargés
        await audioService.setSoundEnabled(parsedSettings.soundEnabled ?? true);
        await vibrationService.setVibrationEnabled(parsedSettings.vibrationEnabled ?? true);
      } else {
        // Paramètres par défaut si aucun paramètre n'est trouvé
        setSoundEnabled(true);
        setVibrationEnabled(true);
        await audioService.setSoundEnabled(true);
        await vibrationService.setVibrationEnabled(true);
      }
    } catch (error) {
      // Erreur lors du chargement des paramètres
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('gameSettings', JSON.stringify(newSettings));
    } catch (error) {
      // Erreur lors de la sauvegarde des paramètres
    }
  };

  const handleSoundToggle = async (value) => {
    setSoundEnabled(value);
    const newSettings = {
      soundEnabled: value,
      vibrationEnabled,
    };
    await saveSettings(newSettings);
    
    // Synchroniser avec le service audio
    await audioService.setSoundEnabled(value);
    
    // Jouer le son et vibration si activés
    if (value) {
      audioService.playButtonClick();
    }
    vibrationService.vibrateButtonClick();
  };

  const handleVibrationToggle = async (value) => {
    setVibrationEnabled(value);
    const newSettings = {
      soundEnabled,
      vibrationEnabled: value,
    };
    await saveSettings(newSettings);
    
    // Synchroniser avec le service de vibration
    await vibrationService.setVibrationEnabled(value);
    
    // Jouer le son et vibration si activés
    audioService.playButtonClick();
    if (value) {
      vibrationService.vibrateButtonClick();
    }
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Réinitialiser les paramètres',
      'Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: async () => {
            setSoundEnabled(true);
            setVibrationEnabled(true);
            
            const defaultSettings = {
              soundEnabled: true,
              vibrationEnabled: true,
            };
            await saveSettings(defaultSettings);
            
            // Synchroniser avec les services
            await audioService.setSoundEnabled(true);
            await vibrationService.setVibrationEnabled(true);
            
            audioService.playButtonClick();
            vibrationService.vibrateButtonClick();
          },
        },
      ]
    );
  };

  const handleBackPress = () => {
    audioService.playButtonClick();
    audioService.playModalClose();
    vibrationService.vibrateButtonClick();
    vibrationService.vibrateModalClose();
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ PARAMÈTRES</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Audio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔊 AUDIO</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Sons d'interface</Text>
                  <Text style={styles.settingDescription}>Activer les sons des boutons et interactions</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={handleSoundToggle}
                  trackColor={{ false: '#767577', true: '#ffd93d' }}
                  thumbColor={soundEnabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Vibrations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📳 VIBRATIONS</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Retour haptique</Text>
                  <Text style={styles.settingDescription}>Activer les vibrations tactiles dans toute l'application</Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={handleVibrationToggle}
                  trackColor={{ false: '#767577', true: '#ffd93d' }}
                  thumbColor={vibrationEnabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* CGU et Légal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚖️ LÉGAL</Text>
              
              <TouchableOpacity
                style={styles.legalButton}
                onPress={() => {
                  audioService.playButtonClick();
                  vibrationService.vibrateButtonClick();
                  setShowCGUModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.legalButtonText}>📄 Conditions Générales d'Utilisation</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.legalButton}
                onPress={() => {
                  audioService.playButtonClick();
                  vibrationService.vibrateButtonClick();
                  setShowPrivacyModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.legalButtonText}>🔒 Politique de Confidentialité</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.legalButton}
                onPress={() => {
                  audioService.playButtonClick();
                  vibrationService.vibrateButtonClick();
                  setShowLegalModal(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.legalButtonText}>ℹ️ Mentions Légales</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔧 ACTIONS</Text>
              
              <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                handleResetSettings();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>🔄 Réinitialiser les paramètres</Text>
            </TouchableOpacity>
            </View>

            {/* Informations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ℹ️ INFORMATIONS</Text>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Version de l'application</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Développé par</Text>
                <Text style={styles.infoValue}>Hot Potato Team</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modales légales */}
      <CustomModal
        visible={showCGUModal}
        onClose={() => setShowCGUModal(false)}
        title="📄 Conditions Générales d'Utilisation"
        message="En utilisant cette application, vous acceptez nos conditions d'utilisation. Cette application est fournie 'en l'état' sans garantie. L'utilisation de l'application se fait sous votre propre responsabilité."
        buttons={[
          {
            text: 'Compris',
            onPress: () => setShowCGUModal(false),
            style: 'primary'
          }
        ]}
      />

      <CustomModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="🔒 Politique de Confidentialité"
        message="Cette application ne collecte aucune donnée personnelle. Toutes les données de jeu sont stockées localement sur votre appareil et ne sont jamais transmises à des serveurs externes."
        buttons={[
          {
            text: 'Compris',
            onPress: () => setShowPrivacyModal(false),
            style: 'primary'
          }
        ]}
      />

      <CustomModal
        visible={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        title="ℹ️ Mentions Légales"
        message="Hot Potato Game\nVersion 1.0.0\n\nDéveloppé par Hot Potato Team\n\nCette application est un jeu de divertissement. Consommez l'alcool avec modération."
        buttons={[
          {
            text: 'Compris',
            onPress: () => setShowLegalModal(false),
            style: 'primary'
          }
        ]}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#ffd93d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginRight: 50,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 15,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legalButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
  },
  legalButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  infoValue: {
    fontSize: 16,
    color: '#ffd93d',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;