import { App } from 'vue'

import tooltips from './tooltip.directive'
import clickOutside from './clickoutside.directive'

export function registerDirectives(app: App): void {
  app.directive('tooltip', tooltips)
  app.directive('click-outside', clickOutside)
}
