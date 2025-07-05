import { LocalhostAPI as API, REFRESH_TOKEN_ID } from '@/core/apis/localhost/localhost.api'
import { useLocalStorageUtil } from '@/core/utils/local-storage.util'
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
} from '@/library/dto/user.dto'
import { Store, StoreDefinition, defineStore } from 'pinia'
import { credentials, JWTDto } from '@/library/dto/JWT.dto'
import { second } from '@/library/constants/time.constants'

interface IAccessToken {
  token: string
  iat: number
  exp: number
}

interface IAuthState {
  $access_token: IAccessToken | null
  $authenticated: boolean
  $user: UserDto | undefined
}

interface AuthGetters {
  isAuthenticated: (state: IAuthState) => boolean
  authenticatedUser: (state: IAuthState) => UserDto | undefined
}

interface AuthActions {
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
}

type AuthStore = Store<'authentication', IAuthState, AuthGetters, AuthActions>
type StoreDef = StoreDefinition<'authentication', IAuthState, AuthGetters, AuthActions>

const REFRESH_TOKEN = useLocalStorageUtil(REFRESH_TOKEN_ID)

const useAuthStore: StoreDef = defineStore({
  id: 'authentication',
  state: (): IAuthState => ({
    $access_token: null,
    $authenticated: false,
    $user: undefined
  }),
  getters: {
    isAuthenticated: (state: IAuthState): boolean => state.$authenticated,
    authenticatedUser: (state: IAuthState): UserDto | undefined => state.$user
  },
  actions: {
    async authenticate(props: JWTDto) {
      REFRESH_TOKEN.saveItem(props.refresh_token)

      this.$user = props.user
      this.$authenticated = true
      this.$access_token = {
        token: props.access_token,
        iat: props.iat,
        exp: props.exp
      }
    },

    async purge(): Promise<void> {
      REFRESH_TOKEN.destroyItem()

      this.$user = undefined
      this.$authenticated = false
    },

    async getValidAccessToken(): Promise<string | null> {
      const now = Date.now() / second

      if (this.$access_token && this.$access_token.exp > now) {
        return this.$access_token.token
      }

      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      const dto: JWTDto = await API.authentication.verifyToken(token)
      this.authenticate(dto)

      return this.$access_token?.token || null
    },

    // AUTHENTICATION ROUTES

    async verifyToken(): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) return

      const dto: JWTDto = await API.authentication.verifyToken(token)
      this.authenticate(dto)
    },

    async register(props: RegisterDto): Promise<void> {
      const dto: JWTDto = await API.authentication.register(props)
      this.authenticate(dto)
    },

    async signIn(props: credentials): Promise<void> {
      const dto: JWTDto = await API.authentication.signIn(props)
      this.authenticate(dto)
    },

    async forgotPassword(props: ForgotPasswordDto): Promise<void> {
      await API.authentication.forgotPassword(props)
      this.purge()
    },

    async signOut(): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      await API.authentication.signOut(token)
      this.purge()
    },

    async resetPassword(props: ResetPasswordDto): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      await API.authentication.resetPassword(props, token)
      this.purge()
    },

    // SETTINGS > SECURITY

    async deleteAccount(props: DeleteAccountDto): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      await API.settings.security.deleteAccount(props, token)
      this.purge()
    },

    async updateEmail(props: UpdateEmailDto): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      const dto: JWTDto = await API.settings.security.updateEmail(props, token)
      this.authenticate(dto)
    },

    async updatePassword(props: UpdatePasswordDto): Promise<void> {
      const token = REFRESH_TOKEN.getItem<string>()
      if (!token) throw new Error('Could not verify refresh token')

      const dto: JWTDto = await API.settings.security.updatePassword(props, token)
      this.authenticate(dto)
    },

    // SETTINGS > PROFILE

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

export { useAuthStore }
export type { AuthStore }
