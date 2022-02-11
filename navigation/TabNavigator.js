import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../src/screens/HomeScreen";
import AccountScreen from "../src/screens/AccountScreen";
import AddScreen from "../src/screens/AddScreen";
import { HomeScreenNavigator } from "./StackNavigators";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "white" },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "#afafaf",
      }}
    >
      <Tab.Screen name="Home" component={HomeScreenNavigator} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
