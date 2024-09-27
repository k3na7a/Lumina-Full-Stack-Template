<script setup lang="ts">
const props = defineProps<{ theme: 'primary' | 'secondary' }>()
</script>

<template>
  <div class="badge-custom px-2 d-flex align-items-center text-nowrap" :class="props.theme">
    <small class="fw-bold text-truncate">
      <slot></slot>
    </small>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.badge-custom {
  height: 2.5rem;
  border-radius: 0.25rem;

  &.primary {
    background-color: color-mix(in srgb, $primary 50%, transparent);
    color: $light;
  }

  &.secondary {
    background-color: $secondary;
    color: $lightAlt;
  }
}
</style>
