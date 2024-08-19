<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

type PropType = { title: string; routes: sub_navigation }
const props = defineProps<PropType>()
</script>

<template>
  <header class="settings-header p-3 pb-0">
    <h2 class="mb-1 fw-bold display-font text-truncate">{{ $t(props.title) }}</h2>
    <ul class="d-flex nav nav-underline">
      <li v-for="route of props.routes" class="nav-item">
        <RouterLink :to="{ name: route.name }" class="nav-link fw-400 text-light" activeClass="active">
          {{ $t(route.label) }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>

<style lang="scss">
@import '@/sass/variables/index';

header.settings-header {
  ul.nav {
    box-shadow: inset 0 calc(-1 * 1px) 0 rgba(255, 255, 255, 0.2);
    font-size: $font-size-5;
  }

  a.nav-link:hover,
  a.nav-link.active {
    color: $primary !important;
    font-weight: inherit;
  }
}
</style>
