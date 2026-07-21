import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import * as Sentry from '@sentry/react-native';

// Import des services
import vibrationService from './src/services/VibrationService';

// DSN fourni via variable d'environnement EXPO_PUBLIC_SENTRY_DSN (voir .env.example).
// Sans DSN configuré, Sentry.init() est un no-op : aucun crash n'est remonté tant
// qu'un vrai projet Sentry n'a pas été créé et sa clé renseignée.
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  enabled: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 1.0,
});

// Import des écrans
import HomeScreen from './src/screens/HomeScreen';
import ConfigScreen from './src/screens/ConfigScreen';
import CustomThemesScreen from './src/screens/CustomThemesScreen';
import PositionScreen from './src/screens/PositionScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoseScreen from './src/screens/LoseScreen';
import RulesScreen from './src/screens/RulesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    // Initialiser le service de vibration au démarrage
    vibrationService.init();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Hot Potato' }}
        />
        <Stack.Screen 
          name="Config" 
          component={ConfigScreen} 
          options={{ title: 'Configuration' }}
        />
        <Stack.Screen 
          name="CustomThemes" 
          component={CustomThemesScreen} 
          options={{ title: 'Mes Thèmes Personnalisés' }}
        />
        <Stack.Screen 
          name="Position" 
          component={PositionScreen} 
          options={{ title: 'Positionnement' }}
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: 'Jeu', headerLeft: null }}
        />
        <Stack.Screen 
          name="Result" 
          component={ResultScreen} 
          options={{ title: 'Résultats' }}
        />
        <Stack.Screen 
          name="Lose" 
          component={LoseScreen} 
          options={{ title: 'Défaite', headerLeft: null }}
        />
        <Stack.Screen 
          name="Rules" 
          component={RulesScreen} 
          options={{ title: 'Règles du Jeu', headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Paramètres', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Sentry.wrap(App);