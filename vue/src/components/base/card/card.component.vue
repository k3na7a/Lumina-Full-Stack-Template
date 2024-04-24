<script setup lang="ts" />

<template>
  <div id="card" class="card p-2 text-light">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '@/assets/sass/utils/utils';

#card {
  border-radius: 0px;
  background-color: $backgroundLight;
}
</style>
