import {
  BackHandler,
  ImageBackground,
  Platform,
  StatusBar,  
  Text,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "react-native-linear-gradient";
import { Fonts } from "../constants/styles";
import { useFocusEffect } from "@react-navigation/native";

const SplashScreen = ({ navigation }) => {
  const backAction = () => {
    if (Platform.OS === "ios") {
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });
    } else {
      BackHandler.exitApp();
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

  setTimeout(() => {
    navigation.push("Onboarding");
  }, 2000);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor='transparent' barStyle={'light-content'} />
      <ImageBackground
        source={require("../assets/images/splash.png")}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["rgba(217, 217, 217, 0.00)", "rgba(6, 124, 96, 0.77)"]}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ ...Fonts.whiteColor38SemiBold }}>Rapid Chargex</Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;