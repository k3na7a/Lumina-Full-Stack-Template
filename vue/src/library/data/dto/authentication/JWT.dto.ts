import { iUser, UserDto } from "../user/user.dto";

type credentials = { email: string; password: string }

interface IJWT {
  token: string
  iat: number
  exp: number
  user: iUser
}

class JWTDto {
  public readonly token: string
  public readonly iat: number
  public readonly exp: number
  public readonly user: UserDto

  constructor({ token, iat, exp, user }: IJWT) {
    this.token = token
    this.iat = iat
    this.exp = exp
    this.user = new UserDto(user)
  }
}

export { JWTDto }
export type { credentials }
