module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: [
    '<rootDir>/e2e/'
  ],
  setupFiles: [
    './jestSetup.js'
  ],
  transform: {
    '^.+\\.(js|jsx|ts)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ]
};
