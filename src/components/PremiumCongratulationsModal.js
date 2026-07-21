import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import CustomModal from './CustomModal';

const { width } = Dimensions.get('window');

const PremiumCongratulationsModal = ({ visible, onClose }) => {
  const premiumFeatures = [
    { icon: '🎮', text: 'Jusqu\'à 50 joueurs (au lieu de 3)' },
    { icon: '⏱️', text: 'Chronomètre jusqu\'à 2 minutes (au lieu de 30s)' },
    { icon: '🎲', text: 'Jusqu\'à 20 manches (au lieu de 3)' },
    { icon: '🎨', text: 'Tous les thèmes premium disponibles' },
    { icon: '🎯', text: 'Sélection multiple de thèmes par manche' },
    { icon: '🎲', text: 'Mode thème aléatoire intelligent' },
    { icon: '🔥', text: 'Mode Hardcore ultra-intense' },
    { icon: '✨', text: 'Création de thèmes personnalisés' },
    { icon: '🚫', text: 'Suppression des publicités' },
  ];

  const customContent = (
    <View style={styles.container}>
      <View style={styles.congratsHeader}>
        <Text style={styles.congratsTitle}>🌟 Version Premium Activée ! 🌟</Text>
        <Text style={styles.congratsSubtitle}>
          Vous avez maintenant accès à toutes les fonctionnalités premium !
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>🎁 Avantages débloqués :</Text>
        <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
          {premiumFeatures.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={onClose}
        activeOpacity={0.8}
      >
        <Text style={styles.continueButtonText}>🚀 Continuer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      title="🎉 Félicitations !"
      customContent={customContent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  congratsHeader: {
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  congratsTitle: {
    fontSize: width > 600 ? 24 : 20,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 10,
  },
  congratsSubtitle: {
    fontSize: width > 600 ? 16 : 14,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featuresTitle: {
    fontSize: width > 600 ? 18 : 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresList: {
    maxHeight: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#0f3460',
    borderRadius: 8,
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 25,
    textAlign: 'center',
  },
  featureText: {
    fontSize: width > 600 ? 14 : 13,
    color: '#ffffff',
    flex: 1,
    lineHeight: 20,
  },
  continueButton: {
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
  continueButtonText: {
    color: '#ffffff',
    fontSize: width > 600 ? 18 : 16,
    fontWeight: 'bold',
  },
});

export default PremiumCongratulationsModal;