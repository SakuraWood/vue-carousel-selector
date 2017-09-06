import carousel from './carousel.vue'
import slide from './slide.vue'

const install = (Vue) => {
    Vue.component('carousel', carousel)
    Vue.component('slide', slide)
}

export default {
    install
}

export {
    carousel,
    slide
}