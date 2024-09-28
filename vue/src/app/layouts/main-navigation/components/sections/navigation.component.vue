<script setup lang="ts">
import NavigationDropdown from '@/app/layouts/main-navigation/components/dropdowns/navigation-dropdown.component.vue'
import { MAIN_NAVIGATION } from '@/app/layouts/main-navigation/schema/main-navigation.schema'
import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { computed, ComputedRef } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

const route: RouteLocationNormalizedLoaded = useRoute()
const authStore: AuthStore = useAuthStore()

const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.isAuthenticated)
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
      <template v-for="nav in MAIN_NAVIGATION" :key="nav.name">
        <div v-if="!nav.auth || isAuthenticated" class="m-nav d-flex flex-column">
          <nav class="align-content-center flex-grow-1">
            <RouterLink :to="{ name: nav.name }" class="text-decoration-none" activeClass="text-primary">
              <span class="d-none d-md-block">{{ $t(nav.label) }}</span>
              <span v-tooltip="{ text: $t(nav.label), position: 'bottom', trigger: 'hover' }" class="d-block d-md-none">
                <font-awesome-icon :icon="nav.icon" />
              </span>
            </RouterLink>
          </nav>
          <div class="highlight" :class="{ active: route.path.startsWith(`/${nav.name}`) }"></div>
        </div>
      </template>
      <div class="d-flex flex-column">
        <nav class="align-content-center flex-grow-1">
          <NavigationDropdown />
        </nav>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.th-navbar {
  .m-nav {
    nav {
      margin-top: 0.2rem;
    }
  }

  nav {
    a {
      font-family: $noto-sans;
      font-weight: 600;

      font-size: $font-size-5;

      color: $light;
      transition: color 0.15s ease-in-out;

      &:hover {
        color: $primary;
      }
    }
  }

  nav.nav-logo {
    width: map-get($header-config, height, desktop);

    img.logo {
      width: 3rem;
    }
  }

  div.highlight {
    height: 0.2rem;

    &.active {
      background-color: $primary;
    }
  }
}
</style>
