import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import enrouteStore from './enrouteScreenStore'
import { Colors, FontFamily, screenWidth, Sizes } from '../../constants/styles';

const GetDetailsModal = () => {
    const { getDetailsModal, batteryPerAtStart, batteryNeedToCharge, batteryRange, estimatedMiles, adjustedForWeather, adjustedForTerrain, adjustedForContinuousDriving, showDetailsModal, setBatteryPerAtStart, setText, toggleGetDetailsModal, setEstimatedValues, toggleShowDetailsModal } = enrouteStore();
    console.log("getDetailsModal", getDetailsModal);
    console.log("batteryPerAtStart", batteryPerAtStart);
    console.log("batteryNeedToCharge", batteryNeedToCharge);
    console.log("batteryRange", batteryRange);

    const calculateEstimation = () => {
        let estimatedMilesIdeal = ((batteryPerAtStart - batteryNeedToCharge) / 100) * batteryRange;

        let adjustedForWeather = estimatedMilesIdeal * (1 - 0.2);
        let adjustedForTerrain = adjustedForWeather * (1 - 0.1);
        let adjustedForContinuousDriving = adjustedForTerrain * (1 - 0.05);

        setEstimatedValues(estimatedMilesIdeal, adjustedForWeather, adjustedForTerrain, adjustedForContinuousDriving);
    }

    const check = async () => {
        try {
            // let latitude = 16.867634;
            // let longitude = 74.570389;
            let latitude = 40.7128;
            let longitude = -74.0060;
            // let url = `https://api.weather.gov/points/${latitude},${longitude}`;
            let url = `https://api.weather.gov/points/${latitude},${longitude}`;
            console.log('url',url);
            let res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/ld+json', } })
            console.log("ressss",res);
            
        } catch (error) {
            console.log('check error', error);
        }
    }

    return (
        <Modal visible={true} onRequestClose={() => {
            toggleGetDetailsModal();
        }} transparent >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#33333390' }}>
                {showDetailsModal == false &&
                    <View style={{ backgroundColor: '#ccc', borderRadius: 8, borderWidth: 2, borderColor: Colors.primaryColor, padding: 10 }}>
                        <Text style={styles.header}>Enter Details</Text>
                        <TextInput placeholder='Battery Percentage at Start' placeholderTextColor={"gray"} style={styles.input} value={batteryPerAtStart} onChangeText={(e) => { setBatteryPerAtStart(e) }} />
                        <TextInput placeholder='Battery Percentage Need to Charge' placeholderTextColor={"gray"}
                            style={styles.input}
                            value={batteryNeedToCharge}
                            onChangeText={(e) => { setText(e, "batteryNeedToCharge") }} />
                        <TextInput placeholder='Battery Range' placeholderTextColor={"gray"} style={styles.input} value={batteryRange} onChangeText={(e) => { setText(e, "batteryRange") }} />

                        {/* Btn Part */}
                        <View style={styles.bottomBtnContainer}>
                            <TouchableOpacity style={styles.buttonLeft}
                                onPress={() => {
                                    calculateEstimation();
                                    toggleShowDetailsModal();
                                }}
                            >
                                <Text style={styles.btnTextLeft}>Get Estimation</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.buttonRight} onPress={() => { toggleGetDetailsModal(); }}><Text style={styles.btnTextRight}>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>}


                {showDetailsModal && <View style={{ backgroundColor: '#ccc', borderRadius: 8, borderWidth: 2, borderColor: Colors.primaryColor, padding: 10 }}>

                    {/* <Text style={styles.showDetailsText}>Estimated Miles (Ideal): {estimatedMiles}</Text> */}
                    <TextRow label={"Estimated Miles (Ideal)"} value={estimatedMiles} />
                    <TextRow label={"Adjust for Weather"} value={adjustedForWeather} />
                    <TextRow label={"Adjust for Terrain"} value={adjustedForTerrain} />
                    <TextRow label={"Adjust for Continuous Driving"} value={adjustedForContinuousDriving} />
                    {/* Btn Part */}
                    <View style={styles.bottomBtnContainer}>
                        <TouchableOpacity style={styles.buttonLeft} onPress={async () => {
                            await check();
                            // toggleShowDetailsModal();
                        }}><Text style={styles.btnTextLeft}>OK</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRight} onPress={() => { toggleShowDetailsModal(); }}><Text style={styles.btnTextRight}>Back</Text></TouchableOpacity>
                    </View>
                </View>}
            </View>
        </Modal>
    )
}

const TextRow = ({label,  value}) => {

    return (
        <View style={{ width: screenWidth * 0.7, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.showDetailsText}>{label}</Text>
            <Text style={styles.showDetailsText}>: {value}</Text>
        </View>
    )
}

export default GetDetailsModal

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        // fontWeight: '800',
        fontFamily: FontFamily.Bold,
        // color: "#333",
        textAlign: 'center',
        marginVertical: 14
    },
    showDetailsText: {
        fontSize: 15,
        // fontWeight: '800',
        fontFamily: FontFamily.Regular,
        // color: "#333",
        // textAlign: 'center',
        marginVertical: 14, 
        // width: screenWidth * 0.7
    },
    btnTextLeft: { color: "#fff", padding: 12, fontFamily: FontFamily.Medium, fontSize: 12 },
    btnTextRight: { color: Colors.primaryColor, padding: 12, fontFamily: FontFamily.Medium, fontSize: 12 },
    buttonLeft: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryColor, marginRight: 4, borderRadius: 8
    },
    buttonRight: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", borderWidth: 2, borderColor: Colors.primaryColor, marginLeft: 4, borderRadius: 8
    },
    input: {
        height: 40,
        width: screenWidth * 0.7,
        borderColor: Colors.extraLightGrayColor,
        borderWidth: 1,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
        color: 'black',
        fontSize:11
    },
    bottomBtnContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14
    }
})