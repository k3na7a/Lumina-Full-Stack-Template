import { LocalhostAPI as API, LocalhostAPI } from '@/core/apis/localhost/localhost.api'
import {
  DeleteAccountDto,
  ForgotPasswordDto,
  RegisterDto,
  ResetPassword,
  ResetPasswordDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UserDto
} from '@/core/apis/localhost/administration/users/dto/user.dto'
import { Store, StoreDefinition, defineStore } from 'pinia'
import { credentials, JWTDto } from '@/core/apis/localhost/dto/JWT.dto'
import { second } from '@lib/constants/time.constants'
import { useLocalStorageUtil } from '../utils/local-storage.util'

import { PERMISSION_MATRIX, PermissionDomain, PermissionsKey } from '@lib/constants/permissions.constants'
import { RoleDto } from '../apis/localhost/administration/users/dto/role.dto'

interface IToken {
  token: string
  iat: number
  exp: number
}

interface IAppState {
  $csrf_token: IToken | null
  $access_token: IToken | null
  $authenticated: boolean
  $user: UserDto | undefined
  $permissions: string[]
}

interface AppGetters {
  isAuthenticated: (state: IAppState) => boolean
  authenticatedUser: (state: IAppState) => UserDto | undefined
}

interface AppActions {
  initialize(): Promise<void>
  authenticate(props: JWTDto): Promise<void>
  verifyToken(): Promise<void>
  purge(): Promise<void>
  register(props: RegisterDto): Promise<void>
  signIn(props: credentials): Promise<void>
  signOut(): Promise<void>
  forgotPassword(props: { email: string }): Promise<void>
  resetPassword(props: ResetPassword): Promise<void>
  updateProfile(props: UpdateProfileDto): Promise<void>
  updateEmail(props: UpdateEmailDto): Promise<void>
  updateAvatar(props: File): Promise<void>
  removeAvatar(): Promise<void>
  updatePassword(props: UpdatePasswordDto): Promise<void>
  deleteAccount(props: DeleteAccountDto): Promise<void>
  getValidAccessToken(): Promise<string | null>
  getValidCsrfToken(): Promise<string | null>
  getCsrfToken(): Promise<void>
  canActivate(requiredPermissions: PermissionsKey[]): boolean
}

type AppStore = Store<'application', IAppState, AppGetters, AppActions>
type StoreDef = StoreDefinition<'application', IAppState, AppGetters, AppActions>

const localStorage = useLocalStorageUtil('refresh_expiry')

const useAppStore: StoreDef = defineStore({
  id: 'application',
  state: (): IAppState => ({
    $csrf_token: null,
    $access_token: null,
    $authenticated: false,
    $user: undefined,
    $permissions: []
  }),
  getters: {
    isAuthenticated: (state: IAppState): boolean => state.$authenticated,
    authenticatedUser: (state: IAppState): UserDto | undefined => state.$user
  },
  actions: {
    canActivate(requiredPermissions: PermissionsKey[]): boolean {
      if (this.$permissions.includes(PERMISSION_MATRIX[PermissionDomain.SYSTEM].HAS_ALL_PERMISSIONS)) return true
      return requiredPermissions.some((permission: string) => this.$permissions.includes(permission))
    },

    async initialize(): Promise<void> {
      const now = Date.now() / second
      const exp = localStorage.getItem<number>()

      if (!exp || isNaN(exp) || now > exp) {
        localStorage.destroyItem()
        return
      }

      await this.getCsrfToken()
      await this.verifyToken()
    },

    async authenticate(props: JWTDto): Promise<void> {
      localStorage.saveItem<number>(props.refresh)

      this.$user = props.user
      this.$authenticated = true
      this.$permissions = Array.from(
        new Set(props.user.roles?.flatMap((val: RoleDto) => val.permissions?.map((permission) => permission.name)))
      )
      this.$access_token = {
        token: props.access_token,
        iat: props.iat,
        exp: props.exp
      }
    },

    async purge(): Promise<void> {
      localStorage.destroyItem()

      this.$user = undefined
      this.$authenticated = false
      this.$permissions = []
    },

    async getValidCsrfToken(): Promise<string | null> {
      const now = Date.now()

      if (this.$csrf_token && this.$csrf_token.exp > now) {
        return this.$csrf_token.token
      }

      await this.getCsrfToken()
      return this.$csrf_token?.token || null
    },

    async getCsrfToken(): Promise<void> {
      const csrf_token = await LocalhostAPI.authentication.csrfToken()
      this.$csrf_token = csrf_token
    },

    async getValidAccessToken(): Promise<string | null> {
      const now = Date.now() / second

      if (this.$access_token && this.$access_token.exp > now) {
        return this.$access_token.token
      }

      await this.verifyToken()
      return this.$access_token?.token || null
    },

    async verifyToken(): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      const dto: JWTDto = await API.authentication.verifyToken(token)
      this.authenticate(dto)
    },

    async register(props: RegisterDto): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      const dto: JWTDto = await API.authentication.register(props, token)
      this.authenticate(dto)
    },

    async signIn(props: credentials): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      const dto: JWTDto = await API.authentication.signIn(props, token)
      this.authenticate(dto)
    },

    async forgotPassword(props: ForgotPasswordDto): Promise<void> {
      await API.authentication.forgotPassword(props)
      this.purge()
    },

    async signOut(): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      await API.authentication.signOut(token)
      this.purge()
    },

    async resetPassword(props: ResetPasswordDto): Promise<void> {
      await API.authentication.resetPassword(props, '')
      this.purge()
    },

    async deleteAccount(props: DeleteAccountDto): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      await API.settings.security.deleteAccount(props, token)
      this.purge()
    },

    async updateEmail(props: UpdateEmailDto): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      const dto: JWTDto = await API.settings.security.updateEmail(props, token)
      this.authenticate(dto)
    },

    async updatePassword(props: UpdatePasswordDto): Promise<void> {
      const token = await this.getValidCsrfToken()
      if (!token) throw new Error('Could not verify rcsf token')

      const dto: JWTDto = await API.settings.security.updatePassword(props, token)
      this.authenticate(dto)
    },

    async updateProfile(props: UpdateProfileDto): Promise<void> {
      const token = await this.getValidAccessToken()
      if (!token) throw new Error('Could not verify access token')

      const user: UserDto = await API.settings.profile.updateProfile(props, token)
      this.$user = user
    },

    async updateAvatar(props: File): Promise<void> {
      const token = await this.getValidAccessToken()
      if (!token) throw new Error('Could not verify access token')

      const user: UserDto = await API.settings.profile.updateAvatar(props, token)
      this.$user = user
    },

    async removeAvatar(): Promise<void> {
      const token = await this.getValidAccessToken()
      if (!token) throw new Error('Could not verify access token')

      const user: UserDto = await API.settings.profile.removeAvatar(token)
      this.$user = user
    }
  }
})

export { useAppStore }
export type { AppStore }
