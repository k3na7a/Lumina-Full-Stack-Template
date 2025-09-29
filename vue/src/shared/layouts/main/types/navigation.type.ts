import { ROUTE_NAMES } from "@lib/enums/route-names.enum"

type nav = {
  label: string
  name: ROUTE_NAMES
  icon: [string, string]
  auth?: boolean
}

export type { nav }