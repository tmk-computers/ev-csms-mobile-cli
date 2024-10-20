export function getRandomLatLonWithinRadius(latitude, longitude, radius) {
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
}
