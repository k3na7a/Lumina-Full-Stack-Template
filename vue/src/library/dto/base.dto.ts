class BaseDto {
  public readonly id: string
  public readonly createdAt: Date
  public readonly updatedAt: Date

  constructor({ id, createdAt, updatedAt }: BaseDto) {
    this.id = id
    this.createdAt = new Date(createdAt)
    this.updatedAt = new Date(updatedAt)
  }
}

export { BaseDto }
