<script setup lang="ts"></script>

<template>
  <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
    <div class="row-header">
      <h6 class="fw-bold">{{ $t('settings.profile.label') }}</h6>
    </div>

    <div class="d-flex flex-column flex-grow-1">
      <div class="row gy-2 align-items-start flex-grow-1">
        <div class="col-12 col-md-6 d-flex flex-column gap-1">
          <slot name="firstname"></slot>
          <small class="text-light-alt">
            {{ $t('forms.given-name') }}
          </small>
        </div>
        <div class="col-12 col-md-6 d-flex flex-column gap-1">
          <slot name="lastname"></slot>
          <small class="text-light-alt">
            {{ $t('forms.family-name') }}
          </small>
        </div>
      </div>
    </div>
  </div>

  <div class="section d-flex flex-column gap-3 flex-sm-row p-3">
    <div class="row-header">
      <h6 class="fw-bold">{{ $t('settings.security-privacy.label') }}</h6>
    </div>

    <div class="d-flex flex-column flex-grow-1">
      <div class="row gy-3 align-items-start flex-grow-1">
        <div class="col-12 d-flex flex-column gap-1">
          <slot name="email"></slot>
          <small class="text-light-alt">
            {{ $t('forms.email') }}
          </small>
        </div>
        <div class="col-12 d-flex flex-column gap-1">
          <slot name="role"></slot>
          <small class="text-light-alt">
            {{ $t('forms.role') }}
          </small>
        </div>
      </div>
    </div>
  </div>
  <div class="section bg-alt d-flex flex-row p-3 justify-content-end">
    <slot name="submit"></slot>
  </div>
</template>
