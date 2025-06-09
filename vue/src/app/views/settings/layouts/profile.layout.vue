<script setup lang="ts"></script>

<template>
  <div class="content-view-settings d-flex flex-column gap-3">
    <div class="d-flex flex-column gap-2">
      <h4 class="text-light fw-semibold">
        {{ $t('settings.profile.avatar.label') }}
      </h4>
      <div class="card d-flex flex-column">
        <slot name="profile-picture"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('settings.profile.profile-settings.header') }}
        </h4>
        <p class="text-muted fw-normal">{{ $t('settings.profile.profile-settings.sub-header') }}</p>
      </div>
      <div class="card d-flex flex-column">
        <slot name="update-profile"></slot>
      </div>
    </div>

    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('settings.profile.disable-account.header') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('settings.profile.disable-account.sub-header') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <div class="section">
          <slot name="disable-account"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
