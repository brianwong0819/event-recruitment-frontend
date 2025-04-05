<template>
    <div class="w-full mb-8">
      <div class="bg-gray-100 rounded-lg flex p-1">
        <button 
          @click="$emit('update:modelValue', 'candidate')" 
          class="flex-1 py-2 rounded-md text-center transition-all"
          :class="modelValue === 'candidate' 
            ? 'bg-white shadow-sm text-primary-700 font-medium' 
            : 'text-gray-600 hover:text-gray-800'"
        >
          Candidate
        </button>
        <button 
          @click="$emit('update:modelValue', 'recruiter')" 
          class="flex-1 py-2 rounded-md text-center transition-all"
          :class="modelValue === 'recruiter' 
            ? 'bg-white shadow-sm text-primary-700 font-medium' 
            : 'text-gray-600 hover:text-gray-800'"
        >
          Recruiter
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: {
      type: String,
      required: true
    }
  });
  
  defineEmits(['update:modelValue']);
  </script>