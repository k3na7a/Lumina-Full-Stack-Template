<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import NavigationDropdown from '@/shared/components/dropdown/navigation-dropdown.component.vue'

import { nav as Navigation } from '../types/navigation.type'

type props = {
  isAuthenticated: boolean
  navigation: Navigation[]
}

const $route: RouteLocationNormalizedLoaded = useRoute()

const { isAuthenticated, navigation } = defineProps<props>()
</script>

<template>
  <div class="d-flex gap-2">
    <div class="d-flex justify-content-center">
      <nav class="nav-logo d-flex justify-content-center">
        <div class="align-content-center">
          <RouterLink :to="{ name: 'home' }">
            <img class="logo border-radius" src="/vue.svg" />
          </RouterLink>
        </div>
      </nav>
    </div>

    <div class="d-flex gap-3">
      <template v-for="nav in navigation" :key="nav.name">
        <div v-if="!nav.auth || isAuthenticated" class="m-nav d-flex flex-column">
          <nav class="align-content-center flex-grow-1">
            <RouterLink :to="{ name: nav.name }" class="text-decoration-none" activeClass="text-primary">
              <span class="d-none d-md-block">{{ $t(nav.label) }}</span>
              <span v-tooltip="{ text: $t(nav.label), position: 'bottom', trigger: 'hover' }" class="d-block d-md-none">
                <font-awesome-icon :icon="nav.icon" />
              </span>
            </RouterLink>
          </nav>
          <div class="highlight" :class="{ active: $route.path.startsWith(`/${nav.name}`) }"></div>
        </div>
      </template>
      <div class="d-flex flex-column">
        <nav class="align-content-center flex-grow-1">
          <NavigationDropdown :navigation="[]" />
        </nav>
      </div>
    </div>
  </div>
</template>
