<script setup lang="ts">
import { useRoute } from 'vue-router'

import ToastComponent from '@/components/toast/toast.component.vue'

const route = useRoute()
</script>

<template>
  <RouterView :key="route.fullPath" />
  <ToastComponent />
</template>
