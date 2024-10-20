import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MapView, { Marker } from "react-native-maps";
import { Key } from "../../constants/key";
import MapViewDirections from "react-native-maps-directions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";

const DirectionScreen = ({ navigation, route }) => {

  const { fromLocation, toLocation } = route.params;

  console.log("fromLocation", fromLocation);
  console.log("toLocation", toLocation);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {mapView()}
        {backArrow()}
        {chargingSpotInfo()}
      </View>
    </View>
  );

  function chargingSpotInfo() {
    return (
      <View style={styles.chargingStationWrapStyle}>
        <Image
          source={require("../../assets/images/chargingStations/charging_station4.png")}
          style={styles.chargingStationImage}
        />
        <View style={styles.stationOpenCloseWrapper}>
          <Text style={{ ...Fonts.whiteColor18Regular }}>Open</Text>
        </View>
        <View style={{ flex: 1, padding: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
            BYD Charging Point
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            Near shell petrol station
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding,
              ...commonStyles.rowAlignCenter,
            }}
          >
            <View style={{ ...commonStyles.rowAlignCenter }}>
              <Text style={{ ...Fonts.blackColor18Medium }}>4.7</Text>
              <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
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
                8 Charging Points
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor16Medium,
              marginTop: Sizes.fixPadding * 2.0,
            }}
          >
            4.5 km
          </Text>
        </View>
      </View>
    );
  }

  function backArrow() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.pop()}
        style={styles.backArrowWrapStyle}
      >
        <MaterialIcons
          name={"arrow-back"}
          size={24}
          color={Colors.blackColor}
          onPress={() => navigation.pop()}
        />
      </TouchableOpacity>
    );
  }

  function mapView() {

    // Calculate the midpoint between the fromLocation and toLocation
    const latitudeMidpoint = (fromLocation.latitude + toLocation.latitude) / 2;
    const longitudeMidpoint = (fromLocation.longitude + toLocation.longitude) / 2;

    // Calculate distance between fromLocation and toLocation (haversine formula or manually)
    const latDiff = Math.abs(fromLocation.latitude - toLocation.latitude);
    const longDiff = Math.abs(fromLocation.longitude - toLocation.longitude);

    // Adjust delta to fit both markers in the view
    const latitudeDelta = latDiff * 1.5; // Adjust factor for padding
    const longitudeDelta = longDiff * 1.5; // Adjust factor for padding


    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitudeMidpoint,
          longitude: longitudeMidpoint,
          latitudeDelta: Math.max(latitudeDelta, 0.2), // Minimum delta to prevent zooming too far in
          longitudeDelta: Math.max(longitudeDelta, 0.2),
        }}
      >
        <MapViewDirections
          origin={fromLocation}
          destination={toLocation}
          apikey={Key.apiKey}
          lineCap="square"
          strokeColor={Colors.primaryColor}
          strokeWidth={3}
        />
        <Marker coordinate={fromLocation}>
          <Image
            source={require("../../assets/images/icons/marker1.png")}
            style={{ width: 40.0, height: 40.0, resizeMode: 'contain' }}
          />
        </Marker>
        <Marker coordinate={toLocation}>
          <Image
            source={require("../../assets/images/icons/marker.png")}
            style={{ width: 40.0, height: 40.0, resizeMode: 'contain' }}
          />
        </Marker>
      </MapView>
    );
  }
};

export default DirectionScreen;

const styles = StyleSheet.create({
  backArrowWrapStyle: {
    width: 40.0,
    height: 40.0,
    backgroundColor: Colors.whiteColor,
    borderRadius: 20.0,
    ...commonStyles.shadow,
    position: "absolute",
    top: 20.0,
    left: 20.0,
    alignItems: "center",
    justifyContent: "center",
  },
  chargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    position: "absolute",
    bottom: 20.0,
    left: 20.0,
    right: 20.0,
  },
  chargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  stationOpenCloseWrapper: {
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
});
