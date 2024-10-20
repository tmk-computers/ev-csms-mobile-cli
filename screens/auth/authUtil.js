import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { mapSocialUserToProfile } from "../../utils/utility";

const authUtil = {

    configGoogleAuth: ({ webClientId }) => {
        GoogleSignin.configure({
            webClientId
        })
    },

    signinUsingGoogle: async () => {
        try {
            console.log('✅ Signing in to Google')
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const userInfo = mapSocialUserToProfile(response.data.user);
            return { ...userInfo, type: 'external', service: 'Google' }
        } catch (error) {
            console.error('Google Sign-In Error:', error);
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