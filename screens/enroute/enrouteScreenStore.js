import { create } from 'zustand';

const enrouteStoreObject = (set, get) => ({
    getDetailsModal: false,
    showDetailsModal: false,
    batteryPerAtStart: 80,
    batteryNeedToCharge: 20,
    batteryRange: 250,
    estimatedMiles: null,
    adjustedForWeather: null,
    adjustedForTerrain: null,
    adjustedForContinuousDriving: null,
    resetValue: () => {
        set({ batteryPerAtStart: 80, batteryNeedToCharge: 20, batteryRange: 250})
    },
    setEstimatedValues: (estimatedMiles, adjustedForWeather, adjustedForTerrain, adjustedForContinuousDriving) => {
        set({
            estimatedMiles: estimatedMiles, adjustedForWeather: adjustedForWeather, adjustedForTerrain
                : adjustedForTerrain, adjustedForContinuousDriving: adjustedForContinuousDriving
        })
    },
    toggleGetDetailsModal: () => {
        set(state => ({ getDetailsModal: !state.getDetailsModal }))
    },
    toggleShowDetailsModal: () => {
        set(state => ({ showDetailsModal: !state.showDetailsModal }))
    },
    setBatteryPerAtStart: (value) => {
        set({ batteryPerAtStart: value });
    },
    setText: (value, key) => {
        console.log('in setText of store', key);
        set({ [`${key}`]: value })
    }
});

const enrouteStore = create(enrouteStoreObject);

export default enrouteStore;