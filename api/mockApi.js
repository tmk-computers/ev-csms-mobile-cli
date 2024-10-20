import fetchMock from 'fetch-mock';
import { ENV, API_URL } from '@env';
import { getRandomLatLonWithinRadius } from '../helpers/geoUtils';

export const setupMockApis = (baseLatitude = 40.7128, baseLongitude = -74.0060) => {
  const radiusInMeters = 20000; // 20km radius
  if (ENV === 'development') {
    // Reset any existing mocks before setting new ones
    fetchMock.restore();

    // Mock Signup API
    fetchMock.post(`${API_URL}/auth/signup`, (url, options) => {
      const { mobileNumber, fullName, email } = JSON.parse(options.body);

      // Mock success response if certain conditions are met, else failure
      if (mobileNumber && fullName && email) {
        return {
          success: true,
          message: "Signup successful. Please verify your account.",
        };
      } else {
        return {
          success: false,
          message: "Signup failed. Missing required fields.",
        };
      }
    }, { overwriteRoutes: true });

    // Mock Check User Exists API
    fetchMock.post(`${API_URL}/auth/check-user-exists`, (url, options) => {
      const { mobileNumber } = JSON.parse(options.body);
      if (mobileNumber === "+919764613084") {
        return {
          success: true,
          exists: true,
          message: "User exists."
        };
      } else {
        return {
          success: true,
          exists: false,
          message: "User does not exist."
        };
      }
    }, { overwriteRoutes: true });

    // Mock OTP verification API
    fetchMock.post(`${API_URL}/auth/verify-otp`, (url, options) => {
      const { otp } = JSON.parse(options.body);

      // Mock success or failure based on the OTP
      if (otp === '1234') {
        return {
          success: true,
          message: 'OTP verification successful',
          loginResponse: {
            token: '1234',
            refreshToken: '5678',
            expiresIn: 3600,
          },
          userProfileResponse: {
            fullName: 'John Doe',
            mobileNumber: '+12124567890',
            email: 'john.doe@example.com',
          },
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }
    }, { overwriteRoutes: true });

    fetchMock.get(`${API_URL}/api/users/me`, {
      status: 200,
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
      },
    }, { overwriteRoutes: true });

    // Mock Update User Profile API
    fetchMock.put(`${API_URL}/api/users/update-profile`, (url, options) => {
      const { mobileNumber, fullName, email } = JSON.parse(options.body);

      // Mock success or failure based on the OTP
      if (mobileNumber && fullName && email) {
        return {
          success: true,
          message: 'Profile updated successfully',
          userProfileResponse: {
            fullName: 'John Doe',
            mobileNumber: '+12124567890',
            email: 'john.doe@example.com',
          },
        };
      } else {
        return {
          success: false,
          message: 'Invalid user data',
        };
      }
    }, { overwriteRoutes: true });

    fetchMock.get(
      new RegExp(`${API_URL}/api/charging-stations/\\d+`),
      (url) => {
        const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
        return {
          status: 200,
          body: {
            id: id,
            name: `Charging station ${id}`,
            description: `Charging station ${id} description`,
            address: "Pune, India",
            amenity: { atm: true, children_playarea: true, foodcourt: true, id: 4, washroom: true, wifi: true },
            favorite: false,
            open: false,
            operationalHours: "24x7",
            pincode: null,
            tenantId: 1,
            ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
          },
        };
      },
      { overwriteRoutes: true }
    );

    fetchMock.get(
      new RegExp(`${API_URL}/api/charging-stations/connectors/\\d+`),
      (url) => {
        const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
        const connectionsList = [
          {
            id: 1,
            connectionTypeImage: "connection_type1.png",
            connectionType: "CCS",
            capacity: 55,
            pricePerWatt: 0.05,
            takenSlot: 0,
            totalSlot: 3,
          },
          {
            id: 2,
            connectionTypeImage: "connection_type2.png",
            connectionType: "CCS2",
            capacity: 55,
            pricePerWatt: 0.05,
            takenSlot: 2,
            totalSlot: 5,
          },
          {
            id: 3,
            connectionTypeImage: "connection_type3.png",
            connectionType: "Mennekes",
            capacity: 34,
            pricePerWatt: 0.02,
            takenSlot: 6,
            totalSlot: 6,
          },
        ];
        return {
          status: 200,
          body: connectionsList,
        };
      },
      { overwriteRoutes: true }
    );

    fetchMock.get(
      new RegExp(`${API_URL}/api/charging-stations/customer-reviews/\\d+`),
      (url) => {
        const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
        const dummyText =
          "Lorem ipsum dolor sit amet consectetur. Vitae luctusmassa viverra eget pulvinar. Vestibulum ac cras estplatea natoque nec. Sed sed gravida platea viverra vel ac.Eu placerat sit lacus tellus. Faucibus et id a eros volutpatinterdum in tincidunt viverra.";

        const reviewsList = [
          {
            id: "1",
            reviewerImage: "user1.png",
            reviewerName: "Andrew Anderson",
            rating: 5.0,
            review: dummyText,
          },
          {
            id: "2",
            reviewerImage: "user2.png",
            reviewerName: "Peter Jones",
            rating: 4.0,
            review: dummyText,
          },
          {
            id: "3",
            reviewerImage: "user3.png",
            reviewerName: "Emily Wood",
            rating: 3.0,
            review: dummyText,
          },
        ];
        return {
          status: 200,
          body: reviewsList,
        };
      },
      { overwriteRoutes: true }
    );


    // Mock Get favorite charging stations API
    fetchMock.get(`${API_URL}/api/charging-stations/favorites`, {
      status: 200,
      body: [
        {
          id: "1",
          stationImage: "charging_station2.png",
          stationName: "Apex Charging Point",
          stationAddress: "Near shell petrol station",
          rating: 4.7,
          totalPoints: 8,
          distance: "4.5 km",
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "2",
          stationImage: "charging_station3.png",
          stationName: "Horizon EV Station",
          stationAddress: "Near apex hospital",
          rating: 4.2,
          totalPoints: 18,
          distance: "5.7 km",
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "3",
          stationImage: "charging_station1.png",
          stationName: "Rapid EV Charge",
          stationAddress: "Near shelby play ground",
          rating: 4.2,
          totalPoints: 12,
          distance: "6.2 km",
          isOpen: false,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "4",
          stationImage: "charging_station5.png",
          stationName: "Tesla Recharge",
          stationAddress: "Near nissan show room",
          rating: 4.9,
          totalPoints: 22,
          distance: "7.9 km",
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
      ],
    }, { overwriteRoutes: true });

    fetchMock.get(new RegExp(`${API_URL}/api/charging-stations/favorites/\\d+`), (url) => {
      const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
      return {
        status: 200,
        body: true,
      };
    }, { overwriteRoutes: true });

    fetchMock.post(new RegExp(`${API_URL}/api/charging-stations/favorites/\\d+`), (url, options) => {
      const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
      return {
        status: 200,
        body: true,
      };
    }, { overwriteRoutes: true });

    fetchMock.delete(new RegExp(`${API_URL}/api/charging-stations/favorites/\\d+`), (url, options) => {
      const id = url.match(/\d+$/)[0]; // Extract the ID from the URL
      return {
        status: 200,
        body: true,
      };
    }, { overwriteRoutes: true });

    // Mock Get nearest charging stations API
    fetchMock.post(`${API_URL}/api/charging-stations/nearest`, (url, options) => {
      const { latitude, longitude, distanceThreshold } = JSON.parse(options.body);

      const nearByChargingStationsList = [
        {
          id: "1",
          stationImage: "charging_station2.png",
          stationName: "Apex Charging Point",
          stationAddress: "Near shell petrol station",
          rating: 4.7,
          totalPoints: 8,
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "2",
          stationImage: "charging_station3.png",
          stationName: "Horizon EV Station",
          stationAddress: "Near apex hospital",
          rating: 4.2,
          totalPoints: 18,
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "3",
          stationImage: "charging_station1.png",
          stationName: "Rapid EV Charge",
          stationAddress: "Near shelby play ground",
          rating: 4.2,
          totalPoints: 12,
          isOpen: false,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "4",
          stationImage: "charging_station5.png",
          stationName: "Tesla Recharge",
          stationAddress: "Near nissan show room",
          rating: 4.9,
          totalPoints: 22,
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
      ];
      return nearByChargingStationsList;
    }, { overwriteRoutes: true });

    // Mock Get enroute charging stations API
    fetchMock.post(`${API_URL}/api/charging-stations/enroute`, (url, options) => {
      const { sourcePlace, destinationPlace } = JSON.parse(options.body);

      const enrouteChargingStationList = [
        {
          id: "1",
          stationImage: "charging_station5.png",
          stationName: "BYD Charging Point",
          stationAddress: "Near shell petrol station",
          rating: 4.7,
          totalPoints: 8,
          distance: "4.5",
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "2",
          stationImage: "charging_station4.png",
          stationName: "TATA EStation",
          stationAddress: "Near orange business hub",
          rating: 3.9,
          totalPoints: 15,
          distance: "5.7",
          isOpen: false,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "3",
          stationImage: "charging_station5.png",
          stationName: "HP Charging Station",
          stationAddress: "Near ananta business park",
          rating: 4.9,
          totalPoints: 6,
          distance: "2.1",
          isOpen: true,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "4",
          stationImage: "charging_station4.png",
          stationName: "VIDA Station V1",
          stationAddress: "Near opera street",
          rating: 4.2,
          totalPoints: 15,
          distance: "3.5",
          isOpen: false,
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
      ];

      return enrouteChargingStationList;
    }, { overwriteRoutes: true });

    // Mock Get ongoing Bookings List
    fetchMock.get(`${API_URL}/api/charging-sessions/ongoing-bookings`, {
      status: 200,
      body: [
        {
          id: "1",
          chargingStationImage: "charging_station4.png",
          chargingStationName: "BYD Charging Point",
          chargingStationAddress: "Near shell petrol station",
          bookingDay: "SUN",
          bookingTime: "08:30 PM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "2",
          chargingStationImage: "charging_station5.png",
          chargingStationName: "VIDA Station V1",
          chargingStationAddress: "Near opera street",
          bookingDay: "TUE",
          bookingTime: "11:30 AM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
      ],
    }, { overwriteRoutes: true });

    // Mock Get ongoing Bookings List
    fetchMock.get(`${API_URL}/api/charging-sessions/history-bookings`, {
      status: 200,
      body: [
        {
          id: "1",
          chargingStationImage: "charging_station4.png",
          chargingStationName: "BYD Charging Point",
          chargingStationAddress: "Near shell petrol station",
          bookingDate: "10 Aug 2023 ",
          bookingTime: " 11:45 AM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "2",
          chargingStationImage: "charging_station5.png",
          chargingStationName: "VIDA Station V1",
          chargingStationAddress: "Near opera street",
          bookingDate: "05 Aug 2023",
          bookingTime: "04:15 PM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "3",
          chargingStationImage: "charging_station1.png",
          chargingStationName: "TATA EStation",
          chargingStationAddress: "Near orange business hub",
          bookingDate: "10 Aug 2023 ",
          bookingTime: " 11:45 AM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
        {
          id: "4",
          chargingStationImage: "charging_station2.png",
          chargingStationName: "HP Charging Station",
          chargingStationAddress: "Near ananta business park",
          bookingDate: "05 Aug 2023",
          bookingTime: "04:15 PM",
          ...getRandomLatLonWithinRadius(baseLatitude, baseLongitude, radiusInMeters),
        },
      ],
    }, { overwriteRoutes: true });

    fetchMock.get(
      new RegExp('https://maps.googleapis.com/maps/api/directions/json.*'),
      {
        status: 'OK',
        routes: [
          {
            summary: "Mocked Route",
            legs: [
              {
                distance: { text: "4.5 km", value: 4500 },
                duration: { text: "10 mins", value: 600 },
                start_address: "Point A",
                end_address: "Point B",
                start_location: { lat: baseLatitude, lng: baseLongitude },
                end_location: { lat: baseLatitude + 0.05, lng: baseLongitude + 0.05 }
              }
            ],
            overview_polyline: {
              points: "mocked_polyline_points_here" // Mocked polyline points
            }
          }
        ]
      }
    );
  }
};
