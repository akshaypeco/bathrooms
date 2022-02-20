import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackNavigator } from "./navigation/StackNavigators";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import { useEffect, useState } from "react";
import * as Filesystem from "expo-file-system";
import { Asset } from "expo-asset";
import { getStorage, ref } from "firebase/storage";

const Stack = createNativeStackNavigator();

export default function App() {
  const getLocalDatabase = async () => {
    if (
      !(await Filesystem.getInfoAsync(Filesystem.documentDirectory + "SQLite"))
        .exists
    ) {
      await Filesystem.makeDirectoryAsync(
        Filesystem.documentDirectory + "SQLite"
      );
    }

    const storage = getStorage();
    const pathRef = ref(storage, "bathrooms.db");
    await Filesystem.downloadAsync(
      Asset.fromModule(require("./assets/database/bathrooms.db")).uri,
      Filesystem.documentDirectory + "SQLite/bathrooms.db"
    );
  };

  getLocalDatabase();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login Stage"
          component={LoginStackNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main Stage"
          component={TabNavigator}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
