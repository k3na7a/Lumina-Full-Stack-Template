type UpdatePassword = {
  old_password: string
  new_password: string
  confirm_new_password: string
}
type UpdateEmail = { password: string; new_email: string; confirm_new_email: string }
type ResetPassword = { token: string; new_password: string; confirm_password: string }
type ForgotPassword = { email: string }

export interface IUser {
  readonly $id: string
  readonly email: string
  readonly role: Role
  readonly profile: Profile
}

export interface Profile {
  readonly name: Name
}

export interface Name {
  readonly first: string
  readonly last: string
}

export enum Role {
  USER = 'user',
  ADMIN = 'administrator'
}

export class UserDto {
  public readonly $id: string
  public readonly email: string
  public readonly role: Role
  public readonly profile: Profile

  public getFullName(): string {
    return [this.profile.name.first, this.profile.name.last].join(' ')
  }

  constructor(user: IUser) {
    this.$id = user.$id
    this.email = user.email
    this.role = user.role
    this.profile = user.profile
  }
}

export type { UpdateEmail, UpdatePassword, ResetPassword, ForgotPassword }
