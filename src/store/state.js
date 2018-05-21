import {playMode} from 'common/js/config'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache'

const state = {
  singer:{},
  playing:false, //是否播放
  fullScreen:false, //是否全屏
  playList:[], //实际播放列表 [Song,Song]
  sequenceList:[], //顺序播放列表 [Song,Song]
  mode:playMode.sequence, //播放模式
  currentIndex:-1, //当前播放序号
  disc:{},
  topMusic:{},
  searchHistory: loadSearch(), //搜索历史 [string,string...]
  playHistory:loadPlay(), //最近播放歌曲 在player ready的时候，写入[object,object]
  favoriteList:loadFavorite()
};

export default state
