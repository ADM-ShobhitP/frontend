import React from 'react';
import { Provider } from 'react-redux';
import Store from './redux/Store';
import Layout from './app/_layout';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <Provider store={Store}>
      <Layout />
    </Provider>
  );
}

