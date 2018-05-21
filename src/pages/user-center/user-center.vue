<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches="switches" :current_Index="current_Index" @switchItem="switchItem">
        </switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <!--喜欢歌曲列表-->
        <scroll class="list-scroll"
                v-if="current_Index===0"
                :data="favoriteList"
                ref="favoriteListScroll"
        >
          <div class="list-inner">
            <song-list :songs="favoriteList"
                       @selected="selectSong"
            >
            </song-list>
            <no-result v-show="!favoriteList.length"
                       :title="nofavoriteDesc"
            ></no-result>
          </div>
        </scroll>
        <!--最近播放歌曲-->
        <scroll class="list-scroll"
                v-if="current_Index===1"
                :data="playHistory"
                ref="playListScroll"
        >
          <div class="list-inner">
            <song-list :songs="playHistory"
                       @selected="selectSong"
            >
            </song-list>
            <no-result v-show="!playHistory.length"
                       :title="noplayHisDesc"
            ></no-result>
          </div>
        </scroll>
        <!--没有搜索结果-->
      </div>

    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'components/song-list/song-list'
  import NoResult from 'base/no-result/no-result'
  import {mapGetters,mapActions} from "vuex";
  import Song from 'common/js/song'
  import {processSongsUrl} from 'common/js/song'
  import {playListMixin} from 'common/js/mixins'

  export default { //vuex 传递数据
    mixins:[playListMixin],
    data() {
      return {
        switches: [
          {name: '我喜欢的'},
          {name: '最近听的'}
        ],
        current_Index: 0,
        nofavoriteDesc:'暂无收藏歌曲',
        noplayHisDesc:'还没有听过歌曲'
      }
    },
    computed: {
      showNoResult(){

      },
      ...mapGetters([
        'favoriteList',
        'playHistory',
        'playList'
      ])
    },
    methods: {
      switchItem(index) {
        this.current_Index = index;
      },
      back() {
        this.$router.back()
      },
      selectSong(song){
        //因为保存在本地的对象，它的vkey值会过期，获取的url不对，所以需要重新获取url
        let ret = [];
        ret.push(new Song(song));
        processSongsUrl(ret).then((res)=>{
          this.insertSong(res[0]) //res[0]就是重新获取了url的Song对象
        });
      },
      random(){
        let list = this.current_Index === 0 ? this.favoriteList : this.playHistory
        if(list.length === 0){
          return
        }
        list = list.map((item)=>{
          return new Song(item);
        });
        this.randomPlay({list});
      },
      handlePlayList(playList){
        const bottom = playList.length>0 ? '60px' : '';
        this.$refs.listWrapper.style.bottom = bottom;
        if(this.current_Index===0){
          this.$refs.favoriteListScroll.refresh();
        }
        else{
          this.$refs.playListScroll.refresh();
        }
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      SongList,
      Scroll,
      NoResult
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
