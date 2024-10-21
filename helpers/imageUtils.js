
// Utility function to check if the stationImage is a URL
const isImageUrl = (imagePath) => {
    return typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'));
};

// Utility function to get image source (either URL or local)
const getImageSource = (stationImage, localImageMap) => {
    if (isImageUrl(stationImage)) {
        return { uri: stationImage };
    } else if (localImageMap[stationImage]) {
        return localImageMap[stationImage];
    }
    return null;
};

export { getImageSource, isImageUrl };
