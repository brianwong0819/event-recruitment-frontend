const fs = require('fs');
const path = require('path');

// Read the original file
const filePath = path.join(__dirname, 'Profile.vue');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the duplicate code at the end of the script section
// The pattern is after loadExperiencesAndAvailability function but before </script>
const duplicateCodePattern =
  /\/\/ Sidebar state\s*const sidebarOpen = ref\(false\);\s*\/\/ Toggle sidebar\s*const toggleSidebar = \(\) => {\s*sidebarOpen\.value = !sidebarOpen\.value;\s*};/;

// Replace the duplicate code with nothing
const fixedContent = content.replace(duplicateCodePattern, '');

// Write the fixed content back to a new file
const fixedFilePath = path.join(__dirname, 'Profile.fixed.vue');
fs.writeFileSync(fixedFilePath, fixedContent, 'utf8');

console.log('Fixed file created at:', fixedFilePath);
