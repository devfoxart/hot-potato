import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import premiumService from '../services/PremiumService';
import CustomModal from '../components/CustomModal';
import audioService from '../services/AudioService';
import vibrationService from '../services/VibrationService';

const { width } = Dimensions.get('window');



const CustomThemesScreen = ({ navigation }) => {
  const [customThemes, setCustomThemes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeEmoji, setCustomThemeEmoji] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);


  useEffect(() => {
    // Son d'ouverture d'écran
    audioService.playModalOpen();
    
    loadCustomThemes();
  }, []);

  const loadCustomThemes = async () => {
    const themes = await premiumService.getCustomThemes();
    setCustomThemes(themes);
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

  // Réinitialiser les champs
  const resetFields = () => {
    setCustomThemeName('');
    setCustomThemeEmoji('');
    setEditingTheme(null);
  };

  // Créer un nouveau thème
  const handleCreateTheme = () => {
    resetFields();
    setShowCreateModal(true);
  };

  // Modifier un thème existant
  const handleEditTheme = (theme) => {
    setEditingTheme(theme);
    // Extraire l'emoji et le nom du thème
    const themeName = theme.name;
    const emojiMatch = themeName.match(/^([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])\s*/u);
    
    if (emojiMatch) {
      setCustomThemeEmoji(emojiMatch[1]);
      setCustomThemeName(themeName.replace(emojiMatch[0], ''));
    } else {
      setCustomThemeEmoji('');
      setCustomThemeName(themeName);
    }
    
    setShowEditModal(true);
  };

  // Supprimer un thème avec confirmation
  const confirmDeleteTheme = (theme) => {
    setModalMessage(`Êtes-vous sûr de vouloir supprimer "${theme.name}" ?`);
    setConfirmAction(() => () => deleteTheme(theme.id));
    setShowConfirmModal(true);
  };

  const deleteTheme = async (themeId) => {
    const success = await premiumService.removeCustomTheme(themeId);
    if (success) {
      loadCustomThemes();
      audioService.playButtonClick();
      setModalMessage('Thème supprimé avec succès !');
      setShowSuccessModal(true);
    } else {
      setModalMessage('Erreur lors de la suppression du thème');
      setShowErrorModal(true);
    }
  };

  // Supprimer tous les thèmes avec confirmation
  const confirmDeleteAllThemes = () => {
    if (customThemes.length === 0) {
      setModalMessage('Aucun thème à supprimer');
      setShowErrorModal(true);
      return;
    }

    setModalMessage(`Êtes-vous sûr de vouloir supprimer tous vos ${customThemes.length} thèmes personnalisés ?\n\nCette action est irréversible.`);
    setConfirmAction(() => deleteAllThemes);
    setShowConfirmModal(true);
  };

  const deleteAllThemes = async () => {
    const success = await premiumService.clearAllCustomThemes();
    
    loadCustomThemes();
    audioService.playButtonClick();
    
    if (success) {
      setModalMessage('Tous les thèmes ont été supprimés avec succès !');
      setShowSuccessModal(true);
    } else {
      setModalMessage('Erreur lors de la suppression des thèmes');
      setShowErrorModal(true);
    }
  };

  // Sauvegarder un thème (création ou modification)
  const saveTheme = async () => {
    if (!customThemeName.trim()) {
      setModalMessage('Veuillez entrer un nom pour le thème');
      setShowErrorModal(true);
      return;
    }

    const emoji = customThemeEmoji.trim() || '🎯';
    const themeName = `${emoji} ${customThemeName.trim()}`;

    const themeData = {
      name: themeName
    };

    let success = false;
    
    if (editingTheme) {
      // Modification d'un thème existant
      await premiumService.removeCustomTheme(editingTheme.id);
      success = await premiumService.addCustomTheme(themeData);
    } else {
      // Création d'un nouveau thème
      success = await premiumService.addCustomTheme(themeData);
    }

    if (success) {
      setShowCreateModal(false);
      setShowEditModal(false);
      resetFields();
      loadCustomThemes();
      audioService.playButtonClick();
      setModalMessage(editingTheme ? 'Thème modifié avec succès !' : 'Thème créé avec succès !');
      setShowSuccessModal(true);
    } else {
      setModalMessage('Erreur lors de la sauvegarde du thème');
      setShowErrorModal(true);
    }
  };

  const cancelModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    resetFields();
  };



  const renderThemeModal = (isEdit = false) => (
    <CustomModal
      visible={isEdit ? showEditModal : showCreateModal}
      onClose={cancelModal}
      title={isEdit ? '✏️ Modifier le Thème' : '🎨 Créer un Thème Personnalisé'}
      message={isEdit ? 'Modifiez votre thème personnalisé' : 'Créez votre thème avec un nom et un emoji'}
      customContent={
        <View style={styles.modalContent}>
          <Text style={styles.label}>Emoji du thème :</Text>
          <TextInput
             style={styles.input}
             value={customThemeEmoji}
             onChangeText={handleEmojiChange}
             placeholder="🎯 Tapez un emoji"
             placeholderTextColor="#999"
             maxLength={2}
             returnKeyType="done"
             autoFocus={false}
           />
          
          <Text style={styles.label}>Nom du thème :</Text>
          <TextInput
            style={styles.input}
            value={customThemeName}
            onChangeText={setCustomThemeName}
            placeholder="Ex: Mes Films Préférés"
            placeholderTextColor="#999"
          />
        </View>
      }
      buttons={[
        {
          text: 'Annuler',
          onPress: cancelModal,
          style: 'secondary'
        },
        {
          text: isEdit ? 'Modifier' : 'Créer',
          onPress: saveTheme,
          style: 'primary'
        }
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            audioService.playButtonClick();
            vibrationService.vibrateButtonClick();
            audioService.playModalClose();
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mes Thèmes Personnalisés</Text>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => {
            audioService.playButtonClick();
            vibrationService.vibrateButtonClick();
            handleCreateTheme();
          }}
        >
          <Text style={styles.createButtonText}>+ Créer</Text>
        </TouchableOpacity>
      </View>

      {/* Delete All Button */}
      {customThemes.length > 0 && (
        <View style={styles.deleteAllContainer}>
          <TouchableOpacity 
            style={styles.deleteAllButton} 
            onPress={() => {
              audioService.playButtonClick();
              vibrationService.vibrateError();
              confirmDeleteAllThemes();
            }}
          >
            <Text style={styles.deleteAllButtonText}>🗑️ Supprimer tous les thèmes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste des thèmes */}
      <ScrollView style={styles.content}>
        {customThemes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎨</Text>
            <Text style={styles.emptyStateTitle}>Aucun thème personnalisé</Text>
            <Text style={styles.emptyStateText}>
              Créez votre premier thème personnalisé !
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton} 
              onPress={() => {
                audioService.playButtonClick();
                vibrationService.vibrateButtonClick();
                handleCreateTheme();
              }}
            >
              <Text style={styles.emptyStateButtonText}>🎨 Créer mon premier thème</Text>
            </TouchableOpacity>
          </View>
        ) : (
          customThemes.map((theme, index) => (
            <View key={theme.id || index} style={styles.themeCard}>
              <View style={styles.themeInfo}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <Text style={styles.themeQuestionCount}>
                  Thème personnalisé
                </Text>
              </View>
              <View style={styles.themeActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => {
                    audioService.playButtonClick();
                    vibrationService.vibrateButtonClick();
                    handleEditTheme(theme);
                  }}
                >
                  <Text style={styles.editButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => {
                    vibrationService.vibrateError();
                    confirmDeleteTheme(theme);
                  }}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modals */}
      {renderThemeModal(false)}
      {renderThemeModal(true)}
      
      {/* Modal de succès */}
      <CustomModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="✅ Succès"
        message={modalMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowSuccessModal(false),
            style: 'primary'
          }
        ]}
      />
      
      {/* Modal d'erreur */}
      <CustomModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="❌ Erreur"
        message={modalMessage}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowErrorModal(false),
            style: 'primary'
          }
        ]}
      />
      
      {/* Modal de confirmation */}
      <CustomModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="⚠️ Confirmation"
        message={modalMessage}
        buttons={[
          {
            text: 'Annuler',
            onPress: () => setShowConfirmModal(false),
            style: 'secondary'
          },
          {
            text: 'Confirmer',
            onPress: () => {
              setShowConfirmModal(false);
              if (confirmAction) {
                confirmAction();
              }
            },
            style: 'primary'
          }
        ]}
      />
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#16213e',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAllContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteAllButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  deleteAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyStateButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  themeQuestionCount: {
    fontSize: 14,
    color: '#a0a0a0',
  },
  themeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#4a90e2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  modalContent: {
    maxHeight: 400,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },

});

export default CustomThemesScreen;