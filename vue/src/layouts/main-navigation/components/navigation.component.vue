<script setup lang="ts">
import NavigationDropdown from '../../../components/dropdown/navigation-dropdown.component.vue'

type PropType = {
  path: string | undefined
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

  <div v-if="props.isAuthenticated" class="container px-2 d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <RouterLink :to="{ name: 'following' }" class="text-decoration-none" activeClass="text-primary">
        {{ $t('navigation.following') }}
      </RouterLink>
    </nav>
    <div class="highlight" :class="{ active: props.path == 'following' }"></div>
  </div>

  <div class="container px-2 d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <RouterLink :to="{ name: 'browse' }" class="text-decoration-none" activeClass="text-primary">
        {{ $t('navigation.browse') }}
      </RouterLink>
    </nav>
    <div class="highlight" :class="{ active: props.path == 'browse' }"></div>
  </div>

  <div class="container px-1 d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <NavigationDropdown />
    </nav>
  </div>
</template>

<style lang="scss">
@import '@/sass/variables/index';

.th-navbar {
  nav {
    margin-top: 2px;

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
    height: 2px;

    &.active {
      background-color: $primary;
    }
  }
}
</style>
