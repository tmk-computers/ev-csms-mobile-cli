
const API_URL = 'http://192.168.250.182:8080';

/**
 * Function to handle signup API call.
 * @param {string} mobileNumber - The mobile number of the user.
 * @param {string} fullName - The full name of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<object>} - The response from the server.
 */
export const signupUser = async (mobileNumber, fullName, email) => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNumber,
        fullName,
        email,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    return data; // Return data from the response
  } catch (error) {
    throw error; // Throw error for handling in the component
  }
};

/**
 * Function to handle check user exists API call.
 * @param {string} mobileNumber - The mobile number of the user.
 * @returns {Promise<object>} - The response from the server, containing a boolean `success` and the data from the server.
 */
export const checkUserExists = async (mobileNumber) => {
  try {
    const response = await fetch(`${API_URL}/auth/check-user-exists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error checking user existence:', error);
    return { success: false, error };
  }
};

/**
 * Function to handle OTP verification API call.
 * @param {string} mobileNumber - The mobile number of the user.
 * @param {string} otp - The OTP entered by the user.
 * @returns {Promise<object>} - The response from the server.
 */
export const verifyOtp = async (mobileNumber, otp) => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber, otp }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error };
  }
};

/**
 * Function to handle fetch user info API call.
 * @param {string} token - The access token obtained after successful login.
 * @returns {Promise<object>} - The response from the server, containing a boolean `success` and the data from the server.
 * If the request is successful, the `success` key will be true and contain the user info data.
 * If the request fails, the `success` key will be false and contain the error data.
 */
export const fetchUserInfo = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error };
  }
};

export const fetchChargingStationDetails = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error };
  }
};

export const fetchChargingStationConnectorDetails = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/connectors/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error };
  }
};

export const fetchChargingStationCustomerReviews = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/customer-reviews/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error };
  }
};

export const updateUserProfile = async (token, mobileNumber, fullName, email) => {
  try {
    const response = await fetch(`${API_URL}/api/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber, fullName, email }),
    });

    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error Updating User profile:', error);
    return { success: false, error };
  }
};

export const fetchFavoriteChargingStations = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/favorites`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching favorite charging stations:', JSON.stringify(error));
    return { success: false, error };
  }
};

export const fetchNearbyChargingStations = async (latitude, longitude, distanceThreshold) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/nearest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude, distanceThreshold }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching nearby charging stations:', JSON.stringify(error));
    return { success: false, error };
  }
};

export const fetchNearbyChargingStationsUsingAggregator = async (latitude, longitude, distanceThreshold) => {
  try {
    const response = await fetch(`${API_URL}/api/aggregator/nearby?latitude=${latitude}&longitude=${longitude}&radius=${distanceThreshold}&maxResults=10&offset=0`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching nearby charging stations:', JSON.stringify(error));
    return { success: false, error };
  }
};

export const fetchEnrouteChargingStations = async (sourcePlace, destinationPlace) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/enroute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sourcePlace, destinationPlace }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching enroute charging stations:',API_URL, JSON.stringify(error));
    return { success: false, error };
  }
};

export const removeFromFavorites = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/favorites/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error removing charging station from favorites:', JSON.stringify(error));
    return { success: false, error };
  }
}

export const addToFavorites = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/favorites/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error adding charging station to favorites:', JSON.stringify(error));
    return { success: false, error };
  }
}

export const isFavorite = async (token, id) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-stations/favorites/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error checking if charging station is favorite:', JSON.stringify(error));
    return { success: false, error };
  }
}

export const fetchOngoingBookings = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-sessions/ongoing-bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching ongoing charging sessions:', JSON.stringify(error));
    return { success: false, error };
  }
};

export const fetchHistoryBookings = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/charging-sessions/history-bookings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Error fetching history charging sessions:', JSON.stringify(error));
    return { success: false, error };
  }
};