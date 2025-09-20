import { AxiosInstance } from 'axios'

import { users } from './users/users.service'
import { games } from './games/games.service'
import { platforms } from './games/platforms.service'
import { roles } from './users/roles.service'
import { permissions } from './users/permissions.service'
import { audit } from './audit/audit.service'

class administration {
  public readonly users: users
  public readonly roles: roles
  public readonly permissions: permissions
  public readonly games: games
  public readonly platforms: platforms
  public readonly audit: audit

  constructor(api: AxiosInstance) {
    this.users = new users(api)
    this.roles = new roles(api)
    this.permissions = new permissions(api)
    this.games = new games(api)
    this.platforms = new platforms(api)
    this.audit = new audit(api)
  }
}

export { administration }
