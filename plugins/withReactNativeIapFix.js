const { withAppBuildGradle } = require('@expo/config-plugins');

// react-native-iap publishes two Android product flavors (Amazon Appstore vs
// Google Play), and Gradle cannot resolve the dependency without the app
// declaring which one to use. Without this, `gradlew bundleRelease` fails
// with "cannot choose between amazonReleaseRuntimeElements / playReleaseRuntimeElements".
function withReactNativeIapFix(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("missingDimensionStrategy 'store'")) {
      return config;
    }

    config.modResults.contents = config.modResults.contents.replace(
      /defaultConfig\s*\{/,
      (match) => `${match}\n        missingDimensionStrategy 'store', 'play'`
    );

    return config;
  });
}

module.exports = withReactNativeIapFix;
