<script setup lang="ts">
import { sub_navigation } from '@/library/types/sub-navigation.type'

const props = defineProps<{ title: string; routes: sub_navigation }>()
</script>

<template>
  <header class="settings-header p-3 pb-0">
    <h2 class="mb-1 fw-bold display-font text-truncate">
      {{ $t(props.title) }}
    </h2>
    <ul class="d-flex nav nav-underline">
      <li v-for="route of props.routes" class="nav-item">
        <RouterLink :to="{ name: route.name }" class="nav-link fw-semibold text-light" activeClass="active">
          {{ $t(route.label) }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

header.settings-header {
  ul.nav {
    box-shadow: inset 0 calc(-1 * 0.1rem) 0 rgba(255, 255, 255, 0.2);
    font-size: $font-size-5;
    column-gap: 2rem;
    row-gap: 0.5rem;
  }

  a.nav-link {
    font-weight: inherit;
    border-bottom: 0.2rem solid transparent;

    &:hover,
    &.active {
      color: $primary !important;
      font-weight: inherit;
    }

    &:hover:not(.active),
    &:focus:not(.active) {
      border-color: transparent;
    }
  }
}
</style>
