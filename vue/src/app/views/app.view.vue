<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <RouterView v-slot="{ Component }" :key="route.fullPath">
    <component :is="Component" />
  </RouterView>
</template>
