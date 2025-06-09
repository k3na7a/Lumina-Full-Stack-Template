<script setup lang="ts"></script>

<template>
  <div class="d-flex flex-column gap-2">
    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.user.account-details.title') }}
      </h4>
      <p class="text-muted fw-normal">
        {{ $t('administration.user.account-details.subtitle') }}
      </p>
    </div>
    <div class="card d-flex flex-column">
      <slot name="update-profile"></slot>
    </div>

    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.user.avatar.title') }}
      </h4>
      <p class="text-muted fw-normal">
        {{ $t('administration.user.avatar.subtitle') }}
      </p>
    </div>

    <div class="card d-flex flex-column">
      <slot name="update-avatar"></slot>
    </div>

    <div class="d-flex flex-column">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.user.delete-account.title') }}
      </h4>
      <p class="text-muted fw-normal">
        {{ $t('administration.user.delete-account.subtitle') }}
      </p>
    </div>

    <div class="card d-flex flex-column">
      <slot name="disable-account"></slot>
    </div>
  </div>
</template>
