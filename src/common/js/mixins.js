import {mapGetters,mapMutations,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = { //解决迷你播放器遮挡问题
  computed:{
    ...mapGetters([
      'playList'
    ])
  },
  mounted(){
    this.handlePlayList(this.playList);
  },
  activated(){
    this.handlePlayList(this.playList);
  },
  watch:{
    playList(newVal){
      this.handlePlayList(newVal);
    }
  },
  methods:{
    handlePlayList(){
      throw new Error('component must implement handlePlayList');
    }
  }
}

export const playerMixin = { //把player.vue和play-list.vue共有的代码放到这里
  computed:{
    iconMode(){
      return (this.mode === playMode.sequence) ? 'icon-sequence'
        : (this.mode === playMode.loop ? 'icon-loop' :  'icon-random')
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'mode',
      'playList',
      'currentIndex',
      'favoriteList'
    ])
  },
  methods:{
    changeMode(){
      const mode = (this.mode + 1) % 3 ;
      this.setPlayMode(mode);
      let list = null;
      if( mode === playMode.random){
        list = shuffle(this.sequenceList);
      }else{
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list){ //改变播放模式的时候，把当前歌曲的index也改变,
      let index = list.findIndex((item)=>{   //不会在切换模式的时候变歌
        return item.id === this.currentSong.id
      });
      this.setCurrentIndex(index);
    },
    getFavoriteIcon(song){
      if(this.isFavorite(song)){
        return 'icon-favorite'
      }
      else{
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song){
      if(this.isFavorite(song)){
        this.deleteFavoriteItem(song);
      }
      else{
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song){
      const index = this.favoriteList.findIndex((item)=>{
        return item.id === song.id
      });
      return index > -1 //true or false
    },
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAY_LIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteItem'
    ])

  }
}

export const searchMixin = { //search.vue和add-song.vue共同的代码
  data(){
    return{
      query:''
    }
  },
  methods:{
    onQueryChange(query){
      this.query = query
    },
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch(){
      this.saveSearchHistory(this.query);
    },
    blurInput(){
      this.$refs.searchBox.blur()
    },
    deleteOne(query){
      this.deleteOneSearchHistory(query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteOneSearchHistory',
    ])
  }
}
