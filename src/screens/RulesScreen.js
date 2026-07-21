import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const RulesScreen = ({ navigation }) => {
  // Son d'ouverture d'écran
  useEffect(() => {
    audioService.playModalOpen();
  }, []);
  const handleBackPress = () => {
    audioService.playButtonClick();
    vibrationService.vibrateButtonClick();
    audioService.playModalClose();
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
          <Text style={styles.title}>📋 RÈGLES DU JEU</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Objectif du jeu */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 OBJECTIF</Text>
              <Text style={styles.sectionText}>
                Hot Potato est un jeu de rapidité et de réflexes ! Le but est simple : évitez d'être le joueur qui tient la "patate chaude" quand le temps s'arrête.
              </Text>
            </View>

            {/* Préparation */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚙️ PRÉPARATION</Text>
              <Text style={styles.sectionText}>
                1. Choisissez le nombre de joueurs (2 à 3 en gratuit, jusqu'à 50 en premium)
              </Text>
              <Text style={styles.sectionText}>
                2. Définissez la durée du minuteur (10-30s en gratuit, jusqu'à 120s en premium)
              </Text>
              <Text style={styles.sectionText}>
                3. Sélectionnez le nombre de manches (1-3 en gratuit, jusqu'à 20 en premium)
              </Text>
              <Text style={styles.sectionText}>
                4. Choisissez vos thèmes ou activez le mode aléatoire (premium)
              </Text>
              <Text style={styles.sectionText}>
                5. Entrez les noms des joueurs et placez-vous en cercle
              </Text>
            </View>

            {/* Déroulement */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎮 DÉROULEMENT</Text>
              <Text style={styles.sectionText}>
                1. <Text style={styles.bold}>Mémorisation :</Text> Un thème s'affiche pendant quelques secondes
              </Text>
              <Text style={styles.sectionText}>
                2. <Text style={styles.bold}>Jeu :</Text> Le minuteur démarre et le téléphone indique le joueur actuel
              </Text>
              <Text style={styles.sectionText}>
                3. <Text style={styles.bold}>Énonciation :</Text> Le joueur doit dire un mot lié au thème
              </Text>
              <Text style={styles.sectionText}>
                4. <Text style={styles.bold}>Passage :</Text> Appuyez sur "SUIVANT" pour passer au joueur suivant
              </Text>
              <Text style={styles.sectionText}>
                5. <Text style={styles.bold}>Erreur :</Text> Utilisez "ERREUR PRÉCÉDENT" si le joueur précédent s'est trompé
              </Text>
            </View>

            {/* Règles importantes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ RÈGLES IMPORTANTES</Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Pas de répétition :</Text> Un mot déjà dit ne peut pas être répété
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Respect du thème :</Text> Le mot doit être en rapport avec le thème affiché
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Rapidité :</Text> Pas de temps de réflexion trop long
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Fair-play :</Text> Les autres joueurs valident si le mot est acceptable
              </Text>
            </View>

            {/* Fin de manche */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⏰ FIN DE MANCHE</Text>
              <Text style={styles.sectionText}>
                Le joueur qui tient la "patate chaude" quand le temps s'arrête doit boire !
              </Text>
              <Text style={styles.sectionText}>
                Le nombre de gorgées dépend du temps restant :
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Temps écoulé :</Text> 2 gorgées
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Plus de 80% du temps :</Text> 6 gorgées
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>60-80% du temps :</Text> 5 gorgées
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>40-60% du temps :</Text> 4 gorgées
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>20-40% du temps :</Text> 3 gorgées
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Moins de 20% :</Text> 2 gorgées
              </Text>
            </View>

            {/* Fonctionnalités Premium */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🌟 PREMIUM</Text>
              <Text style={styles.sectionText}>
                Débloquez toutes les fonctionnalités premium :
              </Text>
              <Text style={styles.sectionText}>
                • Jusqu'à 50 joueurs (au lieu de 3)
              </Text>
              <Text style={styles.sectionText}>
                • Minuteur jusqu'à 2 minutes (au lieu de 30s)
              </Text>
              <Text style={styles.sectionText}>
                • Jusqu'à 20 manches (au lieu de 3)
              </Text>
              <Text style={styles.sectionText}>
                • Tous les thèmes premium disponibles
              </Text>
              <Text style={styles.sectionText}>
                • Mode thème aléatoire intelligent
              </Text>
              <Text style={styles.sectionText}>
                • Création de thèmes personnalisés
              </Text>
              <Text style={styles.sectionText}>
                • Mode Hardcore ultra-intense
              </Text>
              <Text style={styles.sectionText}>
                • Suppression des publicités
              </Text>
            </View>

            {/* Mode Hardcore */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔥 MODE HARDCORE</Text>
              <Text style={styles.sectionText}>
                Le mode Hardcore est la version la plus intense du jeu !
              </Text>
              <Text style={styles.sectionText}>
                <Text style={styles.bold}>Caractéristiques :</Text>
              </Text>
              <Text style={styles.sectionText}>
                • ⏱️ <Text style={styles.bold}>Temps fixe :</Text> Exactement 1 minute par manche
              </Text>
              <Text style={styles.sectionText}>
                • 🎲 <Text style={styles.bold}>Thème aléatoire :</Text> Impossible de prévoir le thème
              </Text>
              <Text style={styles.sectionText}>
                • 🍻 <Text style={styles.bold}>Gorgées basées sur les mots :</Text> Plus vous parlez, plus vous buvez
              </Text>
              <Text style={styles.sectionText}>
                • 💀 <Text style={styles.bold}>Calcul unique :</Text> Gorgées = mots prononcés
              </Text>
              <Text style={styles.sectionText}>
                <Text style={styles.bold}>Calcul des gorgées :</Text>
              </Text>
              <Text style={styles.sectionText}>
                • Que ce soit erreur ou temps écoulé : nombre de mots prononcés = nombre de gorgées
              </Text>
              <Text style={styles.sectionText}>
                • Minimum 1 gorgée même si aucun mot prononcé
              </Text>
              <Text style={styles.sectionText}>
                • <Text style={styles.bold}>Règle spéciale :</Text> Plus de 10 mots = tu bois tous ton verre !
              </Text>
            </View>

            {/* Conseils */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 CONSEILS</Text>
              <Text style={styles.sectionText}>
                • Restez concentré sur le thème affiché
              </Text>
              <Text style={styles.sectionText}>
                • Préparez plusieurs mots à l'avance
              </Text>
              <Text style={styles.sectionText}>
                • Écoutez bien les mots déjà dits
              </Text>
              <Text style={styles.sectionText}>
                • Soyez fair-play dans vos jugements
              </Text>
              <Text style={styles.sectionText}>
                • Amusez-vous et buvez avec modération ! 🍻
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => {
              audioService.playButtonClick();
              vibrationService.vibrateButtonClick();
              navigation.navigate('Config');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>🎮 COMMENCER À JOUER</Text>
          </TouchableOpacity>
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
    marginRight: 50, // Compenser le bouton retour
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#ffd93d',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  startButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    borderRadius: 25,
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
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RulesScreen;