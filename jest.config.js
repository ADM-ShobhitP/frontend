module.exports = {
  preset: 'jest-expo',
  setupFiles: ['@testing-library/react-native/dont-cleanup-after-each', './node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-redux' +
      '|redux' +
      '|expo' +
      '|@expo' +
      '|expo-status-bar' +
      '|react-native-reanimated' +
      '|react-native-safe-area-context' +
      '|react-native-gesture-handler' +
      '|react-native-vector-icons' +
      ')',
  ],
  testEnvironment: 'jest-environment-jsdom',
  "moduleNameMapper": {
      "^react-native-vector-icons/(.*)": "<rootDir>/__mocks__/react-native-vector-icons/$1.js",
      '^react-native-gesture-handler$': '<rootDir>/__mocks__/react-native-gesture-handler.js',
      "^expo-font$": "<rootDir>/__mocks__/expo-font.js"
    }
};
