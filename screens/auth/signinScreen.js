import {
  BackHandler,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useCallback } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { useFocusEffect } from "@react-navigation/native";
import IntlPhoneInput from "react-native-intl-phone-input";
import { parsePhoneNumberFromString } from 'libphonenumber-js/min';
import { checkUserExists } from '../../api/realApi';
import SigninWithGoogle from "./OAuth/signinwithgoogle/signinwithgoogle";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SigninScreen = ({ navigation }) => {
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

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      navigation.addListener("gestureEnd", backAction);
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileLoginSelected, setMobileLoginSelected] = useState(false)

  const handlerOnSocialMediaLoginSuccess = async (userInfo) => {
    console.log(userInfo)
    await AsyncStorage.setItem('fullName', userInfo.name)
    navigation.push("BottomTabBar")
  }

  const handleCheckUserExists = async () => {
    try {
      if (!mobileNumber || parsePhoneNumberFromString(mobileNumber)?.isValid() === false) {
        // Show an error message if mobile number is empty
        alert('Please enter a valid mobile number');
        return;
      }
      const { success, data } = await checkUserExists(mobileNumber);

      if (success && data.exists) {
        // User exists, navigate to OTP Verification screen
        navigation.push("Verification", { mobileNumber });
      } else {
        // User does not exist, navigate to Register screen
        navigation.push("Register", { mobileNumber });
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      // Handle error if needed
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {topImage()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {signInMethods()}
        </ScrollView>
      </View>
      {exitInfo()}
    </View>
  );

  function signInMethods() {

    return (
      <>
      {
        mobileLoginSelected ?
        renderMobileLoginScreen() : 
        <View>
          {SigninWithMobileButton()}
          {<SigninWithGoogle onSuccess={handlerOnSocialMediaLoginSuccess} />}
          {SkipButton()}
        </View>
      }
      </>
    )

  }

  function renderMobileLoginScreen() {
    return (
      <>
      {mobileNumberInfo()}
      {continueButton()}
      {backButton()}
      </>
    )
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCheckUserExists}
        style={{ ...commonStyles.button,borderRadius:Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
      </TouchableOpacity>
    );
  }

  function backButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setMobileLoginSelected(false)}
        style={{ ...commonStyles.button,borderRadius:Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Back</Text>
      </TouchableOpacity>
    );
  }

  function SigninWithMobileButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setMobileLoginSelected(true)
        }}
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Sign in with mobile number</Text>
      </TouchableOpacity>
    );
  }

  function SkipButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("BottomTabBar");
        }}
        style={{ ...commonStyles.button,borderRadius: Sizes.fixPadding-5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Skip</Text>
      </TouchableOpacity>
    );
  }

  function mobileNumberInfo() {
    const handleMobileNumberChange = ({ dialCode, unmaskedPhoneNumber }) => {
      // Clean mobile number by removing non-numeric characters
      const cleanedMobileNumber = unmaskedPhoneNumber.replace(/\D/g, '');
      setMobileNumber(`${dialCode}${cleanedMobileNumber}`);
    };
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 5.0,
        }}
      >
        <IntlPhoneInput
          onChangeText={handleMobileNumberChange}
          defaultCountry="IN"
          containerStyle={styles.mobileNumberWrapStyle}
          placeholder={"Enter your mobile number"}
          placeholderTextColor={Colors.grayColor}
          phoneInputStyle={{ flex: 1, ...Fonts.blackColor16Medium }}
          dialCodeTextStyle={{
            ...Fonts.blackColor16Medium,
            marginHorizontal: Sizes.fixPadding - 2.0,
          }}
          modalCountryItemCountryNameStyle={{ ...Fonts.blackColor16SemiBold }}
        />
      </View>
    );
  }

  function topImage() {
    return (
      <ImageBackground
        source={require("../../assets/images/authbg.png")}
        style={{ width: screenWidth, height: screenWidth - 150 }}
        resizeMode="stretch"
      >
        <View style={styles.topImageOverlay}>
          <Text style={{ ...Fonts.whiteColor22SemiBold }}>Sign in</Text>
          <Text
            style={{
              ...Fonts.whiteColor16Regular,
              marginTop: Sizes.fixPadding,
            }}
          >
            Sign in to your account
          </Text>
        </View>
      </ImageBackground>
    );
  }

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

export default SigninScreen;

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
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    padding: Sizes.fixPadding * 2.0,
  },
  mobileNumberWrapStyle: {
    paddingVertical: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    backgroundColor: Colors.bodyBackColor,
    marginTop: Sizes.fixPadding,
    ...commonStyles.shadow,
    borderColor:Colors.extraLightGrayColor,
    borderWidth:1.0,
    borderRadius:Sizes.fixPadding-5.0,
  },
});
