import { ScrollView, Text, View } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, commonStyles } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const dummyText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown.";

const privacyPoliciesList = [
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
  dummyText,
];

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {privacyPolicyInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function privacyPolicyInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        {privacyPoliciesList.map((item, index) => (
          <Text
            key={`${index}`}
            style={{
              ...Fonts.blackColor16Regular,
              marginBottom: Sizes.fixPadding,
            }}
          >
            {item}
          </Text>
        ))}
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          ...commonStyles.rowAlignCenter,
          margin: Sizes.fixPadding * 2.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={26}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            ...Fonts.blackColor20SemiBold,
            flex: 1,
            marginLeft: Sizes.fixPadding * 2.0,
          }}
        >
          Privacy Policy
        </Text>
      </View>
    );
  }
};

export default PrivacyPolicyScreen;