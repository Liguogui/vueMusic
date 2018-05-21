import jsonp from 'common/js/jsonp'
import {commonParams,options} from "./config"

export function getSingerList() { //获取歌手列表
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';// 域名

  const data = Object.assign({},commonParams,{
    channel:'singer',
    page:'list',
    key:'all_all_all',
    pagesize:100,
    pagenum:1,
    loginUin:0,
    hostUin:0,
    platform:'yqq',
    needNewCode:0
  });
  //console.log(data); //data是除了回调函数名(jsonpCallback)之外的所有的参数集合
  // data:{format:"jsonp",g_tk:5381,inCharset:"utf-8",needNewCode:1,notice:0,outCharset:"utf-8",platform:"h5",uin:0}
  return jsonp(url,data,options);
}

export function getSingerDetail(singerMid) { //获取相应歌手的音乐
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';// 域名

  const data = Object.assign({},commonParams,{
    loginUin:0,
    hostUin:0,
    platform:'yqq',
    needNewCode:0,
    singermid:singerMid,
    order:'listen',
    begin:0,
    num:100,
    songstatus:1
  });
  return jsonp(url,data,options);
}
