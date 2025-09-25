<script setup lang="ts" />
<template>
  <div class="d-flex flex-column gap-3">
    <slot name="title"></slot>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.details') }}</h6>
      <div>
        <slot name="info"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.before') }}</h6>
      <div>
        <slot name="before"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.after') }}</h6>
      <div>
        <slot name="after"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.changes') }}</h6>
      <div>
        <slot name="diff"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.metadata') }}</h6>
      <div>
        <slot name="metadata"></slot>
      </div>
    </div>
  </div>
</template>
