import { Router } from 'vue-router'

import { ROUTE_NAMES } from '@/library/enums/route-names.enum'
import { actions } from '../types/actions.type'

const user_actions = (router: Router, signout: Function): actions => {
  return [
    {
      key: 'redirects',
      children: [
        {
          title: 'settings.label',
          icon: ['fas', 'gear'],
          callback: () => router.push({ name: ROUTE_NAMES.SETTINGS })
        },
        {
          title: 'administration.label',
          icon: ['fas', 'lock'],
          callback: () => router.push({ name: ROUTE_NAMES.ADMINISTRATION })
        }
      ]
    },
    {
      key: 'actions',
      children: [
        {
          title: 'actions.log-out',
          icon: ['fas', 'right-from-bracket'],
          callback: signout
        }
      ]
    }
  ]
}

export { user_actions }
