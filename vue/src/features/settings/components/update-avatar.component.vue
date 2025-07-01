<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

type proptype = {
  user: UserDto
  updateAvatar: () => void
  removeAvatar: () => void
}

const { user, updateAvatar, removeAvatar } = defineProps<proptype>()
</script>

<template>
  <div class="profile-picture-settings d-flex flex-column flex-sm-row p-3 gap-3 align-items-sm-center">
    <div class="d-flex row-header justify-content-center justify-content-sm-start">
      <img class="avatar-icon rounded-circle" :src="user?.profile.avatar" />
    </div>
    <div class="d-flex flex-column align-items-start flex-grow-1 gap-1">
      <div class="d-flex gap-2 flex-nowrap align-items-center">
        <div>
          <button class="btn btn-secondary px-2" type="button" @click="updateAvatar">
            {{ $t('actions.update-avatar') }}
          </button>
        </div>
        <div>
          <button class="btn btn-dark btn-icon px-0 fw-normal" type="button" @click="removeAvatar">
            <font-awesome-icon :icon="['fas', 'trash-can']" />
          </button>
        </div>
      </div>
      <p class="text-light-alt">{{ $t('forms.img-input-warning') }}</p>
    </div>
  </div>
</template>
