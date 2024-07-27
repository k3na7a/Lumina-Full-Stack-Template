<script setup lang="ts">
import NavigationDropdown from '../dropdowns/navigation.dropdown.vue'
import { more_navigation } from '@/library/config/more.navigation.config'

type PropType = {
  path: string | undefined
  isAuthenticated: boolean
  navigation_list: more_navigation
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex justify-content-center">
    <nav id="nav-logo" class="d-flex justify-content-center">
      <div class="align-content-center">
        <RouterLink :to="{ name: 'home' }">
          <img id="logo" src="/media/logo.svg" />
        </RouterLink>
      </div>
    </nav>
  </div>

  <div v-if="props.isAuthenticated" class="container d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <RouterLink :to="{ name: 'following' }" class="text-decoration-none" activeClass="text-primary">
        {{ $t('navigation.following') }}
      </RouterLink>
    </nav>
    <div class="highlight" :class="{ active: props.path == 'following' }"></div>
  </div>

  <div class="container d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <RouterLink :to="{ name: 'browse' }" class="text-decoration-none" activeClass="text-primary">
        {{ $t('navigation.browse') }}
      </RouterLink>
    </nav>
    <div class="highlight" :class="{ active: props.path == 'browse' }"></div>
  </div>

  <div class="container px-2 d-flex flex-column">
    <nav class="align-content-center flex-grow-1">
      <NavigationDropdown :navigation_list="$props.navigation_list" />
    </nav>
  </div>
</template>
