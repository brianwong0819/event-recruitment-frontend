/**
 * Simple Profile Test
 * This test uses XMLHttpRequest instead of fetch to test if that makes a difference
 * Copy and paste this entire code into your browser console and run xhrTestProfileUpdate()
 */

function xhrTestProfileUpdate() {
  console.log('======================================');
  console.log('STARTING XHR PROFILE UPDATE TEST');
  console.log('======================================');

  // Get token
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('No access token found!');
    return;
  }
  console.log('Token found:', token.substring(0, 20) + '...');

  // Create test data
  const data = {
    bio: 'XHR Test update ' + new Date().toISOString(),
    name: 'XHR Test ' + new Date().toISOString().substring(0, 10),
  };
  console.log('Test data:', data);

  // Create XHR request
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', 'http://localhost:8080/api/profile', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Authorization', token);

  // Add some logging
  console.log('XHR Created with headers:');
  console.log('- Content-Type: application/json');
  console.log('- Authorization: ' + token.substring(0, 20) + '...');

  // Set up response handler
  xhr.onreadystatechange = function () {
    console.log('XHR state change:', xhr.readyState);

    if (xhr.readyState === 4) {
      console.log('XHR Status:', xhr.status);
      console.log('XHR Response Text:', xhr.responseText);

      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('SUCCESS! Profile updated.');
        try {
          const response = JSON.parse(xhr.responseText);
          console.log('Parsed response:', response);
        } catch (e) {
          console.log('Could not parse response as JSON');
        }
      } else {
        console.error('FAILED! Status:', xhr.status);
      }
    }
  };

  // Log any errors
  xhr.onerror = function (e) {
    console.error('XHR ERROR:', e);
    console.error('This typically indicates a network or CORS issue');
  };

  // Send the request
  console.log('Sending XHR request...');
  xhr.send(JSON.stringify(data));
  console.log('XHR request sent');
}

// Expose to window in browser
if (typeof window !== 'undefined') {
  window.xhrTestProfileUpdate = xhrTestProfileUpdate;
  console.log('Simple XHR Profile Test loaded');
  console.log('Run window.xhrTestProfileUpdate() to test');
}

export default xhrTestProfileUpdate;
