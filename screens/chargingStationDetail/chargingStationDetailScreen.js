import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Sizes,
  Fonts,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import CollapsibleToolbar from "react-native-collapsible-toolbar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "react-native-linear-gradient";
import rating from "../../components/rating";
import { Snackbar } from "react-native-paper";

import { fetchChargingStationDetails, fetchChargingStationConnectorDetails, fetchChargingStationCustomerReviews, addToFavorites, removeFromFavorites, isFavorite } from '../../api/realApi';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentPosition } from '../../helpers/geoUtils';
import { getImageSource, isImageUrl } from "../../helpers/imageUtils";

const AllAminitiesList = [
  {
    id: "1",
    aminityImage: require("../../assets/images/aminities/aminity1.png"),
    aminity: "Washroom",
  },
  {
    id: "2",
    aminityImage: require("../../assets/images/aminities/aminity2.png"),
    aminity: "Sitting area",
  },
  {
    id: "3",
    aminityImage: require("../../assets/images/aminities/aminity3.png"),
    aminity: "FREE Wifi",
  },
  {
    id: "4",
    aminityImage: require("../../assets/images/aminities/aminity4.png"),
    aminity: "Food",
  },
  {
    id: "5",
    aminityImage: require("../../assets/images/aminities/aminity5.png"),
    aminity: "Pharmacy",
  },
];

const localImageMap = {
  'connection_type1.png': require("../../assets/images/connectionTypes/connection_type1.png"),
  'connection_type2.png': require("../../assets/images/connectionTypes/connection_type2.png"),
  'connection_type3.png': require("../../assets/images/connectionTypes/connection_type3.png"),
  'user1.png': require("../../assets/images/users/user1.png"),
  'user2.png': require("../../assets/images/users/user2.png"),
  'user3.png': require("../../assets/images/users/user3.png"),
};

