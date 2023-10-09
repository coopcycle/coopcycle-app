module.exports = {
  preset: 'react-native',
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
    'node_modules/(?!@react-native|react-native|react-navigation|native-base-shoutem-theme|@shoutem/animation|@shoutem/ui|tcomb-form-native|coopcycle-frontend-js)'
  ]
};
