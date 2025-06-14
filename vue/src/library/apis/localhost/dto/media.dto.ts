interface iImage {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
  readonly filename: string
  readonly uri: string
  readonly mimetype: string
  readonly size: number
  readonly width: number
  readonly height: number
  readonly altText: string
}

export type { iImage }
