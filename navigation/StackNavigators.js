import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../src/screens/LoginScreen";
import FilterScreen from "../src/screens/FilterScreen";
import HomeScreen from "../src/screens/HomeScreen";

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const LoginStackNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

const HomeScreenNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Homescreen" component={HomeScreen} />
      <HomeStack.Screen name="Filter" component={FilterScreen} />
    </HomeStack.Navigator>
  );
};

export { LoginStackNavigator, HomeScreenNavigator };
