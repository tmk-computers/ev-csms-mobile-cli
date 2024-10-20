import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { fetchNearbyChargingStations, fetchEnrouteChargingStations } from '../../api/realApi';
import { getCurrentPosition } from '../../helpers/geoUtils';
import { getImageSource, isImageUrl } from "../../helpers/imageUtils";

const localImageMap = {
  'charging_station1.png': require('../../assets/images/chargingStations/charging_station1.png'),
  'charging_station2.png': require('../../assets/images/chargingStations/charging_station2.png'),
  'charging_station3.png': require('../../assets/images/chargingStations/charging_station3.png'),
  'charging_station4.png': require('../../assets/images/chargingStations/charging_station4.png'),
  'charging_station5.png': require('../../assets/images/chargingStations/charging_station5.png'),
};

const HomeScreen = ({ navigation }) => {

  const [fullName, setFullName] = useState("Guest");  // Default name
  const [nearByChargingStationsList, setNearByChargingStationsList] = useState([]);
  const [enrouteChargingStationList, setEnrouteChargingStationList] = useState([]);
  const [nearbyErrorMessage, setNearbyErrorMessage] = useState("");
  const [enrouteErrorMessage, setEnrouteErrorMessage] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const loadNearbyChargingStations = async () => {
    try {
      const location = await getCurrentPosition();
      setCurrentLocation(location);
      console.log("User's current location:", location?.coords?.latitude, location?.coords?.longitude);

      const { success, data } = await fetchNearbyChargingStations(
        location?.coords?.latitude,
        location?.coords?.longitude,
        10
      );

      if (success && Array.isArray(data) && data.length > 0) {
        setNearByChargingStationsList(data);
      } else {
        setNearbyErrorMessage("No charging stations available nearby.");
      }
    } catch (error) {
      console.error(error);
      setNearbyErrorMessage("Unable to fetch user's current location.");
    }
  };

  const loadEnrouteChargingStations = async () => {
    try {
      let sourcePlace = "";
      let destinationPlace = "";
      const { success, data } = await fetchEnrouteChargingStations(sourcePlace, destinationPlace);
      if (success && Array.isArray(data) && data.length > 0) {
        setEnrouteChargingStationList(data);
      } else {
        setEnrouteErrorMessage("No enroute charging stations available.");
      }
    } catch (error) {
      setEnrouteErrorMessage("Failed to fetch enroute charging stations.");
    }
  };

  const fetchFullName = async () => {
    try {
      const storedFullName = await AsyncStorage.getItem("fullName");  // Fetch name from AsyncStorage
      if (storedFullName) {
        setFullName(storedFullName);  // Set full name if found
      }
    } catch (error) {
      console.error("Error fetching full name:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFullName();
      loadNearbyChargingStations();
      loadEnrouteChargingStations();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {welcomeInfo()}
          {searchBox()}
          {nearByChargingStationInfo()}
          {enrouteChargingStationInfo()}
        </ScrollView>
        {mapViewButton()}
      </View>
    </View>
  );

  function mapViewButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("ChargingStationsOnMap", { "currentLocation": currentLocation, "chargingSpotsList": enrouteChargingStationList })}
        style={styles.mapViewButton}
      >
        <MaterialIcons name="map" color={Colors.whiteColor} size={30} />
      </TouchableOpacity>
    );
  }

  function enrouteChargingStationInfo() {

    if (enrouteErrorMessage) {
      return <Text style={styles.messageText}>{enrouteErrorMessage}</Text>;
    }

    if (enrouteChargingStationList.length === 0) {
      return <Text style={styles.messageText}>No enroute charging stations found...</Text>;
    }

    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail", { "chargingStationId": item.id });
        }}
        style={styles.enrouteChargingStationWrapStyle}
      >
        {isImageUrl(item.stationImage) ? (
          <Image
            source={{ uri: item.stationImage }} // If it's a URL, use it directly
            style={styles.enrouteChargingStationImage}
          />
        ) : (
          <Image
            source={getImageSource(item.stationImage, localImageMap)}
            style={styles.enrouteChargingStationImage}
          />
        )}
        <View style={styles.enrouteStationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>
            {item.isOpen ? "Open" : "Closed"}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ margin: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item.stationName}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.stationAddress}
            </Text>
            <View
              style={{
                marginTop: Sizes.fixPadding,
                ...commonStyles.rowAlignCenter,
              }}
            >
              <View style={{ ...commonStyles.rowAlignCenter }}>
                <Text style={{ ...Fonts.blackColor18Medium }}>
                  {item.rating}
                </Text>
                <MaterialIcons
                  name="star"
                  color={Colors.yellowColor}
                  size={20}
                />
              </View>
              <View
                style={{
                  marginLeft: Sizes.fixPadding * 2.0,
                  ...commonStyles.rowAlignCenter,
                  flex: 1,
                }}
              >
                <View style={styles.primaryColorDot} />
                <Text
                  numberOfLines={1}
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.grayColor14Medium,
                    flex: 1,
                  }}
                >
                  {item.totalPoints} Charging Points
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              ...commonStyles.rowAlignCenter,
              paddingLeft: Sizes.fixPadding,
              marginTop: Sizes.fixPadding,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.blackColor16Medium,
                flex: 1,
                marginRight: Sizes.fixPadding - 5.0,
              }}
            >
              {`${item.distance} Km`}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("Direction", { fromLocation: { latitude: currentLocation?.coords?.latitude, longitude: currentLocation?.coords?.longitude }, toLocation: { latitude: item.latitude, longitude: item.longitude }, station: item });
              }}
              style={styles.getDirectionButton}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor20SemiBold,
          }}
        >
          Enroute charging station
        </Text>
        <FlatList
          data={enrouteChargingStationList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          style={{ paddingTop: Sizes.fixPadding * 1.5 }}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function nearByChargingStationInfo() {

    if (nearbyErrorMessage) {
      return <Text style={styles.messageText}>{nearbyErrorMessage}</Text>;
    }

    if (nearByChargingStationsList.length === 0) {
      return <Text style={styles.messageText}>No nearby charging stations found...</Text>;
    }

    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail", { "chargingStationId": item.id });
        }}
        style={styles.nearByChargingStationWrapStyle}
      >
        <View>
          {isImageUrl(item.stationImage) ? (
            <Image
              source={{ uri: item.stationImage }} // If it's a URL, use it directly
              style={styles.nearByChargingStationImageStyle}
            />
          ) : (
            <Image
              source={getImageSource(item.stationImage, localImageMap)}
              style={styles.nearByChargingStationImageStyle}
            />
          )}
          <View style={styles.nearByOpenCloseWrapper}>
            <Text style={{ ...Fonts.whiteColor18Regular }}>
              {item.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
        <View style={{ width: screenWidth / 1.83 }}>
          <View style={{ padding: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
              {item.stationName}
            </Text>
            <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
              {item.stationAddress}
            </Text>
            <View style={{ ...commonStyles.rowAlignCenter }}>
              <Text style={{ ...Fonts.blackColor18Medium }}>{item.rating}</Text>
              <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingLeft: Sizes.fixPadding,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                ...Fonts.grayColor12Medium,
                flex: 1,
                marginRight: Sizes.fixPadding - 5.0,
              }}
            >
              {item.totalPoints} Charging Points
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("Direction", { fromLocation: { latitude: currentLocation?.coords?.latitude, longitude: currentLocation?.coords?.longitude }, toLocation: { latitude: item.latitude, longitude: item.longitude }, station: item });
              }}
              style={styles.getDirectionButton}
            >
              <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding * 2.0 }}>
        <View
          style={{
            ...commonStyles.rowSpaceBetween,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          <Text
            numberOfLines={1}
            style={{ ...Fonts.blackColor20SemiBold, flex: 1 }}
          >
            Nearby charging station
          </Text>
          <Text
            onPress={() => {
              navigation.push("AllChargingStations");
            }}
            style={{ ...Fonts.primaryColor16Medium }}
          >
            See all
          </Text>
        </View>
        <FlatList
          data={nearByChargingStationsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding * 2.0,
            paddingTop: Sizes.fixPadding * 1.5,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        />
      </View>
    );
  }

  function searchBox() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.push("Search")}
        style={styles.searchBox}
      >
        <MaterialIcons name="search" color={Colors.grayColor} size={24} />
        <Text
          numberOfLines={1}
          style={{
            ...Fonts.grayColor18Medium,
            flex: 1,
            marginLeft: Sizes.fixPadding,
          }}
        >
          Search for charging station
        </Text>
      </TouchableOpacity>
    );
  }

  function welcomeInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor26SemiBold }}>Welcome {fullName},</Text>
        <Text style={{ ...Fonts.grayColor18Regular }}>
          Find charging station now
        </Text>
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  messageText: {
    textAlign: 'center',
    marginTop: Sizes.fixPadding * 2.0,
    ...Fonts.grayColor18Regular,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  nearByChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    marginRight: Sizes.fixPadding * 2.0,
  },
  nearByChargingStationImageStyle: {
    width: screenWidth / 1.83,
    height: screenWidth / 3.2,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  nearByOpenCloseWrapper: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    right: 0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderBottomLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  enrouteChargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  enrouteStationOpenCloseWrapper: {
    position: "absolute",
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  primaryColorDot: {
    width: 10.0,
    height: 10.0,
    borderRadius: 5.0,
    backgroundColor: Colors.primaryColor,
  },
  mapViewButton: {
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20.0,
    right: 20.0,
    ...commonStyles.shadow,
  },
});
