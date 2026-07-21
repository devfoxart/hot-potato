import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import audioService from '../services/AudioService';

const { width } = Dimensions.get('window');

const CustomModal = ({ 
  visible, 
  title, 
  message, 
  buttons = [], 
  onClose,
  customContent,
  showCloseButton = true
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Son d'ouverture de modal
      audioService.playModalOpen();
      
      // Animation d'entrée (zoom in)
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();

      // Animation de pulsation continue
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          })
        ]).start(() => {
          if (visible) pulse();
        });
      };
      pulse();
    } else {
      // Animation de sortie (zoom out)
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleAnim, pulseAnim]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: Animated.multiply(scaleAnim, pulseAnim) }
              ]
            }
          ]}
        >
          <View style={styles.modalContent}>
            {showCloseButton && (
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => {
                  // Son de clic de bouton
                  audioService.playButtonClick();
                  // Son de fermeture de modal
                  audioService.playModalClose();
                  onClose && onClose();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            )}
            
            {title && (
              <Text style={styles.title}>{title}</Text>
            )}
            {message && (
              <View style={styles.messageContainer}>
                {message.split('\n').map((line, index) => (
                  <Text key={index} style={styles.message}>
                    {line}
                  </Text>
                ))}
              </View>
            )}
            
            {customContent && customContent}
            
            {buttons.length > 0 && (
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === 'primary' ? styles.primaryButton : styles.secondaryButton,
                      buttons.length === 1 && styles.singleButton
                    ]}
                    onPress={() => {
                      // Son de clic de bouton
                      audioService.playButtonClick();
                      // Son de fermeture de modal (joué avant l'action du bouton)
                      if (button.closesModal !== false) {
                        audioService.playModalClose();
                      }
                      button.onPress && button.onPress();
                      if (button.style !== 'primary' || !button.preventClose) {
                        onClose && onClose();
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.buttonText,
                      button.style === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: width > 600 ? 500 : width * 0.9,
    maxHeight: '80%',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: width > 600 ? 30 : 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
    maxHeight: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 12,
    paddingRight: 40,
    marginTop: 10,
  },
  messageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 2,
  },
  buttonContainer: {
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  button: {
    flex: width > 600 ? 1 : 0,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginHorizontal: width > 600 ? 5 : 0,
    marginVertical: width > 600 ? 0 : 6,
    alignItems: 'center',
    minHeight: 45,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  singleButton: {
    marginHorizontal: 0,
  },
  primaryButton: {
    backgroundColor: '#ff6b6b',
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: '#ff4757',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffd93d',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  secondaryButtonText: {
    color: '#ffd93d',
  },
});

export default CustomModal;