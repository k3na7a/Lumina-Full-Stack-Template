type actions = Array<{
  key: string
  children: Array<{
    title: string
    icon: string[]
    disabled?: boolean
    callback: Function
  }>
}>

export type { actions }
