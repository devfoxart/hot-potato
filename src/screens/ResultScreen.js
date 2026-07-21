import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const { results, playerStats, totalRounds } = route.params;
  
  // Son d'ouverture d'écran
  useEffect(() => {
    audioService.playModalOpen();
  }, []);
  
  // Trouver le joueur qui a le plus bu
  const getBiggestLoser = () => {
    let maxSips = 0;
    let biggestLoser = 1;
    
    Object.entries(playerStats).forEach(([player, stats]) => {
      if (stats.totalSips > maxSips) {
        maxSips = stats.totalSips;
        biggestLoser = parseInt(player);
      }
    });
    
    return { player: biggestLoser, sips: maxSips };
  };

  // Trouver le joueur qui a le mieux réussi
  const getBestPlayer = () => {
    let minSips = Infinity;
    let bestPlayer = 1;
    
    Object.entries(playerStats).forEach(([player, stats]) => {
      if (stats.totalSips < minSips) {
        minSips = stats.totalSips;
        bestPlayer = parseInt(player);
      }
    });
    
    return { player: bestPlayer, sips: minSips };
  };

  const biggestLoser = getBiggestLoser();
  const bestPlayer = getBestPlayer();

  const startNewGame = () => {
    audioService.playButtonClick();
    vibrationService.vibrateButtonClick();
    navigation.navigate('Config', {
      previousConfig: {
        playerNames: route.params.playerNames || []
      }
    });
  };

  const goHome = () => {
    audioService.playButtonClick();
    vibrationService.vibrateButtonClick();
    audioService.playModalClose();
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Résultats de la partie</Text>
          <Text style={styles.subtitle}>
            {results.length} manche{results.length > 1 ? 's' : ''} jouée{results.length > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Statistiques générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Statistiques</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🍻</Text>
              <Text style={styles.statValue}>{biggestLoser.sips}</Text>
              <Text style={styles.statLabel}>Plus gros buveur</Text>
              <Text style={styles.statPlayer}>Joueur {biggestLoser.player}</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>{bestPlayer.sips}</Text>
              <Text style={styles.statLabel}>Meilleur joueur</Text>
              <Text style={styles.statPlayer}>Joueur {bestPlayer.player}</Text>
            </View>
          </View>
        </View>

        {/* Résultats par joueur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Résultats par joueur</Text>
          
          {Object.entries(playerStats)
            .sort(([,a], [,b]) => b.totalSips - a.totalSips)
            .map(([player, stats]) => (
              <View key={player} style={styles.playerCard}>
                <View style={styles.playerHeader}>
                  <Text style={styles.playerNumber}>Joueur {player}</Text>
                  <View style={styles.playerSips}>
                    <Text style={styles.sipsCount}>{stats.totalSips}</Text>
                    <Text style={styles.sipsLabel}>gorgée{stats.totalSips > 1 ? 's' : ''}</Text>
                  </View>
                </View>
                
                <View style={styles.playerDetails}>
                  <Text style={styles.playerStat}>
                    🎯 {stats.losses} défaite{stats.losses > 1 ? 's' : ''}
                  </Text>
                  {stats.themes.length > 0 && (
                    <Text style={styles.playerStat}>
                      📝 Thèmes ratés: {stats.themes.join(', ')}
                    </Text>
                  )}
                </View>
              </View>
            ))
          }
        </View>

        {/* Historique des manches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Historique des manches</Text>
          
          {results.map((result, index) => (
            <View key={index} style={styles.roundCard}>
              <View style={styles.roundHeader}>
                <Text style={styles.roundNumber}>Manche {result.round}</Text>
                <Text style={styles.roundTheme}>{result.theme}</Text>
              </View>
              
              <View style={styles.roundDetails}>
                <Text style={styles.roundLoser}>
                  🍻 Joueur {result.loser} boit {result.sips} gorgée{result.sips > 1 ? 's' : ''}
                </Text>
                {isHardcoreMode ? (
                  <Text style={styles.roundTime}>
                    {result.endType === 'timeout' ? `💀 Temps écoulé - ${result.wordsUsed || 0} mot${(result.wordsUsed || 0) > 1 ? 's' : ''} prononcé${(result.wordsUsed || 0) > 1 ? 's' : ''}` : `🔥 Erreur - ${result.wordsUsed || 0} mot${(result.wordsUsed || 0) > 1 ? 's' : ''} prononcé${(result.wordsUsed || 0) > 1 ? 's' : ''}`}
                  </Text>
                ) : (
                  <Text style={styles.roundTime}>
                    ⏱️ Temps restant: {result.remainingTime}s
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.newGameButton}
            onPress={startNewGame}
            activeOpacity={0.8}
          >
            <Text style={styles.newGameButtonText}>🎮 NOUVELLE PARTIE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={goHome}
            activeOpacity={0.8}
          >
            <Text style={styles.homeButtonText}>🏠 ACCUEIL</Text>
          </TouchableOpacity>
        </View>

        {/* Message de fin */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🍻 Merci d'avoir joué!</Text>
          <Text style={styles.footerSubtext}>Buvez avec modération</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  statIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 5,
  },
  statPlayer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecdc4',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerSips: {
    alignItems: 'center',
  },
  sipsCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  sipsLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  playerDetails: {
    gap: 5,
  },
  playerStat: {
    fontSize: 14,
    color: '#ccc',
  },
  roundCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd93d',
  },
  roundTheme: {
    fontSize: 14,
    color: '#4ecdc4',
    fontStyle: 'italic',
  },
  roundDetails: {
    gap: 5,
  },
  roundLoser: {
    fontSize: 14,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  roundTime: {
    fontSize: 12,
    color: '#ccc',
  },
  actionButtons: {
    gap: 15,
    marginTop: 20,
  },
  newGameButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4ecdc4',
    paddingVertical: 15,
    borderRadius: 25,
  },
  homeButtonText: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 18,
    color: '#ffd93d',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic',
  },
});

export default ResultScreen;