import { AxiosInstance } from 'axios'

import { ILocalStorageUtil } from '@/core/utilities/local-storage.util'
import { security } from './security/security.service'
import { profile } from './profile/profile.service'

class settings {
  public readonly profile: profile
  public readonly security: security

  constructor(api: AxiosInstance, token: ILocalStorageUtil) {
    this.profile = new profile(api, token)
    this.security = new security(api, token)
  }
}

export { settings }
