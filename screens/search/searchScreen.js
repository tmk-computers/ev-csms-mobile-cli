import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors, Fonts, Sizes, commonStyles, screenWidth} from '../../constants/styles';
import MyStatusBar from '../../components/myStatusBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Key from "../../constants/key";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { fetchNearbyChargingStationsUsingAggregator } from '../../api/realApi';
import Geocoder from 'react-native-geocoding';
import { getCurrentPosition } from '../../helpers/geoUtils';
import { getImageSource, isImageUrl } from "../../helpers/imageUtils";
import { ENV } from '@env';
import { setupMockApis } from '../../api/mockApi';

// Mock the API if the environment is development
if (ENV === 'development') {
  setupMockApis();
}


const recentSearchesList = [];

const localImageMap = {
  'charging_station1.png': require('../../assets/images/chargingStations/charging_station1.png'),
  'charging_station2.png': require('../../assets/images/chargingStations/charging_station2.png'),
  'charging_station3.png': require('../../assets/images/chargingStations/charging_station3.png'),
  'charging_station4.png': require('../../assets/images/chargingStations/charging_station4.png'),
  'charging_station5.png': require('../../assets/images/chargingStations/charging_station5.png'),
};

const SearchScreen = ({navigation}) => {
  const [search, setsearch] = useState('');
  const [recentSearches, setrecentSearches] = useState(recentSearchesList);
  const [nearByChargingStationsList, setNearByChargingStationsList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    console.log('ENV:', process.env.NODE_ENV);
    console.log('ENVFILE:', process.env.ENVFILE);
    Geocoder.init(Key.apiKey);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodyBackColor}}>
      <MyStatusBar />
      <View style={{flex: 1}}>
        {header()}
        {searchField()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}>
          {/* {recentSearches.length === 0 ? null : recentSearchesInfo()} */}
          {nearByChargingStationInfo()}
        </ScrollView>
      </View>
    </View>
  );

  async function fetchChargingStationsNearByPlace({ address }) {
    try {
      Geocoder.from(address)
        .then(async json => {
          var location = json.results[0].geometry.location;
          const userSearchLocation = {
            latitude: location.lat,
            longitude: location.lng,
          };
          const { success, data } = await fetchNearbyChargingStationsUsingAggregator(userSearchLocation.latitude, userSearchLocation.longitude, 50);
          if (success && Array.isArray(data) && data.length > 0) {
            setNearByChargingStationsList(data);
            const location = await getCurrentPosition();
            setCurrentLocation(location);
          } else {
            setNearByChargingStationsList([]);
            console.log("No charging stations available nearby for this location.");
          }
          console.log("userSearchLocation", userSearchLocation);
        })
        .catch(error => {
          console.error('Error in geocoding: ', error);
          console.log("Failed to fetch nearby charging stations for this location.");
        });
    } catch (error) {
      console.log("Failed to fetch nearby charging stations for this location.");
    }
  }
  function nearByChargingStationInfo() {

    if (nearByChargingStationsList.length === 0) {
      return <Text style={styles.messageText}>No nearBy charging stations found...</Text>;
    }

    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail", { "chargingStationId": item.id });
        }}
        style={styles.nearByChargingStationWrapStyle}
      >
        {isImageUrl(item.stationImage) ? (
          <Image
            source={{ uri: item.stationImage }} // If it's a URL, use it directly
            style={styles.nearByChargingStationImage}
          />
        ) : (
          <Image
            source={getImageSource(item.stationImage, localImageMap)}
            style={styles.nearByChargingStationImage}
          />
        )}
        <View style={styles.nearByStationOpenCloseWrapper}>
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
          Nearby charging stations
        </Text>
        <FlatList
          data={nearByChargingStationsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          style={{ paddingTop: Sizes.fixPadding * 1.5 }}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function recentSearchesInfo() {
    const renderItem = ({item}) => (
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          marginVertical: Sizes.fixPadding - 5.0,
        }}>
        {item}
      </Text>
    );
    return (
      <View style={{marginHorizontal: Sizes.fixPadding * 2.0}}>
        <View style={{...commonStyles.rowSpaceBetween}}>
          <Text
            numberOfLines={1}
            style={{...Fonts.blackColor20SemiBold, flex: 1}}>
            Recent searches
          </Text>
          <Text
            onPress={() => {
              setrecentSearches([]);
            }}
            style={{...Fonts.primaryColor16Medium}}>
            Clear all
          </Text>
        </View>
        <FlatList
          data={recentSearches}
          keyExtractor={index => `${index}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    );
  }

  function searchField() {
    return (
      <View style={styles.searchBox}>
        <MaterialIcons
          name="search"
          color={search ? Colors.primaryColor : Colors.grayColor}
          size={24}
        />
        <GooglePlacesAutocomplete
          placeholder="Search location here"
          onPress={(data) => {
            setsearch(data.description);
            fetchChargingStationsNearByPlace({ address: data.description });
            setrecentSearches([...recentSearches, data.description]);
          }}
          styles={{
            textInputContainer: {
              backgroundColor: Colors.bodyBackColor,
              borderRadius: Sizes.fixPadding - 5.0,
              borderColor: Colors.primaryColor, // Border to make input distinct
              borderWidth: 1,
            },
            textInput: {
              height: 40,
              color: Colors.blackColor, // Fixes text color
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: Colors.primaryColor, // Text for dropdown suggestions
            },
            description: {
              color: Colors.blackColor, // Dropdown item text color
            },
            listView: {
              backgroundColor: Colors.whiteColor, // Background for dropdown
              borderRadius: 5,
              elevation: 2, // Adding shadow for dropdown visibility
            },
          }}
          query={{
            key: Key.apiKey,
            language: "en",
          }}
          textInputProps={{
            InputComp: TextInput,
            value: search,
            onChangeText: (value) => setsearch(value),
            placeholderTextColor: Colors.grayColor, // Fix placeholder visibility
            selectionColor: Colors.primaryColor, // Selection text color
          }}
        />
      </View>
    );
  }

  function header() {
    return (
      <View style={{...commonStyles.rowSpaceBetween, margin: 20.0}}>
        <View
          style={{
            ...commonStyles.rowAlignCenter,
            flex: 1,
            marginRight: Sizes.fixPadding - 5.0,
          }}>
          <MaterialIcons
            name="arrow-back"
            color={Colors.blackColor}
            size={26}
            onPress={() => {
              navigation.pop();
            }}
          />
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor20SemiBold,
              flex: 1,
              marginLeft: Sizes.fixPadding * 2.0,
            }}>
            Search
          </Text>
        </View>
        <MaterialIcons
          name="filter-list"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.push("Filter");
          }}
        />
      </View>
    );
  }
};

export default SearchScreen;

const styles = StyleSheet.create({
  searchFieldStyle: {
    ...Fonts.blackColor18Medium,
    flex: 1,
    marginLeft: Sizes.fixPadding,
    padding: 0,
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
  messageText: {
    textAlign: 'center',
    marginTop: Sizes.fixPadding * 2.0,
    ...Fonts.grayColor18Regular,
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  nearByChargingStationWrapStyle: {
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
  nearByChargingStationImage: {
    width: screenWidth / 3.2,
    height: "100%",
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
  },
  nearByStationOpenCloseWrapper: {
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
