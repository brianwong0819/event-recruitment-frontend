<template>
  <div class="confirm-trash-dialog" v-if="visible">
    <div class="dialog-overlay" @click="onCancel"></div>
    <div class="dialog-container">
      <div class="dialog-content">
        <!-- Header with warning icon -->
        <div class="dialog-header">
          <div class="warning-icon">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <h2 class="dialog-title">{{ title }}</h2>
          <button class="close-button" @click="onCancel">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="dialog-body">
          <p class="dialog-message">{{ message }}</p>
        </div>

        <!-- Footer with action buttons -->
        <div class="dialog-footer">
          <Button label="No" class="p-button-text" @click="onCancel" />
          <Button label="Yes" class="p-button-danger" @click="onConfirm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Button from 'primevue/button';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Confirm Action',
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed with this action?',
  },
});

const emit = defineEmits(['confirm', 'cancel', 'update:visible']);

const onConfirm = () => {
  emit('confirm');
  emit('update:visible', false);
};

const onCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<style scoped>
.confirm-trash-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
}

.dialog-container {
  position: relative;
  max-width: 450px;
  width: 90%;
  z-index: 1001;
}

.dialog-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: dialog-fade-in 0.2s ease-out;
}

@keyframes dialog-fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  position: relative;
  padding: 1.5rem 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.warning-icon {
  background-color: #fef2f2;
  color: #dc2626;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.warning-icon i {
  font-size: 2rem;
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  text-align: center;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.dialog-body {
  padding: 1rem 1.5rem;
  text-align: center;
}

.dialog-message {
  color: #4b5563;
  font-size: 1rem;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.dialog-footer {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

:deep(.p-button-danger) {
  background-color: #dc2626;
  border-color: #dc2626;
}

:deep(.p-button-danger:hover) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

:deep(.p-button-text) {
  color: #4b5563;
}

:deep(.p-button-text:hover) {
  background-color: #f3f4f6;
  color: #1f2937;
}

@media (max-width: 640px) {
  .dialog-container {
    width: 95%;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 0.5rem;
  }

  .dialog-footer button {
    width: 100%;
  }
}
</style>
