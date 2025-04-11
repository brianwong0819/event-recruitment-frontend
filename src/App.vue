<template>
  <Toast />
  <router-view />
</template>

<script setup>
// Root component
</script>

<style>
/* Global Toast Styling */
.p-toast {
  opacity: 1 !important;
}

/* Reset all toast colors to defaults */
.p-toast-message {
  background: white !important;
  color: #495057 !important;
  border: none !important;
  border-width: 0 !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

/* Success Toast - Override all properties */
.p-toast-message-success {
  background-color: #ecfdf5 !important;
  border-left: 6px solid #10b981 !important;
}
.p-toast-message-success .p-toast-message-content {
  color: #065f46 !important;
}
.p-toast-message-success .p-toast-message-content .p-toast-message-icon {
  color: #10b981 !important;
}
.p-toast-message-success .p-toast-message-content .p-toast-summary {
  color: #065f46 !important;
  font-weight: 600 !important;
}
.p-toast-message-success .p-toast-message-content .p-toast-detail {
  color: #065f46 !important;
}
.p-toast-message-success .p-toast-icon-close {
  color: #065f46 !important;
}

/* Info Toast */
.p-toast-message-info {
  background-color: #eff6ff !important;
  border-left: 6px solid #3b82f6 !important;
}
.p-toast-message-info .p-toast-message-content {
  color: #1e40af !important;
}
.p-toast-message-info .p-toast-message-content .p-toast-message-icon {
  color: #3b82f6 !important;
}
.p-toast-message-info .p-toast-message-content .p-toast-summary {
  color: #1e40af !important;
  font-weight: 600 !important;
}
.p-toast-message-info .p-toast-message-content .p-toast-detail {
  color: #1e40af !important;
}
.p-toast-message-info .p-toast-icon-close {
  color: #1e40af !important;
}

/* Warning Toast */
.p-toast-message-warn {
  background-color: #fffbeb !important;
  border-left: 6px solid #f59e0b !important;
}
.p-toast-message-warn .p-toast-message-content {
  color: #92400e !important;
}
.p-toast-message-warn .p-toast-message-content .p-toast-message-icon {
  color: #f59e0b !important;
}
.p-toast-message-warn .p-toast-message-content .p-toast-summary {
  color: #92400e !important;
  font-weight: 600 !important;
}
.p-toast-message-warn .p-toast-message-content .p-toast-detail {
  color: #92400e !important;
}
.p-toast-message-warn .p-toast-icon-close {
  color: #92400e !important;
}

/* Error Toast */
.p-toast-message-error {
  background-color: #fef2f2 !important;
  border-left: 6px solid #ef4444 !important;
}
.p-toast-message-error .p-toast-message-content {
  color: #991b1b !important;
}
.p-toast-message-error .p-toast-message-content .p-toast-message-icon {
  color: #ef4444 !important;
}
.p-toast-message-error .p-toast-message-content .p-toast-summary {
  color: #991b1b !important;
  font-weight: 600 !important;
}
.p-toast-message-error .p-toast-message-content .p-toast-detail {
  color: #991b1b !important;
}
.p-toast-message-error .p-toast-icon-close {
  color: #991b1b !important;
}

/* General toast styling */
.p-toast-message .p-toast-message-content .p-toast-summary {
  margin-bottom: 0.25rem !important;
}
.p-toast-message .p-toast-message-content .p-toast-detail {
  margin: 0 !important;
  font-size: 0.875rem !important;
}
.p-toast-icon-close {
  opacity: 0.7 !important;
}
.p-toast-icon-close:hover {
  opacity: 1 !important;
}
</style>
