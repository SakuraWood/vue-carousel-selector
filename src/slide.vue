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
                'current': this.parent.currentSlide === this.index,
                'touching': this.parent.istouching
            }
        },
        rstyle: function() {
            return this.isVertical ?
                {
                    transform: 'rotateX(' + (this.rtl ? -this.index : this.index) * this.deg + 'deg)' + ' ' + 'translateZ(' + this.parent.tz + 'px)',
                } : {
                    transform: 'rotateY(' + (this.dtu ? this.index : -this.index) * this.deg + 'deg)' + ' ' + 'translateZ(' + this.parent.tz + 'px)',
                }
        }

    },

}
</script>
<style>
.carousel-slide {
    position: absolute;
    opacity: 0
}

.carousel-slide.current {
    display: block;
    opacity: 1;
}

.carousel-slide.touching:not(.current) {
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s;
}

.carousel-slide:not(.current) {
    -webkit-animation: fadeOut 1.5s;
    animation: fadeOut 1.5s;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        display: block;
    }
    100% {
        opacity: 1;
        display: block;
    }
}

@keyframes fadeOut {
    0% {
        opacity: 1;
        display: block;
    }
    100% {
        opacity: 0;
        display: none;
    }
}
</style>