/**
 * API Debugger Utility
 *
 * This utility provides functions to test and debug API calls from the browser console.
 * Copy and paste the following into your browser console to use:
 *
 * Usage:
 * 1. Call window.testProfileGet() to test getting the profile
 * 2. Call window.testProfileUpdate(data) to test updating the profile
 */

// Configure the API URL
const API_URL = 'http://localhost:8080/api';

/**
 * Get the authorization token from localStorage
 * @returns {string|null} The authorization token
 */
function getAuthToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('No access token found in localStorage');
    return null;
  }
  return token;
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint path
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {Object} data - Request body data (for POST/PUT)
 * @returns {Promise} - Promise that resolves to the API response
 */
async function makeApiRequest(endpoint, method = 'GET', data = null) {
  try {
    const token = getAuthToken();
    if (!token && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
      throw new Error('Authentication required');
    }

    const url = `${API_URL}${endpoint}`;
    console.log(`Making ${method} request to ${url}`);

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token exists
    if (token) {
      options.headers.Authorization = token;
    }

    // Add request body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log('Request options:', options);

    // Make the fetch request
    const response = await fetch(url, options);
    console.log('Response status:', response.status);

    // Parse the response
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log('Response data:', responseData);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return { status: response.status, data: responseData };
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Test getting the user profile
 */
async function testProfileGet() {
  try {
    console.log('Testing GET /profile API call...');
    const result = await makeApiRequest('/profile');
    console.log(
      '%c✅ Profile GET successful!',
      'color: green; font-weight: bold;'
    );
    return result;
  } catch (error) {
    console.error(
      '%c❌ Profile GET failed!',
      'color: red; font-weight: bold;',
      error
    );
    return null;
  }
}

/**
 * Test updating the user profile
 * @param {Object} profileData - Profile data to update
 */
async function testProfileUpdate(profileData = null) {
  try {
    console.log('Testing PUT /profile API call...');

    // If no profile data provided, use a test object
    const data = profileData || {
      name: 'Test User ' + new Date().toISOString().substring(0, 10),
      preferredLocation: 'Test Location',
      bio: 'This is a test bio update ' + new Date().toTimeString(),
      phoneNumber: '0123456789',
    };

    console.log('Using profile data:', data);

    const result = await makeApiRequest('/profile', 'PUT', data);
    console.log(
      '%c✅ Profile UPDATE successful!',
      'color: green; font-weight: bold;'
    );
    return result;
  } catch (error) {
    console.error(
      '%c❌ Profile UPDATE failed!',
      'color: red; font-weight: bold;',
      error
    );
    return null;
  }
}

/**
 * Test complete profile flow (get and update)
 */
async function testProfileFlow() {
  try {
    // First get the current profile
    const currentProfile = await testProfileGet();
    if (!currentProfile) {
      throw new Error('Failed to get current profile');
    }

    // Small delay for logging clarity
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update just the bio field with timestamp to see the change
    const profileData = {
      ...currentProfile.data.data,
      bio: `Updated bio on ${new Date().toLocaleString()}`,
    };

    // Then update the profile
    const updatedProfile = await testProfileUpdate(profileData);
    if (!updatedProfile) {
      throw new Error('Failed to update profile');
    }

    console.log(
      '%c✅ Complete profile flow test successful!',
      'color: green; font-weight: bold; font-size: 14px;'
    );
    return { before: currentProfile, after: updatedProfile };
  } catch (error) {
    console.error(
      '%c❌ Profile flow test failed!',
      'color: red; font-weight: bold; font-size: 14px;',
      error
    );
    return null;
  }
}

// Expose functions to the window object
window.testProfileGet = testProfileGet;
window.testProfileUpdate = testProfileUpdate;
window.testProfileFlow = testProfileFlow;
window.apiDebugger = { makeApiRequest, getAuthToken };

// Log that the API debugger is loaded
console.log(
  '%cAPI Debugger loaded!',
  'color: purple; font-weight: bold; font-size: 16px;'
);
console.log('Available commands:');
console.log('%c- window.testProfileGet()', 'color: blue;');
console.log('%c- window.testProfileUpdate(data)', 'color: blue;');
console.log('%c- window.testProfileFlow()', 'color: blue;');
