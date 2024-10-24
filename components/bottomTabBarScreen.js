import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors, Fonts, Sizes, commonStyles } from "../constants/styles";
import { View, StyleSheet, Text, BackHandler, Platform } from "react-native";
import HomeScreen from "../screens/home/homeScreen";
import ProfileScreen from "../screens/profile/profileScreen";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import EnrouteScreen from "../screens/enroute/enrouteScreen";
import FavoriteScreen from "../screens/favorite/favoriteScreen";
import BookingScreen from "../screens/booking/bookingScreen";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStatusBar from "./myStatusBar";

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      backClickCount == 1 ? BackHandler.exitApp() : _spring();
      return true;
    }
  };

  const loadProfileData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      setIsLoggedIn(!!accessToken);
    } catch (error) {
      console.log("Error loading profile data: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
      loadProfileData();
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
        navigation.removeListener("gestureEnd", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryColor,
          tabBarInactiveTintColor: Colors.lightGrayColor,
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: { height: 70.0 }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="home"
                    size={26}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="home"
                  size={26}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
        <Tab.Screen
          name="Enroute"
          component={EnrouteScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <FontAwesome5
                    name="route"
                    size={22}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <FontAwesome5
                  name="route"
                  size={22}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
         <Tab.Screen
              name="Booking"
              component={BookingScreen}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <View style={styles.selectedTabCircleStyle}>
                      <MaterialIcons
                        name="receipt-long"
                        size={24}
                        color={Colors.whiteColor}
                      />
                    </View>
                  ) : (
                    <MaterialIcons
                      name="receipt-long"
                      size={24}
                      color={Colors.primaryColor}
                    />
                  ),
              }}
            />
            <Tab.Screen
              name="Favorite"
              component={FavoriteScreen}
              options={{
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <View style={styles.selectedTabCircleStyle}>
                      <MaterialIcons
                        name="favorite"
                        size={24}
                        color={Colors.whiteColor}
                      />
                    </View>
                  ) : (
                    <MaterialIcons
                      name="favorite"
                      size={24}
                      color={Colors.primaryColor}
                    />
                  ),
              }}
            />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={styles.selectedTabCircleStyle}>
                  <MaterialIcons
                    name="person"
                    size={25}
                    color={Colors.whiteColor}
                  />
                </View>
              ) : (
                <MaterialIcons
                  name="person"
                  size={25}
                  color={Colors.primaryColor}
                />
              ),
          }}
        />
      </Tab.Navigator>
      {exitInfo()}
    </View>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor14Medium }}>
          Press Back Once Again To Exit!
        </Text>
      </View>
    ) : null;
  }
};

export default BottomTabBarScreen;

const styles = StyleSheet.create({
  exitInfoWrapStyle: {
    backgroundColor: Colors.lightBlackColor,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedTabCircleStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderTopColor: Colors.extraLightGrayColor,
    borderTopWidth: 1.0,
    height: 70.0,
  },
});
