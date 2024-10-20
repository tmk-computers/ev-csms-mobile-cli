import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Platform,
    TextInput,
} from "react-native";
import React, { useState } from "react";
import {
    Colors,
    commonStyles,
    Fonts,
    screenWidth,
    Sizes,
} from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

ChargingStationReview = ({ navigation, route }) => {
    const [text, setText] = useState('');
    const [ratings, setRatings] = useState([0, 0, 0, 0]);
    const { chargingStationId } = route.params;

    const handleSubmit = () => {
        console.log(chargingStationId, ratings, text)
        const test = ratings.every(item => item == false)
        if (!test && text) {
            navigation.navigate("ChargingStationDetail", { "chargingStationId": chargingStationId })
        }
        setText('');
        setRatings([0, 0, 0, 0]);
    };

    return (
        <View style={styles.dialogStyle}>
            <ScrollView style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }} showsVerticalScrollIndicator={true}>
                <View>
                    <Image
                        source={require("../../assets/images/icons/rating.png")}
                        style={styles.ratingImageStyle}
                    />
                    <Text style={{ ...Fonts.blackColor18Medium, textAlign: "center", marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        Rate your charging experience..
                    </Text>
                    {renderRatingStars(0, ratings, setRatings)}
                    <Text style={{ ...Fonts.blackColor18Medium, textAlign: "center", marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        Rate safety experience..
                    </Text>
                    {renderRatingStars(1, ratings, setRatings)}
                    <Text style={{ ...Fonts.blackColor18Medium, textAlign: "center", marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        Rate ease experience..
                    </Text>
                    {renderRatingStars(2, ratings, setRatings)}
                    <Text style={{ ...Fonts.blackColor18Medium, textAlign: "center", marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        Rate location accessibility
                    </Text>
                    {renderRatingStars(3, ratings, setRatings)}
                    <View style={styles.container}>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            numberOfLines={4}
                            placeholder="Write your review..."
                            value={text}
                            onChangeText={setText}
                        />
                    </View>

                </View>
            </ScrollView>
            <View style={{ ...commonStyles.rowAlignCenter, marginTop: Sizes.fixPadding }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("ChargingStationDetail", { "chargingStationId": chargingStationId })}
                    style={{ ...styles.noButtonStyle, ...styles.dialogYesNoButtonStyle }}
                >
                    <Text style={{ ...Fonts.blackColor16Medium }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    style={{ ...styles.yesButtonStyle, ...styles.dialogYesNoButtonStyle }}
                >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function handleRatingPress(index, star, ratings, setRatings) {
    const newRatings = [...ratings];
    if (newRatings[index] === star) {
        newRatings[index] = star - 1; // Decrement if the star is already selected
    } else {
        newRatings[index] = star; // Set to the new star rating
    }
    setRatings(newRatings);
}

function renderRatingStars(index, ratings, setRatings) {
    return (
        <View style={{ ...styles.ratingWrapStyle }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <MaterialIcons
                    key={star}
                    name={ratings[index] >= star ? "star" : "star-border"}
                    size={screenWidth / 12.5}
                    color={Colors.primaryColor}
                    onPress={() => handleRatingPress(index, star, ratings, setRatings)}
                />
            ))}
        </View>
    );
}

export default ChargingStationReview;

const styles = StyleSheet.create({
    dialogStyle: {
        backgroundColor: Colors.whiteColor,
        width: "100%",
        height: '100%'
    },
    chargingStationWrapStyle: {
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.bodyBackColor,
        ...commonStyles.shadow,
        borderColor: Colors.extraLightGrayColor,
        borderWidth: 0.1,
        borderTopWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        flexDirection: "row",
    },
    chargingStationImage: {
        width: screenWidth / 3.2,
        height: "100%",
        borderTopLeftRadius: Sizes.fixPadding,
        borderBottomLeftRadius: Sizes.fixPadding,
    },
    stationOpenCloseWrapper: {
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
    getDirectionButton: {
        backgroundColor: Colors.primaryColor,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding - 2.0,
        borderTopLeftRadius: Sizes.fixPadding,
        borderBottomRightRadius: Sizes.fixPadding,
    },
    bookingDetailWrapStyle: {
        ...commonStyles.rowSpaceBetween,
        marginBottom: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    dottedLineStyle: {
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        borderStyle: "dashed",
        marginVertical: Sizes.fixPadding * 2.0,
    },
    bookingInfoWrapStyle: {
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 7.0,
        backgroundColor: Colors.whiteColor,
        ...commonStyles.shadow,
    },
    chargeInfoTextStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
        textAlign: "center",
        ...Fonts.primaryColor16Medium,
    },
    dialogClearIconWrapper: {
        alignSelf: "center",
        width: 50.0,
        height: 50.0,
        borderRadius: 25.0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C30707",
        marginTop: Sizes.fixPadding * 2.0,
    },
    dialogYesNoButtonStyle: {
        flex: 1,
        ...commonStyles.shadow,
        borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
        padding: Sizes.fixPadding,
        alignItems: "center",
        justifyContent: "center",
    },
    noButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopColor: Colors.extraLightGrayColor,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    },
    yesButtonStyle: {
        borderTopColor: Colors.primaryColor,
        backgroundColor: Colors.primaryColor,
        borderBottomRightRadius: Sizes.fixPadding - 5.0,
    },
    dialogCancelTextStyle: {
        marginVertical: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        textAlign: "center",
        ...Fonts.blackColor18Medium,
    },
    ratingImageStyle: {
        marginTop: Sizes.fixPadding * 1.5,
        width: 70.0,
        height: 60.0,
        resizeMode: "contain",
        alignSelf: "center",
    },
    ratingWrapStyle: {
        ...commonStyles.rowAlignCenter,
        justifyContent: "center",
        marginVertical: Sizes.fixPadding + 5.0,
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        //   marginTop: 
        // marginTop:60
    },
    textArea: {
        height: 150,
        justifyContent: "flex-start",
        textAlignVertical: "top", // Ensures text starts at the top
        borderColor: '#000',
        borderWidth: 1,
        padding: 10,
    },
});