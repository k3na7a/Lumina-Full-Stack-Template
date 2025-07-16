<script setup lang="ts" />
<template>
  <div class="d-flex flex-column gap-3">
    <slot name="title"></slot>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.label') }}</h6>
      <slot name="label"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.description') }}</h6>
      <slot name="description"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.domain') }}</h6>
      <slot name="domain"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.name') }}</h6>
      <slot name="name"></slot>
    </div>
    <div class="d-grid">
      <slot name="submit"></slot>
    </div>
  </div>
</template>
