import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, PermissionsAndroid, Platform, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MapView, { Marker, Polyline } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import Tts from 'react-native-tts';
import { Key } from "../../constants/key";
import MapViewDirections from "react-native-maps-directions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";

const DirectionScreen = ({ navigation, route }) => {

  const { fromLocation, toLocation, station } = route.params;

  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(fromLocation);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [navigationStarted, setNavigationStarted] = useState(false); // Track navigation state
  const [watchId, setWatchId] = useState(null); // Track the watch ID for Geolocation
  const [lastInstruction, setLastInstruction] = useState(''); // Track the last spoken instruction to avoid repetition
  const [totalTime, setTotalTime] = useState(null); // Store total time to destination
  const [nextTurn, setNextTurn] = useState(''); // Store next turn instruction
  const [showDirections, setShowDirections] = useState(false);
  const [directions, setDirections] = useState([]);

  // Then in useEffect:
  useEffect(() => {
    const init = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        startLocationTracking(); // Start tracking location but don't start navigation until the button is pressed
      }
    };

    init();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const granted = await Geolocation.requestAuthorization('whenInUse');
        if (granted !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is needed for navigation.');
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location for navigation",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('Permission Denied', 'Location permission is needed for navigation.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
  };

  const startLocationTracking = () => {
    const id = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };

        // Update current location
        setCurrentLocation(newLocation);

        // Remove previous coordinates the user has passed
        setRouteCoordinates((prevCoordinates) => {
          // Find the closest point in the routeCoordinates
          const closestIndex = findClosestCoordinateIndex(newLocation, prevCoordinates);

          // Remove all points before the closest point
          return prevCoordinates.slice(closestIndex);
        });

        if (navigationStarted) {
          handleProximityCheck({ latitude, longitude });
          updateMapCamera({ latitude, longitude });
        }
      },
      (error) => Alert.alert("Error", error.message),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
    setWatchId(id); // Store the watch ID to clear it later if needed
  };

  const findClosestCoordinateIndex = (currentLocation, routeCoordinates) => {
    let minDistance = Infinity;
    let closestIndex = 0;

    // Iterate through routeCoordinates to find the closest point
    routeCoordinates.forEach((coordinate, index) => {
      const distance = calculateDistance(currentLocation, coordinate);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex; // Return the index of the closest point
  };

  // Utility function to remove HTML tags
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, ''); // Regular expression to remove HTML tags
  };

  const onDirectionsReady = (result) => {
    setRouteCoordinates(result.coordinates);
    setTotalTime(result.duration); // Get the total travel time

    // Extract detailed instructions for the steps
    const steps = result.legs[0]?.steps.map((step, index) => ({
      instruction: stripHtmlTags(step.html_instructions) || 'No instruction available',
      distance: step.distance.text,
      duration: step.duration.text
    })) || [];
    setDirections(steps);

    // Get the next turn instruction (if available)
    const nextTurn = stripHtmlTags(result.legs[0]?.steps[0]?.html_instructions) || 'Proceed straight';
    setNextTurn(nextTurn);
  };

  const handleProximityCheck = (currentPosition) => {
    if (stepIndex >= routeCoordinates.length) {
      Tts.speak("You have arrived at your destination.");
      Geolocation.clearWatch(watchId); // Stop location tracking when arriving
      return;
    }

    const nextStep = routeCoordinates[stepIndex];
    const distance = calculateDistance(currentPosition, nextStep);

    // Provide voice instructions based on the distance to the next step
    provideVoiceInstructions(distance);

    if (distance < 50) { // 50 meters proximity threshold to trigger the turn
      Tts.speak("Turn now.");
      moveToNextStep(nextStep);
    }
  };

  const provideVoiceInstructions = (distance) => {
    if (distance <= 200 && lastInstruction !== '200m') {
      Tts.speak(`In 200 meters, ${nextTurn}.`);
      setLastInstruction('200m');
    } else if (distance <= 100 && lastInstruction !== '100m') {
      Tts.speak(`In 100 meters, ${nextTurn}.`);
      setLastInstruction('100m');
    } else if (distance <= 50 && lastInstruction !== '50m') {
      Tts.speak(`In 50 meters, ${nextTurn}.`);
      setLastInstruction('50m');
    }
  };

  const moveToNextStep = (nextLocation) => {
    // Animate the camera to change the angle, position, and zoom after each turn
    mapRef.current.animateCamera({
      center: {
        latitude: nextLocation.latitude,
        longitude: nextLocation.longitude,
      },
      pitch: 45, // Camera angle for better navigation view
      heading: calculateHeading(currentLocation, nextLocation), // Adjust heading based on movement
      altitude: 1000, // Adjust altitude for zoom
      zoom: 16,
    }, { duration: 1000 });

    setStepIndex(stepIndex + 1); // Advance to the next step
    setLastInstruction(''); // Reset last instruction for the next step
  };

  const calculateHeading = (from, to) => {
    const fromLat = from.latitude;
    const fromLng = from.longitude;
    const toLat = to.latitude;
    const toLng = to.longitude;

    const dLon = (toLng - fromLng);
    const y = Math.sin(dLon) * Math.cos(toLat);
    const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLon);
    const heading = Math.atan2(y, x) * (180 / Math.PI);
    return (heading + 360) % 360;
  };

  const calculateDistance = (location1, location2) => {
    const lat1 = location1.latitude;
    const lon1 = location1.longitude;
    const lat2 = location2.latitude;
    const lon2 = location2.longitude;

    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const startNavigation = () => {
    setNavigationStarted(true);
    // Fit both markers (start and end points) on the screen
    mapRef.current.fitToCoordinates([fromLocation, toLocation], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      animated: true,
    });

    // Announce the total time and next turn on start
    Tts.speak(`The total time to your destination is ${Math.round(totalTime)} minutes. ${nextTurn}.`);

    // Change the camera to a driving view when navigation starts
    mapRef.current.animateCamera({
      center: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
      pitch: 45, // Set the angle for a driving view
      heading: 0, // Initial heading
      zoom: 20, // Zoom level for driving
    }, { duration: 1000 });
  };

  const updateMapCamera = (currentPosition) => {
    const nextStep = routeCoordinates[stepIndex] || toLocation;
    const heading = calculateHeading(currentPosition, nextStep);

    mapRef.current.animateCamera({
      center: {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      },
      pitch: 45,
      heading: heading,  // Update heading dynamically
      zoom: 20,
    }, { duration: 1000 });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {mapView()}
        {backArrow()}
        {chargingSpotInfo()}
        {!navigationStarted && startNavigationButton()}
        {viewDirectionsButton()}
        {showDirections && renderDirectionsList()}
      </View>
    </View>
  );

  function startNavigationButton() {
    return (
      <TouchableOpacity
        style={styles.navigationButton}
        activeOpacity={0.8}
        onPress={startNavigation}
      >
        <Text style={styles.navigationButtonText}>Start Navigation</Text>
      </TouchableOpacity>
    );
  }

  function viewDirectionsButton() {
    return (
      <TouchableOpacity
        style={styles.navigationButton}
        activeOpacity={0.8}
        onPress={() => setShowDirections(!showDirections)} // Toggle visibility
      >
        <Text style={styles.navigationButtonText}>View Directions</Text>
      </TouchableOpacity>
    );
  }

  function renderDirectionsList() {
    return (
      <ScrollView style={styles.directionsList}>
        {directions.map((step, index) => (
          <View key={index} style={styles.directionItem}>
            <Text style={styles.directionText}>{index + 1}. {step.instruction}</Text>
            <Text style={styles.directionSubText}>Distance: {step.distance}, Duration: {step.duration}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }

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
            {station?.stationName || station?.name}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {station?.stationAddress || station?.address}
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
                {station?.totalPoints || station?.noOfConnectors || 0} Charging Points
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
            {station?.distance} km
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

  function handleError(errorMessage) {
    Alert.alert(
      "Route Not Found",
      errorMessage || "Could not find a route between the locations.",
      [{ text: "OK" }]
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
        ref={mapRef}
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
          onReady={onDirectionsReady}
          onError={(errorMessage) => {
            if (errorMessage === "Error on GMAPS route request: ZERO_RESULTS") {
              handleError("No route found between the selected locations.");
            } else {
              handleError(errorMessage);
            }
          }}
        />
        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor="blue" />
        <Marker coordinate={currentLocation}>
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
  navigationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    ...commonStyles.shadow,
  },
  navigationButtonText: {
    ...Fonts.whiteColor18SemiBold,
  },
  directionsList: {
    position: 'absolute',
    bottom: 150, // Position above the buttons
    left: 20,
    right: 20,
    backgroundColor: Colors.whiteColor,
    padding: 10,
    borderRadius: 8,
    maxHeight: 300,
    ...commonStyles.shadow,
  },
  directionItem: {
    marginBottom: 10,
  },
  directionText: {
    ...Fonts.blackColor16Medium,
  },
  directionSubText: {
    ...Fonts.grayColor14Medium,
  },
});
