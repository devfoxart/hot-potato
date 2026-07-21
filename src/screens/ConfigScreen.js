import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { getAvailableThemes } from '../data/themes';
import premiumService from '../services/PremiumService';
import CustomModal from '../components/CustomModal';
import PremiumCongratulationsModal from '../components/PremiumCongratulationsModal';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width } = Dimensions.get('window');

const ConfigScreen = ({ navigation, route }) => {
  const previousConfig = route.params?.previousConfig;
  
  const [playerCount, setPlayerCount] = useState(previousConfig?.playerCount || 3);
  const [timerDuration, setTimerDuration] = useState(previousConfig?.timerDuration || 30);
  const [roundCount, setRoundCount] = useState(previousConfig?.roundCount || 3); // Nombre de manches (adapté au mode gratuit)
  const [selectedThemes, setSelectedThemes] = useState(previousConfig?.selectedThemes || []);
  const [randomThemeMode, setRandomThemeMode] = useState(previousConfig?.randomThemeMode || false);
  const [availableThemes, setAvailableThemes] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [showCustomThemeModal, setShowCustomThemeModal] = useState(false);

  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeEmoji, setCustomThemeEmoji] = useState('');
  const [customThemes, setCustomThemes] = useState([]);
  const [isHardcoreMode, setIsHardcoreMode] = useState(previousConfig?.isHardcoreMode || false);

  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    loadThemes();
    
    // Ajouter un listener pour recharger les thèmes quand on revient sur cet écran
    const unsubscribe = navigation.addListener('focus', () => {
      loadThemes();
    });
    
    // Ajouter un gestionnaire pour le bouton de retour du header
    const beforeRemoveListener = navigation.addListener('beforeRemove', (e) => {
      // Jouer le son de fermeture modal avant de quitter l'écran
      audioService.playModalClose();
    });
    
    return () => {
      unsubscribe();
      beforeRemoveListener();
    };
  }, [navigation]);

  const loadThemes = async () => {
    const premium = await premiumService.checkPremiumStatus();
    setIsPremium(premium);
    const themes = await getAvailableThemes(premium, premiumService);
    setAvailableThemes(themes);
    
    // Charger les thèmes personnalisés
    const customThemesList = await premiumService.getCustomThemes();
    setCustomThemes(customThemesList);
    
    // Sélectionner le thème précédent ou le premier thème par défaut
    if (themes.length > 0 && !previousConfig?.selectedThemes && selectedThemes.length === 0) {
      setSelectedThemes([themes[0].key]);
    }
  };

  const updatePlayerCount = (increment) => {
    const maxPlayers = isPremium ? 50 : 3; // Limite premium vs gratuit
    setPlayerCount(prev => {
      const newCount = prev + increment;
      // Si on essaie de dépasser la limite en mode gratuit, afficher le modal premium
      if (!isPremium && increment > 0 && prev >= 3) {
        vibrationService.vibrateError();
        setShowPremiumModal(true);
        audioService.playWarning();
        return prev; // Ne pas changer la valeur
      }
      vibrationService.vibrateButtonClick();
      audioService.playButtonClick();
      return Math.max(2, Math.min(maxPlayers, newCount));
    });
  };

  const updateTimerDuration = (increment) => {
    setTimerDuration(prev => {
      const newDuration = prev + increment;
      const maxDuration = isPremium ? 120 : 30; // Limite gratuite: 30s max
      // Si on essaie de dépasser la limite en mode gratuit, afficher le modal premium
      if (!isPremium && increment > 0 && prev >= 30) {
        vibrationService.vibrateError();
        setShowPremiumModal(true);
        audioService.playWarning();
        return prev; // Ne pas changer la valeur
      }
      vibrationService.vibrateButtonClick();
      audioService.playButtonClick();
      return Math.max(10, Math.min(maxDuration, newDuration));
    });
  };

  const updateRoundCount = (increment) => {
    setRoundCount(prev => {
      const newCount = prev + increment;
      const maxRounds = isPremium ? 20 : 3; // Limite gratuite: 3 manches max
      // Si on essaie de dépasser la limite en mode gratuit, afficher le modal premium
      if (!isPremium && increment > 0 && prev >= 3) {
        vibrationService.vibrateError();
        setShowPremiumModal(true);
        audioService.playWarning();
        return prev; // Ne pas changer la valeur
      }
      vibrationService.vibrateButtonClick();
      audioService.playButtonClick();
      const finalCount = Math.max(1, Math.min(maxRounds, newCount));
      
      // Si le nombre de manches diminue, désélectionner les thèmes en trop
      if (finalCount < prev && selectedThemes.length > finalCount) {
        setSelectedThemes(prevThemes => prevThemes.slice(0, finalCount));
      }
      
      return finalCount;
    });
  };

  const handleThemeSelect = (themeKey) => {
    // En mode thème aléatoire, ne pas permettre la sélection manuelle
    if (randomThemeMode) return;
    
    const theme = availableThemes.find(t => t.key === themeKey);
    if (!theme) {
      // Vérifier si c'est un thème personnalisé
      const customTheme = customThemes.find(t => t.name === themeKey);
      if (customTheme) {
        handleThemeToggle(themeKey);
      }
      return;
    }

    // Si le thème est verrouillé, afficher le modal premium
    if (theme.locked) {
      vibrationService.vibrateError();
      setShowPremiumModal(true);
      audioService.playWarning();
      return;
    }

    handleThemeToggle(themeKey);
  };

  const handleThemeToggle = (themeKey) => {
    setSelectedThemes(prev => {
      const isSelected = prev.includes(themeKey);
      if (isSelected) {
        // Retirer le thème de la sélection
        vibrationService.vibrateButtonClick();
        audioService.playUnselection(); // Son de désélection
        return prev.filter(t => t !== themeKey);
      } else {
        // Ajouter le thème à la sélection (maximum = nombre de manches)
        if (prev.length < roundCount) {
          vibrationService.vibrateSuccess();
          audioService.playSelection(); // Son de sélection
          return [...prev, themeKey];
        }
        return prev;
      }
    });
  };

  const handlePremiumUpgrade = async () => {
    setShowPremiumModal(false);
    const success = await premiumService.purchasePremium();
    if (success) {
      await loadThemes();
      audioService.playSuccess();
      setShowCongratulationsModal(true);
    }
  };

  // Obtenir un accès premium temporaire via publicité
  const handleTemporaryPremium = async () => {
    setShowPremiumModal(false);
    const success = await premiumService.activateTemporaryPremium();
    if (success) {
      setIsPremium(true);
      loadThemes();
    }
  };

  // Gérer la création de thème personnalisé
  const handleCreateCustomTheme = () => {
    if (!isPremium) {
      vibrationService.vibrateError();
      setShowPremiumModal(true);
      audioService.playWarning();
      return;
    }
    vibrationService.vibrateButtonClick();
    setShowCustomThemeModal(true);
  };

  // Sauvegarder le thème personnalisé
  const saveCustomTheme = async () => {
    if (!customThemeName.trim()) {
      alert('Veuillez entrer un nom pour le thème');
      return;
    }

    const emoji = customThemeEmoji.trim() || '🎯';
    const themeName = `${emoji} ${customThemeName.trim()}`;

    const customTheme = {
      name: themeName
    };

    const success = await premiumService.addCustomTheme(customTheme);
    if (success) {
      setShowCustomThemeModal(false);
      setCustomThemeName('');
      setCustomThemeEmoji('');
      loadThemes();
      alert('Thème personnalisé créé avec succès !');
    } else {
      alert('Erreur lors de la création du thème');
    }
  };

  // Annuler la création de thème personnalisé
  const cancelCustomTheme = () => {
    setShowCustomThemeModal(false);
    setCustomThemeName('');
    setCustomThemeEmoji('');
  };

  // Fonction pour valider si un caractère est un emoji
  const isEmoji = (char) => {
    // Regex plus complète pour tous les emojis Unicode
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20FF}]/u;
    return emojiRegex.test(char);
  };

  // Fonction pour gérer la saisie d'emoji
  const handleEmojiChange = (text) => {
    // Permettre la saisie libre mais limiter la longueur
    setCustomThemeEmoji(text.slice(0, 2));
  };



  const handleRandomThemeToggle = () => {
    if (!isPremium) {
      vibrationService.vibrateError();
      setShowPremiumModal(true);
      audioService.playWarning();
      return;
    }
    vibrationService.vibrateButtonClick();
    setRandomThemeMode(prev => {
      if (!prev) {
        // Activer le mode aléatoire, vider la sélection manuelle
        setSelectedThemes([]);
      }
      return !prev;
    });
  };

  const getSelectedThemeDisplay = () => {
    if (randomThemeMode) {
      return 'Mode thème aléatoire activé';
    }
    
    if (selectedThemes.length === 0) return 'Aucun thème sélectionné';
    
    if (selectedThemes.length === 1) {
      const theme = availableThemes.find(t => t.key === selectedThemes[0]);
      if (theme) return theme.name;
      
      const customTheme = customThemes.find(t => t.name === selectedThemes[0]);
      return customTheme ? customTheme.name : 'Thème inconnu';
    }
    
    return `${selectedThemes.length} thèmes sélectionnés`;
  };

  const getGameDuration = () => {
    // Plus il y a de joueurs, plus le temps par manche est court
    const baseTime = 60; // 60 secondes de base
    const timePerPlayer = Math.max(10, baseTime - (playerCount - 3) * 5);
    return timePerPlayer;
  };

  const handleStartGame = () => {
    if (!randomThemeMode && selectedThemes.length === 0) {
      return;
    }

    // Son de bouton et vibration
    vibrationService.vibrateSuccess();
    audioService.playButtonClick();

    // Configurer le mode hardcore dans le service
    premiumService.setHardcoreMode(isHardcoreMode);

    navigation.navigate('Position', {
      playerCount,
      selectedThemes,
      randomThemeMode,
      timerDuration: isHardcoreMode ? 60 : timerDuration, // 1 minute en mode hardcore
      roundCount,
      isHardcoreMode,
      previousPlayerNames: previousConfig?.playerNames, // Transmettre les noms précédents
    });
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Configuration</Text>
        <Text style={styles.subtitle}>Personnalisez votre partie</Text>
        {isPremium && (
          <TouchableOpacity 
            style={styles.premiumBadge}
            onPress={() => {
              vibrationService.vibrateButtonClick();
              setShowCongratulationsModal(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.premiumText}>🌟 PREMIUM</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Nombre de joueurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👥 Nombre de joueurs</Text>
        <View style={styles.playerCountContainer}>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => updatePlayerCount(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.countButtonText}>-</Text>
          </TouchableOpacity>
          
          <View style={styles.countDisplay}>
            <Text style={styles.countText}>{playerCount}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => updatePlayerCount(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.countButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.rangeText}>
          {isPremium ? 'Jusqu\'à 50 joueurs' : 'Jusqu\'à 3 joueurs (Premium: jusqu\'à 50)'}
        </Text>
      </View>

      {/* Durée du chronos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⏱️ Durée du chronos</Text>
        <Text style={styles.sectionSubtitle}>Temps par manche en secondes</Text>
        <View style={styles.playerCountContainer}>
          <TouchableOpacity
            style={[styles.countButton, isHardcoreMode && styles.disabledButton]}
            onPress={isHardcoreMode ? null : () => updateTimerDuration(-5)}
            activeOpacity={isHardcoreMode ? 1 : 0.7}
            disabled={isHardcoreMode}
          >
            <Text style={[styles.countButtonText, isHardcoreMode && styles.disabledButtonText]}>-</Text>
          </TouchableOpacity>
          
          <View style={[styles.countDisplay, isHardcoreMode && styles.disabledCountDisplay]}>
            <Text style={[styles.countText, isHardcoreMode && styles.disabledCountText]}>
              {isHardcoreMode ? '60s' : `${timerDuration}s`}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.countButton, isHardcoreMode && styles.disabledButton]}
            onPress={isHardcoreMode ? null : () => updateTimerDuration(5)}
            activeOpacity={isHardcoreMode ? 1 : 0.7}
            disabled={isHardcoreMode}
          >
            <Text style={[styles.countButtonText, isHardcoreMode && styles.disabledButtonText]}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.rangeText, isHardcoreMode && styles.disabledRangeText]}>
          {isHardcoreMode ? '🔥 Mode Hardcore : Temps fixe à 1 minute' : (isPremium ? 'Entre 10 et 120 secondes' : 'Entre 10 et 30 secondes (Premium: jusqu\'à 120s)')}
        </Text>
      </View>

      {/* Nombre de manches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Nombre de manches</Text>
        <Text style={styles.sectionSubtitle}>Combien de manches voulez-vous jouer ?</Text>
        <View style={styles.playerCountContainer}>
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => updateRoundCount(-1)}
            activeOpacity={0.7}
          >
            <Text style={styles.countButtonText}>-</Text>
          </TouchableOpacity>
          
          <View style={styles.countDisplay}>
            <Text style={styles.countText}>{roundCount}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.countButton}
            onPress={() => updateRoundCount(1)}
            activeOpacity={0.7}
          >
            <Text style={styles.countButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.rangeText}>
          {isPremium ? 'Entre 1 et 20 manches' : 'Entre 1 et 3 manches (Premium: jusqu\'à 20)'}
        </Text>
      </View>

      {/* Sélection de thème */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thème de jeu</Text>
        <Text style={styles.sectionSubtitle}>
          {randomThemeMode ? 'Mode aléatoire activé' : `Sélectionnez jusqu'à ${roundCount} thèmes (${selectedThemes.length}/${roundCount})`}
        </Text>
        
        {/* Bouton mode aléatoire */}
        <TouchableOpacity 
          style={[
            styles.randomModeButton,
            randomThemeMode && styles.randomModeButtonActive,
            !isPremium && styles.randomModeButtonLocked
          ]} 
          onPress={handleRandomThemeToggle}
        >
          <Text style={[
            styles.randomModeButtonText,
            randomThemeMode && styles.randomModeButtonTextActive
          ]}>
            🎲 Mode thème aléatoire
          </Text>
          {!isPremium && <Text style={styles.premiumBadgeSmall}>PREMIUM</Text>}
        </TouchableOpacity>

        {/* Bouton mode hardcore */}
        <TouchableOpacity 
          style={[
            styles.hardcoreModeButton,
            isHardcoreMode && styles.hardcoreModeButtonActive,
            !isPremium && styles.hardcoreModeButtonLocked
          ]} 
          onPress={() => {
            if (!isPremium) {
              vibrationService.vibrateError();
              audioService.playError();
              setShowPremiumModal(true);
              return;
            }
            vibrationService.vibrateButtonClick();
            audioService.playButtonClick();
            setIsHardcoreMode(!isHardcoreMode);
            if (!isHardcoreMode) {
              // Activer automatiquement le mode aléatoire en mode hardcore
              setRandomThemeMode(true);
            }
          }}
        >
          <Text style={[
            styles.hardcoreModeButtonText,
            isHardcoreMode && styles.hardcoreModeButtonTextActive
          ]}>
            🔥 Mode Hardcore
          </Text>
          {!isPremium && <Text style={styles.premiumBadgeSmall}>PREMIUM</Text>}
        </TouchableOpacity>
        
        {isHardcoreMode && (
          <View style={styles.hardcoreInfo}>
            <Text style={styles.hardcoreInfoText}>🔥 Mode Hardcore activé !</Text>
            <Text style={styles.hardcoreInfoSubtext}>• Thème aléatoire • 1 min par manche • Gorgées = mots dits • Erreur = finir son verre</Text>
          </View>
        )}
        
        {/* Boutons thèmes personnalisés */}
        <View style={isPremium ? styles.customThemeButtonsContainer : styles.singleButtonContainer}>
          <TouchableOpacity style={isPremium ? styles.customThemeButton : styles.customThemeButtonFull} onPress={handleCreateCustomTheme}>
            <Text style={styles.customThemeButtonText}>➕ Créer un thème</Text>
            {!isPremium && <Text style={styles.premiumBadgeSmall}>PREMIUM</Text>}
          </TouchableOpacity>
          
          {isPremium && (
            <TouchableOpacity style={styles.myThemesButton} onPress={() => {
              vibrationService.vibrateButtonClick();
              audioService.playButtonClick();
              navigation.navigate('CustomThemes');
            }}>
              <Text style={styles.myThemesButtonText}>👤 Mes thèmes ({customThemes.length})</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.themesPreview}>
          {availableThemes.map((theme) => {
            const isSelected = selectedThemes.includes(theme.key);
            const selectionIndex = selectedThemes.indexOf(theme.key);
            const isDisabled = randomThemeMode;
            
            return (
              <TouchableOpacity
                key={theme.key}
                style={[
                  styles.themePreviewCard,
                  isSelected && styles.themePreviewCardSelected,
                  theme.locked && styles.themePreviewCardLocked,
                  randomThemeMode && styles.themePreviewCardDisabled,
                ]}
                onPress={() => handleThemeSelect(theme.key)}
                activeOpacity={isDisabled ? 1 : 0.8}
                disabled={isDisabled}
              >
                <Text style={[
                  styles.themePreviewText,
                  theme.locked && styles.themePreviewTextLocked,
                  randomThemeMode && styles.themePreviewTextDisabled,
                ]}>
                  {theme.name}
                </Text>
                {isSelected && (
                  <View style={styles.selectionBadge}>
                    <Text style={styles.selectionNumber}>{selectionIndex + 1}</Text>
                  </View>
                )}
                {theme.locked && (
                  <Text style={styles.lockIcon}>🔒</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Bouton de démarrage */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.startButton,
            (!randomThemeMode && selectedThemes.length === 0) && styles.startButtonDisabled
          ]}
          onPress={handleStartGame}
          activeOpacity={0.8}
          disabled={!randomThemeMode && selectedThemes.length === 0}
        >
          <Text style={styles.startButtonText}>COMMENCER</Text>
        </TouchableOpacity>
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

      {/* Modal Création Thème Personnalisé */}
      <CustomModal
        visible={showCustomThemeModal}
        onClose={cancelCustomTheme}
        title="🎨 Créer un Thème Personnalisé"
        message="Créez votre thème avec un emoji et des questions personnalisées"
        customContent={
          <ScrollView style={styles.customThemeContent}>
            <Text style={styles.customThemeLabel}>Emoji du thème :</Text>
            <TextInput
              style={styles.customThemeInput}
              value={customThemeEmoji}
              onChangeText={handleEmojiChange}
              placeholder="🎯 Tapez un emoji"
              placeholderTextColor="#999"
              maxLength={2}
              returnKeyType="done"
              autoFocus={false}
            />
            
            <Text style={styles.customThemeLabel}>Nom du thème :</Text>
            <TextInput
              style={styles.customThemeInput}
              value={customThemeName}
              onChangeText={setCustomThemeName}
              placeholder="Ex: Mes Films Préférés"
              placeholderTextColor="#999"
            />
            

          </ScrollView>
        }
        buttons={[
          {
            text: 'Annuler',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              cancelCustomTheme();
            },
            style: 'secondary'
          },
          {
            text: 'Créer le thème',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              saveCustomTheme();
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

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: width > 600 ? 32 : 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width > 600 ? 18 : 14,
    color: '#a0a0a0',
    marginBottom: 10,
  },
  premiumBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  premiumText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: width > 600 ? 30 : 15,
    marginBottom: 25,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: width > 600 ? 25 : 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 15,
  },
  playerCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  countButton: {
    backgroundColor: '#e74c3c',
    width: width > 600 ? 50 : 40,
    height: width > 600 ? 50 : 40,
    borderRadius: width > 600 ? 25 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width > 600 ? 20 : 10,
  },
  countButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countDisplay: {
    backgroundColor: '#0f3460',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rangeText: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 10,
  },
  themeSelector: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  themeSelectorText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  themeSelectorArrow: {
    color: '#a0a0a0',
    fontSize: 16,
  },
  themesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themePreviewCard: {
    width: width > 600 ? '31%' : '48%',
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: width > 600 ? 15 : 10,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: width > 600 ? 80 : 60,
    justifyContent: 'center',
  },
  themePreviewCardSelected: {
    borderColor: '#e74c3c',
    backgroundColor: '#1a4480',
  },
  themePreviewText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
  },
  startButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subthemeList: {
    maxHeight: 300,
  },
  subthemeItem: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subthemeItemLocked: {
    backgroundColor: '#2a2a2a',
    opacity: 0.7,
  },
  subthemeItemText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
  },
  subthemeItemTextLocked: {
    color: '#888',
  },
  premiumLabel: {
    color: '#ffd700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customThemeButton: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd700',
    flex: 1,
  },
  customThemeButtonFull: {
    backgroundColor: '#0f3460',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  customThemeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  customThemeContent: {
    maxHeight: 400,
  },
  customThemeLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  customThemeInput: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },

  themePreviewCardLocked: {
    backgroundColor: '#2a2a2a',
    opacity: 0.6,
    borderColor: '#444',
  },
  themePreviewTextLocked: {
    color: '#888',
  },
  randomModeButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  randomModeButtonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  randomModeButtonLocked: {
    opacity: 0.6,
  },
  randomModeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  randomModeButtonTextActive: {
    color: '#ffffff',
  },
  hardcoreModeButton: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  hardcoreModeButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  hardcoreModeButtonLocked: {
    opacity: 0.6,
  },
  hardcoreModeButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hardcoreModeButtonTextActive: {
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hardcoreInfo: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  hardcoreInfoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  hardcoreInfoSubtext: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.9,
  },
  themePreviewCardDisabled: {
    opacity: 0.4,
  },
  themePreviewTextDisabled: {
    color: '#666',
  },
  selectionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectionNumber: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockIcon: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  customThemeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  singleButtonContainer: {
    marginBottom: 15,
  },
  myThemesButton: {
    backgroundColor: '#27ae60',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  myThemesButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  premiumBadgeSmall: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#888888',
  },
  disabledCountDisplay: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  disabledCountText: {
    color: '#888888',
  },
  disabledRangeText: {
    color: '#888888',
    fontStyle: 'italic',
  },

});

export default ConfigScreen;