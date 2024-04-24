<script setup lang="ts" />

<template>
  <div id="navbar">
    <div id="top-nav">
      <slot name="left"></slot>

      <slot name="center"></slot>

      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/sass/utils/utils';

#navbar {
  & #top-nav {
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    padding: 0px map-get($content-spacing, desktop);

    height: map-get($header-config, height, desktop);

    & .nav {
      .active {
        border-color: $primary !important;
      }

      .btn-link {
        padding-top: 10px !important;
      }

      & .btn-link:hover,
      .btn-link:focus {
        border-color: transparent;
      }
    }
  }

  background-color: $backgroundLight;
  box-shadow: $boxShadow;

  position: fixed;
  z-index: map-get($header-config, z-index);

  min-width: $min-width;

  top: 0;
  right: 0;
  left: 0;
}
</style>
