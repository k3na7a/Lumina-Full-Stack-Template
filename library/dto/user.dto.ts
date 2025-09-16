import { iImage } from '@lib/dto/media.dto'
import { BaseDto } from '@lib/dto/base.dto'
import { iRole, RoleDto } from './role.dto'

type UpdatePassword = { current_password: string; password: string; confirm_password: string }
type UpdateEmail = { password: string; email: string; confirm_email: string }
type ResetPassword = { new_password: string; confirm_password: string }
type ForgotPassword = { email: string; redirect: string }
type DeleteAccount = { password: string }
type UpdateProfile = { firstname: string; lastname: string }
type Register = { firstname: string; lastname: string; email: string; password: string }
type UpdateUser = {
  readonly email: string
  readonly firstname: string
  readonly lastname: string
  readonly roles?: RoleDto[]
  readonly avatar?: File | null
  readonly 'remove-avatar': boolean
}

class UpdateUserDto {
  public readonly firstname!: string
  public readonly lastname!: string
  public readonly email!: string
  public readonly roles!: string[]
  public readonly avatar?: File
  public readonly 'remove-avatar'!: boolean

  constructor(payload: UpdateUser) {
    this.firstname = payload.firstname
    this.lastname = payload.lastname
    this.email = payload.email
    this.roles = payload.roles?.map((value: RoleDto) => value.id) || []
    this.avatar = payload.avatar || undefined
    this['remove-avatar'] = payload['remove-avatar']
  }
}

class ResetPasswordDto {
  public readonly token: string
  public readonly new_password: string
  public readonly confirm_password: string

  constructor({ new_password, confirm_password }: ResetPassword, token: string) {
    this.token = token
    this.new_password = new_password
    this.confirm_password = confirm_password
  }
}

class ForgotPasswordDto {
  public readonly email: string
  public readonly redirect: string

  constructor(payload: ForgotPassword) {
    this.email = payload.email
    this.redirect = payload.redirect
  }
}

class RegisterDto {
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

class UpdateProfileDto {
  public readonly name: Name

  constructor(payload: UpdateProfile) {
    this.name = {
      first: payload.firstname,
      last: payload.lastname
    }
  }
}

class DeleteAccountDto {
  public readonly password: string

  constructor(payload: DeleteAccount) {
    this.password = payload.password
  }
}

class UpdatePasswordDto {
  public readonly old_password: string
  public readonly new_password: string
  public readonly confirm_new_password: string

  constructor(payload: UpdatePassword) {
    this.old_password = payload.current_password
    this.new_password = payload.password
    this.confirm_new_password = payload.confirm_password
  }
}

class UpdateEmailDto {
  public readonly password: string
  public readonly new_email: string
  public readonly confirm_new_email: string

  constructor(payload: UpdateEmail) {
    this.password = payload.password
    this.new_email = payload.email
    this.confirm_new_email = payload.confirm_email
  }
}

interface iUser {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly email: string

  readonly profile: iProfile
  readonly roles: iRole[]
}

interface iProfile {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly avatar: iImage | null
  readonly name: Name
}

interface Name {
  readonly first: string
  readonly last: string
}

enum Role {
  USER = 'user',
  ADMIN = 'administrator'
}

function getAvatar(first: string, last: string) {
  return `https://ui-avatars.com/api/?name=${[first, last].join('+')}`
}

class Profile {
  public readonly avatar: string
  public readonly name: Name

  constructor({ name, avatar }: iProfile) {
    this.name = name
    this.avatar = avatar?.uri || getAvatar(name.first, name.last)
  }
}

class UserDto extends BaseDto {
  public readonly email: string
  public readonly profile: Profile
  public readonly roles: RoleDto[]

  public getFullName(): string {
    return [this.profile.name.first, this.profile.name.last].join(' ')
  }

  constructor(user: iUser) {
    super(user)

    this.email = user.email
    this.profile = new Profile(user.profile)
    this.roles = user.roles ? user.roles.map((value: iRole) => new RoleDto(value)) : []
  }
}

export {
  UserDto,
  Profile,
  Role,
  ResetPasswordDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  DeleteAccountDto,
  UpdateProfileDto,
  RegisterDto,
  ForgotPasswordDto,
  UpdateUserDto
}

export type {
  UpdateEmail,
  UpdatePassword,
  ResetPassword,
  ForgotPassword,
  DeleteAccount,
  UpdateProfile,
  Register,
  Name,
  iProfile,
  iUser,
  UpdateUser
}
