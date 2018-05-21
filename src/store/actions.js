import {playMode} from "common/js/config";
import {shuffle} from "common/js/util";
import * as types from './mutation-types'
import {saveSearch,deleteOneSearch,clearSearch,savePlay,saveFavorite,deleteFavorite} from 'common/js/cache'

function findIndex(list,song) {
  return list.findIndex((item)=>{
    return item.id === song.id;
  })
}

export const selectPlay = function ({commit,state},{list,index}) {
    commit(types.SET_SEQUENCE_LIST,list);
    commit(types.SET_PLAY_LIST,list);
    commit(types.SET_CURRENT_INDEX,index);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAYING_STATE,true);
};

export const randomPlay = function ({commit},{list}) {
  commit(types.SET_PLAY_MODE,playMode.random);
  commit(types.SET_SEQUENCE_LIST,list);
  let randomList = shuffle(list);
  commit(types.SET_PLAY_LIST,randomList);
  commit(types.SET_CURRENT_INDEX,0);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAYING_STATE,true);
};

//搜索页面或播放历史中添加歌曲 按照网易云音乐的方式
export const insertSong = function ({commit,state},song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  //判断当前歌曲列表有没有将要加入的歌曲
  let fpIndex = findIndex(playList,song);
  // 如果有 遍历playList，找到相同的第一首歌播放，改变currentIndex
  if(fpIndex>-1){
      commit('SET_CURRENT_INDEX',fpIndex);
      commit('SET_FULL_SCREEN',true);
      commit('SET_PLAYING_STATE',true);
  }
  else{ //如果没有 将歌曲添加到playList列表和sequenceList列表的最后一位,改变currentIndex
      playList.push(song);
      sequenceList.push(song);
      commit('SET_PLAY_LIST',playList);
      commit('SET_SEQUENCE_LIST',sequenceList);
      commit('SET_CURRENT_INDEX',playList.length-1);
      commit('SET_FULL_SCREEN',true);
      commit('SET_PLAYING_STATE',true);
  }
};

export const saveSearchHistory = function ({commit,state},query) {
    commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteOneSearchHistory = function ({commit,state},query) {
    commit(types.SET_SEARCH_HISTORY,deleteOneSearch(query))
}

export const clearSearchHistory = function ({commit,state}) {
  commit(types.SET_SEARCH_HISTORY,clearSearch())
}


export const clearSongList = function ({commit}) {
  commit('SET_PLAY_LIST',[]);
  commit('SET_SEQUENCE_LIST',[]);
  commit('SET_CURRENT_INDEX',-1);
  commit('SET_PLAYING_STATE',false);
}

export const savePlayHistory = function ({commit},currentSong) {
  commit(types.SET_PLAY_HISTORY,savePlay(currentSong))
}

export const saveFavoriteList = function ({commit},song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteItem = function ({commit},song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}
