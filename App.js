import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackNavigator } from "./navigation/StackNavigators";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import * as Filesystem from "expo-file-system";
import { Asset } from "expo-asset";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { View, Text } from "react-native";
import React, { useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
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
    getDownloadURL(pathRef)
      .then((url) => {
        Filesystem.downloadAsync(
          url,
          Filesystem.documentDirectory + "SQLite/bathrooms.db"
        )
          .then(({ uri }) => {
            console.log("Finished downloading to ", uri);
            setIsReady(true);
          })
          .catch((error) => {
            Filesystem.downloadAsync(
              Asset.fromModule(require("./assets/database/bathrooms.db")).uri,
              Filesystem.documentDirectory + "SQLite/bathrooms.db"
            );
            console.log(error);
            setIsReady(true);
          });
      })
      .catch((error) => {
        Filesystem.downloadAsync(
          Asset.fromModule(require("./assets/database/bathrooms.db")).uri,
          Filesystem.documentDirectory + "SQLite/bathrooms.db"
        );
        console.log(error);
        setIsReady(true);
      });
  };

  getLocalDatabase();
  if (isReady) {
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
  } else {
    return (
      <View
        style={{
          alignSelf: "center",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 30, alignSelf: "center", paddingBottom: 10 }}>
          BATHROOMS
        </Text>
        <Text style={{ fontSize: 17, alignSelf: "center" }}>
          locations from Refugee Restrooms
        </Text>
        <Text style={{ fontSize: 17, alignSelf: "center", marginTop: 75 }}>
          Retrieving latest data...
        </Text>
      </View>
    );
  }
}
