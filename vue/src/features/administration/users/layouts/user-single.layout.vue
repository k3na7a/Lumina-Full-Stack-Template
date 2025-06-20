<script setup lang="ts"></script>

<template>
  <div class="d-flex flex-column gap-3">
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.users.single.account-details.title') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.users.single.account-details.subtitle') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <slot name="update-profile"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.users.single.avatar.title') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.users.single.avatar.subtitle') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <slot name="update-avatar"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.users.single.delete-account.title') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.users.single.delete-account.subtitle') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <slot name="disable-account"></slot>
      </div>
    </div>
  </div>
</template>
