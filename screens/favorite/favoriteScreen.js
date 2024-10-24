import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Colors,
  Fonts,
  Sizes,
  screenWidth,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import { fetchFavoriteChargingStations } from '../../api/realApi';
import { getImageSource } from "../../helpers/imageUtils";
import { getCurrentPosition } from '../../helpers/geoUtils';

const localImageMap = {
  'charging_station1.png': require('../../assets/images/chargingStations/charging_station1.png'),
  'charging_station2.png': require('../../assets/images/chargingStations/charging_station2.png'),
  'charging_station3.png': require('../../assets/images/chargingStations/charging_station3.png'),
  'charging_station4.png': require('../../assets/images/chargingStations/charging_station4.png'),
  'charging_station5.png': require('../../assets/images/chargingStations/charging_station5.png'),
};

const FavoriteScreen = ({ navigation }) => {
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [listData, setListData] = useState([]);
  const [token, settoken] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [favouriteErrorMessage, setFavouriteErrorMessage] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      loadFavouriteChargingStations();
    }, [])
  );

  const loadFavouriteChargingStations = async () => {

    const location = await getCurrentPosition();
    setCurrentLocation(location);

    try {
      const storedToken = await AsyncStorage.getItem("accessToken");
      if (storedToken)
        settoken(storedToken);
      else {
        setFavouriteErrorMessage("Unable to get user's access token.");
        console.log("Unable to get user's access token.");
        return;
      }
      const { success, data } = await fetchFavoriteChargingStations(storedToken);
      if (success && Array.isArray(data) && data.length > 0) {
        setListData(data);
      } else {
        setListData([]);
        console.log("No charging stations added to your favorite list.");
      }
    } catch (error) {
      console.log("Network error:", error);
      console.log("Failed to fetch favorite charging stations.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        {token  ? (listData.length === 0 ? noItemsInfo() : favoriteItems()) : loggedoutInfo()}
      </View>
      {snackBar()}
    </View>
  );

  function loggedoutInfo(){
    return(
      <View style={styles.noDataWrapper}>
      <Image
        source={require("../../assets/images/icons/user.png")}
        style={{ width: 100.0, height: 100.0, resizeMode: "contain" }}
      />
      <Text
        style={{
          ...Fonts.grayColor18Medium,
          marginTop: Sizes.fixPadding - 5.0,
        }}
      >
        Please Login to Add your favorites
      </Text>
    </View>
    )
  }
  

  function noItemsInfo() {
    return (
      <View style={styles.noItemsInfoWrapStyle}>
        <Image
          source={require("../../assets/images/icons/heart_broken.png")}
          style={{ width: 100.0, height: 100.0, resizeMode: "contain" }}
        />
        <Text
          style={{
            ...Fonts.grayColor18Medium,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Your favorite list is empty..!
        </Text>
      </View>
    );
  }

  function favoriteItems() {
    const closeRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    };

    const renderHiddenItem = (data, rowMap) => (
      <View style={{ alignItems: "center", flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ ...styles.backDeleteContinerStyle }}
          onPress={() => deleteRow(rowMap, data.item.key)}
        >
          <View style={styles.deleteIconWrapper}>
            <MaterialIcons name="delete" size={22} color={Colors.whiteColor} />
          </View>
        </TouchableOpacity>
      </View>
    );

    const deleteRow = (rowMap, rowKey) => {
      closeRow(rowMap, rowKey);
      const newData = [...listData];
      const prevIndex = listData.findIndex((item) => item.key === rowKey);
      newData.splice(prevIndex, 1);
      setShowSnackBar(true);
      setListData(newData);
    };

    const renderItem = (data) => (
      <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("ChargingStationDetail", { "chargingStationId": data.item.id });
          }}
          style={styles.enrouteChargingStationWrapStyle}
        >
          <Image
            source={getImageSource(data.item.stationImage, localImageMap)}
            style={styles.enrouteChargingStationImage}
          />
          <View style={styles.enrouteStationOpenCloseWrapper}>
            <Text style={{ ...Fonts.whiteColor18Regular }}>
              {data.item.isOpen ? "Open" : "Closed"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ margin: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                {data.item.stationName}
              </Text>
              <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {data.item.stationAddress}
              </Text>
              <View
                style={{
                  marginTop: Sizes.fixPadding,
                  ...commonStyles.rowAlignCenter,
                }}
              >
                <View style={{ ...commonStyles.rowAlignCenter }}>
                  <Text style={{ ...Fonts.blackColor18Medium }}>
                    {data.item.rating}
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
                    {data.item.totalPoints} Charging Points
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
                {data.item.distance}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.push("Direction", { fromLocation: { latitude: currentLocation?.coords?.latitude, longitude: currentLocation?.coords?.longitude }, toLocation: { latitude: data.item.latitude, longitude: data.item.longitude }, station: data.item });
                }}
                style={styles.getDirectionButton}
              >
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                  Get Direction
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={{ flex: 1 }}>
        <SwipeListView
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-66}
          useNativeDriver={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        />
      </View>
    );
  }

  function snackBar() {
    return (
      <Snackbar
        style={styles.snackBarStyle}
        elevation={0}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
        duration={800}
      >
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Charging station remove from favorite
        </Text>
      </Snackbar>
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        Favorite
      </Text>
    );
  }
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  noItemsInfoWrapStyle: {
    margin: Sizes.fixPadding * 2.0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: Colors.redColor,
    alignItems: "center",
    justifyContent: "center",
  },
  backDeleteContinerStyle: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    right: 0,
    width: 66,
    paddingRight: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    marginBottom: Sizes.fixPadding + 5.0,
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
  snackBarStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  noDataWrapper: {
    flex: 1,
    margin: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
});
