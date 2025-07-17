import { ROUTE_NAMES } from "@/core/router/route-names.enum"

type nav = {
  label: string
  name: ROUTE_NAMES
  icon: [string, string]
  auth?: boolean
}

export type { nav }