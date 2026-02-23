import React from "react";

import { Stack } from "expo-router";

import { Provider } from "react-redux";

import { store } from "../src/redux/store";

import { PaperProvider } from "react-native-paper";


export default function RootLayout() {

  return (

    <Provider store={store}>

      <PaperProvider>

        <Stack screenOptions={{ headerShown: false }} />

      </PaperProvider>

    </Provider>

  );

}
