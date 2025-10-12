import { App } from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

class FontAwesomeService {
  public static init(app: App<Element>): void {
    library.add(fas, far, fab)
    app.component('font-awesome-icon', FontAwesomeIcon)
  }
}

export { FontAwesomeService }
