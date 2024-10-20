import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  screenWidth,
  Fonts,
  Sizes,
  commonStyles,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ENV } from '@env';
import { setupMockApis } from '../../api/mockApi';
import { signupUser } from '../../api/realApi';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock the API if the environment is development
if (ENV === 'development') {
  setupMockApis();
}

const RegisterScreen = ({ navigation, route }) => {
  // Retrieve the mobileNumber passed from the SigninScreen
  const { mobileNumber } = route.params;

  const [fullName, setfullName] = useState("");
  const [email, setemail] = useState("");

  // Function to handle signup API call
  const handleSignup = async () => {
    try {
      const data = await signupUser(mobileNumber, fullName, email); // Call the function from api.js
      if (data.success) {
        const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'))
        await AsyncStorage.setItem('userInfo', JSON.stringify({
          ...userInfo,
          name: fullName,
          email: email,
        }))
        navigation.push("Verification", { mobileNumber });
      } else {
        Alert.alert('Signup Failed', data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
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
          {fullNameInfo()}
          {emailInfo()}
          {continueButton()}
          {agreeInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function agreeInfo() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text style={{ textAlign: "center", ...Fonts.grayColor16Medium }}>
          By continue you’re agreed to our
        </Text>
        <Text
          style={{
            textAlign: "center",
            ...Fonts.grayColor18SemiBold,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Terms & condition
        </Text>
      </View>
    );
  }

  function emailInfo() {
    return (
      <View
        style={{
          ...styles.textFieldWrapper,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <TextInput
          placeholder="Email address"
          placeholderTextColor={Colors.grayColor}
          value={email}
          onChangeText={(text) => setemail(text)}
          style={{ ...Fonts.blackColor16Medium, padding: 1, }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    );
  }

  function fullNameInfo() {
    return (
      <View
        style={{
          ...styles.textFieldWrapper,
          marginTop: Sizes.fixPadding * 5.0,
        }}
      >
        <TextInput
          placeholder="Full name"
          placeholderTextColor={Colors.grayColor}
          value={fullName}
          onChangeText={(text) => setfullName(text)}
          style={{ ...Fonts.blackColor16Medium, padding: 1, }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
        />
      </View>
    );
  }

  function continueButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSignup}
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
            <Text style={{ ...Fonts.whiteColor22SemiBold }}>Register</Text>
            <Text
              style={{
                ...Fonts.whiteColor16Regular,
                marginTop: Sizes.fixPadding,
              }}
            >
              Create your account
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  }
};

export default RegisterScreen;

const styles = StyleSheet.create({
  topImageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: Sizes.fixPadding * 2.0,
  },
  textFieldWrapper: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding * 1.5,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 1.0,
  },
});
