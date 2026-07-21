import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomModal from '../components/CustomModal';
import PremiumCongratulationsModal from '../components/PremiumCongratulationsModal';
import premiumService from '../services/PremiumService';
import audioService from '../services/AudioService';

const { width, height } = Dimensions.get('window');

const PositionScreen = ({ navigation, route }) => {
  const { playerCount, selectedThemes, randomThemeMode, selectedSubtheme, timerDuration, roundCount, previousPlayerNames, isHardcoreMode } = route.params;
  
  // Initialiser les noms avec les noms précédents s'ils existent, sinon avec des chaînes vides
  const initializePlayerNames = () => {
    const names = Array(playerCount).fill('');
    if (previousPlayerNames && Array.isArray(previousPlayerNames)) {
      // Préremplir avec les noms précédents jusqu'au nombre de joueurs actuel
      for (let i = 0; i < Math.min(playerCount, previousPlayerNames.length); i++) {
        names[i] = previousPlayerNames[i] || '';
      }
    }
    return names;
  };
  
  const [playerNames, setPlayerNames] = useState(initializePlayerNames());
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await premiumService.checkPremiumStatus();
    setIsPremium(premium);
  };

  const handlePlayerNameChange = (index, name) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const validateNames = () => {
    // Vérifier qu'aucun champ n'est vide
    const emptyFields = playerNames.some(name => name.trim() === '');
    if (emptyFields) {
      setErrorMessage('Tous les champs doivent être remplis !');
      setShowErrorModal(true);
      audioService.playWarning();
      return false;
    }

    const filledNames = playerNames.filter(name => name.trim() !== '');
    
    if (filledNames.length < 2) {
      setErrorMessage('Il faut au moins 2 joueurs pour commencer !');
      setShowErrorModal(true);
      audioService.playWarning();
      return false;
    }

    // Vérifier les doublons
    const uniqueNames = new Set(filledNames.map(name => name.trim().toLowerCase()));
    if (uniqueNames.size !== filledNames.length) {
      setErrorMessage('Tous les noms doivent être différents !');
      setShowErrorModal(true);
      audioService.playWarning();
      return false;
    }

    return true;
  };

  const handleStartGame = () => {
    if (!validateNames()) return;

    const finalNames = playerNames.filter(name => name.trim() !== '').map(name => name.trim());
    
    // Son de clic de bouton
    audioService.playButtonClick();
    
    navigation.navigate('Game', {
      playerCount: finalNames.length,
      playerNames: finalNames,
      selectedThemes,
      randomThemeMode,
      selectedSubtheme,
      timerDuration,
      roundCount,
      isHardcoreMode,
    });
  };

  const handlePremiumUpgrade = async () => {
    setShowPremiumModal(false);
    // Ici vous pourriez naviguer vers un écran d'achat
    // Pour la démo, on active directement le premium
    const success = await premiumService.purchasePremium();
    if (success) {
      setIsPremium(true);
      audioService.playSuccess();
      setShowCongratulationsModal(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Noms des Joueurs</Text>
        <Text style={styles.subtitle}>
          Entrez les noms des participants
        </Text>
        <Text style={styles.info}>
          {playerCount} joueurs maximum
        </Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          {Array.from({ length: playerCount }, (_, index) => (
            <View key={index} style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Joueur {index + 1}</Text>
              <TextInput
                style={styles.nameInput}
                placeholder={`Nom du joueur ${index + 1}`}
                placeholderTextColor="#666"
                value={playerNames[index]}
                onChangeText={(text) => handlePlayerNameChange(index, text)}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType={index === playerCount - 1 ? 'done' : 'next'}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>💡 Conseils :</Text>
          <Text style={styles.infoText}>• Au moins 2 joueurs requis</Text>
          <Text style={styles.infoText}>• Tous les noms doivent être différents</Text>
          <Text style={styles.infoText}>• Aucun champ ne peut être vide</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>COMMENCER LE JEU</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="❌ Erreur"
        message={errorMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowErrorModal(false),
            style: 'primary'
          }
        ]}
      />

      <CustomModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        title="🌟 Version Premium"
        message="Débloquez plus de fonctionnalités avec la version premium !"
        buttons={[
          {
            text: 'Plus tard',
            onPress: () => setShowPremiumModal(false),
            style: 'secondary'
          },
          {
            text: 'Upgrader',
            onPress: handlePremiumUpgrade,
            style: 'primary'
          }
        ]}
      />

      {/* Modal de Félicitations Premium */}
      <PremiumCongratulationsModal
        visible={showCongratulationsModal}
        onClose={() => setShowCongratulationsModal(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#ffd93d',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingVertical: 10,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  nameInput: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
  },
  infoText: {
    fontSize: 14,
    color: '#ffd93d',
    marginBottom: 4,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PositionScreen;