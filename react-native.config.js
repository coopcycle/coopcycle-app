// Specify a custom path, to make sure it loads the expected .env file
// https://github.com/motdotla/dotenv#path
require('dotenv').config({ path: __dirname + '/.env' })

let dependencies = {
  // We disable @react-native-firebase/messaging auto-linking on iOS
  '@react-native-firebase/messaging': {
    platforms: {
      ios: null,
    },
  },
};

if (!!process.env.DEFAULT_SERVER) {
  // We disable react-native-background-geolocation auto-linking for custom apps
  dependencies = Object.assign(dependencies, {
    'react-native-background-geolocation': {
      platforms: {
        android: null,
      },
    },
  })
}

module.exports = {
  assets: ['./assets/fonts/'],
  dependencies: dependencies
};
