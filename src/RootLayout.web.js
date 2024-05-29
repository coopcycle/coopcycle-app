import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { nativeBaseTheme } from '@/src/styles/theme';
import RootView from '@/src/navigation/RootView';
// import { Provider } from 'react-redux';
// import store, { persistor } from '@/src/redux/store';
// import FullScreenLoadingIndicator from '@/src/navigation/FullScreenLoadingIndicator';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/src/i18n';
import { NativeBaseProvider } from 'native-base';
// import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const queryClient = new QueryClient();

  //TODO; minimise DUPLICATION WITH mobile app RootPage.js

  return (
    <NativeBaseProvider theme={nativeBaseTheme}>
      <RootView>
        {/*<Provider store={store}>*/}
        {/*  <PersistGate*/}
        {/*    loading={*/}
        {/*      <FullScreenLoadingIndicator debugHint="Initialising the Redux state ..." />*/}
        {/*    }*/}
        {/*    persistor={persistor}>*/}
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            {/*<Spinner />*/}
            <ThemeProvider
              value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack />
            </ThemeProvider>
            {/*<NavigationContainer*/}
            {/*  ref={navigationRef}*/}
            {/*  linking={linking}*/}
            {/*  onReady={onReady}*/}
            {/*  onStateChange={onNavigationStateChange}*/}
            {/*  theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>*/}
            {/*  <Root />*/}
            {/*</NavigationContainer>*/}
            {/*<DropdownAlert*/}
            {/*  ref={ref => {*/}
            {/*    DropdownHolder.setDropdown(ref);*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<NotificationHandler />*/}
          </QueryClientProvider>
        </I18nextProvider>
        {/*  </PersistGate>*/}
        {/*</Provider>*/}
      </RootView>
    </NativeBaseProvider>
  );
}
