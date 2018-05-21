<template>
  <transition name="slide">
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage"
                :rank="rank"
    ></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'api/rank'
  import {mapGetters} from 'vuex'
  import {ERR_OK} from "api/config"
  import { createSong,processSongsUrl } from 'common/js/song'

  export default { //通过Vuex中topMusic对象的id发送ajax,jsonp,整理数据，传递数据
    computed: {
      title() {
        return this.topMusic.title
      },
      bgImage() {
        return this.topMusic.picUrl;
      },
      ...mapGetters([
        'topMusic'
      ])
    },
    data() {
      return {
        songs: [],
        rank:true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if(!this.topMusic.id){
          this.$router.push('/rank');
          return
        }
        getMusicList(this.topMusic.id).then((res) => {
          if (res.code === ERR_OK) {
            //console.log(res.songlist);
            //给所有的song实例加上url
            processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              //console.log(songs);
              this.songs = songs; //有url的song才是完整的song，才能傳給music-list
              // console.log(songs);
            })
          }
        })
      },
      _normalizeSongs(list) { //将list数组里面的对象变为Song类[{}{}...]->[Song,Song...]
        let ret = [];
        list.forEach((musicData, index) => {
          if (musicData.data.songid && musicData.data.albumid) {
            ret.push(createSong(musicData.data));
          }
        });
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
