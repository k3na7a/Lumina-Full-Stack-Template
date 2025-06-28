interface RequestConfig {
  content?: string
  token?: string | null
  params?: Record<string, any>
  data?: Record<string, any>
}

export type { RequestConfig }
