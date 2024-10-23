import React from 'react';
import { View } from 'react-native';
import MyStatusBar from "../../components/myStatusBar";
import ChargingStationsMap from '../../components/chargingStationsMap';

const ChargingStationsOnMapScreen = ({ navigation, route }) => {
  const { currentLocation, chargingSpotsList } = route.params;

  // Function to handle the "back" press
  const handleBackPress = () => {
    navigation.pop();
  };

  // Function to handle selecting a charging station
  const handleStationSelect = (stationId) => {
    navigation.push("ChargingStationDetail", { chargingStationId: stationId });
  };

  // Function to handle "Get Directions" button press
  const handleGetDirection = (station) => {
    navigation.push("Direction", {
      fromLocation: currentLocation?.coords,
      toLocation: { latitude: station.latitude, longitude: station.longitude },
      station,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Status Bar */}
      <MyStatusBar />
      
      {/* Charging Stations Map Component */}
      <ChargingStationsMap
        currentLocation={currentLocation}
        chargingSpotsList={chargingSpotsList}
        onBackPress={handleBackPress}
        onStationSelect={handleStationSelect}
        onGetDirection={handleGetDirection}
      />
    </View>
  );
};

export default ChargingStationsOnMapScreen;