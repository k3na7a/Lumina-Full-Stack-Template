import { LocalhostAPI as API, TOKEN_ID } from '@/apis/localhost/localhost.api'
import { useLocalStorageUtil } from '@/utilities/local-storage.util'
import { credentials, JWTDto } from '@/apis/localhost/dto/JWT.dto'
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
} from '@/apis/localhost/dto/user.dto'
import { Store, StoreDefinition, defineStore } from 'pinia'

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
  init(): Promise<void>
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

    async init(): Promise<void> {
      if (!TOKEN.getItem()) return

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

    async signOut(): Promise<void> {
      await API.authentication.signOut()
      this.purge()
    },

    async forgotPassword(props: ForgotPasswordDto): Promise<void> {
      await API.authentication.forgotPassword(props)
    },

    async resetPassword(props: ResetPasswordDto): Promise<void> {
      await API.authentication.resetPassword(props)
    },

    async updateProfile(props: UpdateProfileDto): Promise<void> {
      const dto: JWTDto = await API.authentication.updateProfile(props)
      this.authenticate(dto)
    },

    async updateEmail(props: UpdateEmailDto): Promise<void> {
      const dto: JWTDto = await API.authentication.updateEmail(props)
      this.authenticate(dto)
    },

    async updateAvatar(props: File): Promise<void> {
      const dto: JWTDto = await API.authentication.updateAvatar(props)
      this.authenticate(dto)
    },

    async removeAvatar(): Promise<void> {
      const dto: JWTDto = await API.authentication.removeAvatar()
      this.authenticate(dto)
    },

    async updatePassword(props: UpdatePasswordDto): Promise<void> {
      const dto: JWTDto = await API.authentication.updatePassword(props)
      this.authenticate(dto)
    },

    async deleteAccount(props: DeleteAccountDto): Promise<void> {
      await API.authentication.deleteAccount(props)
      this.purge()
    }
  }
})

export { useAuthStore }
export type { AuthStore }
