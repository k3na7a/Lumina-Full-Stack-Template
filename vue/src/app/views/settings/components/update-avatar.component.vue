<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ComputedRef } from 'vue'

import { AuthStore, useAuthStore } from '@/app/store/authentication.store'
import { UserDto } from '@/library/apis/localhost/dto/user.dto'
import { SettingsController } from '../controllers/settings.controller'

const { t } = useI18n()
const controller = new SettingsController(t)

const authStore: AuthStore = useAuthStore()

const user: ComputedRef<UserDto | undefined> = computed(() => authStore.authenticatedUser)
</script>

<template>
  <div class="profile-picture-settings d-flex flex-column flex-sm-row p-3 gap-3 align-items-sm-center">
    <div class="d-flex row-header justify-content-center justify-content-sm-start">
      <img class="avatar-icon rounded-circle" :src="user?.profile.avatar" />
    </div>
    <div class="d-flex flex-column align-items-start flex-grow-1 gap-1">
      <div class="d-flex gap-2 flex-nowrap align-items-center">
        <div>
          <button class="btn btn-secondary px-2" type="button" @click="controller.updateAvatar">
            {{ $t('actions.update-avatar') }}
          </button>
        </div>
        <div>
          <button class="btn btn-dark btn-icon px-0 fw-normal" type="button" @click="controller.removeAvatar">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </button>
        </div>
      </div>
      <p class="text-light-alt">{{ $t('forms.img-input-warning') }}</p>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/library/sass/variables/index';

.profile-picture-settings {
  img {
    width: 9.6rem;
    height: 9.6rem;
    object-fit: cover;
  }
}
</style>
