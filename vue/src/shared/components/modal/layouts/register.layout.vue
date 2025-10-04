<script setup lang="ts">
import { ROUTE_NAMES } from '@lib/enums/route-names.enum'
import ModalTitleComponent from '@/shared/components/modal/base/modal-title.component.vue'
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <ModalTitleComponent :title="$t('authentication.register.modal-title')" />
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

    <div class="d-flex flex-column">
      <div class="row gap-3">
        <div class="col-12">
          <slot name="email"></slot>
        </div>
        <div class="col-12 d-flex flex-column gap-1">
          <slot name="new-password"></slot>
          <div class="d-flex flex-column">
            <small>{{ $t('authentication.password-validation.label') }}</small>
            <ul class="mb-0" style="list-style-type: circle">
              <template v-for="idx in 4" :key="idx">
                <li>
                  <small>{{ $t(`authentication.password-validation.contains.${idx}`) }}</small>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column text-muted">
      <i18n-t keypath="legal.term" tag="p" scope="global">
        <RouterLink target="_blank" :to="{ name: ROUTE_NAMES.HOME }" class="link-underline link-offset-2">
          {{ $t('legal.terms-of-service') }}
        </RouterLink>
        <RouterLink target="_blank" :to="{ name: ROUTE_NAMES.HOME }" class="link-underline link-offset-2">
          {{ $t('legal.privacy-notice') }}
        </RouterLink>
      </i18n-t>
    </div>

    <div class="d-grid">
      <slot name="submit"></slot>
    </div>
  </div>
</template>
