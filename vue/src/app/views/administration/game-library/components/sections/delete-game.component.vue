<script lang="ts" setup>
import { GameDto } from '@/library/data/dto/games/game.dto'
import { GameLibraryService } from '../../service/game-library.service'
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '@/app/router/routes'

const router = useRouter()

const props = defineProps<{ game: GameDto }>()

const { remove } = GameLibraryService.games
</script>

<template>
  <div class="d-flex flex-column flex-sm-row gap-3 p-3">
    <div class="row-header">
      <h6 class="fw-bold">
        {{ $t('administration.game-library.games.single.delete.title') }}
      </h6>
    </div>

    <div class="d-flex align-items-center justify-content-sm-end flex-grow-1">
      <button
        class="btn btn-link fw-normal"
        type="button"
        @click="
          (_: MouseEvent) =>
            remove(props.game, (_: GameDto) => {
              router.push({ name: ROUTE_NAMES.ADMIN_GAMES_LIST })
            })
        "
      >
        {{ $t('actions.delete-game') }}
      </button>
    </div>
  </div>
</template>
