<template>
   <transition name="slide">
     <div class="add-song" v-show="showFlag" @click.stop>
       <div class="header">
         <h1 class="title">添加歌曲到列表</h1>
         <div class="close" @click="hide">
           <i class="icon-close"></i>
         </div>
       </div>
       <div class="search-box-wrapper">
         <search-box @query="onQueryChange" placeholder="搜索歌曲"
                     ref="searchBox"
         ></search-box>
       </div>
       <div class="shortcut" v-show="!query">
         <switches :switches="switches"
                   :current_Index="current_Index"
                   @switchItem="switchItem"
         ></switches>
         <div class="list-wrapper">
           <!--最近播放歌曲-->
           <scroll class="list-scroll"
                   v-if="current_Index===0"
                   :data="playHistory"
                   ref="songListScroll"
           >
             <div class="list-inner">

               <song-list :songs="playHistory"
                          @selected="selectSong"
               >
               </song-list>
             </div>
           </scroll>
           <!--搜索历史-->
           <scroll class="list-scroll"
                   v-if="current_Index===1"
                   :data="searchHistory"
                   ref="searchListScroll"
                   :refreshDelay="100"
           >
             <div class="list-inner">

               <search-list :searches="searchHistory"
                             @select="addQuery"
                             @deleteOne= "deleteOne"
               >
               </search-list>
             </div>
           </scroll>
         </div>
       </div>
       <div class="search-result" v-show="query">
         <suggest :query="query" :showSinger="showSinger"
                  @beforeScroll="blurInput"
                  @select="selectSuggest"
                  ref="suggest"
         ></suggest>
       </div>
       <top-tip ref="topTip">
         <div class="tip-title">
           <i class="icon-ok"></i>
           <span class="text">一首歌曲已经添加到播放列表</span>
         </div>
       </top-tip>
     </div>
   </transition>
</template>

<script type='text/ecmascript-6'>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import {searchMixin} from 'common/js/mixins'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import {mapGetters,mapActions} from 'vuex'
  import SongList from 'components/song-list/song-list'
  import Song from 'common/js/song'
  import {processSongsUrl} from 'common/js/song'
  import SearchList from 'components/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'

    export default{
      mixins:[searchMixin],
      computed:{
        ...mapGetters([
          'playList',
          'sequenceList',
          'playHistory',
          'searchHistory'
        ])
      },
      data(){
        return{
          showFlag:false,
          query:'',
          showSinger:false,
          switches:[
            {name:'最近播放'},
            {name:'搜索历史'},
          ],
          current_Index:0
        }
      },
      methods:{
        show(){
          this.showFlag = true;
          setTimeout(()=>{
            if(this.current_Index === 0){
              this.$refs.songListScroll.refresh();
            }
            if(this.current_Index === 1){
              this.$refs.searchListScroll.refresh();
            }
          },20)
        },
        hide(){
          this.showFlag = false;
        },
        switchItem(index){
          this.current_Index = index;
        },
        selectSuggest(){
          this.saveSearch();
          this.showTip();
        },
        selectSong(song,index){ //点击播放列表，将歌曲加入播放列表
          if(index === 0){ //点击的是最近播放歌曲第一个，什么都不做
            return
          }
          //console.log(song);//object Song的实例存入缓存之中会变为object
          //因为保存在本地的对象，它的vkey值会过期，获取的url不对，所以需要重新获取url
          let ret = [];
          ret.push(new Song(song));
          processSongsUrl(ret).then((res)=>{
            this.insertSong(res[0]) //res[0]就是重新获取了url的Song对象
          });

          this.showTip();
        },
        showTip(){
          this.$refs.topTip.show()
        },
        ...mapActions([
          'insertSong'
        ])
      },
      watch:{
        query(newQuery){
          if(!newQuery){ //suggest组件消失时
            setTimeout(()=>{
              if(this.current_Index === 0){
                this.$refs.songListScroll.refresh();
              }
              if(this.current_Index === 1){
                this.$refs.searchListScroll.refresh();
              }
            },20)
          }
        }
      },
      components:{
        SearchBox,
        Suggest,
        Switches,
        Scroll,
        SongList,
        SearchList,
        TopTip
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
