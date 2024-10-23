import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { mapSocialUserToProfile } from "../../../../utils/utility"
import { Alert } from "react-native";


const authUtil = {

    configGoogleAuth: ({ webClientId }) => {
        GoogleSignin.configure({
            offlineAccess: true,
            webClientId
        })
    },

    signinUsingGoogle: async () => {
        try {
            console.log('✅ Signing in to Google');
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();    
            
            if (!response.data.user || !response.data.user.id || !response.data.user.email) {
                throw new Error("User object is invalid or missing necessary fields.");
            }
    
            const userInfo = mapSocialUserToProfile(response.data.user);
            return { ...userInfo, type: 'external', service: 'Google' };
        } catch (error) {
            console.error('Google Sign-In Error:', error);
            Alert.alert("Sign-In Error", error.message || "An unknown error occurred.");
            throw error;
        }
    },

    signoutFromGoogle: async () => {
        try {
            console.log('🔑 Signing out from Google')
            await GoogleSignin.signOut();
            return true
        } catch (error) {
            console.error('Google Sign-Out Error:',error);
            throw error
        }
    }


}

export default authUtil