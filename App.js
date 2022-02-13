import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackNavigator } from "./navigation/StackNavigators";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const getLocalDatabase = async () => {
    if (
      !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
        .exists
    ) {
      await FileSystem.makeDirectoryAsync(
        Filesystem.documentDirectory + "SQLite"
      );
    }
    await FileSystem.downloadAsync(
      Asset.fromModule(require("./assets/database/bathrooms.db")).uri,
      FileSystem.documentDirectory + "SQLite/bathrooms.db"
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
