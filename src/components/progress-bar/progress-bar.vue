<template>
   <div class="progress-bar" ref="progressBar" @click="progressClick">
     <div class="bar-inner">
       <div class="progress" ref="progress"></div>
       <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend = "progressTouchEnd"
       >
         <div class="progress-btn"></div>
       </div>
     </div>
   </div>
</template>

<script type='text/ecmascript-6'>
  import { prefixStyle } from 'common/js/dom'
    const transform = prefixStyle('transform');
    const progressBtnWidth = 16;

    export default{
      props:{
        percent:{
          type:Number,
          default:0
        }
      },
      created(){
        this.touch = {}
      },
      methods:{
        progressTouchStart(e){
          this.touch.initiated = true;
          this.touch.startX = e.touches[0].pageX;
          this.touch.left = this.$refs.progress.clientWidth;
        },
        progressTouchMove(e){
          if(!this.touch.initiated){
            return
          }
          const deltaX = e.touches[0].pageX - this.touch.startX;
          this.touch.offsetWidth = Math.min(Math.max(0,this.touch.left + deltaX),this.touch.barWidth);
          this._offset(this.touch.offsetWidth);
        },
        progressTouchEnd(e){
          this.touch.initiated = false;
          this._triggerPercent();
          // this.$emit();
        },
        progressClick(e){
          // console.log(this.$refs.progressBar.getBoundingClientRect().left);
          // console.log(this.$refs.progressBar.offsetLeft);
          let rect = this.$refs.progressBar.getBoundingClientRect();//和jq中的offset()很像
          const offsetWidth = e.pageX - rect.left;
          this._offset(offsetWidth);
          //当点击progressBtn的时候，获取的e.offsetX不对
          //this._offset(e.offsetX);
          this._triggerPercent();
        },
        _triggerPercent(){
          const percent = this.$refs.progress.clientWidth/this.touch.barWidth;
          this.$emit('onProgressBarChange',percent);
        },
        _offset(offsetWidth){
          this.$refs.progress.style.width = `${offsetWidth}px`; //进度条
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        }
      },
      watch:{
        percent(newPercent){
          if(newPercent>=0 && !this.touch.initiated){ //确保拖动优先级
            this.touch.barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
            const offsetWidth = newPercent * barWidth;
            this._offset(offsetWidth);
          }
        }
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
