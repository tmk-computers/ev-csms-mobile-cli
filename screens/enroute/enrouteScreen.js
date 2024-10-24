import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import { LinearGradient } from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";
import { getCurrentPosition } from '../../helpers/geoUtils';

const EnRouteScreen = ({ navigation, route }) => {
  useEffect(() => {
    fetchCurrentLocation();
    
    if (route.params?.address) {
      if (route.params.addressFor === "pickup") {
        setPickupAddress(route.params.address);
        setPickupLocation(route.params.location);
      } else {
        setDestinationAddress(route.params.address);
        setDestinationLocation(route.params.location);
      }
    }
  }, [route.params?.address]);

  const [pickupLocation, setPickupLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickAlert, setpickAlert] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentLocationLoaded, setCurrentLocationLoaded] = useState(false);
  const [carDetails, setCarDetails] = useState({
    frequency:"",
    aminities:"",
    haultDuration: "",
    batteryStatus:"",
    milage:"",
    carBatteryCapacity: "",
    carDetails: ""
  })
  const showCards = false
  const fetchCurrentLocation = async () => {
    const location = await getCurrentPosition();
    setCurrentLocation(location);
    setCurrentLocationLoaded(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {imageView()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {enrouteDescription()}
          {pickupInfo()}
          {destinationInfo()}
          {carDetailsInfo()}
          {seeRouteButton()}
        </ScrollView>
        {pickAddressMessage()}
      </View>
    </View>
  );

  function pickAddressMessage() {
    return pickAlert ? (
      <Text style={styles.alertTextStyle}>Please Pick Correct Location!</Text>
    ) : null;
  }

  function seeRouteButton() {
    return (
      <TouchableOpacity
        style={{
          ...commonStyles.button,
          ...styles.seeRouteButtonStyle,
        }}
        onPress={() => {
          if (pickupAddress && destinationAddress) {
            navigation.push("EnrouteChargingStations", {pickupLocation, destinationLocation, showCards});
          } else {
            setpickAlert(true);
            setTimeout(() => {
              setpickAlert(false);
            }, 2000);
          }
        }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>
          See enroute charging stations
        </Text>
      </TouchableOpacity>
    );
  }

  function carDetailsInfo() {
    return (
      <View style={styles.carDetailsContainer}>
        <Text style={Fonts.blackColor18Medium}>Enter Car Details</Text>
        {/* <TextInput
          style={styles.input}
          placeholder="Frequency of hault during the travel"
          value={carDetails.frequency}
          onChangeText={setCarDetails({...carDetails, frequency: })}
          placeholderTextColor={"gray"}
        />
        <TextInput
          style={styles.input}
          placeholder="Animities filtering during travel"
          value={aminities}
          onChangeText={setAminities}
          placeholderTextColor={"gray"}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration of hault during travel"
          value={haultDuration}
          keyboardType="numeric"
          onChangeText={setModelYear}
          placeholderTextColor={"gray"}
        />
        <TextInput
          style={styles.input}
          placeholder="Battery charge status at start of the trip"
          value={batteryStatus}
          onChangeText={setBatteryStatus}
          placeholderTextColor={"gray"}
        />
        <TextInput
          style={styles.input}
          placeholder="Milage per KW"
          value={milage}
          onChangeText={setMilage}
          placeholderTextColor={"gray"}
        />
        <TextInput
          style={styles.input}
          placeholder="Car battery capacity"
          value={carBatteryCapacity}
          onChangeText={setCarBatteryCapacity}
          placeholderTextColor={"gray"}
        /> */}
        {/* <TextInput
          style={styles.input}
          placeholder="Avg. Milage"
          value={milage}
          onChangeText={setMilage}
          placeholderTextColor={"gray"}
        /> */}
      </View>
    );
  }


  function destinationInfo() {
    return (
      <TouchableOpacity
        activeOpacity={currentLocationLoaded ? 0.8 : 1}
        onPress={() => {
          if (currentLocationLoaded) {
            navigation.push("PickLocation", { addressFor: "destination", currentLocation });
          }
        }}
        style={{ ...styles.pickPointWrapStyle, opacity: currentLocationLoaded ? 1 : 0.5 }}
        disabled={!currentLocationLoaded}
      >
        <View style={styles.locationIconWrapStyle}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18Medium }}>
            Pick destination point
          </Text>
          <Text numberOfLines={2} style={{ ...Fonts.grayColor14Medium }}>
            {destinationAddress
              ? destinationAddress
              : "Please pick destination point in google map"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function pickupInfo() {
    return (
      <TouchableOpacity
        activeOpacity={currentLocationLoaded ? 0.8 : 1}
        onPress={() => {
          if (currentLocationLoaded) {
            navigation.push("PickLocation", { addressFor: "pickup", currentLocation });
          }
        }}
        style={{ ...styles.pickPointWrapStyle, marginTop: Sizes.fixPadding, opacity: currentLocationLoaded ? 1 : 0.5 }}
        disabled={!currentLocationLoaded}
      >
        <View style={styles.locationIconWrapStyle}>
          <MaterialIcons
            name="location-pin"
            size={24}
            color={Colors.primaryColor}
          />
        </View>
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18Medium }}>
            Pick starting point
          </Text>
          <Text numberOfLines={2} style={{ ...Fonts.grayColor14Medium }}>
            {pickupAddress
              ? pickupAddress
              : "Please pick starting point in google map"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function enrouteDescription() {
    return (
      <Text
        style={{
          ...Fonts.grayColor14Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Sizes.fixPadding,
        }}
      >
        Pick starting point & destination point and see how many charging
        stations are comping at that route.
      </Text>
    );
  }

  function imageView() {
    return (
      <ImageBackground
        source={require("../../assets/images/chargingStations/charging_station7.png")}
        style={styles.enRouteBgImageStyle}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.22)", "rgba(0, 0, 0, 0.16)"]}
          style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}
        >
          <Text
            style={{
              ...Fonts.whiteColor20SemiBold,
              margin: Sizes.fixPadding * 1.5,
              textAlign: "center",
            }}
          >
            Enroute charging station
          </Text>
        </LinearGradient>
      </ImageBackground>
    );
  }
};

export default EnRouteScreen;

const styles = StyleSheet.create({
  enRouteBgImageStyle: {
    width: "100%",
    height: screenWidth / 1.5,
    resizeMode: "stretch",
  },
  pickPointWrapStyle: {
    ...commonStyles.rowAlignCenter,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding + 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
    marginBottom: Sizes.fixPadding * 2.0,
    ...commonStyles.shadow,
  },
  locationIconWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  alertTextStyle: {
    ...Fonts.whiteColor14Medium,
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 0.0,
    alignSelf: "center",
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 5.0,
    borderRadius: Sizes.fixPadding * 2.0,
    zIndex: 100.0,
    overflow:'hidden'
  },
  seeRouteButtonStyle: {
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  carDetailsContainer: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginVertical: Sizes.fixPadding,
  },
  input: {
    height: 40,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    color: 'black'
  },
});
