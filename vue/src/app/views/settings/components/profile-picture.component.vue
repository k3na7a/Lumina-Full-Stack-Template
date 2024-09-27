<script setup lang="ts">
import { UserDto } from '@/library/dto/user.dto'

const props = defineProps<{ user: UserDto; callback: (event: MouseEvent) => void }>()
</script>

<template>
  <div class="profile-picture-settings d-flex flex-column flex-sm-row p-3 align-items-sm-center">
    <div class="d-flex row-header justify-content-center justify-content-sm-start mb-3 mb-sm-0">
      <img class="avatar-icon rounded-circle" :src="props.user.profile.avatar" />
    </div>
    <div class="d-flex flex-column align-items-start flex-grow-1">
      <div class="d-flex row gx-2 align-items-center mb-1">
        <div class="col">
          <button class="btn btn-secondary px-2" type="button" v-on:click="props.callback">
            {{ $t('actions.update-avatar') }}
          </button>
        </div>
        <div class="col">
          <button class="btn btn-dark btn-icon px-0 fw-normal" type="button">
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
