<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { useSettingsHandler } from '../composables/settings.handler';

const { t } = useI18n()
const handler = useSettingsHandler(t)
</script>

<template>
  <div class="d-flex flex-column flex-sm-row gap-3 p-3">
    <div class="row-header">
      <h6 class="fw-bold">
        {{ $t('settings.profile.disable-account.form-header') }}
      </h6>
    </div>
    <div class="d-flex align-items-center justify-content-sm-end flex-grow-1">
      <button class="btn btn-link fw-normal" type="button" @click="handler.disableAccount">
        {{ $t('actions.disable-account') }}
      </button>
    </div>
  </div>
</template>
