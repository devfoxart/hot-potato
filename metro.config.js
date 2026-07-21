const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure Metro looks for modules in the correct node_modules directory
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Set the project root to the current directory
config.projectRoot = __dirname;

// Exclude react-native-google-mobile-ads from web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Platform-specific module resolution
config.resolver.platformExtensions = ['web.js', 'web.ts', 'web.tsx', 'js', 'ts', 'tsx'];

module.exports = config;