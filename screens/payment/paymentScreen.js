import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  commonStyles,
  Fonts,
  Sizes,
  screenWidth,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";
import CreditCard from 'react-native-credit-card-ui';
import CheckerCC from 'card-validator';

const PaymentScreen = ({ navigation }) => {

  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [focusCvv, setFocusCvv] = useState(false);
  const [backspaceRemove, setBackspaceRemove] = useState(false);
  const [isValidHolder, setIsValidHolder] = useState('');
  const [cardType, setCardType] = useState('');
  const [expiryInfo, setExpiryInfo] = useState({});
  const [saveCard, setsaveCard] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
        >
          {paymentDescriptionText()}
          {cardView()}
          {cardNumberInfo()}
          {cardHolderInfo()}
          {expiryAndCvvInfo()}
          {saveCardInfo()}
        </ScrollView>
        {payButton()}
      </View>
    </View>
  );

  function expiryAndCvvInfo() {
    const handleExpiryDate = (text) => {
      let textTemp = text;
      if (textTemp.length === 2) {
        if (
          parseInt(textTemp.substring(0, 2)) > 12 ||
          parseInt(textTemp.substring(0, 2)) === 0
        ) {
          textTemp = textTemp[0];
        } else if (text.length === 2 && !backspaceRemove) {
          textTemp += '/';
          setBackspaceRemove(true);
        } else if (text.length === 2 && backspaceRemove) {
          textTemp = textTemp[0];
          setBackspaceRemove(false);
        }
      }
      setExpiry(textTemp);
    };
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
            Expiry
          </Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={Colors.grayColor}
              value={expiry}
              onChangeText={(value) => {
                handleExpiryDate(value);
                const expiryValidation = CheckerCC.expirationDate(value);
                setExpiryInfo(expiryValidation);
              }}
              style={{ ...Fonts.blackColor16Medium, color: !expiryInfo.isValid ? 'red' : Colors.blackColor }}
              maxLength={5}
              keyboardType="numeric"
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
            />
          </View>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
            CVV/CVC
          </Text>
          <View style={styles.textFieldWrapper}>
            <TextInput
              placeholder="CVV/CVC"
              placeholderTextColor={Colors.grayColor}
              value={cvv}
              onChangeText={(value) => setCvv(value)}
              style={{ ...Fonts.blackColor16Medium }}
              maxLength={4}
              keyboardType="numeric"
              onFocus={() => { setFocusCvv(true) }}
              onBlur={() => { setFocusCvv(false) }}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
            />
          </View>
        </View>
      </View>
    )
  }

  function cardHolderInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
          Card Holder Name
        </Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Card Holder Name"
            placeholderTextColor={Colors.grayColor}
            value={holder}
            onChangeText={(value) => {
              setHolder(value)
              const holderValidation = CheckerCC.cardholderName(value);
              setIsValidHolder(holderValidation.isValid);
            }}
            style={{ ...Fonts.blackColor16Medium, color: isValidHolder ? Colors.blackColor : 'red' }}
            maxLength={26}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    )
  }

  function cardNumberInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ ...Fonts.blackColor18SemiBold, marginBottom: Sizes.fixPadding - 5.0 }}>
          Card Number
        </Text>
        <View style={styles.textFieldWrapper}>
          <TextInput
            placeholder="Card Number"
            placeholderTextColor={Colors.grayColor}
            value={number}
            onChangeText={(value) => {
              const numberValidation = CheckerCC.number(value);
              setCardType(numberValidation.card?.type);
              setNumber(value);
            }}
            style={{ ...Fonts.blackColor16Medium, color: cardType ? Colors.blackColor : 'red' }}
            keyboardType="numeric"
            maxLength={16}
            cursorColor={Colors.primaryColor}
            selectionColor={Colors.primaryColor}
          />
        </View>
      </View>
    )
  }

  function cardView() {
    return (
      <CreditCard
        shiny
        bar={true}
        focused={focusCvv ? 'cvc' : null}
        number={number}
        name={holder}
        expiry={expiry}
        cvc={cvv}
        bgColor={Colors.primaryColor}
        imageFront={require('../../assets/images/cardbg.png')}
        imageBack={require('../../assets/images/cardbg.png')}
        style={{ alignSelf: 'center', marginBottom: Sizes.fixPadding * 2.0 }}
        type={cardType}
        width={screenWidth - 40}
        height={220}
      />
    );
  }

  function payButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.push("BookingSuccess");
        }}
        style={{ ...commonStyles.button, borderRadius: 0 }}
      >
        <Text style={{ ...Fonts.whiteColor18Medium }}>Pay</Text>
      </TouchableOpacity>
    );
  }

  function saveCardInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setsaveCard(!saveCard)}
        style={styles.saveCardInfoWrapper}
      >
        <View
          style={{
            ...styles.selectionIndicatorStyle,
            backgroundColor: saveCard ? Colors.primaryColor : Colors.whiteColor,
            ...commonStyles.shadow,
          }}
        >
          {saveCard ? (
            <MaterialIcons name="check" color={Colors.whiteColor} size={18} />
          ) : null}
        </View>
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}
        >
          Save this card
        </Text>
      </TouchableOpacity>
    );
  }

  function paymentDescriptionText() {
    return (
      <Text
        style={{
          ...Fonts.grayColor16Medium,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        Enter your card detail and pay..
      </Text>
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
          Pay now
        </Text>
      </View>
    );
  }
};

export default PaymentScreen;

const styles = StyleSheet.create({
  selectionIndicatorStyle: {
    width: 24.0,
    height: 24.0,
    borderRadius: 12.0,
    alignItems: "center",
    justifyContent: "center",
  },
  saveCardInfoWrapper: {
    ...commonStyles.rowAlignCenter,
    margin: Sizes.fixPadding * 2.0,
    alignSelf: "flex-start",
  },
  textFieldWrapper: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    ...commonStyles.shadow,
    padding: Sizes.fixPadding,
  }
});
