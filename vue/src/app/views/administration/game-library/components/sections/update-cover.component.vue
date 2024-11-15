<script setup lang="ts">
import { GameDto } from '@/library/data/dto/games/game.dto'
import { GameLibraryService } from '../../service/game-library.service'
import { ref } from 'vue'

const { updateCover } = GameLibraryService.games

const props = defineProps<{ game: GameDto }>()

const game = ref<GameDto>(props.game)
</script>

<template>
  <div class="d-flex flex-column flex-sm-row p-3 gap-3 align-items-sm-center">
    <div class="d-flex row-header justify-content-center justify-content-sm-start">
      <img class="avatar-icon" style="width: auto; height: 15rem; object-fit: cover" :src="game.cover" />
    </div>
    <div class="d-flex flex-column align-items-start flex-grow-1 gap-1">
      <div class="d-flex gap-2 flex-nowrap align-items-center">
        <button
          class="btn btn-secondary px-2"
          type="button"
          @click="() => updateCover(game, (res: GameDto) => {
            game = res
          })"
        >
          {{ $t('actions.update-cover') }}
        </button>
        <button class="btn btn-dark btn-icon px-0 fw-normal" type="button">
          <font-awesome-icon :icon="['fas', 'trash-can']" />
        </button>
      </div>
      <p class="text-light-alt">{{ $t('forms.img-input-warning') }}</p>
    </div>
  </div>
</template>
