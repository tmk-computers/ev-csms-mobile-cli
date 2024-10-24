import 'react-native-gesture-handler';
import {
    createStackNavigator,
    TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import { LogBox } from "react-native";
import AllChargingStationsScreen from "./screens/allChargingStations/allChargingStationsScreen";
import FilterScreen from "./screens/filter/filterScreen";
import SearchScreen from "./screens/search/searchScreen";
import ChargingStationDetailScreen from "./screens/chargingStationDetail/chargingStationDetailScreen";
import AllReviewScreen from "./screens/allReview/allReviewScreen";
import ChargingStationReview from './screens/review/chargingStationReview';
import DirectionScreen from "./screens/direction/directionScreen";
import BookSlotScreen from "./screens/bookSlot/bookSlotScreen";
import ConfirmDetailScreen from "./screens/confirmDetail/confirmDetailScreen";
import PaymentScreen from "./screens/payment/paymentScreen";
import BookingSuccessScreen from "./screens/bookingSuccess/bookingSuccessScreen";
import PickLocationScreen from "./screens/pickLocation/pickLocationScreen";
import EnrouteChargingStationsScreen from "./screens/enrouteChargingStations/enrouteChargingStationsScreen";
import ChargingStationsOnMapScreen from "./screens/chargingStationsOnMap/chargingStationsOnMapScreen";
import BookingDetailScreen from "./screens/bookingDetail/bookingDetailScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import NotificationScreen from "./screens/notifications/notificationsScreen";
import TermsAndConditionsScreen from "./screens/termsAndConditions/termsAndConditionsScreen";
import FaqScreen from "./screens/faq/faqScreen";
import PrivacyPolicyScreen from "./screens/privacyPolicy/privacyPolicyScreen";
import HelpScreen from "./screens/help/helpScreen";
import SplashScreen from "./screens/splashScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import SigninScreen from "./screens/auth/signinScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import VerificationScreen from "./screens/auth/verificationScreen";
import ViewDetailScreen from './screens/viewdetailsScreen/viewDetails';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

function MyApp() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="BottomTabBar" component={BottomTabBarScreen} options={{ ...TransitionPresets.DefaultTransition }} />
                <Stack.Screen name="AllChargingStations" component={AllChargingStationsScreen} />
                <Stack.Screen name="Filter" component={FilterScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="ChargingStationDetail" component={ChargingStationDetailScreen} />
                <Stack.Screen name="AllReview" component={AllReviewScreen} />
                <Stack.Screen name="AddReview" component={ChargingStationReview} />
                <Stack.Screen name="Direction" component={DirectionScreen} />
                <Stack.Screen name="BookSlot" component={BookSlotScreen} />
                <Stack.Screen name="ConfirmDetail" component={ConfirmDetailScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
                <Stack.Screen name="PickLocation" component={PickLocationScreen} />
                <Stack.Screen name="EnrouteChargingStations" component={EnrouteChargingStationsScreen} />
                <Stack.Screen name="ChargingStationsOnMap" component={ChargingStationsOnMapScreen} />
                <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="Notification" component={NotificationScreen} />
                <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
                <Stack.Screen name="Faq" component={FaqScreen} />
                <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
                <Stack.Screen name="Help" component={HelpScreen} />
                <Stack.Screen name="Signin" component={SigninScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Verification" component={VerificationScreen} />
                <Stack.Screen name="DetailsScreen" component={ViewDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MyApp;
