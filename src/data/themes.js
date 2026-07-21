// Système de thèmes simplifiés (sans sous-thèmes)
export const THEMES_DATA = {
  // Thèmes gratuits (4 débloqués)
  animaux: {
    name: '🐾 Animaux',
    free: true,
    questions: [
      'Nomme un animal domestique',
      'Cite un animal sauvage',
      'Quel animal miaule ?',
      'Nomme un animal de la ferme',
      'Cite un animal qui vole',
      'Nomme un poisson',
      'Cite un mammifère marin',
      'Quel animal a huit tentacules ?',
      'Nomme un crustacé',
      'Cite un animal des profondeurs',
      'Nomme un reptile',
      'Cite un animal nocturne',
      'Quel animal hiberne ?',
      'Nomme un animal de la jungle',
      'Cite un animal qui pond des œufs'
    ]
  },

  nourriture: {
    name: '🍕 Nourriture',
    free: true,
    questions: [
      'Nomme un fruit rouge',
      'Cite un légume vert',
      'Quel plat mange-t-on avec des baguettes ?',
      'Nomme une pâtisserie française',
      'Cite un fromage français',
      'Nomme un fruit tropical',
      'Cite un fruit à noyau',
      'Quel fruit est jaune et courbé ?',
      'Nomme un dessert au chocolat',
      'Cite une glace parfumée',
      'Nomme une boisson chaude',
      'Cite un cocktail célèbre',
      'Nomme un plat italien',
      'Cite une spécialité japonaise',
      'Quel plat vient du Mexique ?'
    ]
  },

  films: {
    name: '🎬 Films & Séries',
    free: true,
    questions: [
      'Nomme un film avec des super-héros',
      'Cite un film d\'animation Disney',
      'Quel film a gagné l\'Oscar cette année ?',
      'Nomme un acteur français célèbre',
      'Cite une saga de films',
      'Nomme une princesse Disney',
      'Cite un méchant Disney',
      'Nomme un film Pixar',
      'Nomme une série Netflix populaire',
      'Cite une série avec des zombies',
      'Quelle série se passe à Hawkins ?',
      'Nomme un film de zombie',
      'Cite un personnage effrayant',
      'Nomme un réalisateur célèbre',
      'Cite une comédie française'
    ]
  },

  sport: {
    name: '⚽ Sport',
    free: true,
    questions: [
      'Nomme un sport d\'équipe',
      'Cite un sport olympique',
      'Quel sport se joue avec une raquette ?',
      'Nomme un sport de combat',
      'Cite un sport aquatique',
      'Nomme un joueur de football célèbre',
      'Cite une équipe de Ligue 1',
      'Quel pays a gagné la dernière Coupe du Monde ?',
      'Nomme un sport d\'hiver',
      'Cite une épreuve d\'athlétisme',
      'Nomme un sport de glisse',
      'Cite un sport aérien',
      'Nomme un champion olympique',
      'Cite un sport de vitesse',
      'Nomme une discipline de gymnastique'
    ]
  },

  // Thèmes premium (verrouillés)
  musique: {
    name: '🎵 Musique',
    free: false,
    questions: [
      'Nomme un instrument à cordes',
      'Cite un chanteur français',
      'Quel instrument a des touches noires et blanches ?',
      'Nomme un groupe de rock',
      'Cite un style de musique',
      'Nomme un chanteur pop international',
      'Cite un groupe de rock célèbre',
      'Nomme un compositeur célèbre',
      'Cite un opéra connu',
      'Nomme un rappeur français',
      'Cite un rappeur américain',
      'Nomme un festival de musique',
      'Cite une chanson des Beatles',
      'Nomme un instrument à vent',
      'Cite un album célèbre'
    ]
  },

  geographie: {
    name: '🌍 Géographie',
    free: false,
    questions: [
      'Nomme un continent',
      'Cite une capitale européenne',
      'Quel est le plus grand océan ?',
      'Nomme une chaîne de montagnes',
      'Cite un fleuve célèbre',
      'Nomme un pays d\'Asie',
      'Cite un pays d\'Afrique',
      'Quel pays a pour capitale Tokyo ?',
      'Nomme une ville américaine',
      'Cite une ville française',
      'Quelle ville abrite la Tour Eiffel ?',
      'Nomme un monument parisien',
      'Cite une merveille du monde',
      'Nomme un château français',
      'Cite un monument américain'
    ]
  },

  histoire: {
    name: '📚 Histoire',
    free: false,
    questions: [
      'Nomme un roi de France',
      'Cite une guerre mondiale',
      'Quel empereur a conquis l\'Europe ?',
      'Nomme une révolution célèbre',
      'Cite un pharaon égyptien',
      'Nomme un empereur romain',
      'Cite une bataille célèbre',
      'Quel siècle était le Moyen Âge ?',
      'Nomme un explorateur célèbre',
      'Cite une civilisation antique',
      'Nomme un président français',
      'Cite un événement du 20e siècle',
      'Nomme un château médiéval',
      'Cite une invention importante',
      'Nomme un personnage historique'
    ]
  },

  science: {
    name: '🔬 Science',
    free: false,
    questions: [
      'Nomme un élément chimique',
      'Cite une planète du système solaire',
      'Quel gaz respirons-nous ?',
      'Nomme un scientifique célèbre',
      'Cite une invention moderne',
      'Nomme un organe du corps humain',
      'Cite une maladie connue',
      'Quel est l\'organe qui pompe le sang ?',
      'Nomme un animal préhistorique',
      'Cite une source d\'énergie',
      'Nomme une constellation',
      'Cite un phénomène naturel',
      'Nomme un métal précieux',
      'Cite une unité de mesure',
      'Nomme une théorie scientifique'
    ]
  },

  technologie: {
    name: '💻 Technologie',
    free: false,
    questions: [
      'Nomme un réseau social',
      'Cite une marque de smartphone',
      'Quel système d\'exploitation utilise Apple ?',
      'Nomme un moteur de recherche',
      'Cite une plateforme de streaming',
      'Nomme un langage de programmation',
      'Cite une entreprise tech',
      'Quel appareil sert à naviguer sur internet ?',
      'Nomme une console de jeux',
      'Cite un jeu vidéo célèbre',
      'Nomme une application mobile',
      'Cite un service de cloud',
      'Nomme un navigateur web',
      'Cite une cryptomonnaie',
      'Nomme une intelligence artificielle'
    ]
  },

  litterature: {
    name: '📖 Littérature',
    free: false,
    questions: [
      'Nomme un écrivain français',
      'Cite un livre célèbre',
      'Quel auteur a écrit Harry Potter ?',
      'Nomme un poète français',
      'Cite une pièce de théâtre',
      'Nomme un personnage de roman',
      'Cite un conte de fées',
      'Quel écrivain a écrit "1984" ?',
      'Nomme une saga littéraire',
      'Cite un prix littéraire',
      'Nomme un héros de BD',
      'Cite un journal célèbre',
      'Nomme un genre littéraire',
      'Cite un auteur de science-fiction',
      'Nomme une maison d\'édition'
    ]
  },

  mode: {
    name: '👗 Mode & Style',
    free: false,
    questions: [
      'Nomme une marque de luxe',
      'Cite un vêtement d\'été',
      'Quel accessoire porte-t-on au poignet ?',
      'Nomme un styliste célèbre',
      'Cite une couleur tendance',
      'Nomme un type de chaussures',
      'Cite un tissu naturel',
      'Quel vêtement porte-t-on pour dormir ?',
      'Nomme un parfum célèbre',
      'Cite un défilé de mode',
      'Nomme une capitale de la mode',
      'Cite un magazine de mode',
      'Nomme un bijou précieux',
      'Cite un style vestimentaire',
      'Nomme une matière de luxe'
    ]
  },

  voyage: {
    name: '✈️ Voyage & Tourisme',
    free: false,
    questions: [
      'Nomme une destination exotique',
      'Cite un moyen de transport',
      'Quel document faut-il pour voyager ?',
      'Nomme un hôtel de luxe',
      'Cite une compagnie aérienne',
      'Nomme une île paradisiaque',
      'Cite un site touristique',
      'Quel continent visiter en safari ?',
      'Nomme une ville romantique',
      'Cite une activité de vacances',
      'Nomme un parc d\'attractions',
      'Cite une croisière célèbre',
      'Nomme un guide de voyage',
      'Cite une application de voyage',
      'Nomme un type d\'hébergement'
    ]
  },

  nature: {
    name: '🌿 Nature & Environnement',
    free: false,
    questions: [
      'Nomme un arbre fruitier',
      'Cite une fleur colorée',
      'Quel phénomène cause la pluie ?',
      'Nomme un parc national',
      'Cite un animal en voie de disparition',
      'Nomme une saison de l\'année',
      'Cite un phénomène météo',
      'Quel gaz produit l\'effet de serre ?',
      'Nomme une source d\'énergie verte',
      'Cite un écosystème naturel',
      'Nomme un minéral précieux',
      'Cite une catastrophe naturelle',
      'Nomme un insecte utile',
      'Cite une plante médicinale',
      'Nomme un océan de la planète'
    ]
  },

  art: {
    name: '🎨 Art & Culture',
    free: false,
    questions: [
      'Nomme un peintre célèbre',
      'Cite un musée parisien',
      'Quel artiste a peint la Joconde ?',
      'Nomme une sculpture célèbre',
      'Cite un mouvement artistique',
      'Nomme un instrument de musique',
      'Cite une danse traditionnelle',
      'Quel matériau utilise un sculpteur ?',
      'Nomme un théâtre célèbre',
      'Cite un festival culturel',
      'Nomme un style architectural',
      'Cite une technique de peinture',
      'Nomme un opéra célèbre',
      'Cite un artiste contemporain',
      'Nomme une galerie d\'art'
    ]
  },

  metiers: {
    name: '👷 Métiers & Professions',
    free: false,
    questions: [
      'Nomme un métier médical',
      'Cite un métier artistique',
      'Quel métier enseigne aux enfants ?',
      'Nomme un métier du bâtiment',
      'Cite un métier de la restauration',
      'Nomme un métier du sport',
      'Cite un métier de la mode',
      'Quel métier répare les voitures ?',
      'Nomme un métier de la justice',
      'Cite un métier de l\'informatique',
      'Nomme un métier de la sécurité',
      'Cite un métier du spectacle',
      'Nomme un métier de l\'agriculture',
      'Cite un métier de la communication',
      'Nomme un métier de la finance'
    ]
  }
};

