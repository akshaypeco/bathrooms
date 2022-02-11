import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const FilterScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="dark-content" />
      <View style={styles.titleContainer}>
        <View>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            Filter restrooms
          </Text>
          <Text style={{ fontSize: 18 }}>Map will reset on return</Text>
        </View>

        <Ionicons
          name="chevron-forward-circle-outline"
          size={40}
          color="black"
          style={{ marginLeft: "auto", marginRight: 30 }}
          onPress={() => {
            navigation.navigate("Homescreen");
          }}
        />
      </View>
      <View style={styles.filterOptionsContainer}>
        <Text style={{ fontSize: 27, fontWeight: "bold" }}>Reviews</Text>
      </View>
      <View style={styles.filterOptionsContainer}>
        <Text style={{ fontSize: 27, fontWeight: "bold" }}>Type</Text>
      </View>
      <View style={styles.filterOptionsContainer}>
        <Text style={{ fontSize: 27, fontWeight: "bold" }}>Accessibility</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.reset}
          onPress={() => {
            navigation.navigate("Homescreen");
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.apply}
          onPress={() => {
            navigation.navigate("Homescreen");
          }}
        >
          <Text style={{ fontSize: 18, color: "white" }}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    marginLeft: 40,
    flexDirection: "row",
  },
  filterOptionsContainer: {
    marginLeft: 45,
    marginTop: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 40,
  },
  reset: {
    backgroundColor: "black",
    width: "45%",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  apply: {
    backgroundColor: "black",
    width: "45%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
});
