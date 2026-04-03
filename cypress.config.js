const { defineConfig } = require('cypress');
const getCompareSnapshotsPlugin = require('cypress-image-diff-js/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://centraldata.com',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
    video: false,
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
      return config;
    },
  },
  env: {
    visualRegressionType: 'regression',
    cypressImageDiff: {
      threshold: 1,
      thresholdType: 'percent',
    },
  },
});
