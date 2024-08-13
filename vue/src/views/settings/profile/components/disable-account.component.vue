<script setup lang="ts">
type PropType = {
  callback: (event?: MouseEvent) => void
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex flex-column flex-sm-row p-3">
    <div class="row-header pe-3 mb-2 mb-sm-0">
      <h6 class="fw-bold">Disable Your Testhub Account</h6>
    </div>
    <div class="d-flex align-items-center justify-content-sm-end flex-grow-1">
      <button class="btn btn-link fw-normal" type="button" v-on:click="props.callback">Disable Account</button>
    </div>
  </div>
</template>
