/**
 * Calcule le nombre de gorgées à boire en fonction du temps restant
 * @param {number} timeLeft - Temps restant en secondes
 * @param {number} totalTime - Temps total du chronomètre en secondes
 * @param {boolean} isTimeUp - Indique si c'est une fin par temps écoulé
 * @returns {number} - Nombre de gorgées à boire
 */
export const calculateSips = (timeLeft, totalTime, isTimeUp = false) => {
  // Si le temps est écoulé, toujours 2 gorgées par défaut
  if (isTimeUp || timeLeft <= 0) {
    return 2;
  }
  // Base de 2 gorgées minimum
  const baseSips = 2;
  
  // Calcul du pourcentage de temps restant
  const timePercentage = timeLeft / totalTime;
  
  // Plus il reste de temps, plus on boit
  // Si 100% du temps reste = +4 gorgées
  // Si 75% du temps reste = +3 gorgées
  // Si 50% du temps reste = +2 gorgées
  // Si 25% du temps reste = +1 gorgée
  // Si 0% du temps reste = +0 gorgée
  
  let bonusSips = 0;
  
  if (timePercentage >= 0.8) {
    bonusSips = 4; // 80-100% = 6 gorgées total
  } else if (timePercentage >= 0.6) {
    bonusSips = 3; // 60-79% = 5 gorgées total
  } else if (timePercentage >= 0.4) {
    bonusSips = 2; // 40-59% = 4 gorgées total
  } else if (timePercentage >= 0.2) {
    bonusSips = 1; // 20-39% = 3 gorgées total
  } else {
    bonusSips = 0; // 0-19% = 2 gorgées total (base)
  }
  
  return baseSips + bonusSips;
};

/**
 * Obtient un message descriptif pour le nombre de gorgées
 * @param {number} sipsCount - Nombre de gorgées
 * @param {number} timeLeft - Temps restant en secondes
 * @param {number} totalTime - Temps total du chronomètre
 * @param {boolean} isTimeUp - Indique si c'est une fin par temps écoulé
 * @returns {string} - Message descriptif
 */
export const getSipsMessage = (sipsCount, timeLeft, totalTime, isTimeUp = false) => {
  // Message spécial pour temps écoulé
  if (isTimeUp || timeLeft <= 0) {
    return `Plus de temps ! ${sipsCount} gorgées`;
  }
  
  const timePercentage = (timeLeft / totalTime) * 100;
  
  if (timePercentage >= 80) {
    return `Beaucoup de temps restant = ${sipsCount} gorgées !`;
  } else if (timePercentage >= 60) {
    return `Pas mal de temps restant = ${sipsCount} gorgées`;
  } else if (timePercentage >= 40) {
    return `Un peu de temps restant = ${sipsCount} gorgées`;
  } else if (timePercentage >= 20) {
    return `Peu de temps restant = ${sipsCount} gorgées`;
  } else {
    return `Presque plus de temps = ${sipsCount} gorgées`;
  }
};