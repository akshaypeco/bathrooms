import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginStackNavigator } from "./navigation/StackNavigators";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import { useEffect } from "react";
import { addInitialData, createTable, dropTable } from "./database";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    const fetchData = async () => {
      createTable();
      // await addInitialData();
    };
    fetchData();
  }, []);

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
