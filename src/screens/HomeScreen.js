import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  StatusBar,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { openDatabase } from "expo-sqlite";

const HomeScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [getLocation, setGetLocation] = useState(false);
  const [currLoc, setCurrLoc] = useState();
  const [currMarkerLoc, setcurrMarkerLoc] = useState(null);
  const [currRegion, setCurrRegion] = useState([]);
  const [icon, setIcon] = useState("black");
  const [markerData, setMarkerData] = useState([]);
  const [searchArea, setSearchArea] = useState(false);

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["100%"], []);

  var db = openDatabase("bathrooms.db");
  const getData = async (
    latitude,
    longitude,
    longitudeDelta,
    latitudeDelta
  ) => {
    const minLat = latitude - latitudeDelta / 2;
    const maxLat = latitude + latitudeDelta / 2;
    const minLong = longitude + longitudeDelta / 2;
    const maxLong = longitude - longitudeDelta / 2;
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM bathrooms WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?",
        [minLat, maxLat, minLong, maxLong],
        (tx, res) => {
          setMarkerData(res.rows._array);
        },
        (e) => console.log("error fetching: ", e)
      );
    });
  };

  const getCurrLoc = async () => {
    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    setCurrLoc({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    });

    setcurrMarkerLoc({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    return coords;
  };

  useEffect(() => {
    const fetchData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "Permission to access location was denied. To use location-based features on map and list, the app needs your current location."
        );
      }
      getCurrLoc();
    };
    fetchData();
    setGetLocation(true);
  }, [getLocation]);

  const snapToUser = () => {
    getCurrLoc();
    mapRef.current.animateToRegion(currLoc, 800);
    setIcon("#5588ff");
  };

  const openModal = () => {
    bottomSheetModalRef.current.present();
  };

  const dismissModal = () => {
    bottomSheetModalRef.current.dismiss();
  };

  return (
    <BottomSheetModalProvider style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={currLoc}
        onRegionChangeComplete={(region) => {
          setCurrRegion(region);
          setIcon("black");
          setSearchArea(true);
          if (region.latitudeDelta <= 0.3 && region.longitudeDelta <= 0.3) {
            getData(
              region.latitude,
              region.longitude,
              region.longitudeDelta,
              region.latitudeDelta
            );
          }
        }}
      >
        {currMarkerLoc ? (
          <Marker
            coordinate={{
              longitude: currMarkerLoc.longitude,
              latitude: currMarkerLoc.latitude,
            }}
          >
            <View style={styles.currentLocationBlueDot}></View>
          </Marker>
        ) : null}
        {markerData.map((hit) => (
          <Marker
            coordinate={{
              longitude: parseFloat(hit.longitude),
              latitude: parseFloat(hit.latitude),
            }}
            key={hit.id}
          >
            <View style={styles.bathroomLocationDot}></View>
          </Marker>
        ))}
      </MapView>
      <Pressable
        style={styles.currentLocationButton}
        onPressIn={() => {
          snapToUser();
        }}
      >
        <FontAwesome name="location-arrow" size={35} color={icon} />
      </Pressable>
      <Pressable
        style={styles.addButton}
        onPressIn={() => {
          snapToUser();
        }}
      >
        <Ionicons name="md-add" size={42} color="black" />
      </Pressable>
      <Pressable
        style={styles.filterButton}
        onPress={() => {
          openModal();
        }}
      >
        <FontAwesome name="filter" size={24} color="black" />
      </Pressable>
      {/* {searchArea &&
      currRegion.longitudeDelta <= 0.3 &&
      currRegion.latitudeDelta <= 0.3 ? (
        <Pressable
          style={styles.searchAreaButton}
          onPress={() => {
            setSearchArea(false);
            getData(
              currRegion.latitude,
              currRegion.longitude,
              currRegion.longitudeDelta,
              currRegion.latitudeDelta
            );
          }}
        >
          <Text style={{ fontSize: 17 }}>Search area</Text>
        </Pressable>
      ) : null} */}
      {currRegion.longitudeDelta > 0.3 || currRegion.latitudeDelta > 0.3 ? (
        <View
          style={[
            styles.searchAreaButton,
            { width: Dimensions.get("window").height * 0.195 },
          ]}
        >
          <Text style={{ fontSize: 17 }}>Zoom in to search</Text>
        </View>
      ) : null}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        <View>
          <View style={styles.titleContainer}>
            <View>
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                Filter restrooms
              </Text>
            </View>
          </View>
          <View style={styles.filterOptionsContainer}>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}>Reviews</Text>
          </View>
          <View style={styles.filterOptionsContainer}>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}>Type</Text>
            <Text style={{ fontSize: 22, marginTop: 20, marginLeft: 20 }}>
              Gender-neutral
            </Text>
            <Text style={{ fontSize: 22, marginTop: 20, marginLeft: 20 }}>
              Family
            </Text>
          </View>
          <View style={styles.filterOptionsContainer}>
            <Text style={{ fontSize: 27, fontWeight: "bold" }}>
              Accessibility
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.reset}
              onPress={() => {
                dismissModal();
              }}
            >
              <Text style={{ fontSize: 18, color: "white" }}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.apply}
              onPress={() => {
                dismissModal();
              }}
            >
              <Text style={{ fontSize: 18, color: "white" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  currentLocationButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.815,
    left: Dimensions.get("window").width * 0.8,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.065,
    width: Dimensions.get("window").height * 0.065,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.72,
    left: Dimensions.get("window").width * 0.8,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.065,
    width: Dimensions.get("window").height * 0.065,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 2,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filterButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.07,
    left: Dimensions.get("window").width * 0.08,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.06,
    width: Dimensions.get("window").height * 0.06,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  currentLocationBlueDot: {
    height: 17,
    width: 17,
    backgroundColor: "#4a80f5",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 2.25,
    borderColor: "white",
  },
  bathroomLocationDot: {
    height: 10,
    width: 10,
    backgroundColor: "#1f3a6f",
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // borderWidth: 2.25,
    // borderColor: "white",
  },
  searchAreaButton: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.825,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").height * 0.165,
    alignSelf: "center",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  bottomSheet: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  titleContainer: {
    marginTop: 10,
    marginLeft: 40,
    flexDirection: "row",
  },
  filterOptionsContainer: {
    marginLeft: 50,
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
