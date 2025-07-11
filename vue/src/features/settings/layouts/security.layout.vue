<script setup lang="ts"></script>

<template>
  <div class="content-view-settings d-flex flex-column gap-3">
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold display-font">{{ $t('settings.security-privacy.contact.header') }}</h4>
        <p class="text-muted">{{ $t('settings.security-privacy.contact.sub-header') }}</p>
      </div>
      <div class="card d-flex flex-column mb">
        <div class="section">
          <div class="d-flex flex-column flex-sm-row gap-3 p-3">
            <div class="row-header">
              <h6 class="fw-bold">{{ $t('forms.email') }}</h6>
            </div>
            <slot name="update-email"></slot>
          </div>
        </div>
        <div class="section">
          <div class="d-flex flex-column flex-sm-row p-3 gap-3">
            <div class="row-header">
              <h6 class="fw-bold">{{ $t('forms.phone') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold display-font">{{ $t('settings.security-privacy.security.header') }}</h4>
        <p class="text-muted">
          {{ $t('settings.security-privacy.security.sub-header') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <div class="section">
          <div class="d-flex flex-column flex-sm-row gap-3 p-3">
            <div class="row-header">
              <h6 class="fw-bold">{{ $t('forms.password') }}</h6>
            </div>
            <slot name="update-password"></slot>
          </div>
        </div>
        <div class="section">
          <div class="d-flex flex-column flex-sm-row gap-3 p-3">
            <div class="row-header">
              <h6 class="fw-bold">{{ $t('forms.two-factor') }}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold display-font">
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
