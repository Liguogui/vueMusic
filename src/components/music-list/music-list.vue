<template>
   <div class="music-list">
     <div class="back" @click="back">
         <i class="icon-back"></i>
       </div>

     <h1 class="title" v-html="title"></h1>

     <div class="bg-image" :style="bgStyle" ref="bgImage">
       <div class="play-wrapper">
         <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
           <i class="icon-play"></i>
           <span class="text">随机播放全部</span>
         </div>
       </div>
       <!--蒙尘-->
       <div class="filter" ref="filter"></div>
     </div>
      <!--实际页面地层-->
     <div class="bg-layer" ref="layer"></div>

      <!--半遮层页面-->
     <scroll :data="songs" class="list" ref="list" :listen-scroll="listenScroll" @scroll="handScroll">
       <div class="song-list-wrapper">
         <song-list :songs="songs" @selected="selectItem" :rank="rank"></song-list>
       </div>
       <div class="loading-container" v-show="!songs.length">
          <loading></loading>
       </div>
     </scroll>

   </div>
</template>

<script type='text/ecmascript-6'>
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'components/song-list/song-list'
  import {prefixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import {playListMixin} from  'common/js/mixins'

  const RESERVED_HEIGHT = 40; //固定标题高度
  const transform = prefixStyle('transform');
  const backdropFilter = prefixStyle('backdrop-filter');

    export default{ //操作Vuex
        mixins:[playListMixin],
        props:{
          bgImage:{
            type:String,
            default:''
          },
          songs:{
            type:Array,
            default:[]
          },
          title:{
            type:String,
            default:''
          },
          rank:{
            type:Boolean,
            default:false
          }
        },
        computed:{
          bgStyle(){
            return {
              backgroundImage:`url(${this.bgImage})`
            }
          }
        },
        data(){
          return {
            scrollY:0
          }
        },
        created(){
          this.listenScroll = true //传给scroll组件
        },
        mounted(){
          this.imageHeight = this.$refs.bgImage.clientHeight;
          this.minTranslateY = -this.imageHeight+RESERVED_HEIGHT; //原位置到到标题底部(-223px)
          this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods:{
          handlePlayList(playList){
            const bottom = playList.length>0 ? '60px' : '';
            this.$refs.list.$el.style.bottom = bottom;
            this.$refs.list.refresh();
          },
          handScroll(pos){
            this.scrollY = pos.y //滚动的子页面在滚动窗口移动的距离,上位负下位正，左为负右为正
          },
          back(){
            this.$router.back();
          },
          selectItem(song,index){
            // console.log(this.songs);
            this.selectPlay({
              list:this.songs,
              index:index
            })
          },
          random(){
            this.randomPlay({
              list:this.songs
            });
          },
          ...mapActions([
            'selectPlay',
            'randomPlay'
          ])
        },
        watch:{
          scrollY(newY){
            //滚动覆盖图片
            //较大值newY(0到-223) 较小值minTranslateY-223
            let translateY = Math.max(this.minTranslateY,newY); //限制layer的滚动距离
            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
            // this.$refs.layer.style.webkittransform = `translate3d(0,${translateY}px,0)`;
            //滚动到标题底部为止
            let zIndex = 0;
            if(newY<this.minTranslateY){//滚动距离(-300)小于原位置到到标题底部(-223)时
              zIndex = 10;              //让背景图的z-index大于scroll组件
              this.$refs.bgImage.style.paddingTop = 0;
              this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
              this.$refs.playBtn.style.display = 'none';
            }else{
              zIndex = 0;              //让背景图恢复原样式
              this.$refs.bgImage.style.paddingTop = '70%';
              this.$refs.bgImage.style.height = 0;
              this.$refs.playBtn.style.display = '';
            }
            this.$refs.bgImage.style.zIndex = zIndex;
            //向下拉时，图片放大
            let scale = 1;
            let blur = 0; //向上滑，模糊效果
            const precent = Math.abs(newY/this.imageHeight);
            if(newY>0){
              scale = 1 + precent;
              zIndex = 10;
              this.$refs.bgImage.style[transform] = `scale(${scale})`;
              this.$refs.bgImage.style.zIndex = zIndex;
            }else{
              blur = Math.min(20*precent,20);
            }
            this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`;

          }
        },
        components:{
          Scroll,
          SongList,
          Loading
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
