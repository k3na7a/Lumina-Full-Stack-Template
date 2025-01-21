<script lang="ts" setup>
import { GameDto } from '@/library/data/dto/games/game.dto'
import UpdateCoverComponent from '../../components/sections/update-cover.component.vue'
import DeleteGameComponent from '../../components/sections/delete-game.component.vue'
import UpdateInfoComponent from '../../components/sections/update-info.component.vue'
import { ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { GameLibraryService } from '../../service/game-library.service'

const route: RouteLocationNormalizedLoaded = useRoute()

const { getSingle } = GameLibraryService.games

const selected_game = ref<GameDto>()
const loading = ref<boolean>(true)

async function getData(id: string): Promise<void> {
  loading.value = true
  await getSingle(id, (value: GameDto): void => {
    selected_game.value = value
  }).finally(() => {
    loading.value = false
  })
}

await getData(route.params.slug as string)
</script>

<template>
  <div class="d-flex flex-column gap-3 content-view-administration" v-if="selected_game">
    <div class="d-flex flex-column gap-2">
      <h4 class="text-light fw-semibold">
        {{ $t('administration.game-library.games.single.cover.title') }}
      </h4>
      <div class="card d-flex flex-column">
        <UpdateCoverComponent :game="selected_game" />
      </div>
    </div>
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.game-library.games.single.information.title') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.game-library.games.single.information.subtitle') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <UpdateInfoComponent :game="selected_game" />
      </div>
    </div>
    <div class="d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <h4 class="text-light fw-semibold">
          {{ $t('administration.game-library.games.single.delete.title') }}
        </h4>
        <p class="text-muted fw-normal">
          {{ $t('administration.game-library.games.single.delete.subtitle') }}
        </p>
      </div>
      <div class="card d-flex flex-column">
        <div class="section">
          <DeleteGameComponent :game="selected_game" />
        </div>
      </div>
    </div>
  </div>
</template>
