import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import React, { useState, createRef, useEffect, useRef } from "react";
import MyStatusBar from "../../components/myStatusBar";
import MapView, { Marker } from "react-native-maps";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getImageSource, isImageUrl } from "../../helpers/imageUtils";

const width = screenWidth;
const cardWidth = width / 1.15;
const SPACING_FOR_CARD_INSET = width * 0.1 - 30;

const localImageMap = {
  'charging_station1.png': require('../../assets/images/chargingStations/charging_station1.png'),
  'charging_station2.png': require('../../assets/images/chargingStations/charging_station2.png'),
  'charging_station3.png': require('../../assets/images/chargingStations/charging_station3.png'),
  'charging_station4.png': require('../../assets/images/chargingStations/charging_station4.png'),
  'charging_station5.png': require('../../assets/images/chargingStations/charging_station5.png'),
};

const ChargingStationsOnMapScreen = ({ navigation, route }) => {
  const { currentLocation, chargingSpotsList } = route.params;

  const [markerList] = useState(chargingSpotsList);
  const [region] = useState({
    latitude: currentLocation?.coords?.latitude,
    longitude: currentLocation?.coords?.longitude,
    latitudeDelta: 0.20,
    longitudeDelta: 0.20,
  });

  let mapAnimation = new Animated.Value(0);
  let mapIndex = 0;

  const _map = createRef();

  useEffect(() => {
    mapAnimation.addListener(({ value }) => {
      let index = Math.floor(value / cardWidth + 0.3);
      if (index >= markerList.length) {
        index = markerList.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(regionTimeout);

      const regionTimeout = setTimeout(() => {
        if (mapIndex !== index) {
          mapIndex = index;
          const { latitude, longitude } = markerList[index];
          _map.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            },
            350
          );
        }
      }, 10);
    });
  }, []);

  const interpolation = markerList.map((marker, index) => {
    const inputRange = [
      (index - 1) * cardWidth,
      index * cardWidth,
      (index + 1) * cardWidth,
    ];

    const scale = mapAnimation.interpolate({
      inputRange,
      outputRange: [1, 1.5, 1],
      extrapolate: "clamp",
    });

    return { scale };
  });

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;

    let x = markerID * cardWidth + markerID * 20;
    if (Platform.OS === "ios") {
      x = x - SPACING_FOR_CARD_INSET;
    }

    _scrollView.current.scrollTo({ x: x, y: 0, animated: true });
  };

  const _scrollView = useRef(null);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {markersInfo()}
        {backArrow()}
        {chargingSpotsInfo()}
      </View>
    </View>
  );

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

  function markersInfo() {
    return (
      <MapView
        ref={_map}
        style={{ flex: 1 }}
        initialRegion={region}
      >
        {markerList.map((marker, index) => {
          const scaleStyle = {
            transform: [
              {
                scale: interpolation[index].scale,
              },
            ],
          };
          return (
            <Marker
              key={index}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              onPress={(e) => onMarkerPress(e)}
            >
              <Animated.View style={styles.markerStyle}>
                <Animated.Image
                  source={require("../../assets/images/icons/marker.png")}
                  resizeMode="contain"
                  style={[{ width: 30.0, height: 30.0 }, scaleStyle]}
                ></Animated.Image>
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
    );
  }

  function chargingSpotsInfo() {
    return <View style={styles.chargingInfoWrapStyle}>{chargingSpots()}</View>;
  }

  function chargingSpots() {
    return (
      <Animated.ScrollView
        ref={_scrollView}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 25}
        decelerationRate="fast"
        snapToAlignment="center"
        style={{ paddingVertical: Sizes.fixPadding }}
        contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: mapAnimation,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
      >
        {markerList.map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.push("ChargingStationDetail", { "chargingStationId": item.id })}
            key={index}
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
                <Text
                  numberOfLines={1}
                  style={{ ...Fonts.blackColor18SemiBold }}
                >
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
                  {item.distance}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    navigation.push("Direction", { fromLocation: { latitude: currentLocation?.coords?.latitude, longitude: currentLocation?.coords?.longitude }, toLocation: { latitude: item.latitude, longitude: item.longitude }, station: item });
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
        ))}
      </Animated.ScrollView>
    );
  }
};

export default ChargingStationsOnMapScreen;

const styles = StyleSheet.create({
  enrouteChargingStationWrapStyle: {
    borderRadius: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    flexDirection: "row",
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
    width: cardWidth,
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
  markerStyle: {
    alignItems: "center",
    justifyContent: "center",
    width: 45.0,
    height: 45.0,
  },
  getDirectionButton: {
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 2.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
  },
  chargingInfoWrapStyle: {
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
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
});
