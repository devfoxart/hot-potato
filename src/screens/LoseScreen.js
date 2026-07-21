import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateSips, getSipsMessage } from '../utils/sipsCalculator';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width, height } = Dimensions.get('window');

const LoseScreen = ({ route, navigation }) => {
  const { 
    playerName, 
    timeLeft, 
    totalTime,
    theme,
    playerNames,
    round,
    totalRounds,
    isTimeUp = false,
    // Paramètres originaux pour "Nouvelle partie"
    selectedThemes = [],
    randomThemeMode = false,
    timerDuration = 30,
    isHardcoreMode = false,
    wordsSpoken = 0
  } = route.params;



  // Calcul du nombre de gorgées basé sur le temps restant et le type de fin
  let sipsCount, sipsMessage;
  
  if (isHardcoreMode) {
    // Mode hardcore : gorgées basées sur les mots dits (que ce soit erreur ou temps écoulé)
    const calculatedSips = Math.max(1, wordsSpoken);
    
    if (calculatedSips > 10) {
      sipsCount = "tous son verre";
      if (isTimeUp) {
        sipsMessage = `⚡ MODE HARDCORE ⚡\nTemps écoulé ! Tu as dit ${wordsSpoken} mot${wordsSpoken > 1 ? 's' : ''}, tu bois tous ton verre !`;
      } else {
        sipsMessage = `⚡ MODE HARDCORE ⚡\nTu as dit ${wordsSpoken} mot${wordsSpoken > 1 ? 's' : ''}, tu bois tous ton verre !`;
      }
    } else {
      sipsCount = calculatedSips;
      if (isTimeUp) {
        sipsMessage = `⚡ MODE HARDCORE ⚡\nTemps écoulé ! Tu as dit ${wordsSpoken} mot${wordsSpoken > 1 ? 's' : ''}, tu bois ${calculatedSips} gorgée${calculatedSips > 1 ? 's' : ''} !`;
      } else {
        sipsMessage = `⚡ MODE HARDCORE ⚡\nTu as dit ${wordsSpoken} mot${wordsSpoken > 1 ? 's' : ''}, tu bois ${calculatedSips} gorgée${calculatedSips > 1 ? 's' : ''} !`;
      }
    }
  } else {
    sipsCount = calculateSips(timeLeft, totalTime, isTimeUp);
    sipsMessage = getSipsMessage(sipsCount, timeLeft, totalTime, isTimeUp);
  }

  // Son d'ouverture d'écran et gestion des sons de fin
  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    // Pas de son de victoire - un joueur perd toujours
    // if (round >= totalRounds) {
    //   // C'est la fin de partie, jouer le son de victoire
    //   audioService.playVictory();
    // }
  }, []);

  const handleNextRound = () => {
    audioService.playButtonClick();
    vibrationService.vibrateButtonClick();
    // Si c'est la dernière manche, retourner au menu de configuration
    if (round >= totalRounds) {
      navigation.navigate('Config');
    } else {
      // Sinon, continuer avec la manche suivante directement
      navigation.navigate('Game', {
        playerNames: playerNames,
        selectedThemes: selectedThemes, // Conserver tous les thèmes sélectionnés
        randomThemeMode: randomThemeMode, // Conserver le mode aléatoire
        selectedSubtheme: theme.subthemeKey,
        timerDuration: timerDuration,
        roundCount: totalRounds,
        round: round + 1,
        totalRounds: totalRounds,
        isHardcoreMode: isHardcoreMode // Conserver le mode hardcore
      });
    }
  };

  const handleBackToMenu = () => {
    audioService.playButtonClick();
    audioService.playModalClose();
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
      colors={isHardcoreMode ? ['#8B0000', '#DC143C', '#B22222'] : ['#FF6B6B', '#FF8E53', '#FF6B9D']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Titre principal */}
          <View style={styles.titleContainer}>
            <Text style={isHardcoreMode ? styles.hardcoreTitleText : styles.titleText}>
              {isHardcoreMode ? '💀 DÉFAITE 💀' : '💀 PERDU ! 💀'}
            </Text>
          </View>

          {/* Nom du joueur perdant */}
          <View style={isHardcoreMode ? styles.hardcorePlayerContainer : styles.playerContainer}>
            <Text style={isHardcoreMode ? styles.hardcorePlayerName : styles.playerName}>{playerName}</Text>
          </View>

          {/* Nombre de gorgées */}
          <View style={isHardcoreMode ? styles.hardcoreSipsContainer : styles.sipsContainer}>
            <Text style={isHardcoreMode ? styles.hardcoreSipsLabel : styles.sipsLabel}>
              {isHardcoreMode ? 'PUNITION HARDCORE' : 'Doit boire :'}
            </Text>
            <View style={styles.sipsCountContainer}>
              {typeof sipsCount === 'string' ? (
                <Text style={[styles.sipsCount, styles.hardcoreText]}>{sipsCount}</Text>
              ) : (
                <>
                  <Text style={isHardcoreMode ? styles.hardcoreSipsCount : styles.sipsCount}>{sipsCount}</Text>
                  <Text style={isHardcoreMode ? styles.hardcoreSipsText : styles.sipsText}>gorgée{sipsCount > 1 ? 's' : ''}</Text>
                </>
              )}
            </View>
          </View>

          {/* Message descriptif */}
          <View style={isHardcoreMode ? styles.hardcoreMessageContainer : styles.messageContainer}>
            <Text style={isHardcoreMode ? styles.hardcoreMessageText : styles.messageText}>
              {sipsMessage}
            </Text>
          </View>

          {/* Détails du temps - seulement en mode normal */}
          {!isHardcoreMode && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                Temps restant : {Math.ceil(timeLeft)}s / {totalTime}s
              </Text>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.buttonsContainer}>
            {round < totalRounds ? (
              <>
                {/* Affichage du nombre de manches */}
                <View style={styles.roundInfoContainer}>
                  <Text style={styles.roundInfoText}>
                    Manche {round} / {totalRounds}
                  </Text>
                  <Text style={styles.roundInfoSubText}>
                    {totalRounds - round} manche{totalRounds - round > 1 ? 's' : ''} restante{totalRounds - round > 1 ? 's' : ''}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.playAgainButton} 
                  onPress={handleNextRound}
                >
                  <Text style={styles.playAgainText}>MANCHE SUIVANTE</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Fin de partie */}
                <View style={styles.endGameContainer}>
                  <Text style={styles.endGameText}>🎉 FIN DE PARTIE 🎉</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.playAgainButton} 
                  onPress={() => {
                    vibrationService.vibrateButtonClick();
                    navigation.navigate('Config', {
                      previousConfig: {
                        playerCount: playerNames.length,
                        timerDuration: timerDuration,
                        roundCount: totalRounds,
                        selectedThemes: selectedThemes, // Conserver tous les thèmes sélectionnés
                        randomThemeMode: randomThemeMode, // Conserver le mode aléatoire
                        selectedSubtheme: theme.subthemeKey,
                        playerNames: playerNames, // Ajouter les noms des joueurs précédents
                        isHardcoreMode: isHardcoreMode // Conserver le mode hardcore
                      }
                    });
                  }}
                >
                  <Text style={styles.playAgainText}>NOUVELLE PARTIE</Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => {
                audioService.playButtonClick();
                vibrationService.vibrateButtonClick();
                audioService.playModalClose();
                navigation.navigate('Home');
              }}
            >
              <Text style={styles.menuText}>MENU PRINCIPAL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 40,
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  playerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: width * 0.8,
  },
  playerLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '600',
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  sipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: width * 0.7,
  },
  sipsLabel: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 15,
    fontWeight: '600',
  },
  sipsCountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  sipsCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  sipsText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  hardcoreText: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hardcoreTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
  },
  hardcorePlayerContainer: {
    backgroundColor: 'rgba(139, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: width * 0.8,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  hardcorePlayerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  hardcoreSipsContainer: {
    backgroundColor: 'rgba(139, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 30,
    alignItems: 'center',
    minWidth: width * 0.7,
    borderWidth: 3,
    borderColor: '#FF4500',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
  },
  hardcoreSipsLabel: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  hardcoreSipsCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF4500',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  hardcoreSipsText: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  hardcoreMessageContainer: {
    backgroundColor: 'rgba(139, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    minWidth: width * 0.8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 69, 0, 0.6)',
  },
  hardcoreMessageText: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    minWidth: width * 0.8,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  timeContainer: {
    marginBottom: 40,
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  roundInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    minWidth: width * 0.7,
    alignItems: 'center',
  },
  roundInfoText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roundInfoSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  endGameContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    minWidth: width * 0.7,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  endGameText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playAgainButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: width * 0.7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoseScreen;