// Profile API Test Script

/**
 * This is a simple test script to verify the profile update API endpoint.
 *
 * To use:
 * 1. Make sure you have a valid JWT token in localStorage
 * 2. Open browser console
 * 3. Copy and paste this script
 * 4. Check console output for results
 */

// Configuration
const API_URL = 'http://localhost:8080/api';
const PROFILE_ENDPOINT = '/profile';

async function testProfileUpdate() {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('No access token found in localStorage!');
      return;
    }

    console.log('Token found:', token.substring(0, 20) + '...');

    // Create test profile data
    const updateData = {
      name: 'Test User Update ' + new Date().toISOString().slice(0, 10),
      phoneNumber: '0123456789',
      preferredLocation: 'Kuala Lumpur, Malaysia',
      bio: 'This is a test bio update ' + new Date().toTimeString(),
      gender: 'MALE',
      race: 'OTHER',
      employmentStatus: 'STUDENT',
      languages: ['ENGLISH', 'MALAY'],
      dateOfBirth: '1995-01-01',
    };

    console.log('Sending update data:', updateData);

    // Make a PUT request to update profile
    const response = await fetch(`${API_URL}${PROFILE_ENDPOINT}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(updateData),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Success! Profile updated:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.error('Error updating profile:', response.status, errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Exception during profile update test:', error);
    return { success: false, error };
  }
}

// Execute the test
console.log('Starting profile update test...');
testProfileUpdate().then((result) => {
  console.log(
    'Test completed with result:',
    result.success ? 'SUCCESS' : 'FAILURE'
  );
});
