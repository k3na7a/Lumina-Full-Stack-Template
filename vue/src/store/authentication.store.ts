import { UserDto } from '@/helpers/apis/localhost/dto/user.dto'
import { LocalhostAPI as API, TOKEN_ID } from '@/helpers/apis'
import { useLocalStorageUtil } from '@/helpers/utils/local-storage.util'
import { Store, StoreDefinition, defineStore } from 'pinia'

type credentials = { email: string; password: string }

interface IAuthState {
  $authenticated: boolean
  $user: UserDto | undefined
}
interface AuthGetters {
  isAuthenticated: (state: IAuthState) => boolean
  authenticatedUser: (state: IAuthState) => UserDto | undefined
}
interface AuthActions {
  init(): Promise<void>
  register(props: credentials): Promise<void>
  singIn(props: credentials): Promise<void>
  signOut(): Promise<void>
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
    async init(): Promise<void> {
      if (!TOKEN.getItem()) return

      const dto = await API.authentication.verifyToken()

      TOKEN.saveItem(dto.token)

      this.$user = dto.user
      this.$authenticated = true
    },
    async register(props: credentials): Promise<void> {
      const dto = await API.authentication.register(props)

      TOKEN.saveItem(dto.token)

      this.$user = dto.user
      this.$authenticated = true
    },
    async singIn(props: credentials): Promise<void> {
      const dto = await API.authentication.signIn(props)

      TOKEN.saveItem(dto.token)

      this.$user = dto.user
      this.$authenticated = true
    },
    async signOut(): Promise<void> {
      await API.authentication.signOut()

      TOKEN.destroyItem()

      this.$user = undefined
      this.$authenticated = false
    }
  }
})

export { useAuthStore }
export type { AuthStore }
