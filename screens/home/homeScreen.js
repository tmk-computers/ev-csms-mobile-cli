import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import MyStatusBar from "../../components/myStatusBar";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const nearByChargingStationsList = [
  {
    id: "1",
    stationImage: require("../../assets/images/chargingStations/charging_station2.png"),
    stationName: "Apex Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../assets/images/chargingStations/charging_station3.png"),
    stationName: "Horizon EV Station",
    stationAddress: "Near apex hospital",
    rating: 4.2,
    totalStations: 18,
    isOpen: true,
  },
  {
    id: "3",
    stationImage: require("../../assets/images/chargingStations/charging_station1.png"),
    stationName: "Rapid EV Charge",
    stationAddress: "Near shelby play ground",
    rating: 4.2,
    totalStations: 12,
    isOpen: false,
  },
  {
    id: "4",
    stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
    stationName: "Tesla Recharge",
    stationAddress: "Near nissan show room",
    rating: 4.9,
    totalStations: 22,
    isOpen: true,
  },
];

const enrouteChargingStationList = [
  {
    id: "1",
    stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
    stationName: "BYD Charging Point",
    stationAddress: "Near shell petrol station",
    rating: 4.7,
    totalStations: 8,
    distance: "4.5 km",
    isOpen: true,
  },
  {
    id: "2",
    stationImage: require("../../assets/images/chargingStations/charging_station4.png"),
    stationName: "TATA EStation",
    stationAddress: "Near orange business hub",
    rating: 3.9,
    totalStations: 15,
    distance: "5.7 km",
    isOpen: false,
  },
  {
    id: "3",
    stationImage: require("../../assets/images/chargingStations/charging_station5.png"),
    stationName: "HP Charging Station",
    stationAddress: "Near ananta business park",
    rating: 4.9,
    totalStations: 6,
    distance: "2.1 km",
    isOpen: true,
  },
  {
    id: "4",
    stationImage: require("../../assets/images/chargingStations/charging_station4.png"),
    stationName: "VIDA Station V1",
    stationAddress: "Near opera street",
    rating: 4.2,
    totalStations: 15,
    distance: "3.5 km",
    isOpen: false,
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
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
        onPress={() => navigation.push("ChargingStationsOnMap")}
        style={styles.mapViewButton}
      >
        <MaterialIcons name="map" color={Colors.whiteColor} size={30} />
      </TouchableOpacity>
    );
  }

  function enrouteChargingStationInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail");
        }}
        style={styles.enrouteChargingStationWrapStyle}
      >
        <Image
          source={item.stationImage}
          style={styles.enrouteChargingStationImage}
        />
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
                  {item.totalStations} Charging Points
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
              {item.distance}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("Direction");
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
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("ChargingStationDetail");
        }}
        style={styles.nearByChargingStationWrapStyle}
      >
        <View>
          <Image
            source={item.stationImage}
            style={styles.nearByChargingStationImageStyle}
          />
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
              {item.totalStations} Charging Points
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.push("Direction");
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
        <Text style={{ ...Fonts.blackColor26SemiBold }}>Welcome John,</Text>
        <Text style={{ ...Fonts.grayColor18Regular }}>
          Find charging station now
        </Text>
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
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
