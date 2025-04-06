/**
 * API Troubleshooter
 *
 * This utility provides several testing functions to diagnose API issues.
 * Copy and paste into your browser console to use all functions.
 */

// Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Collection of API troubleshooting functions
const apiTroubleshooter = {
  /**
   * Test all the different approaches for updating profile in one function
   */
  async testAllProfileUpdateMethods() {
    console.log('===============================================');
    console.log('TESTING ALL PROFILE UPDATE METHODS');
    console.log('===============================================');

    // Create test data - use same data for all tests
    const testData = {
      bio: 'Comprehensive test ' + new Date().toISOString(),
      name: 'Test User',
      phoneNumber: '0123456789',
    };

    const results = {};

    // 1. Try Fetch
    console.log('\n--- TEST #1: Direct Fetch API Test ---');
    try {
      results.fetch = await this.testFetchProfileUpdate(testData);
    } catch (e) {
      results.fetch = { error: e.message, success: false };
    }

    // 2. Try XMLHttpRequest
    console.log('\n--- TEST #2: XHR API Test ---');
    try {
      results.xhr = await this.testXhrProfileUpdate(testData);
    } catch (e) {
      results.xhr = { error: e.message, success: false };
    }

    // 3. Try Axios
    console.log('\n--- TEST #3: Axios API Test ---');
    try {
      results.axios = await this.testAxiosProfileUpdate(testData);
    } catch (e) {
      results.axios = { error: e.message, success: false };
    }

    // 4. Verify token is valid
    console.log('\n--- TEST #4: Token Validity Test ---');
    try {
      results.tokenTest = await this.testTokenValidity();
    } catch (e) {
      results.tokenTest = { error: e.message, success: false };
    }

    // Summary
    console.log('\n===============================================');
    console.log('TEST RESULTS SUMMARY:');
    console.log('===============================================');

    console.log(
      'Fetch Test:',
      results.fetch.success ? 'SUCCESS ✅' : 'FAILED ❌'
    );
    console.log('XHR Test:', results.xhr.success ? 'SUCCESS ✅' : 'FAILED ❌');
    console.log(
      'Axios Test:',
      results.axios.success ? 'SUCCESS ✅' : 'FAILED ❌'
    );
    console.log(
      'Token Test:',
      results.tokenTest.success ? 'SUCCESS ✅' : 'FAILED ❌'
    );

    return results;
  },

  /**
   * Test profile update using fetch
   */
  async testFetchProfileUpdate(testData) {
    const data = testData || {
      bio: 'Fetch test ' + new Date().toISOString(),
    };

    console.log('Testing profile update with fetch');
    console.log('Test data:', data);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found!');
      return { success: false, error: 'No token found' };
    }

    try {
      console.log('Making fetch PUT request to', `${API_BASE_URL}/profile`);
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      console.log('Fetch response status:', response.status);

      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (e) {
        const text = await response.text();
        console.log('Response not JSON, text:', text);
        responseData = { text };
      }

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        data: responseData,
      };
    } catch (error) {
      console.error('Fetch error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test profile update using XMLHttpRequest
   */
  testXhrProfileUpdate(testData) {
    return new Promise((resolve, reject) => {
      const data = testData || {
        bio: 'XHR test ' + new Date().toISOString(),
      };

      console.log('Testing profile update with XMLHttpRequest');
      console.log('Test data:', data);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found!');
        return reject(new Error('No token found'));
      }

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `${API_BASE_URL}/profile`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', token);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('XHR status:', xhr.status);

          let data;
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            data = { text: xhr.responseText };
          }

          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('XHR success response:', data);
            resolve({
              success: true,
              status: xhr.status,
              data,
            });
          } else {
            console.error('XHR error response:', data);
            resolve({
              success: false,
              status: xhr.status,
              data,
            });
          }
        }
      };

      xhr.onerror = function (e) {
        console.error('XHR network error:', e);
        reject(new Error('Network error'));
      };

      xhr.send(JSON.stringify(data));
    });
  },

  /**
   * Test profile update using axios (if available)
   */
  async testAxiosProfileUpdate(testData) {
    const data = testData || {
      bio: 'Axios test ' + new Date().toISOString(),
    };

    console.log('Testing profile update with axios');
    console.log('Test data:', data);

    // Check if axios is available
    if (typeof axios === 'undefined') {
      console.error('Axios not available in global scope');
      // Create a simple axios-like implementation
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('accessToken'),
          },
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        return {
          success: response.status >= 200 && response.status < 300,
          status: response.status,
          data: responseData,
        };
      } catch (error) {
        console.error('Fetch fallback error:', error);
        return {
          success: false,
          error: error.message,
        };
      }
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, data, {
        headers: {
          Authorization: localStorage.getItem('accessToken'),
        },
      });

      console.log('Axios response:', response);

      return {
        success: true,
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      console.error('Axios error:', error);

      return {
        success: false,
        status: error.response?.status,
        error: error.message,
        data: error.response?.data,
      };
    }
  },

  /**
   * Test if the token is valid by making a GET request
   */
  async testTokenValidity() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found in localStorage');
      return { success: false, error: 'No token found' };
    }

    console.log('Testing token validity...');
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

    try {
      console.log('Making GET request to', `${API_BASE_URL}/profile`);
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      console.log('Token test response status:', response.status);

      // Check if 401/403 which would indicate token issues
      if (response.status === 401 || response.status === 403) {
        console.error('Token appears to be invalid or expired');
        return {
          success: false,
          status: response.status,
          error: 'Token invalid or expired',
        };
      }

      // If we can successfully get profile, token is valid
      let data;
      try {
        data = await response.json();
        console.log('Profile data received:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON');
        data = null;
      }

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        data,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Check for CORS issues by testing preflight
   */
  async testCorsSetup() {
    console.log('Testing CORS setup...');

    try {
      // Make an OPTIONS request to check preflight
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'PUT',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
          Origin: window.location.origin,
        },
      });

      console.log('CORS preflight status:', response.status);
      console.log('CORS headers:', {
        'Access-Control-Allow-Origin': response.headers.get(
          'Access-Control-Allow-Origin'
        ),
        'Access-Control-Allow-Methods': response.headers.get(
          'Access-Control-Allow-Methods'
        ),
        'Access-Control-Allow-Headers': response.headers.get(
          'Access-Control-Allow-Headers'
        ),
      });

      return {
        success: response.status === 204 || response.status === 200,
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': response.headers.get(
            'Access-Control-Allow-Origin'
          ),
          'Access-Control-Allow-Methods': response.headers.get(
            'Access-Control-Allow-Methods'
          ),
          'Access-Control-Allow-Headers': response.headers.get(
            'Access-Control-Allow-Headers'
          ),
        },
      };
    } catch (error) {
      console.error('CORS test error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Test basic connectivity to the API
   */
  async testConnectivity() {
    console.log('Testing basic API connectivity...');

    try {
      // No authorization needed for this test, just checking if server is reachable
      const startTime = Date.now();
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        cache: 'no-cache',
      });
      const endTime = Date.now();

      console.log('Connectivity test status:', response.status);
      console.log('Response time:', endTime - startTime, 'ms');

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        responseTime: endTime - startTime,
      };
    } catch (error) {
      console.error('Connectivity test error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },
};

// Expose to window if in browser
if (typeof window !== 'undefined') {
  window.apiTroubleshooter = apiTroubleshooter;
  console.log('API Troubleshooter loaded!');
  console.log('Available commands:');
  console.log('- window.apiTroubleshooter.testAllProfileUpdateMethods()');
  console.log('- window.apiTroubleshooter.testFetchProfileUpdate()');
  console.log('- window.apiTroubleshooter.testXhrProfileUpdate()');
  console.log('- window.apiTroubleshooter.testAxiosProfileUpdate()');
  console.log('- window.apiTroubleshooter.testTokenValidity()');
  console.log('- window.apiTroubleshooter.testCorsSetup()');
  console.log('- window.apiTroubleshooter.testConnectivity()');
}

export default apiTroubleshooter;
