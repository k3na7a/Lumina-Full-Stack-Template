import { iUser, UserDto } from './user.dto'

type credentials = { email: string; password: string }

interface ICSRF {
  token: string
  iat: number
  exp: number
}

class CsrfDto {
  public readonly token: string
  public readonly iat: number
  public readonly exp: number

  constructor({ token, iat, exp }: ICSRF) {
    this.token = token
    this.iat = iat
    this.exp = exp
  }
}

interface IJWT {
  refresh: number
  access_token: string
  iat: number
  exp: number
  user: iUser
}

class JWTDto {
  public readonly refresh: number
  public readonly access_token: string
  public readonly iat: number
  public readonly exp: number
  public readonly user: UserDto

  constructor({ access_token, iat, exp, refresh, user }: IJWT) {
    this.refresh = refresh
    this.access_token = access_token
    this.iat = iat
    this.exp = exp
    this.user = new UserDto(user)
  }
}

export { JWTDto, CsrfDto }
export type { credentials, IJWT, ICSRF }
