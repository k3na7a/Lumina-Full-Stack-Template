type UpdatePassword = {
  current_password: string
  password: string
  confirm_password: string
}
type UpdateEmail = { password: string; email: string; confirm_email: string }
type ResetPassword = { new_password: string; confirm_password: string }
type ForgotPassword = { email: string }
type DeleteAccount = { password: string }
type UpdateProfile = { firstname: string; lastname: string }
type Register = { firstname: string; lastname: string; email: string; password: string }

export class ResetPasswordDto {
  public readonly token: string
  public readonly new_password: string
  public readonly confirm_password: string

  constructor({ new_password, confirm_password }: ResetPassword, token: string) {
    this.token = token
    this.new_password = new_password
    this.confirm_password = confirm_password
  }
}

export class ForgotPasswordDto {
  public readonly email: string

  constructor(payload: ForgotPassword) {
    this.email = payload.email
  }
}

export class RegisterDto {
  public readonly email: string
  public readonly password: string
  public readonly profile: UpdateProfileDto

  constructor(payload: Register) {
    this.email = payload.email
    this.password = payload.password
    this.profile = new UpdateProfileDto({
      firstname: payload.firstname,
      lastname: payload.lastname
    })
  }
}

export class UpdateProfileDto {
  public readonly name: Name

  constructor(payload: UpdateProfile) {
    this.name = {
      first: payload.firstname,
      last: payload.lastname
    }
  }
}

export class DeleteAccountDto {
  public readonly password: string

  constructor(payload: DeleteAccount) {
    this.password = payload.password
  }
}

export class UpdatePasswordDto {
  public readonly old_password: string
  public readonly new_password: string
  public readonly confirm_new_password: string

  constructor(payload: UpdatePassword) {
    this.old_password = payload.current_password
    this.new_password = payload.password
    this.confirm_new_password = payload.confirm_password
  }
}

export class UpdateEmailDto {
  public readonly password: string
  public readonly new_email: string
  public readonly confirm_new_email: string

  constructor(payload: UpdateEmail) {
    this.password = payload.password
    this.new_email = payload.email
    this.confirm_new_email = payload.confirm_email
  }
}

export interface IUser {
  readonly $id: string
  readonly $createdAt: Date
  readonly $updatedAt: Date

  readonly email: string
  readonly role: Role
  readonly profile: Profile
}

export interface Profile {
  readonly $id: string
  readonly $createdAt: Date
  readonly $updatedAt: Date

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
  public readonly $createdAt: Date
  public readonly $updatedAt: Date

  public readonly email: string
  public readonly role: Role
  public readonly profile: Profile

  public getFullName(): string {
    return [this.profile.name.first, this.profile.name.last].join(' ')
  }

  constructor(user: IUser) {
    this.$id = user.$id
    this.$createdAt = user.$createdAt
    this.$updatedAt = user.$updatedAt

    this.email = user.email
    this.role = user.role
    this.profile = user.profile
  }
}

export type { UpdateEmail, UpdatePassword, ResetPassword, ForgotPassword, DeleteAccount, UpdateProfile, Register }
