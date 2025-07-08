import { iUser, UserDto } from './user.dto'

type credentials = { email: string; password: string }

interface IJWT {
  access_token: string
  iat: number
  exp: number
  user: iUser
}

class JWTDto {
  public readonly access_token: string
  public readonly iat: number
  public readonly exp: number
  public readonly user: UserDto

  constructor({ access_token, iat, exp, user }: IJWT) {
    this.access_token = access_token
    this.iat = iat
    this.exp = exp
    this.user = new UserDto(user)
  }
}

export { JWTDto }
export type { credentials, IJWT }
