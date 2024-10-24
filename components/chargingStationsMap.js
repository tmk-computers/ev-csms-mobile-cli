import React, { useState, createRef, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    TouchableOpacity,
    Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getImageSource, isImageUrl } from "../helpers/imageUtils";
import {
    Colors,
    screenWidth,
    commonStyles,
    Sizes,
    Fonts,
} from "../constants/styles";


const cardWidth = screenWidth / 1.15;
const SPACING_FOR_CARD_INSET = screenWidth * 0.1 - 30;

const localImageMap = {
    "charging_station1.png": require("../assets/images/chargingStations/charging_station1.png"),
    "charging_station2.png": require("../assets/images/chargingStations/charging_station2.png"),
    "charging_station3.png": require("../assets/images/chargingStations/charging_station3.png"),
    "charging_station4.png": require("../assets/images/chargingStations/charging_station4.png"),
    "charging_station5.png": require("../assets/images/chargingStations/charging_station5.png"),
};

const ChargingStationsMap = ({
    currentLocation,
    chargingSpotsList,
    onBackPress,
    onStationSelect,
    onGetDirection,
    width = '100%',  // Default width to 100%
    height = '100%',  // Default height to 100%
    isBackArrowVisible = true,
    showCard= true
}) => {
    const [markerList] = useState(chargingSpotsList);
    
    const latitudes = chargingSpotsList.map(marker => marker.latitude);
    const longitudes = chargingSpotsList.map(marker => marker.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Calculate the center of the region
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;

    // Calculate latitude and longitude deltas (padding of 0.1 for a little margin)
    const latDelta = (maxLat - minLat) + 0.1;
    const lngDelta = (maxLng - minLng) + 0.1;

    const [region] = useState({
        latitude: currentLocation?.coords?.latitude || midLat,
        longitude: currentLocation?.coords?.longitude || midLng,
        latitudeDelta: latDelta,
        longitudeDelta: lngDelta,
    });
  
    let mapAnimation = new Animated.Value(0);
    let mapIndex = 0;

    const _map = createRef();
    const _scrollView = useRef(null);

      
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

    return (
        <View style={{ width, height, backgroundColor: Colors.bodyBackColor }}>
            <View style={{ flex: 1 }}>
                {renderMarkersInfo()}
                {isBackArrowVisible && renderBackArrow()}
                {renderChargingSpotsInfo()}
            </View>
        </View>
    );



    function renderBackArrow() {
        return (
            <View style={{ ...styles.searchFieldWithBackArrowWrapStyle }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onBackPress}
                style={styles.backArrowWrapper}>
                <MaterialIcons
                  name={'arrow-back'}
                  size={24}
                  color={Colors.blackColor}
                />
              </TouchableOpacity>
            </View>
          );
    }

    function renderMarkersInfo() {
        return (
            <MapView ref={_map} style={{ flex: 1 }} initialRegion={region}>
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
                            onPress={onMarkerPress}
                        >
                            <Animated.View style={styles.markerStyle}>
                                <Animated.Image
                                    source={require("../assets/images/icons/marker.png")}
                                    resizeMode="contain"
                                    style={[{ width: 30.0, height: 30.0 }, scaleStyle]}
                                />
                            </Animated.View>
                        </Marker>
                    );
                })}
            </MapView>
        );
    }

    function renderChargingSpotsInfo() {
        return (
            <View style={styles.chargingInfoWrapStyle}>
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
                        [{ nativeEvent: { contentOffset: { x: mapAnimation } } }],
                        { useNativeDriver: true }
                    )}
                >
                    {showCard && markerList.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            onPress={() => onStationSelect(item.id)}
                            style={styles.enrouteChargingStationWrapStyle}
                        >
                            {isImageUrl(item.stationImage) ? (
                                <Image
                                    source={{ uri: item.stationImage }}
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
                                    <Text numberOfLines={1} style={{ ...Fonts.blackColor18SemiBold }}>
                                        {item.stationName}
                                    </Text>
                                    <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                                        {item.stationAddress}
                                    </Text>
                                    <View style={{ marginTop: Sizes.fixPadding, ...commonStyles.rowAlignCenter }}>
                                        <View style={{ ...commonStyles.rowAlignCenter }}>
                                            <Text style={{ ...Fonts.blackColor18Medium }}>{item.rating}</Text>
                                            <MaterialIcons name="star" color={Colors.yellowColor} size={20} />
                                        </View>
                                        <View style={{ marginLeft: Sizes.fixPadding * 2.0, ...commonStyles.rowAlignCenter, flex: 1 }}>
                                            <View style={styles.primaryColorDot} />
                                            <Text numberOfLines={1} style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium, flex: 1 }}>
                                                {item.totalPoints} Charging Points
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ ...commonStyles.rowAlignCenter, paddingLeft: Sizes.fixPadding, marginTop: Sizes.fixPadding }}>
                                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium, flex: 1, marginRight: Sizes.fixPadding - 5.0 }}>
                                        {item.distance}
                                    </Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => onGetDirection(item)}
                                        style={styles.getDirectionButton}
                                    >
                                        <Text style={{ ...Fonts.whiteColor16Medium }}>Get Direction</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>
            </View>
        );
    }
};

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
    searchFieldWithBackArrowWrapStyle: {
        position: "absolute",
        top: 0.0,
        left: 0.0,
        right: 0.0,
        margin: Sizes.fixPadding * 2.0,
        ...commonStyles.rowAlignCenter,
        zIndex: 100,
      },
      backArrowWrapper: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.whiteColor,
        alignItems: "center",
        justifyContent: "center",
        ...commonStyles.shadow,
      },
      searchFieldWrapStyle: {
        flexDirection: "row",
        flex: 1,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding - 6.0,
        marginLeft: Sizes.fixPadding,
        ...commonStyles.shadow,
      },
});

export default ChargingStationsMap;
