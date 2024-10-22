import { GoogleSignin } from "@react-native-google-signin/google-signin"

const authUtils = {
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

const mapSocialUserToProfile = (user) => {
    if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object');
    }

    const { name, email, photo, contact } = user;

    const capitalizedName = name.split(' ').map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(' ')

    return {
        name: capitalizedName,
        email: email,
        contact: contact,
        image: photo
    };
}

export { authUtils, mapSocialUserToProfile }