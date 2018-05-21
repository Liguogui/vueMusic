import storage from 'good-storage'

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;

function insertArray(arr,val,maxLen,compareFunc) { //加入数组最前面
  const index = arr.findIndex(compareFunc); //判断数组中有没有该对象
  if(index === 0){
    return
  }
  if(index>0){
    arr.splice(index,1);
  }
  arr.unshift(val);
  if(maxLen && arr.length>maxLen ){
    arr.pop();
  }
}

function deleteFromArray(arr,compareFunc) {
  const index = arr.findIndex(compareFunc);
  if(index > -1){
    arr.splice(index,1);
  }
  else{
    return
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY,[]); //本地存储中如果有SEARCH_KEY就取出来，没有就默认为[]
  insertArray(searches,query,SEARCH_MAX_LENGTH,function(item) {
      return item === query;
  });
  storage.set(SEARCH_KEY,searches);
  return searches;
}

export function loadSearch() {
  return storage.get(SEARCH_KEY,[])
}

export function deleteOneSearch(query) {
  let searches = storage.get(SEARCH_KEY,[]);
  deleteFromArray(searches,function (item) {
    return item === query
  })
  storage.set(SEARCH_KEY,searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY,[]); //本地存储中如果有SEARCH_KEY就取出来，没有就默认为[]
  insertArray(songs,song,PLAY_MAX_LENGTH,function(item) {
    return item.id === song.id;
  });
  storage.set(PLAY_KEY,songs);
  return songs;
}

export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY,[]);
  insertArray(songs,song,FAVORITE_MAX_LENGTH,function(item) {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY,songs);
  return songs;
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY,[]);
  deleteFromArray(songs,function (item) {
    return item.id === song.id
  });
  storage.set(FAVORITE_KEY,songs);
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY,[])
}
