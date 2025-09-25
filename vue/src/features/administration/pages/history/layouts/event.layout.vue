<script setup lang="ts" />
<template>
  <div class="d-flex flex-column gap-3">
    <slot name="title"></slot>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('DIFF') }}</h6>
      <div>
        <slot name="diff"></slot>
      </div>
    </div>
  </div>
</template>
