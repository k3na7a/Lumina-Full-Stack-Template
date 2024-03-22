interface User {
  $id: string
  email: string
}

export class UserDto {
  public readonly $id: string
  public readonly email: string

  constructor(user: User) {
    this.$id = user.$id
    this.email = user.email
  }
}
