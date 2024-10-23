import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from '../../constants/styles';
import MyStatusBar from '../../components/myStatusBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import authUtil from "../auth/OAuth/utils/authUtil";

const ProfileScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutSheet, setshowLogoutSheet] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSocialLogin, setIsSocialLogin] = useState(false);

  const loadProfileData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (accessToken) {
        const storedFullName = await AsyncStorage.getItem('fullName');
        const storedMobileNumber = await AsyncStorage.getItem('mobileNumber');
        const storedEmail = await AsyncStorage.getItem('email');
        const storedIsSocialLogin = await AsyncStorage.getItem('socialLogin');

        if (storedFullName) setFullName(storedFullName);
        if (storedMobileNumber) setMobileNumber(storedMobileNumber || storedEmail);
        if (storedIsSocialLogin === 'true') setIsSocialLogin(true);
      }
      setIsLoggedIn(!!accessToken);
    } catch (error) {
      console.log("Error loading profile data: ", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {isLoggedIn ? profileInfoWithOptions() : guestOptions()}
        </ScrollView>
      </View>
      {logoutSheet()}
    </View>
  );

  function logoutSheet() {
    const onLogoutPress = async () => {
      const isSocialLogin = await AsyncStorage.getItem('socialLogin');
      isSocialLogin === 'true' && await authUtil.signoutFromGoogle()
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('fullName');
      await AsyncStorage.removeItem('mobileNumber');
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('expiresIn');
      await AsyncStorage.removeItem('socialLogin');
      setshowLogoutSheet(false);
      navigation.push("Signin");
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutSheet}
        onRequestClose={() => { setshowLogoutSheet(false) }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setshowLogoutSheet(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
            >
              <View
                style={{
                  backgroundColor: Colors.bodyBackColor,
                  borderTopLeftRadius: Sizes.fixPadding,
                  borderTopRightRadius: Sizes.fixPadding,
                }}
              >
                <Text style={styles.logoutTextStyle}>Logout</Text>
                <Text
                  style={{
                    ...Fonts.blackColor18Medium,
                    marginVertical: Sizes.fixPadding,
                    marginHorizontal: Sizes.fixPadding * 2.0,
                  }}
                >
                  Are you sure want to logout?
                </Text>
                <View
                  style={{
                    ...commonStyles.rowAlignCenter,
                    marginTop: Sizes.fixPadding,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setshowLogoutSheet(false);
                    }}
                    style={{
                      ...styles.cancelButtonStyle,
                      ...styles.sheetButtonStyle,
                    }}
                  >
                    <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onLogoutPress}
                    style={{
                      ...styles.logoutButtonStyle,
                      ...styles.sheetButtonStyle,
                    }}
                  >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function profileInfoWithOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/images/users/user4.png")}
            style={styles.userImageStyle}
          />
        </View>
        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}>
          <Text style={{ ...Fonts.blackColor18SemiBold }}>{fullName || "Full Name"}</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>{mobileNumber || "Mobile Number"}</Text>
        </View>
        <View>
          {profileOption({
            option: "Edit Profile",
            icon: require("../../assets/images/icons/user.png"),
            disabled : isSocialLogin ,
            tooltipMessage : isSocialLogin ? `Profile signed in with social login cannot be edited ` : '',
            onPress: () => {
              navigation.push("EditProfile");
            },
          })}
          {profileOption({
            option: "My Bookings",
            icon: require("../../assets/images/icons/calendar.png"),
            onPress: () => {
              navigation.navigate("Booking");
            },
          })}
          {profileOption({
            option: "Notifications",
            icon: require("../../assets/images/icons/notification.png"),
            onPress: () => {
              navigation.push("Notification");
            },
          })}
          {profileOption({
            option: "Terms & Condition",
            icon: require("../../assets/images/icons/list.png"),
            onPress: () => {
              navigation.push("TermsAndConditions");
            },
          })}
          {profileOption({
            option: "FAQ",
            icon: require("../../assets/images/icons/faq.png"),
            onPress: () => {
              navigation.push("Faq");
            },
          })}
          {profileOption({
            option: "Privacy Policy",
            icon: require("../../assets/images/icons/privacy_policy.png"),
            onPress: () => {
              navigation.push("PrivacyPolicy");
            },
          })}
          {profileOption({
            option: "Help",
            icon: require("../../assets/images/icons/help.png"),
            onPress: () => {
              navigation.push("Help");
            },
          })}
          {logoutInfo()}
        </View>
      </View>
    );
  }

  function guestOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <View>
          {profileOption({
            option: "Login",
            icon: require("../../assets/images/icons/user.png"),
            onPress: () => {
              navigation.navigate("Signin");
            },
          })}
        </View>
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutSheet(true);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}>
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <Image
              source={require("../../assets/images/icons/logout.png")}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.redColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}>
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.redColor}
        />
      </TouchableOpacity>
    );
  }

  function profileOption({ option, icon, onPress, disabled, tooltipMessage }) {
    const handlePress = () => {
      if (disabled) {
          Alert.alert('Info', tooltipMessage); 
      } else {
          onPress();
      }
  };
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={!disabled ? onPress : handlePress}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: option === 'Login' ? Sizes.fixPadding * 1.0 : Sizes.fixPadding * 2.0 ,
          marginTop: option === 'Login' ? Sizes.fixPadding * 1.0 : null,
          opacity: disabled ? 0.5 : 1,
          
        }}
        // disabled={disabled}
        >
        <View style={{ justifyContent:'center', ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <Image
              source={icon}
              style={{ width: 24.0, height: 24.0, resizeMode: "contain" }}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}>
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
    );
  }

  function header() {
    return (
      <Text
        style={{
          ...Fonts.blackColor20SemiBold,
          margin: Sizes.fixPadding * 2.0,
        }}>
        {isLoggedIn ? "Profile" : "Welcome, Guest"}
      </Text>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  profileInfoWithOptionsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  optionIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(6, 124, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == 'ios' ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  logoutButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
  logoutTextStyle: {
    marginTop: Sizes.fixPadding * 1.5,
    ...Fonts.blackColor20SemiBold,
    textAlign: "center",
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
});
