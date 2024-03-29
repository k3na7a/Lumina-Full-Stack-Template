import { IUser, UserDto } from './user.dto'

interface IJWT {
  token: string
  iat: number
  exp: number
  user: IUser
}

export class JWTDto {
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
