<template>
  <transition name="slide">
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage"
    ></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { ERR_OK } from 'api/config'
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
  import { mapGetters } from 'vuex'

  export default { //通过Vuex中singer对象的mid发送ajax,jsonp,整理数据，传递数据
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.imgUrl
      },
      ...mapGetters([  //歌手的mid，name,imgUrl都来自vuex的state.singer对象
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        if (!this.singer.mid) {
          this.$router.push('/singer');
          return
        }
        //getSingerDetail主要是获取歌手的歌曲
        getSingerDetail(this.singer.mid).then((res) => {
          //console.log(res);
          if (res.code === ERR_OK) {
            //将res.data.list整理为Song类，并且获取歌曲的url地址
            // 给所有的song实例加上url
            processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
              this.songs = songs; //有url的song才是完整的song，才能傳給music-list
              // console.log(songs);
            })
          }
        })
      },
      _normalizeSongs(list) { //将list数组里面的对象变为Song类[{}{}...]->[Song,Song...]
        let ret = [];
        list.forEach((item,index) => {
          let {musicData} = item;
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
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

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
