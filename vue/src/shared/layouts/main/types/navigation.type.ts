import { ROUTE_NAMES } from "@/library/enums/route-names.enum"

type nav = {
  label: string
  name: ROUTE_NAMES
  icon: [string, string]
  auth?: boolean
}

export type { nav }