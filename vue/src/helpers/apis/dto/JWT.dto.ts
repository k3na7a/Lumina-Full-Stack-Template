interface IJWT {
  token: string
  timestamp: number
}

export class JWTDto {
  public readonly token: string
  public readonly timestamp: number

  constructor({ token, timestamp }: IJWT) {
    this.token = token
    this.timestamp = timestamp
  }
}