// Thèmes personnalisés (stockés localement)
export const CUSTOM_THEMES_KEY = '@HotPotato:customThemes';

// Fonction pour obtenir les thèmes disponibles selon le statut premium
export const getAvailableThemes = async (isPremium = false, premiumService = null) => {
  const standardThemes = [];
  
  // Inclure TOUS les thèmes, même ceux premium (pour les afficher verrouillés)
  Object.keys(THEMES_DATA).forEach(themeKey => {
    const theme = THEMES_DATA[themeKey];
    standardThemes.push({
      key: themeKey,
      ...theme,
      type: 'standard',
      locked: !theme.free && !isPremium // Marquer comme verrouillé si premium et pas d'accès
    });
  });
  
  // Ajouter les thèmes personnalisés si premium
  if (isPremium && premiumService) {
    try {
      const customThemes = await premiumService.getCustomThemes();
      const customThemeObjects = customThemes.map(customTheme => ({
        key: `custom_${customTheme.id}`,
        name: customTheme.name,
        free: false,
        type: 'custom',
        customId: customTheme.id,
        questions: customTheme.questions,
        locked: false
      }));
      
      return [...standardThemes, ...customThemeObjects];
    } catch (error) {
      console.error('Erreur lors du chargement des thèmes personnalisés:', error);
    }
  }

  return standardThemes;
};

