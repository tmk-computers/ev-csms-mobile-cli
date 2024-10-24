import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ViewDetailScreen = ({ route }) => {
  const { totalTime, source, chargingStations, destination } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Details</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Total Time:</Text>
          <Text style={styles.detail}>{totalTime}</Text>
          <Text style={styles.extraDetail}>Add more fields here such as estimated arrival time or any rest breaks.</Text>
        </View>
        <View style={styles.flowContainer}>
          <View style={styles.flowSegment}>
            <Text style={styles.label}>Source:</Text>
            <Text style={styles.detail}>{source}</Text>
          </View>
          <MaterialIcons name="arrow-downward" size={24} color="#000" style={styles.arrow} />
          {chargingStations.map((station, index) => (
            <React.Fragment key={index}>
              <View style={styles.flowSegment}>
                <Text style={styles.label}>Charging Station - {index + 1}:</Text>
                <Text style={styles.detail}>{station}</Text>
                <Text style={styles.extraDetail}>Add more details here such as station facilities, type of charging available, etc.</Text>
              </View>
              {index < chargingStations.length - 1 && (
                <MaterialIcons name="arrow-downward" size={24} color="#000" style={styles.arrow} />
              )}
            </React.Fragment>
          ))}
          <MaterialIcons name="arrow-downward" size={24} color="#000" style={styles.arrow} />
          <View style={styles.flowSegment}>
            <Text style={styles.label}>Destination:</Text>
            <Text style={styles.detail}>{destination}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  detailContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  detail: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  extraDetail: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  flowContainer: {
    alignItems: 'center',
  },
  flowSegment: {
    margin: 10,
    alignItems: 'center',
  },
  arrow: {
    marginVertical: 10,
  },
});

export default ViewDetailScreen;
