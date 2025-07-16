<script setup lang="ts" />
<template>
  <div class="d-flex flex-column gap-3">
    <slot name="title"></slot>

    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.name') }}</h6>
      <div class="row gy-3 align-items-start flex-grow-1">
        <div class="col-12 col-sm-6 d-flex flex-column gap-1">
          <slot name="firstname"></slot>
          <small>{{ $t('forms.given-name') }}</small>
        </div>
        <div class="col-12 col-sm-6 d-flex flex-column gap-1">
          <slot name="lastname"></slot>
          <small>{{ $t('forms.family-name') }}</small>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.email') }}</h6>
      <slot name="email"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.role') }}</h6>
      <slot name="role"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.roles') }}</h6>
      <slot name="roles"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <h6 class="fw-semibold">{{ $t('forms.profile-picture') }}</h6>
      <slot name="profile-picture"></slot>
    </div>
    <div class="d-flex flex-column gap-1">
      <slot name="checkbox"></slot>
    </div>
    <div class="d-grid">
      <slot name="submit"></slot>
    </div>
  </div>
</template>
