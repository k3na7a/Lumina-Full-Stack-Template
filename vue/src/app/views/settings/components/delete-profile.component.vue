<script setup lang="ts">
type PropType = {
  callback: (event?: MouseEvent) => void
}

const props = defineProps<PropType>()
</script>

<template>
  <div class="d-flex flex-column mb-2">
    <h4 class="text-light fw-semibold">Disabling Your Testhub Account</h4>
    <p class="text-muted fw-normal">Completely deactivate your account</p>
  </div>

  <div class="card d-flex flex-column">
    <div class="section d-flex flex-row p-3">
      <div class="row-header pe-3">
        <h6 class="fw-bold">Disable Your Testhub Account</h6>
      </div>
      <div class="d-flex align-items-center justify-content-end flex-grow-1">
        <button class="btn btn-link text-primary px-2" type="button" v-on:click="props.callback">
          Disable Account
        </button>
      </div>
    </div>
  </div>
</template>
