class BaseDto {
  public readonly id: string
  public readonly createdAt: Date
  public readonly updatedAt: Date

  constructor({ id, createdAt, updatedAt }: BaseDto) {
    this.id = id
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}

export { BaseDto }
