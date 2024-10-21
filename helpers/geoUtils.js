import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const getRandomLatLonWithinRadius = (latitude, longitude, radius) => {
    const earthRadiusKm = 6371;
    const radiusKm = radius / 1000;

    const lat = (latitude * Math.PI) / 180;
    const lon = (longitude * Math.PI) / 180;

    const randomDistance = Math.random() * radiusKm / earthRadiusKm;
    const randomBearing = Math.random() * 2 * Math.PI;

    const newLat = Math.asin(Math.sin(lat) * Math.cos(randomDistance) +
        Math.cos(lat) * Math.sin(randomDistance) * Math.cos(randomBearing));

    const newLon = lon + Math.atan2(Math.sin(randomBearing) * Math.sin(randomDistance) * Math.cos(lat),
        Math.cos(randomDistance) - Math.sin(lat) * Math.sin(newLat));

    const newLatDeg = (newLat * 180) / Math.PI;
    const newLonDeg = (newLon * 180) / Math.PI;

    return {
        latitude: newLatDeg,
        longitude: newLonDeg
    };
};

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Can we access your location?',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        console.log('granted', granted);
        if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
        } else {
            console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        return false;
    }
};


// Function to get the current position
const getCurrentPosition = async () => {
    const permissionGranted = await requestLocationPermission();

    if (permissionGranted) {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    } else {
        throw new Error("Location permission not granted");
    }
};

export { getCurrentPosition, getRandomLatLonWithinRadius };