// Fonction pour obtenir une question aléatoire d'un thème
export const getRandomQuestion = (themeKey) => {
  // Gérer les thèmes personnalisés
  if (themeKey.startsWith('custom_')) {
    return "Nomme quelque chose de cool !";
  }
  
  const theme = THEMES_DATA[themeKey];
  if (!theme || !theme.questions) {
    return "Nomme quelque chose de cool !";
  }
  
  const questions = theme.questions;
  return questions[Math.floor(Math.random() * questions.length)];
};

// Fonction pour obtenir des questions aléatoires d'un thème
export const getRandomQuestions = async (themeKey, count = 50, premiumService = null) => {
  // Gérer les thèmes personnalisés
  if (themeKey.startsWith('custom_') && premiumService) {
    try {
      const customThemes = await premiumService.getCustomThemes();
      const customId = themeKey.replace('custom_', '');
      const customTheme = customThemes.find(theme => theme.id === customId);
      
      if (customTheme && customTheme.questions) {
        const shuffled = [...customTheme.questions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, customTheme.questions.length));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questions personnalisées:', error);
    }
    return [];
  }

  // Gérer les thèmes standards
  const theme = THEMES_DATA[themeKey];
  if (!theme || !theme.questions) {
    return [];
  }

  const questions = theme.questions;
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};