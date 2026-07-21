module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // babel-preset-expo auto-adds the react-native-reanimated/worklets plugin
      // when react-native-reanimated is installed, no need to declare it manually.
      'babel-preset-expo'
    ],
  };
};
