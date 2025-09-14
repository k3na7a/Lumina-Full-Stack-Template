import * as Yup from 'yup'
import { computed, ref } from 'vue'

import { GameDto, icreategame } from '@lib/dto/game.dto'
import { useFormUtil } from '@/core/utils/forms.util'
import { Order, PaginationOptions } from '@lib/dto/pagination.dto'
import { AppStore, useAppStore } from '@/core/store/app.store'
import { LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import { PlatformDto } from '@lib/dto/platform.dto'

type proptype = {
  game?: GameDto
  title: string
  callback: (values: icreategame) => Promise<void>
}

const platformOptions: PaginationOptions = {
  take: 25,
  order: Order.ASC,
  page: 1,
  sort: 'platform.name',
  search: undefined
}

function useGameForm({ game, callback }: proptype) {
  const validateUtil = useFormUtil()
  const loading = ref(false)

  const { getValidAccessToken }: AppStore = useAppStore()

  async function getPlatforms(options: PaginationOptions) {
    const accessToken = await getValidAccessToken()
    return LocalhostAPI.administration.platforms.getPaginated(options, accessToken as string)
  }

  const initialValues = computed(() => ({
    name: game?.name,
    slug: game?.slug,
    description: game?.description,
    release_date: game?.release_date,
    platforms: game?.platforms || [],
    cover: undefined
  }))

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    cover: Yup.mixed<File>().optional(),
    description: Yup.string().optional(),
    release_date: Yup.date().required(),
    slug: Yup.string().required(),
    platforms: Yup.array<PlatformDto>().optional()
  })

  const onSubmit = validateUtil.getSubmitFn(validationSchema, async (values: icreategame) => {
    loading.value = true
    await callback?.(values)
    loading.value = false
  })

  return {
    validationSchema,
    initialValues,
    onSubmit,
    loading,
    platformOptions,
    getPlatforms
  }
}

export type { proptype }
export { useGameForm }
