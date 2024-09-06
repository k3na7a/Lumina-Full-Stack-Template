<script setup lang="ts">
import NavigationDropdown from '@/components/dropdown/navigation-dropdown.component.vue'
import { MAIN_NAVIGATION } from '@/config/main-navigation.config'
import { RouteLocationNormalizedLoaded } from 'vue-router'

type PropType = {
  path: string | undefined
  route: RouteLocationNormalizedLoaded
  isAuthenticated: boolean
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex justify-content-center">
    <nav class="nav-logo d-flex justify-content-center">
      <div class="align-content-center">
        <RouterLink :to="{ name: 'home' }">
          <img class="logo border-radius" src="/media/logo.svg" />
        </RouterLink>
      </div>
    </nav>
  </div>

  <template v-for="nav in MAIN_NAVIGATION">
    <div v-if="!nav.auth || props.isAuthenticated" class="m-nav container px-2 d-flex flex-column">
      <nav class="align-content-center flex-grow-1">
        <RouterLink :to="{ name: nav.name }" class="text-decoration-none" activeClass="text-primary">
          <span class="d-none d-md-block">{{ $t(nav.label) }}</span>
          <span v-tooltip="{ text: $t(nav.label), position: 'bottom' }" class="d-block d-md-none">
            <font-awesome-icon :icon="nav.icon" />
          </span>
        </RouterLink>
      </nav>
      <div class="highlight" :class="{ active: route.path.startsWith(`/${nav.name}`) }"></div>
    </div>
  </template>

  <div class="container px-1 d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <NavigationDropdown />
    </nav>
  </div>
</template>

<style lang="scss">
@import '@/sass/variables/index';

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
