import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import CustomModal from './CustomModal';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const AlcoholPreventionModal = ({ visible, onClose }) => {
  const handleCallEmergency = (number, serviceName) => {
    audioService.playButtonClick();
    vibrationService.vibrateButtonClick();
    
    const phoneNumber = `tel:${number}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          // Impossible d'ouvrir le numéro
        }
      })
      .catch((err) => console.error('Erreur lors de l\'appel:', err));
  };

  const customContent = (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.warningTitle}>⚠️ CONSOMMATION RESPONSABLE</Text>
        
        <Text style={styles.warningText}>
          L'alcool peut être dangereux pour la santé. Si vous ou quelqu'un de votre entourage avez des problèmes liés à l'alcool, n'hésitez pas à demander de l'aide.
        </Text>

        <View style={styles.numbersSection}>
          <Text style={styles.numbersTitle}>📞 NUMÉROS D'URGENCE</Text>
          
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('15', 'SAMU')}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyNumber}>15</Text>
              <Text style={styles.emergencyLabel}>SAMU - Urgences médicales</Text>
            </View>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('3919', 'Violences Femmes Info')}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyNumber}>39 19</Text>
              <Text style={styles.emergencyLabel}>Violences Femmes Info</Text>
            </View>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('0980980930', 'Alcool Info Service')}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyNumber}>09 80 98 09 30</Text>
              <Text style={styles.emergencyLabel}>Alcool Info Service</Text>
            </View>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('0145394070', 'SOS Amitié')}
            activeOpacity={0.8}
          >
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyNumber}>01 45 39 40 70</Text>
              <Text style={styles.emergencyLabel}>SOS Amitié - Écoute</Text>
            </View>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 CONSEILS DE PRÉVENTION</Text>
          <Text style={styles.tipText}>• Ne buvez jamais l'estomac vide</Text>
          <Text style={styles.tipText}>• Alternez avec de l'eau</Text>
          <Text style={styles.tipText}>• Fixez-vous des limites à l'avance</Text>
          <Text style={styles.tipText}>• Ne conduisez jamais après avoir bu</Text>
          <Text style={styles.tipText}>• Respectez les jours sans alcool</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title="🍻 Boire avec Modération"
      customContent={customContent}
      buttons={[
        {
          text: 'J\'ai compris',
          onPress: onClose,
          style: 'primary'
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 400,
    width: '100%',
  },
  contentContainer: {
    paddingVertical: 10,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 15,
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  numbersSection: {
    marginBottom: 20,
  },
  numbersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd93d',
    textAlign: 'center',
    marginBottom: 15,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  emergencyLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 2,
  },
  callIcon: {
    fontSize: 20,
  },
  tipsSection: {
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
    borderRadius: 10,
    padding: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd93d',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: 18,
    marginBottom: 4,
  },
});

export default AlcoholPreventionModal;