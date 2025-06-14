import axios, { AxiosInstance } from 'axios'

import { ILocalStorageUtil, useLocalStorageUtil } from '@/library/utilities/local-storage.util'

import { authentication } from './authentication/auth.service'
import { administration } from './administration/admin.service'
import { second } from '@/library/data/constants/time.constants'

const TOKEN_ID = 'example-nest-api-token'
const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 10 * second,
  headers: { ['Content-Type']: 'application/json' }
})

class LocalhostAPI {
  private static $token: ILocalStorageUtil = useLocalStorageUtil(TOKEN_ID)

  public static authentication = new authentication(instance, this.$token)
  public static administration = new administration(instance, this.$token)
}

export { LocalhostAPI, TOKEN_ID }
