<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { settings_navigation } from '@/config/settings-sub-navigation.config'

import SubNavigationLayout from '@/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.settings.label" :routes="settings_navigation">
    <template v-slot:content>
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
