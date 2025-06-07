import { LocalhostAPI as API, TOKEN_ID } from '@/library/apis/localhost/localhost.api'
import { useLocalStorageUtil } from '@/library/utils/local-storage.util'
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
} from '@/library/apis/localhost/dto/user.dto'
import { Store, StoreDefinition, defineStore } from 'pinia'
import { credentials, JWTDto } from '@/library/apis/localhost/dto/JWT.dto'

interface IAuthState {
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
}

type AuthStore = Store<'authentication', IAuthState, AuthGetters, AuthActions>
type StoreDef = StoreDefinition<'authentication', IAuthState, AuthGetters, AuthActions>

const TOKEN = useLocalStorageUtil(TOKEN_ID)

const useAuthStore: StoreDef = defineStore({
  id: 'authentication',
  state: (): IAuthState => ({
    $authenticated: false,
    $user: undefined
  }),
  getters: {
    isAuthenticated: (state: IAuthState): boolean => state.$authenticated,
    authenticatedUser: (state: IAuthState): UserDto | undefined => state.$user
  },
  actions: {
    async authenticate(props: JWTDto) {
      TOKEN.saveItem(props.token)

      this.$user = props.user
      this.$authenticated = true
    },

    async purge(): Promise<void> {
      TOKEN.destroyItem()

      this.$user = undefined
      this.$authenticated = false
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

    async resetPassword(props: ResetPasswordDto): Promise<void> {
      await API.authentication.resetPassword(props)
      this.purge()
    },

    async verifyToken(): Promise<void> {
      if (!TOKEN.getItem()) return

      const dto: JWTDto = await API.authentication.account.verifyToken()
      this.authenticate(dto)
    },

    async signOut(): Promise<void> {
      await API.authentication.account.signOut()
      this.purge()
    },

    async updateEmail(props: UpdateEmailDto): Promise<void> {
      const dto: JWTDto = await API.authentication.account.updateEmail(props)
      this.authenticate(dto)
    },

    async updatePassword(props: UpdatePasswordDto): Promise<void> {
      const dto: JWTDto = await API.authentication.account.updatePassword(props)
      this.authenticate(dto)
    },

    async deleteAccount(props: DeleteAccountDto): Promise<void> {
      await API.authentication.account.deleteAccount(props)
      this.purge()
    },

    async updateProfile(props: UpdateProfileDto): Promise<void> {
      const dto: JWTDto = await API.authentication.account.profile.updateProfile(props)
      this.authenticate(dto)
    },

    async updateAvatar(props: File): Promise<void> {
      const dto: JWTDto = await API.authentication.account.profile.updateAvatar(props)
      this.authenticate(dto)
    },

    async removeAvatar(): Promise<void> {
      const dto: JWTDto = await API.authentication.account.profile.removeAvatar()
      this.authenticate(dto)
    }
  }
})

export { useAuthStore }
export type { AuthStore }
