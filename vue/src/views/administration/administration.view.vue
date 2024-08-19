<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import { administration_navigation } from '@/config/administration-sub-navigation.config'

import SubNavigationLayout from '@/layouts/sub-navigation/sub-navigation.layout.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <SubNavigationLayout title="administration.label" :routes="administration_navigation">
    <template v-slot:content>
      <RouterView v-slot="{ Component }" :key="route.fullPath">
        <component :is="Component" />
      </RouterView>
    </template>
  </SubNavigationLayout>
</template>
