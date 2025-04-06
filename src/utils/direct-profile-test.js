/**
 * Direct Profile Test Utility
 *
 * This utility provides a direct way to test the profile update API without
 * going through the normal application flow.
 *
 * Usage:
 * 1. Open browser console
 * 2. Copy the entire function below and paste it
 * 3. Call testDirectProfileUpdate()
 */

async function testDirectProfileUpdate() {
  // Configuration
  const API_URL = 'http://localhost:8080/api';
  const PROFILE_ENDPOINT = '/profile';

  try {
    console.log('------------------------------------------');
    console.log('STARTING DIRECT PROFILE UPDATE TEST');
    console.log('------------------------------------------');

    // 1. Get token from localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('ERROR: No access token found in localStorage');
      return;
    }

    console.log('✓ Token found in localStorage');
    console.log('Token preview:', token.substring(0, 20) + '...');

    // 2. Create test data with timestamp to verify update
    const timestamp = new Date().toISOString();
    const testData = {
      name: 'Test User ' + timestamp.substring(0, 10),
      bio: 'This is a test bio updated at ' + timestamp,
      preferredLocation: 'Test Location',
      phoneNumber: '0123456789',
    };

    console.log('✓ Test data created:', testData);

    // 3. Make direct fetch request
    console.log(
      'Making direct fetch PUT request to ' + API_URL + PROFILE_ENDPOINT
    );

    const response = await fetch(API_URL + PROFILE_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(testData),
    });

    console.log('✓ Response received');
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // 4. Parse response data
    let responseData;
    try {
      responseData = await response.json();
      console.log('✓ Response data:', responseData);
    } catch (parseError) {
      const text = await response.text();
      console.error('ERROR: Failed to parse response as JSON');
      console.log('Response text:', text);
      responseData = { error: 'Failed to parse response', text };
    }

    // 5. Verify the result
    if (response.ok) {
      console.log('------------------------------------------');
      console.log('✅ TEST SUCCESSFUL - Profile updated!');
      console.log('------------------------------------------');
    } else {
      console.log('------------------------------------------');
      console.log('❌ TEST FAILED - Profile update failed');
      console.log('------------------------------------------');
    }

    return {
      success: response.ok,
      status: response.status,
      data: responseData,
    };
  } catch (error) {
    console.error('------------------------------------------');
    console.error('❌ TEST ERROR:', error);
    console.error('------------------------------------------');
    return {
      success: false,
      error: error.message,
    };
  }
}

// If in browser environment, expose to window
if (typeof window !== 'undefined') {
  window.testDirectProfileUpdate = testDirectProfileUpdate;
  console.log('Direct Profile Test Utility loaded!');
  console.log('Call window.testDirectProfileUpdate() to run the test');
}

export default testDirectProfileUpdate;
