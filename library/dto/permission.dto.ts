import { PermissionDomain } from '../constants/permissions.constants'
import { BaseDto } from './base.dto'

interface iPermission {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date

  readonly name: string
  readonly label: string
  readonly description?: string
  readonly domain: PermissionDomain
  readonly isSystemPermission: boolean
}

interface iCreatePermission {
  readonly name: string
  readonly label: string
  readonly description?: string
  readonly domain: PermissionDomain
  readonly isSystemPermission: boolean
}

class CreatePermissionDto {
  public readonly name: string
  public readonly label: string
  public readonly description?: string
  public readonly domain: PermissionDomain
  public readonly isSystemPermission: boolean

  constructor(payload: iCreatePermission) {
    this.name = payload.name
    this.label = payload.label
    this.description = payload.description
    this.domain = payload.domain
    this.isSystemPermission = payload.isSystemPermission
  }
}

class PermissionDto extends BaseDto {
  public readonly name: string
  public readonly label: string
  public readonly description?: string
  public readonly domain: PermissionDomain
  public readonly isSystemPermission: boolean
  public readonly raw: Record<string, unknown>

  constructor(payload: iPermission) {
    super(payload)

    this.name = payload.name
    this.label = payload.label
    this.description = payload.description
    this.isSystemPermission = payload.isSystemPermission
    this.domain = payload.domain
    this.raw = payload as unknown as Record<string, unknown>
  }
}

export type { iPermission, iCreatePermission }
export { PermissionDto, PermissionDomain, CreatePermissionDto }
