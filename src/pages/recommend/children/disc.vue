<template>
  <transition name="slide">
    <music-list :songs="songs"
                :title="title"
                :bg-image="bgImage"
    ></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import MusicList from 'components/music-list/music-list'
  import { getSongList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { createSong,processSongsUrl } from 'common/js/song'
  import {mapGetters} from 'vuex'

  export default{ //通过Vuex中disc对象的dissid发送ajax,jsonp,整理数据，传递数据
    data(){
      return{
        songs:[]
      }
    },
    created(){
      this._getSongList();
    },
    computed:{
      title(){
        return this.disc.dissname;
      },
      bgImage(){
        return this.disc.imgurl;
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods:{
      _getSongList(){
        if(!this.disc.dissid){
          this.$router.push('/recommend');
          return;
        }
        getSongList(this.disc.dissid).then((res)=>{
          if(res.code === ERR_OK){
            //给所有的song实例加上url
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs; //有url的song才是完整的song，才能傳給music-list
              // console.log(songs);
            })
          }

        })
      },
      _normalizeSongs(list){ //将list数组里面的对象变为Song类[{}{}...]->[Song,Song...]
        let ret = [];
        list.forEach((musicData,index) => {
          if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData));
          }
        });
        return ret
      }
    },
    components:{
      MusicList,
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
