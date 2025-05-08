import { Role } from '@/library/data/dto/user.dto'

type Badges = { [key: string]: { theme: 'primary' | 'secondary'; label: string } }
const badges: Badges = {
  [Role.ADMIN]: { theme: 'primary', label: 'forms.admin' },
  [Role.USER]: { theme: 'secondary', label: 'forms.user' }
}

export { badges }
