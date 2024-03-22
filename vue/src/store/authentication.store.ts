import { UserDto } from '@/helpers/apis/dto/user.dto'
import { LocalhostAPI as API, TOKEN_ID } from '@/helpers/apis/localhost.api'
import { useLocalStorageUtil } from '@/helpers/utils/local-storage.util'
import { Store, StoreDefinition, defineStore } from 'pinia'

type credentials = { email: string; password: string }

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

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
    // since we rely on `this`, we cannot use an arrow function
    async init(): Promise<void> {
      const token = TOKEN.getItem<string>()
      if (!token) return

      const new_token = await API.authentication.verifyToken()

      TOKEN.saveItem(new_token.token)

      const user = await API.users.getMe()

      this.$user = user
      this.$authenticated = true
    },
    async singIn(props: credentials): Promise<void> {
      const dto = await API.authentication.signIn(props)

      TOKEN.saveItem(dto.token)

      const user = await API.users.getMe()

      this.$user = user
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
