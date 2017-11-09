<template>
  <div class="carousel-slide" :class="isCurrent" :style="rstyle">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "slide",
  props: ["index",'slideNum'],
  data: function() {
    return {
      parent: this.$parent,
      rtl: this.$parent.rtl,
      dtu: this.$parent.dtu,
      isVertical: this.$parent.isVertical
    };
  },
  computed: {
    tz:function () {
      return this.$parent.tz;
    },
    deg:function () {
      return -Number(360 / this.$parent.slideNum).toFixed(2)
    },
    isCurrent: function() {
      return {
        current: this.$parent.currentSlide === this.index,
        touching: this.$parent.istouching
      };
    },
    isCurrentBy: function() {
      if (
        Math.abs(this.index - this.$parent.currentSlide) === 1 ||
        Math.abs(this.index - this.$parent.currentSlide) ===
          this.$parent.slideNum - 1
      ) {
        return true;
      } else {
        return false;
      }
    },
    scale: function() {
      if (this.$parent.scala) {
        if (this.$parent.currentSlide === this.index) {
          return (
            this.$parent.scale *
            (1 -
              Math.abs(
                ((this.$parent.offset -
                  Math.round(this.$parent.offset / this.deg) * this.deg) %
                  this.deg) /
                  this.deg
              ))
          );
        } else {
          if (this.isCurrentBy) {
            return this.$parent.scale * this.$parent.scaleParams;
          } else {
            return this.$parent.scale * this.$parent.scaleParams;
          }
        }
      } else {
        return this.$parent.scale;
      }
    },
    rstyle: function() {
      return this.isVertical
        ? {
            transform:
              "rotateX(" +
              (this.rtl ? -this.index : this.index) * this.deg +
              "deg)" +
              " " +
              "translateZ(" +
              this.tz +
              "px)" +
              " " +
              "scaleX(" +
              this.scale +
              ")" +
              " " +
              "scaleY(" +
              this.scale +
              ")"
          }
        : {
            transform:
              "rotateY(" +
              (this.dtu ? this.index : -this.index) * this.deg +
              "deg)" +
              " " +
              "translateZ(" +
              this.tz +
              "px)" +
              " " +
              "scaleX(" +
              this.scale +
              ")" +
              " " +
              "scaleY(" +
              this.scale +
              ")"
          };
    }
  }
};
</script>
<style>
.carousel-slide {
  position: absolute;
  opacity: 0;
}

.carousel-slide.current {
  display: block;
  opacity: 1;
}

.carousel-slide.touching:not(.current) {
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
  opacity: 1;
}

.carousel-slide:not(.current) {
  -webkit-animation: fadeOut 1.5s;
  animation: fadeOut 1.5s;
  opacity: 0;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
