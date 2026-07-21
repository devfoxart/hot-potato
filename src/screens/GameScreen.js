import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  Vibration,
  BackHandler,
} from 'react-native';
// Svg components removed - no longer needed
import { useNavigation, useRoute } from '@react-navigation/native';
import { getRandomQuestions } from '../data/themes';
import CustomModal from '../components/CustomModal';
import adService from '../services/AdService';
import premiumService from '../services/PremiumService';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width, height } = Dimensions.get('window');
const centerX = width / 2;
const centerY = height / 2 - 50;

const THEME_WORDS = {
  'Animaux': ['Chien', 'Chat', 'Éléphant', 'Lion', 'Tigre', 'Ours', 'Lapin', 'Poisson', 'Oiseau', 'Cheval'],
  'Pays': ['France', 'Espagne', 'Italie', 'Allemagne', 'Japon', 'Brésil', 'Canada', 'Australie', 'Mexique', 'Russie'],
  'Films': ['Titanic', 'Avatar', 'Matrix', 'Batman', 'Superman', 'Spiderman', 'Avengers', 'StarWars', 'Frozen', 'Shrek'],
  'Nourriture': ['Pizza', 'Burger', 'Sushi', 'Pasta', 'Salade', 'Steak', 'Soupe', 'Sandwich', 'Tacos', 'Crêpes'],
  'Sports': ['Football', 'Tennis', 'Basketball', 'Natation', 'Cyclisme', 'Golf', 'Boxe', 'Ski', 'Surf', 'Escalade'],
  'Musique': ['Rock', 'Pop', 'Jazz', 'Rap', 'Classique', 'Blues', 'Reggae', 'Country', 'Électro', 'Folk'],
  'Célébrités': ['Einstein', 'Mozart', 'Picasso', 'Gandhi', 'Napoleon', 'Shakespeare', 'DaVinci', 'Tesla', 'Jobs', 'Disney'],
  'Objets': ['Téléphone', 'Ordinateur', 'Voiture', 'Livre', 'Chaise', 'Table', 'Lampe', 'Miroir', 'Horloge', 'Clés'],
  'Métiers': ['Médecin', 'Professeur', 'Ingénieur', 'Avocat', 'Chef', 'Artiste', 'Policier', 'Pompier', 'Pilote', 'Musicien'],
  'Couleurs': ['Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Violet', 'Rose', 'Noir', 'Blanc', 'Gris']
};

