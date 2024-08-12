<script setup lang="ts"></script>

<template>
  <header class="settings-header p-3 pb-0">
    <h2 class="mb-1 fw-bold display-font">Settings</h2>
    <ul class="nav nav-underline">
      <li class="nav-item">
        <RouterLink :to="{ name: 'profile' }" class="nav-link fw-400 text-light" activeClass="active">
          {{ $t('settings.profile.label') }}
        </RouterLink>
      </li>
      <li class="nav-item">
        <RouterLink :to="{ name: 'following' }" class="nav-link fw-400 text-light" activeClass="active">
          {{ $t('Security and Privacy') }}
        </RouterLink>
      </li>
    </ul>
  </header>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

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
