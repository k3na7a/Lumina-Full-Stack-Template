import { AxiosInstance } from 'axios'

import { security } from './security/security.service'
import { profile } from './profile/profile.service'

class settings {
  public readonly profile: profile
  public readonly security: security

  constructor(api: AxiosInstance) {
    this.profile = new profile(api)
    this.security = new security(api)
  }
}

export { settings }
