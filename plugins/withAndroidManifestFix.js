const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins');

function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    
    // Add tools namespace if not present
    if (!config.modResults.manifest.$['xmlns:tools']) {
      config.modResults.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }
    
    // Fix AD_SERVICES_CONFIG conflict
    const resourceName = 'android.adservices.AD_SERVICES_CONFIG';
    const conflictResolvingPropertyTag = {
      $: {
        'android:name': resourceName,
        'android:resource': '@xml/gma_ad_services_config',
        'tools:replace': 'android:resource',
      },
    };
    
    if (mainApplication['property']) {
      // Remove existing property with same name
      const existingPropertyTags = mainApplication['property'].filter(
        (res) => res.$['android:name'] !== resourceName,
      );
      existingPropertyTags.push(conflictResolvingPropertyTag);
      mainApplication['property'] = existingPropertyTags;
    } else {
      mainApplication['property'] = [conflictResolvingPropertyTag];
    }

    return config;
  });
}

module.exports = withAndroidManifestFix;