<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'

import NavbarComponent from '@/components/navbar/navbar.component.vue'
import LanguagesDropdown from '@/components/dropdown/languages-dropdown.component.vue'

const route: RouteLocationNormalizedLoaded = useRoute()
</script>

<template>
  <NavbarComponent>
    <template v-slot:left>
      <div class="d-flex justify-content-center">
        <nav class="nav-logo d-flex justify-content-center">
          <div class="align-content-center">
            <RouterLink :to="{ name: 'home' }">
              <img class="logo border-radius" src="/media/logo.svg" />
            </RouterLink>
          </div>
        </nav>
      </div>
    </template>
    <template v-slot:right>
      <div class="d-flex me-2">
        <nav class="align-content-center flex-grow-1 px-1">
          <LanguagesDropdown />
        </nav>
      </div>
    </template>
  </NavbarComponent>

  <div class="content-wrapper d-flex flex-column flex-grow-1 overflow-auto">
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <component :is="Component" />
    </RouterView>
  </div>
</template>

<style lang="scss">
@import '@/sass/variables/index';

.th-navbar {
  z-index: map-get($header-config, z-index);

  .top-nav {
    height: map-get($header-config, height, desktop);
  }
}
</style>

<style lang="scss">
@import '@/sass/variables/index';

.th-navbar {
  nav {
    margin-top: 2px;
  }

  nav.nav-logo {
    width: map-get($header-config, height, desktop);

    img.logo {
      width: 3rem;
    }
  }
}
</style>
