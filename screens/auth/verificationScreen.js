import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { OtpInput } from 'react-native-otp-entry';
import { ENV } from '@env';  // Import the environment variable
import { setupMockApis } from '../../api/mockApi';
import { verifyOtp } from '../../api/realApi';


if (ENV === 'development') {
  setupMockApis();
}

const VerificationScreen = ({ navigation, route }) => {

  const { mobileNumber } = route.params;

  if (!mobileNumber) {
    Alert.alert('Error', 'Mobile number is missing.');
    return;
  }

  const [otpInput, setotpInput] = useState("");
  const [isLoading, setisLoading] = useState(false);

  // Function to handle OTP verification
  const handleVerifyOtp = async (otp) => {
    setisLoading(true);
    const { success, data } = await verifyOtp(mobileNumber, otp);  // Use the new API function
    if (success && data.success) {
      const { token, refreshToken, expiresIn } = data.loginResponse;
      const { fullName, mobileNumber, email } = data.userProfileResponse;

      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('expiresIn', expiresIn.toString());

      await AsyncStorage.setItem('fullName', fullName);
      await AsyncStorage.setItem('mobileNumber', mobileNumber);
      await AsyncStorage.setItem('email', email);

      setisLoading(false);
      navigation.push("BottomTabBar");
    } else {
      setisLoading(false);
      setotpInput("");
      Alert.alert('Verification Failed', data.message || 'Invalid OTP. Please try again.');
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
          contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
        >
          {otpFields()}
          {continueButton()}
          {resendText()}
        </ScrollView>
      </View>
      {loadingDialog()}
    </View>
  );

  function resendText() {
    const resendFunction = () => {
      // TODO: Implement resend functionality
    };

    return (
      <Text
        style={{
          ...Fonts.grayColor18SemiBold,
          textAlign: "center",
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
        onPress={resendFunction}
      >
        Resend OTP
      </Text>
    );
  }

  function loadingDialog() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
              style={{ ...styles.dialogStyle }}
            >
              <ActivityIndicator
                size={50}
                color={Colors.primaryColor}
                style={{
                  alignSelf: "center",
                  transform: [{ scale: Platform.OS == "ios" ? 2 : 1 }],
                }}
              />
              <Text
                style={{
                  marginTop: Sizes.fixPadding,
                  textAlign: "center",
                  ...Fonts.blackColor16Regular,
                }}
              >
                Please wait...
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function otpFields() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 5.0, }}>
        <OtpInput
          numberOfDigits={4}
          focusColor={Colors.primaryColor}
          value={otpInput}
          onTextChange={(text) => {
            setotpInput(text);  // Set OTP input to state

            if (text.length === 4) {
              handleVerifyOtp(text);  // Call verifyOtp when OTP length is 4
            }
          }}
          theme={{
            inputsContainerStyle: { justifyContent: 'center' },
            pinCodeContainerStyle: { ...styles.textFieldStyle },
            pinCodeTextStyle: { ...Fonts.blackColor18SemiBold },
            focusedPinCodeContainerStyle: { borderBottomColor: Colors.primaryColor }
          }}
        />
      </View>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (otpInput.length === 4) {
            setisLoading(true);
            handleVerifyOtp(otpInput);  // Call verifyOtp if OTP is 4 digits
          } else {
            Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP.');
          }
        }}
        style={{ ...commonStyles.button, borderRadius: Sizes.fixPadding - 5.0, margin: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Continue</Text>
      </TouchableOpacity>
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
          <MaterialIcons
            name="arrow-back"
            color={Colors.whiteColor}
            size={26}
            onPress={() => {
              navigation.pop();
            }}
            style={{ alignSelf: 'flex-start' }}
          />
          <View>
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>
              OTP Verification
            </Text>
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.whiteColor16Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              See your mobile to see the verification code
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
};

export default VerificationScreen;

const styles = StyleSheet.create({
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    borderRadius: Sizes.fixPadding - 5.0,
    backgroundColor: Colors.bodyBackColor,
    borderWidth: 0,
    ...commonStyles.shadow,
    marginHorizontal: Sizes.fixPadding,
    width: screenWidth / 8.5,
    height: screenWidth / 8.5
  },
  dialogStyle: {
    width: "80%",
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    padding: Sizes.fixPadding * 2.0,
    alignSelf: 'center'
  },
});