const ChargingStationDetailScreen = ({ navigation, route }) => {

  const [chargingStation, setChargingStation] = useState(null);
  const [inFavorite, setinFavorite] = useState(false);
  const [showSnackBar, setshowSnackBar] = useState(false);
  const [token, setToken] = useState("");
  const [aminitiesList, setAminitiesList] = useState([]);
  const [connectionsList, setConnectionsList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchChargingStation = async (id) => {
    try {
      const { success, data } = await fetchChargingStationDetails(id);
      console.log("Charging station details fetched.", success, data);
      if (success && data) {
        setChargingStation(data);
        setinFavorite(data.favorite);

        let availableAmenitiesList = [];

        if (data.amenity.washroom) {
          availableAmenitiesList.push(AllAminitiesList.find((item) => item.id === "1"));
        }

        if (data.amenity.children_playarea) {
          availableAmenitiesList.push(AllAminitiesList.find((item) => item.id === "2"));
        }

        if (data.amenity.wifi) {
          availableAmenitiesList.push(AllAminitiesList.find((item) => item.id === "3"));
        }

        if (data.amenity.foodcourt) {
          availableAmenitiesList.push(AllAminitiesList.find((item) => item.id === "4"));
        }

        if (data.amenity.atm) {
          availableAmenitiesList.push(AllAminitiesList.find((item) => item.id === "5"));
        }

        setAminitiesList(availableAmenitiesList)

        console.log("Charging station details fetched successfully.");
      } else {
        console.log("Failed to fetch charging station details.", id);
      }
    } catch (error) {
      console.log("Network error:", error);
      console.log("Failed to fetch charging station details.", id);
    }
  };

  const fetchChargingStationConnectors = async (id) => {
    try {
      const { success, data } = await fetchChargingStationConnectorDetails(id);
      console.log("Charging station details fetched.", id, success, data);
      if (success && data) {
        setConnectionsList(data);

        console.log("Charging station connectors fetched successfully.");
      } else {
        console.log("Failed to fetch charging station connector details.", id);
      }
    } catch (error) {
      console.log("Network error:", error);
      console.log("Failed to fetch charging station connector details.", id);
    }
  };

  const fetchChargingStationReviews = async (id) => {
    try {
      const { success, data } = await fetchChargingStationCustomerReviews(id);
      console.log("Charging station customer reviews fetched.", id, success, data);
      if (success && data) {
        setReviewsList(data);

        console.log("Charging station customer reviews fetched successfully.");
      } else {
        console.log("Failed to fetch charging station customer review details.", id);
      }
    } catch (error) {
      console.log("Network error:", error);
      console.log("Failed to fetch charging station customer review details.", id);
    }
  };

  const checkIsFavorite = async (accessToken, id) => {
    try {
      const { success, data } = await isFavorite(accessToken, id);
      console.log("Checking if charging station is favorite.", success, data);
      if (success && data) {
        setinFavorite(data);
      }
    } catch (error) {
      console.log("Network error:", error);
      console.log("Failed to check if charging station is favorite.", id);
    }
  };

  // Function to handle signup API call
  const handleFavoritePress = async () => {
    try {

      if (!token) {
        console.log("Please login to continue");
        return;
      }

      if (inFavorite) {
        const data = await removeFromFavorites(token, chargingStation.id); // Call the function from api.js
        if (data.success) {
          setinFavorite(!inFavorite);
          setshowSnackBar(true);
        } else {
          console.log('Failed to remove from favorites', data.message);
        }
      } else {
        const data = await addToFavorites(token, chargingStation.id); // Call the function from api.js
        if (data.success) {
          setinFavorite(!inFavorite);
          setshowSnackBar(true);
        } else {
          console.log('Failed to add to favorites', data.message);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.log('Error', error.message || 'An error occurred. Please try again.');
    }
  };
 

  useEffect(() => {
    async function fetchData() {
      const location = await getCurrentPosition();
      setCurrentLocation(location);
      if (route.params?.chargingStationId) {
        await fetchChargingStation(route.params.chargingStationId);
        await fetchChargingStationConnectors(route.params.chargingStationId);
        await fetchChargingStationReviews(route.params.chargingStationId);
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (accessToken) {
          setIsLoggedIn(true);
          setToken(accessToken);
          await checkIsFavorite(accessToken, route.params.chargingStationId);
        } else {
          console.log("Unable to get user's access token.");
          return;
        }
      }
    }

    fetchData(); // Call the async function inside the useEffect

  }, [route.params?.chargingStationId]); // Dependency array

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <CollapsibleToolbar
          renderContent={pageView}
          renderNavBar={header}
          renderToolBar={collapsibleImage}
          collapsedNavBarBackgroundColor={Colors.primaryColor}
          toolBarHeight={320}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 5.0 }}
        />
      </View>
      {bookSlotAddReviewAndGetDirectionButton()}
      {snackBarInfo()}
    </View>
  );

  function bookSlotAddReviewAndGetDirectionButton() {
    return (
      <View style={styles.bottomButtonWrapper}>
        {isLoggedIn && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("BookSlot");
              }}
              style={{
                ...styles.bookSlotAndGetDirectionButtonStyle,
                backgroundColor: Colors.bodyBackColor,
                borderTopColor: Colors.extraLightGrayColor,
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.primaryColor12Medium }}>
                Book Slot
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("AddReview", { chargingStationId: chargingStation.id });
              }}
              style={{
                ...styles.bookSlotAndGetDirectionButtonStyle,
                backgroundColor: Colors.bodyBackColor,
                borderTopColor: Colors.extraLightGrayColor,
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.grayColor12Medium }}>
                Add Review
              </Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            navigation.push("Direction", { fromLocation: { latitude: currentLocation?.coords?.latitude, longitude: currentLocation?.coords?.longitude }, toLocation: { latitude: chargingStation.latitude, longitude: chargingStation.longitude } });
          }}
          style={{
            ...styles.bookSlotAndGetDirectionButtonStyle,
            backgroundColor: Colors.primaryColor,
            borderTopColor: Colors.primaryColor,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor12Medium }}>
            Get Direction
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function snackBarInfo() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.lightBlackColor }}
        visible={showSnackBar}
        onDismiss={() => setshowSnackBar(false)}
        elevation={0}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          {inFavorite ? "Added to favorite" : "Removed from favorite"}
        </Text>
      </Snackbar>
    );
  }

  function collapsibleImage() {
    return (
      <ImageBackground
        source={require("../../assets/images/chargingStations/charging_station6.png")}
        style={{ width: "100%", height: 320 }}
      >
        <LinearGradient
          colors={["rgba(217, 217, 217, 0)", "rgba(0, 0, 0, 0.85)"]}
          style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}
        >
          <View
            style={{
              ...commonStyles.rowSpaceBetween,
              alignItems: "flex-end",
              margin: Sizes.fixPadding * 2.0,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ ...Fonts.whiteColor20SemiBold }}>
                {chargingStation?.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  marginVertical: Sizes.fixPadding - 5.0,
                  ...Fonts.grayColor14Medium,
                }}
              >
                {chargingStation?.address} {chargingStation?.pincode}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                Open: {chargingStation?.operationalHours}
              </Text>
            </View>
            <MaterialIcons
              name={inFavorite ? "favorite" : "favorite-border"}
              color={Colors.whiteColor}
              size={35}
              onPress={handleFavoritePress}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowSpaceBetween,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginVertical: Platform.OS == "ios" ? 0 : Sizes.fixPadding,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.whiteColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <View style={styles.ratingWrapper}>
          <Text
            style={{
              ...Fonts.whiteColor18SemiBold,
              marginRight: Sizes.fixPadding - 8.0,
            }}
          >
            4.5
          </Text>
          <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
        </View>
      </View>
    );
  }

  function pageView() {
    return (
      <View style={{ flex: 1 }}>
        {aminitiesInfo()}
        {connectionsInfo()}
        {reviewsInfo()}
      </View>
    );
  }

  function reviewsInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={isImageUrl(item.reviewerImage) ? { uri: item.reviewerImage } : getImageSource(item.reviewerImage, localImageMap)}
            style={{
              width: 60.0,
              height: 60.0,
              borderRadius: Sizes.fixPadding,
            }}
          />
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
              {item.reviewerName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {rating({ rating: item.rating })}
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedReview(item);
                setModalVisible(true);
              }}
            >
              <Text style={{ ...Fonts.primaryColor14Medium }}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}>
          {item.review}
        </Text>
      </View>
    );
    return (
      <View style={{ marginTop: Sizes.fixPadding - 5.0 }}>
        <View style={styles.reviewHeaderWrapper}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor20SemiBold, flex: 1 }}>
            Reviews
          </Text>
          <Text
            onPress={() => {
              navigation.push("AllReview");
            }}
            style={{ ...Fonts.primaryColor16Medium }}
          >
            See all
          </Text>
        </View>
        <FlatList
          data={reviewsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
        {/* Modal for displaying review details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            {selectedReview && modalVisible && (
              <>
                <Text style={styles.modalText}>{selectedReview.reviewerName}</Text>
                {/* <Text style={{ marginBottom: 15 }}>{selectedReview.review}</Text> */}
                <Text>Charging experience</Text>
                {rating({ rating: selectedReview.rating })}
                <Text>Safety experience</Text>
                {rating({ rating: selectedReview.rating })}
                <Text>Ease experience</Text>
                {rating({ rating: selectedReview.rating })}
                <Text>Location accessibility</Text>
                {rating({ rating: selectedReview.rating })}

                <Text style={{ marginTop: Sizes.fixPadding }}>Review</Text>
                <Text style={{ ...Fonts.grayColor14Medium }}>{selectedReview.review}</Text>
                
                {/* Add more details if necessary */}
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      </View>
    );
  }

  function connectionsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.connectionsWrapper}>
        <View
          style={{
            alignItems: "center",
            marginHorizontal: Sizes.fixPadding,
            marginVertical: Sizes.fixPadding * 1.5,
          }}
        >
          {isImageUrl(item.connectionTypeImage) ? (
            <Image
              source={{ uri: item.connectionTypeImage }} // If it's a URL, use it directly
              style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
            />
          ) : (
            <Image
              source={getImageSource(item.connectionTypeImage, localImageMap)}
              style={{ width: 40.0, height: 40.0, resizeMode: "contain" }}
            />
          )}
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18SemiBold,
              marginTop: Sizes.fixPadding - 5.0,
            }}
          >
            {item.connectionType}
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            {item.capacity} kW
          </Text>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
            (${item.pricePerWatt}/kW)
          </Text>
        </View>
        <View style={styles.connectionAvailableSlotWrapper}>
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor14Medium }}>
            {item.takenSlot}/{item.totalSlot} Taken
          </Text>
        </View>
      </View>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Connections available
        </Text>
        <FlatList
          data={connectionsList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        />
      </View>
    );
  }

  function aminitiesInfo() {
    const renderItem = ({ item }) => (
      <View style={{ alignItems: "center" }}>
        <View style={styles.aminitiesCircleWrapper}>
          <Image
            source={item.aminityImage}
            style={{ width: 35.0, height: 35.0, resizeMode: "contain" }}
          />
        </View>
        <Text style={{ ...Fonts.grayColor14Regular }}>{item.aminity}</Text>
      </View>
    );
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 1.5 }}>
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            marginHorizontal: Sizes.fixPadding * 2.0,
          }}
        >
          Amenities
        </Text>
        <FlatList
          data={aminitiesList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        />
      </View>
    );
  }
};

export default ChargingStationDetailScreen;

const styles = StyleSheet.create({
  ratingWrapper: {
    ...commonStyles.rowAlignCenter,
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 5.0,
  },
  aminitiesCircleWrapper: {
    width: 70.0,
    height: 70.0,
    borderRadius: 35.0,
    backgroundColor: Colors.bodyBackColor,
    alignItems: "center",
    justifyContent: "center",
    ...commonStyles.shadow,
    margin: Sizes.fixPadding,
  },
  connectionsWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding,
    width: screenWidth / 3.75,
    margin: Sizes.fixPadding,
  },
  connectionAvailableSlotWrapper: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding - 8.0,
  },
  reviewHeaderWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 1.5,
  },
  bookSlotAndGetDirectionButtonStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 1.2,
    borderTopWidth: 1.0,
  },
  bottomButtonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingWrapStyle: {
    ...commonStyles.rowAlignCenter,
    justifyContent: "center",
    marginVertical: Sizes.fixPadding + 5.0,
  },
});
