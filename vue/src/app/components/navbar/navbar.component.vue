<script setup lang="ts" />

<template>
  <div class="th-navbar position-fixed top-0 start-0 end-0 bg-alt2 box-shadow">
    <div class="d-flex align-items-stretch justify-content-between top-nav">
      <div class="d-flex align-content-center">
        <slot name="left"></slot>
      </div>

      <div class="d-flex align-content-center">
        <slot name="center"></slot>
      </div>
      <div class="d-flex align-content-center">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