const GameScreen = ({ route, navigation }) => {
  const { playerNames, selectedThemes = [], randomThemeMode = false, selectedSubtheme, timerDuration = 30, roundCount = 5, round: initialRound = 1, isHardcoreMode = false } = route.params;
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const [currentTheme, setCurrentTheme] = useState('');
  const [currentThemeName, setCurrentThemeName] = useState('');
  const [showTheme, setShowTheme] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(initialRound);
  const [gameResults, setGameResults] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showRoundPauseModal, setShowRoundPauseModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [gameMode, setGameMode] = useState('words'); // 'words' pour jeu par mots
  const [totalRounds, setTotalRounds] = useState(roundCount);
  const [usedRandomThemes, setUsedRandomThemes] = useState([]);
  const [currentThemeForRound, setCurrentThemeForRound] = useState('');
  const [wordsSpoken, setWordsSpoken] = useState(0); // Pour le mode hardcore
  
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const themeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Fonction pour obtenir le nom d'affichage du thème
  const getThemeDisplayName = async (themeKey) => {
    if (themeKey.startsWith('custom_')) {
      // Thème personnalisé
      try {
        const premiumService = await import('../services/PremiumService');
        const customThemes = await premiumService.default.getCustomThemes();
        const customId = themeKey.replace('custom_', '');
        const customTheme = customThemes.find(theme => theme.id === customId);
        return customTheme ? customTheme.name : 'Thème personnalisé';
      } catch (error) {
        console.error('Erreur lors du chargement du nom du thème personnalisé:', error);
        return 'Thème personnalisé';
      }
    } else {
      // Thème standard
      const { THEMES_DATA } = await import('../data/themes');
      const theme = THEMES_DATA[themeKey];
      return theme ? theme.name : themeKey;
    }
  };

  // Fonction pour obtenir le thème de la manche actuelle
  const getThemeForRound = async (roundNumber) => {
    if (randomThemeMode || isHardcoreMode) {
      // Mode aléatoire : sélectionner un thème aléatoire en évitant les répétitions
      const { getAvailableThemes } = await import('../data/themes');
      const premiumService = await import('../services/PremiumService');
      const isPremium = await premiumService.default.checkPremiumStatus();
      const allThemes = await getAvailableThemes(isPremium, premiumService.default);
      const availableThemes = allThemes.filter(theme => !theme.locked || isPremium);
      
      let availableForSelection = availableThemes.map(t => t.key);
      
      // Exclure les thèmes récemment utilisés (les 2 derniers si possible)
      if (usedRandomThemes.length > 0) {
        const recentThemes = usedRandomThemes.slice(-2); // Les 2 derniers thèmes
        availableForSelection = availableForSelection.filter(t => !recentThemes.includes(t));
      }
      
      // Si pas assez de thèmes disponibles, réinitialiser partiellement
      if (availableForSelection.length === 0) {
        availableForSelection = availableThemes.map(t => t.key);
        // Exclure seulement le dernier thème utilisé
        if (usedRandomThemes.length > 0) {
          const lastTheme = usedRandomThemes[usedRandomThemes.length - 1];
          availableForSelection = availableForSelection.filter(t => t !== lastTheme);
        }
      }
      
      // Si on a utilisé tous les thèmes disponibles, réinitialiser complètement
      if (availableForSelection.length === 0) {
        availableForSelection = availableThemes.map(t => t.key);
        setUsedRandomThemes([]); // Réinitialiser l'historique
      }
      
      const randomIndex = Math.floor(Math.random() * availableForSelection.length);
      const selectedTheme = availableForSelection[randomIndex];
      
      setUsedRandomThemes(prev => [...prev, selectedTheme]);
      return selectedTheme;
    } else {
      // Mode sélection manuelle : utiliser les thèmes sélectionnés de manière cyclique
      if (selectedThemes.length === 0) return null;
      
      // Si on a plusieurs thèmes sélectionnés, les utiliser dans l'ordre
      // puis recommencer au début si on dépasse le nombre de thèmes
      const themeIndex = (roundNumber - 1) % selectedThemes.length;
      return selectedThemes[themeIndex];
    }
  };

  // Charger les mots du thème sélectionné
  useEffect(() => {
    const loadThemeWords = async () => {
      // Son d'ouverture d'écran
      audioService.playModalOpen();
      
      // Initialiser le service de publicités
      await adService.initialize();
      
      // Obtenir le thème pour la manche actuelle
      const themeForRound = await getThemeForRound(round);
      
      if (themeForRound) {
        // Utiliser les mots prédéfinis pour le thème
        const themeWords = THEME_WORDS[themeForRound] || [];
        setAvailableWords(themeWords);
        setCurrentTheme(themeForRound);
        setCurrentThemeForRound(themeForRound);
        
        // Obtenir le nom d'affichage du thème
        const themeName = await getThemeDisplayName(themeForRound);
        setCurrentThemeName(themeName);
        
        setUsedWords([]);
        // Réinitialiser le compteur de mots pour le mode hardcore
        if (isHardcoreMode) {
          setWordsSpoken(0);
        }
      } else {
        // Aucun thème disponible - rediriger vers ConfigScreen avec une erreur
        Alert.alert(
          'Erreur de configuration',
          'Aucun thème n\'est disponible pour cette manche. Veuillez vérifier votre configuration.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Config')
            }
          ]
        );
      }
    };
    
    loadThemeWords();
  }, [round, selectedThemes, randomThemeMode]);

  // Fonction pour vérifier si un mot est valide (pour usage futur)
  const isValidWord = (word) => {
    return availableWords.some(w => 
      w.toLowerCase().includes(word.toLowerCase()) || 
      word.toLowerCase().includes(w.toLowerCase())
    );
  };
  
  // Marquer un mot comme utilisé
  const markWordAsUsed = (word) => {
    setUsedWords(prev => [...prev, word.toLowerCase()]);
  };

  // Calculer l'angle de rotation pour pointer vers un joueur
  const getPlayerAngle = (playerIndex) => {
    const angleStep = 360 / playerNames.length;
    return playerIndex * angleStep - 90; // -90 pour commencer en haut
  };

  // Animer la flèche vers un joueur
  const animateArrowToPlayer = (playerIndex, callback) => {
    const targetAngle = getPlayerAngle(playerIndex);
    
    Animated.timing(rotationAnim, {
      toValue: targetAngle,
      duration: 800,
      useNativeDriver: true,
    }).start(callback);
  };

  // Démarrer une nouvelle manche
  const startNewRound = () => {
    setShowTheme(true);
    setTimeLeft(timerDuration);
    setUsedWords([]); // Réinitialiser les mots utilisés pour cette manche
    setWordsSpoken(0); // Réinitialiser le compteur de mots pour le mode hardcore
    
    // Afficher le thème pendant 3 secondes
    setTimeout(() => {
      setShowTheme(false);
      startCountdown();
    }, 3000);
  };

  // Démarrer le compte à rebours
  const startCountdown = () => {
    setShowCountdown(true);
    setCountdownNumber(3);
    
    // Son de démarrage du compte à rebours (joué une seule fois au début)
    audioService.playGameStart();
    
    const countdownInterval = setInterval(() => {
      setCountdownNumber((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          setGameStarted(true);
          
          startTimer();
          
          // Sélectionner le premier joueur aléatoirement
          // Utiliser setTimeout pour éviter le warning React
          setTimeout(() => {
            const firstPlayer = Math.floor(Math.random() * playerNames.length);
            setCurrentPlayer(firstPlayer);
            animateArrowToPlayer(firstPlayer);
          }, 0);
          
          return 0;
        }
        
        return prev - 1;
      });
    }, 1000);
  };

  // Démarrer le timer
  const startTimer = () => {
    // Son du chronomètre au démarrage - joué une seule fois
    audioService.playTick();
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // Utiliser setTimeout pour éviter le setState pendant le rendu
          setTimeout(() => {
            endRound(currentPlayer);
          }, 0);
          return 0;
        }
        
        return prevTime - 1;
      });
    }, 1000);
    
    timerRef.current = timer;
  };

  // Mettre en pause le timer
  const pauseTimer = () => {
    stopTimer();
    // Arrêter tous les sons lors de la pause
    audioService.stopAllSounds();
    setIsPaused(true);
  };

  // Reprendre le timer
  const resumeTimer = () => {
    if (isPaused && gameStarted) {
      startTimer();
      setIsPaused(false);
    }
  };

  // Arrêter le timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Passer au joueur suivant (quand le joueur actuel donne un mot valide)
  const nextPlayer = () => {
    if (!gameStarted) return;
    
    // Son de clic de bouton
    audioService.playButtonClick();
    
    // Incrémenter le compteur de mots utilisés
    setUsedWords(prev => [...prev, `mot_${prev.length + 1}`]);
    
    // En mode hardcore, compter les mots dits
    if (isHardcoreMode) {
      setWordsSpoken(prev => prev + 1);
    }
    
    const nextPlayerIndex = (currentPlayer + 1) % playerNames.length;
    setCurrentPlayer(nextPlayerIndex);
    animateArrowToPlayer(nextPlayerIndex);
    
    // Vibration légère pour indiquer le changement
    Vibration.vibrate(100);
  };

  // Le joueur précédent s'est trompé
  const previousPlayerWrong = () => {
    if (!gameStarted) return;
    
    // Son de clic de bouton
    audioService.playButtonClick();
    
    Vibration.vibrate(1000);
    stopTimer();
    // Arrêter tous les sons (y compris le tick)
    audioService.stopAllSounds();
    
    // Son de défaite
    audioService.playDefeat();
    
    const prevPlayerIndex = currentPlayer === 0 ? playerNames.length - 1 : currentPlayer - 1;
    const losingPlayer = playerNames[prevPlayerIndex];
    

    
    // Redirection vers LoseScreen avec calcul des gorgées selon temps restant
    // Utiliser setTimeout pour éviter le warning React
    setTimeout(() => {
      navigation.navigate('Lose', {
        playerName: losingPlayer,
        timeLeft: timeLeft,
        totalTime: timerDuration,
        theme: {
          themeKey: currentThemeForRound,
          subthemeKey: selectedSubtheme
        },
        playerNames: playerNames,
        round: round,
        totalRounds: totalRounds,
        isTimeUp: false, // Indique que c'est une erreur du joueur
        // Transmettre les paramètres originaux pour "Nouvelle partie"
        selectedThemes: selectedThemes,
        randomThemeMode: randomThemeMode,
        timerDuration: timerDuration,
        isHardcoreMode: isHardcoreMode,
        wordsSpoken: wordsSpoken // Nombre de mots dits en mode hardcore
      });
    }, 0);
  };

  // Démarrer la manche suivante
  const startNextRound = () => {
    // Son de clic de bouton
    audioService.playButtonClick();
    
    // Son de fin de manche réussie
    audioService.playRoundEnd();
    
    setShowRoundPauseModal(false);
    const nextRound = round + 1;
    setRound(nextRound);
    setTimeLeft(timerDuration);
    setCurrentPlayer((currentPlayer + 1) % playerNames.length);
    setGameStarted(false);
    // Le useEffect se chargera de recharger le thème pour la nouvelle manche
  };

  // Terminer la manche (temps écoulé)
  const endRound = async (losingPlayerIndex = currentPlayer) => {
    Vibration.vibrate(1000);
    stopTimer();
    // Arrêter tous les sons (y compris le tick)
    audioService.stopAllSounds();
    
    // Son de fin de manche (défaite)
    audioService.playDefeat();
    
    const eliminatedPlayer = playerNames[losingPlayerIndex];
    
    // Redirection vers LoseScreen avec 2 gorgées par défaut (temps écoulé)
    // Utiliser setTimeout pour éviter le warning React
    setTimeout(() => {
      navigation.navigate('Lose', {
        playerName: eliminatedPlayer,
        timeLeft: 0, // Temps écoulé
        totalTime: timerDuration,
        theme: {
          themeKey: currentThemeForRound,
          subthemeKey: selectedSubtheme
        },
        playerNames: playerNames,
        round: round,
        totalRounds: totalRounds,
        isTimeUp: true, // Indique que c'est une fin par temps écoulé
        // Transmettre les paramètres originaux pour "Nouvelle partie"
        selectedThemes: selectedThemes,
        randomThemeMode: randomThemeMode,
        timerDuration: timerDuration,
        isHardcoreMode: isHardcoreMode,
        wordsSpoken: wordsSpoken // Nombre de mots dits en mode hardcore
      });
    }, 0);
  };

  // Animation du thème
  useEffect(() => {
    if (showTheme) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(themeAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(themeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showTheme]);

  // Démarrer la première manche
  useEffect(() => {
    if (currentTheme && !gameStarted && !showCountdown) {
      // Initialisation différée pour éviter les setState pendant le rendu
      const timer = setTimeout(() => {
        startNewRound();
      }, 100);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentTheme, gameStarted, showCountdown]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  return (
    <View style={styles.container}>
      {showTheme ? (
        <View style={styles.themeContainer}>
          <Text style={styles.themeTitle}>🎯 Thème de la manche</Text>
          <Animated.View style={[styles.themeCard, { transform: [{ scale: themeAnim }] }]}>
            <Text style={styles.themeText}>{currentThemeName}</Text>
          </Animated.View>
          <Text style={styles.themeSubtitle}>Donnez des mots liés à ce thème!</Text>
          <Text style={styles.countdown}>Le jeu commence dans quelques secondes...</Text>
        </View>
      ) : showCountdown ? (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownTitle}>Préparez-vous !</Text>
          <Text style={styles.countdownNumber}>
            {countdownNumber > 0 ? countdownNumber : 'DÉBUT !'}
          </Text>
          <Text style={styles.countdownSubtitle}>de la manche !</Text>
        </View>
      ) : (
        <>
          {/* Header avec timer et manche */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.pauseButton} 
              onPress={() => {
                // Son de clic de bouton
                audioService.playButtonClick();
                vibrationService.vibrateButtonClick();
                pauseTimer();
                setShowPauseModal(true);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.pauseIcon}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            </TouchableOpacity>
            
            <View style={styles.gameInfo}>
              <Text style={styles.roundText}>Manche {round}/{totalRounds}</Text>
              <Text style={styles.timerText}>{timeLeft}s</Text>
            </View>
          </View>

          {/* Indicateur du joueur actuel */}
          <View style={styles.currentPlayerIndicator}>
            <Text style={styles.currentPlayerLabel}>C'est au tour de :</Text>
            <Text style={styles.currentPlayerName}>{playerNames[currentPlayer]}</Text>
          </View>

          {/* Barre de progression du temps */}
          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar,
                {
                   width: `${(timeLeft / timerDuration) * 100}%`
                 }
              ]}
            />
          </View>

          {/* Thème actuel au centre */}
          <View style={isHardcoreMode ? styles.hardcoreThemeContainer : styles.centerThemeContainer}>
            <Text style={isHardcoreMode ? styles.hardcoreThemeLabel : styles.themeLabel}>Thème :</Text>
            <Text style={isHardcoreMode ? styles.hardcoreThemeText : styles.centerThemeText}>{currentThemeName}</Text>
            <Text style={isHardcoreMode ? styles.hardcoreWordsUsedText : styles.wordsUsedText}>Mots utilisés : {usedWords.length}</Text>
            {isHardcoreMode && (
              <Text style={styles.hardcoreWordsUsedText}>🔥 MODE HARDCORE 🔥</Text>
            )}
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={isHardcoreMode ? styles.hardcoreNextButton : styles.nextButton}
              onPress={() => {
                vibrationService.vibrateButtonClick();
                nextPlayer();
              }}
              disabled={!gameStarted}
              activeOpacity={0.8}
            >
              <Text style={isHardcoreMode ? styles.hardcoreNextButtonText : styles.nextButtonText}>SUIVANT</Text>
            </TouchableOpacity>
            
            {usedWords.length > 0 && (
              <TouchableOpacity
                style={isHardcoreMode ? styles.hardcoreWrongButton : styles.wrongButton}
                onPress={() => {
                  vibrationService.vibrateError();
                  previousPlayerWrong();
                }}
                disabled={!gameStarted}
                activeOpacity={0.8}
              >
                <Text style={isHardcoreMode ? styles.hardcoreWrongButtonText : styles.wrongButtonText}><Text style={{fontStyle: 'italic', textTransform: 'uppercase'}}>{playerNames[currentPlayer === 0 ? playerNames.length - 1 : currentPlayer - 1]}</Text> S'EST TROMPÉ</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
      
      {/* Modal de pause */}
      <CustomModal
        visible={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        showCloseButton={false}
        title="⏸️ Jeu en pause"
        message="Que voulez-vous faire ?"
        buttons={[
          {
            text: 'Reprendre',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              setShowPauseModal(false);
              resumeTimer();
            },
            style: 'primary'
          },
          {
            text: 'Quitter',
            onPress: () => {
              vibrationService.vibrateButtonClick();
              audioService.playModalClose();
              navigation.goBack();
            },
            style: 'secondary',
            closesModal: false
          }
        ]}
      />
      
      {/* Modal de pause entre les manches */}
      <CustomModal
        visible={showRoundPauseModal}
        onClose={() => setShowRoundPauseModal(false)}
        showCloseButton={false}
        title={`🎯 Fin de la manche ${round - 1}`}
        message={`Prêts pour la manche ${round} ?`}
        buttons={[
          {
            text: 'Commencer la manche suivante',
            onPress: startNextRound,
            style: 'primary'
          },
          {
            text: 'Quitter le jeu',
            onPress: () => {
              audioService.playModalClose();
              navigation.goBack();
            },
            style: 'secondary'
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  themeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  themeTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  themeCard: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 40,
    paddingHorizontal: 60,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  themeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  themeSubtitle: {
    fontSize: 18,
    color: '#ffd93d',
    textAlign: 'center',
    marginBottom: 20,
  },
  countdown: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  roundInfo: {
    flex: 1,
  },
  roundText: {
    fontSize: 18,
    color: '#ffd93d',
    fontWeight: 'bold',
  },

  currentPlayerIndicator: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd93d',
  },
  currentPlayerLabel: {
    fontSize: 16,
    color: '#ffd93d',
    fontWeight: '600',
    marginBottom: 5,
  },
  currentPlayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#1a1a2e',
    marginHorizontal: 20,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 4,
  },
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  nextButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hardcoreNextButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  hardcoreNextButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  wrongButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  wrongButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hardcoreWrongButton: {
    backgroundColor: '#8B0000',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FF6347',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  hardcoreWrongButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  centerThemeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 20,
    padding: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  hardcoreThemeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    margin: 20,
    borderRadius: 20,
    padding: 30,
    elevation: 8,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: '#FF6347',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3460',
  },
  countdownTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 20,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  countdownSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffd93d',
    marginTop: 20,
  },
  themeLabel: {
    color: '#ffd93d',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  centerThemeText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordsUsedText: {
    color: '#ffd93d',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  hardcoreWordsUsedText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
    textShadowColor: '#FF4500',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hardcoreThemeText: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#FF4500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  hardcoreThemeLabel: {
    color: '#FFA500',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  currentPlayerText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quitButton: {
    backgroundColor: '#e74c3c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#ffd93d',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  pauseIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  pauseBar: {
    width: 6,
    height: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
  },
  gameInfo: {
    flex: 1,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerPosition: {
    position: 'absolute',
    minWidth: 60,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 8,
  },
  playerName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameScreen;