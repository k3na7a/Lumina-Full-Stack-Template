<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import RenderedView from '@/shared/components/page/page.component.vue'
import SubNavigationLayout from '@/shared/components/navigation/sub-navigation.layout.vue'

import { options } from './config/navigation.config'

const $route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.user-management.header" :routes="options">
    <template #content>
      <RenderedView :key="$route.path" />
    </template>
  </SubNavigationLayout>
</template>
