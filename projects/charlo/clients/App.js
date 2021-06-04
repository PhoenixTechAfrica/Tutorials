import './global';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { DrawerLayoutAndroid } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import { useCachedResources } from "./hooks/useCashedResources";
import { useColorScheme } from "./hooks/useColorScheme";
import { Navigation } from './navigation'
import { default as theme } from './custom-theme.json';
import { default as mapping } from './mapping.json';
import { store } from './store';


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <ApplicationProvider
          {...eva}
          theme={{...eva.dark, ...theme}}
          customMapping={mapping}>

          <IconRegistry icons={EvaIconsPack} />
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
          
        </ApplicationProvider>
      </Provider>
    );
  }
}
