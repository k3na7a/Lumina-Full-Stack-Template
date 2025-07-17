import { BaseDto } from "../../../dto/base.dto"
import { iPermission, PermissionDto } from "./permission.dto"


interface iRole {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly name: string
  readonly label: string
  readonly description?: string
  readonly isSystemRole: boolean

  readonly permissions: iPermission[]
}

interface iCreateRole {
  readonly name: string
  readonly label: string
  readonly description?: string
  readonly isSystemRole: boolean
  readonly permissions?: PermissionDto[]
}

class CreateRoleDto {
  public readonly name: string
  public readonly label: string
  public readonly description?: string
  public readonly isSystemRole: boolean
  public readonly permissions: string[]

  constructor(payload: iCreateRole) {
    this.name = payload.name
    this.label = payload.label
    this.description = payload.description
    this.isSystemRole = payload.isSystemRole
    this.permissions = payload.permissions?.map((value: PermissionDto) => value.id) || []
  }
}

class RoleDto extends BaseDto {
  public readonly name: string
  public readonly label: string
  public readonly description?: string
  public readonly isSystemRole: boolean
  public readonly permissions: PermissionDto[]

  constructor(payload: iRole) {
    super(payload)

    this.name = payload.name
    this.label = payload.label
    this.description = payload.description
    this.isSystemRole = payload.isSystemRole
    this.permissions = payload.permissions?.length
      ? payload.permissions.map((value: iPermission) => new PermissionDto(value))
      : []
  }
}

export type { iRole, iCreateRole }
export { RoleDto, CreateRoleDto }
