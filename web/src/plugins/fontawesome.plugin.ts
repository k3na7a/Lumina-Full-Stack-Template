import { App } from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

export class FontAwesomeService {
  public static init(app: App<Element>): void {
    library.add(fas, fab)
    app.component('font-awesome-icon', FontAwesomeIcon)
  }
}
