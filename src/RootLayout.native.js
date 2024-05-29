import React from 'react';
import { Slot } from 'expo-router';

// As we will move from React Navigation to the file-based router (Expo Router)
// most of the code from RootPage.native.js will be moved to this file
export default function RootLayout() {
  return <Slot />;
}
