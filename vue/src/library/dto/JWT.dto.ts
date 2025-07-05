import { iUser, UserDto } from './user.dto'

type credentials = { email: string; password: string }

interface IJWT {
  refresh_token: string
  access_token: string
  iat: number
  exp: number
  user: iUser
}

class JWTDto {
  public readonly refresh_token: string
  public readonly access_token: string
  public readonly iat: number
  public readonly exp: number
  public readonly user: UserDto

  constructor({ refresh_token, access_token, iat, exp, user }: IJWT) {
    this.refresh_token = refresh_token
    this.access_token = access_token
    this.iat = iat
    this.exp = exp
    this.user = new UserDto(user)
  }
}

export { JWTDto }
export type { credentials, IJWT }
