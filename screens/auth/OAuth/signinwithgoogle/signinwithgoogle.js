import {
    GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import authUtil from '../utils/authUtil';

authUtil.configGoogleAuth({
    webClientId: "174661613395-ddtfki7tpvohilb1htfb86imt4t0is7e.apps.googleusercontent.com"
});

function SigninWithGoogle({ onSuccess }) {

    const [isInProgress, setIsInProgress] = useState(false)

    const signIn = async () => {
        try {
            setIsInProgress(true)
            const userInfo = await authUtil.signinUsingGoogle()
            onSuccess(userInfo)

        } catch (error) {
            console.error(error)
        } finally {
            setIsInProgress(false)
        }
    };

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={signIn}
            style={{ ...styles.signinButton }}
            disabled={isInProgress}
        />
    )
}

const styles = StyleSheet.create({
    signinButton: {
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignSelf: "center",
    }
})

export default SigninWithGoogle