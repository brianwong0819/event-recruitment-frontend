<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Profile Test Page</h1>
    <p>This is a simplified version to test Vue initialization</p>

    <button
      @click="activeSection = 'basic'"
      class="p-2 bg-blue-500 text-white rounded mr-2"
    >
      Basic
    </button>
    <button
      @click="activeSection = 'photos'"
      class="p-2 bg-blue-500 text-white rounded mr-2"
    >
      Photos
    </button>
    <button
      @click="activeSection = 'work'"
      class="p-2 bg-blue-500 text-white rounded"
    >
      Work
    </button>

    <div class="mt-4 p-4 border rounded">
      <p>Active Section: {{ activeSection }}</p>
    </div>

    <div
      v-if="activeSection === 'photos'"
      class="mt-4 p-4 border rounded bg-gray-100"
    >
      <h2 class="text-xl font-bold mb-2">Photos Section</h2>
      <p>Photos would be displayed here</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

// Basic state
const activeSection = ref('basic');

// Watch for section changes
watch(activeSection, (newValue, oldValue) => {
  console.log(`Section changed from ${oldValue} to ${newValue}`);
});

// Setup on component mount
onMounted(() => {
  console.log('ProfileTest component mounted');
  console.log('Initial section:', activeSection.value);
});
</script>
