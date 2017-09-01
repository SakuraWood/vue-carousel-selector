<template>
    <div class="carousel-slide" :class="isCurrent" :style="rstyle">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'slide',
    props: ['index'],
    data: function() {
        return {
            parent: this.$parent,
            rtl: this.$parent.rtl,
            dtu: this.$parent.dtu,
            deg: -Number(360 / this.$parent.slideNum).toFixed(2),
            isVertical: this.$parent.isVertical,
        }
    },
    computed: {
        isCurrent: function() {
            return {
                'current': this.parent.currentSlide === this.index
            }
        },
        rstyle: function() {
            return this.isVertical ?
                {
                    transform: 'rotateX(' + (this.rtl ? -this.index : this.index) * this.deg + 'deg)' + ' ' + 'translateZ(' + this.parent.tz + 'px)'
                } : {
                    transform: 'rotateY(' + (this.dtu ? this.index : -this.index) * this.deg + 'deg)' + ' ' + 'translateZ(' + this.parent.tz + 'px)'
                }
        }

    },

}
</script>
<style>
.carousel-slide {
    display: block;
    position: absolute;
    opacity: 1;
}
</style>