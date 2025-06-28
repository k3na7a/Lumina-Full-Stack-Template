<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import SubNavigationLayout from '@/shared/components/top-nav/sub-navigation.layout.vue'
import RenderedView from '@/shared/components/page/page.component.vue'

import { options } from './config/settings-navigation.config'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="settings.title" subtitle="settings.subtitle" :routes="options">
    <template #content>
      <RenderedView :key="$route.path" />
    </template>
  </SubNavigationLayout>
</template>
