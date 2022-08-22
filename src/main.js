import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'

library.add(faFloppyDisk);
library.add(faBoxOpen);

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
