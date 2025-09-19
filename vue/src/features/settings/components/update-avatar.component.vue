<script setup lang="ts">
import { UserDto } from '@lib/dto/user.dto'

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
      <img :key="user?.profile.avatar" class="avatar-icon" :src="user?.profile.avatar" />
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

{
  "path":"/api/settings/profile/update",
  "method":"PATCH",
  "headers":{
    "host":"localhost:3000","connection":"keep-alive","content-length":"48","sec-ch-ua-platform":"\"Windows\"","authorization":"[REDACTED]","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36","accept":"application/json, text/plain, */*","sec-ch-ua":"\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"","content-type":"application/json","sec-ch-ua-mobile":"?0","origin":"https://localhost:8080","sec-fetch-site":"same-site","sec-fetch-mode":"cors","sec-fetch-dest":"empty","referer":"https://localhost:8080/","accept-encoding":"gzip, deflate, br, zstd","accept-language":"en-US,en;q=0.9"}}