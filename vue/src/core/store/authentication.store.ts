import { LocalhostAPI as API } from '@/core/apis/localhost/localhost.api'
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
      this.$user = props.user
      this.$authenticated = true
      this.$access_token = {
        token: props.access_token,
        iat: props.iat,
        exp: props.exp
      }
    },

    async purge(): Promise<void> {
      this.$user = undefined
      this.$authenticated = false
    },

    async getValidAccessToken(): Promise<string | null> {
      const now = Date.now() / second

      if (this.$access_token && this.$access_token.exp > now) {
        return this.$access_token.token
      }

      await this.verifyToken()

      return this.$access_token?.token || null
    },

    // AUTHENTICATION ROUTES

    async verifyToken(): Promise<void> {
      const dto: JWTDto = await API.authentication.verifyToken()
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
      await API.authentication.signOut()
      this.purge()
    },

    async resetPassword(props: ResetPasswordDto): Promise<void> {
      await API.authentication.resetPassword(props, '')
      this.purge()
    },

    // SETTINGS > SECURITY

    async deleteAccount(props: DeleteAccountDto): Promise<void> {
      await API.settings.security.deleteAccount(props)
      this.purge()
    },

    async updateEmail(props: UpdateEmailDto): Promise<void> {
      const dto: JWTDto = await API.settings.security.updateEmail(props)
      this.authenticate(dto)
    },

    async updatePassword(props: UpdatePasswordDto): Promise<void> {
      const dto: JWTDto = await API.settings.security.updatePassword(props)
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
