import * as Yup from 'yup'

import { PlatformDto } from '@/library/dto/platform.dto'
import { GameDto, icreategame } from '@/library/dto/game.dto'
import { useFormUtil } from '@/core/utils/forms.util'
import { computed, ref } from 'vue'

type proptype = {
  game?: GameDto
  callback: (values: icreategame) => Promise<void>
}

function useGameForm({ game, callback }: proptype) {
  const validateUtil = useFormUtil()
  const loading = ref(false)

  const initialValues = computed(() => ({
    name: game?.name,
    slug: game?.slug,
    description: game?.description,
    release_date: game?.release_date,
    platforms: game?.platforms,
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
    loading
  }
}

export type { proptype }
export { useGameForm }
