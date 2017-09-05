<template>
    <div class="carousel-container" @touchstart="touchstart($event)" @touchend="touchend($event)" @touchmove="touchmove($event)">
        <div class="carousel" :style="tmstyle" ref="cs">
            <slot></slot>
        </div>
    </div>
</template>


<script>
import Slide from './slide'
export default {
    name: 'carousel-selector',
    props: ['options'],
    mounted() {

    },
    components: {
        Slide
    },
    watch: {
        containerWidth: function(newValue) {
            console.log(newValue)
        }
    },
    data: function() {
        return {
            offset: 0, //the offset of the carousel
            oldoffset: 0,
            movedirection: 0,//0 means direction is left or up,1 means direction is right or down
            // slideNum: this.options.num,//calculate the slide num of this carousel
            containerWidth: this.options.initTZ.width,//calculate the width of the slide container
            containerHeight: this.options.initTZ.height,//calculate the height of the slide container
            starttime: 0,//start to calculate the speed of carousel scrolling
            endtime: 0,//finish to calculate the speed of carousel scrolling
            v: 0,//the speed of carousel scrolling
            vt: 0,
            touchable: this.options.touchable === undefined ? true : this.options.touchable,
            startoffset: 0,
            endoffset: 0,
            moveX: 0,
            moveY: 0,
            rtl: this.options.rtl === undefined ? false : this.options.rtl,
            dtu: this.options.dtu === undefined ? false : this.options.dtu,
            istouching: false,
        }
    },
    watch: {
        // slideNum: function() {

        // }
    },
    computed: {
        theta: function() {
            return Number(Number(360 / this.options.num).toFixed(2)) //θ值
        },
        slideNum: function() {
            this.$nextTick(function() {

                // this.containerWidth = this.$refs.cs.offsetWidth
                // this.containerHeight = this.$refs.cs.offsetHeight

                // console.log(this.containerWidth + '    ' + this.containerHeight)
                // this.tz = this.isVertical ? Math.round((this.containerHeight / 2) / Math.tan(Math.PI / this.slideNum)) : Math.round((this.containerWidth / 2) / Math.tan(Math.PI / this.slideNum))
            })
            return this.options.num
        },
        currentSlide: function() {
            return Math.round((this.offset / this.theta) % this.slideNum < 0 ? this.slideNum + (this.offset / this.theta) % this.slideNum : (this.offset / this.theta) % this.slideNum)
        },
        /** 
         * @description the carousel direction , default is horizontal
         */
        isVertical: function() {
            return this.options === undefined ? false : (this.options.vertical === undefined ? false : this.options.vertical)
        },
        /** 
         * @description the translatez value of 3d object
         */
        tz: {
            get: function() {
                console.log(this.containerHeight + '  ' + this.slideNum)
                return this.isVertical ? Math.round((this.containerHeight / 2) / Math.tan(Math.PI / this.slideNum)) : Math.round((this.containerWidth / 2) / Math.tan(Math.PI / this.slideNum))
            },
            set: function(newValue) {

            }

        },

        tmstyle: function() {
            return this.isVertical
                ? {
                    'transform': 'translateZ(' + (-this.tz) + 'px)' + ' ' + 'rotateX(' + this.offset + 'deg)',
                    'transition': 'transform ' + this.vt + 'ms'
                } : {
                    'transform': 'translateZ(' + (-this.tz) + 'px)' + ' ' + 'rotateY(' + this.offset + 'deg)',
                    'transition': 'transform ' + this.vt + 'ms'
                }
        },
    },
    methods: {
        touchstart: function(event) {
            if (this.touchable) {
                this.istouching = true
                this.vt = 0
                let touch = event.targetTouches[0]
                this.moveX = touch.pageX
                this.moveY = touch.pageY
                console.log(this.moveX + '  ' + this.moveY)
                this.starttime = Date.now()
                this.startoffset = this.offset
            }
        },
        touchmove: function(event) {
            if (this.touchable) {
                let touch = event.targetTouches[0]
                let x = touch.pageX
                let y = touch.pageY
                console.log('move')
                if (this.isVertical) {
                    this.offset += ((this.moveY - y) / this.containerHeight) * this.theta
                    this.moveY - y > 0 ? this.movedirection = 1 : this.movedirection = 0
                    console.log(this.moveY - y)
                } else {
                    this.offset += ((x - this.moveX) / this.containerWidth) * this.theta
                    x - this.moveX > 0 ? this.movedirection = 1 : this.movedirection = 0
                }
                this.moveX = x
                this.moveY = y
                let now = Date.now()
                if (now - this.starttime > 300) {
                    this.starttime = Date.now()
                    this.startoffset = this.offset
                }
            }
        },
        touchend: function(event) {
            if (this.touchable) {
                console.log('end')
                this.endtime = Date.now()
                this.endoffset = this.offset
                this.v = (this.endoffset - this.startoffset) / (this.endtime - this.starttime) //滑动的速度
                this.adjustAngle()
            }
        },
        adjustAngle: function() {
            console.log(this.offset)
            this.offset === NaN ? this.offset = this.currentSlide * this.theta : void 0
            let ceil = Math.ceil(this.offset / this.theta)
            let bl = Math.abs(this.theta * ceil - this.offset) < this.theta / 2
            let s = this.movedirection === 1 ? Math.round(this.v * this.v) : -Math.round(this.v * this.v)
            console.log(s)
            if (bl) {
                this.vt = Math.abs(this.v) * 1000
                this.offset = (Math.ceil(this.offset / this.theta) + s) * this.theta
            } else {
                this.vt = Math.abs(this.v) * 1000
                this.offset = (Math.floor(this.offset / this.theta) + s) * this.theta
            }
            this.istouching = false
        },
        moveRight: function(step) {
            step === undefined ? step = 0 : void 0
            this.offset -= this.theta * step
        },
        moveLeft: function(step) {
            step === undefined ? step = 0 : void 0
            this.offset += this.theta * step
        },
        moveUp: function(step) {
            step === undefined ? step = 0 : void 0
            this.offset += this.theta * step
        },
        moveDown: function(step) {
            step === undefined ? step = 0 : void 0
            this.offset -= this.theta * step
        },
        goToIndex: function(index, theta) {
            theta === undefined ? theta = this.theta : void 0
            this.vt = 0
            this.offset = (index - 2) * theta
            this.vt = 80
            this.offset = index * theta
        },
        goToIndexNoWait: function(index, theta) {
            theta === undefined ? theta = this.theta : void 0
            this.vt = 0
            this.offset = index * theta
        }
    }
}
</script>


<style>
.carousel-container {
    perspective: 300rem;
}

.carousel {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
}
</style>
