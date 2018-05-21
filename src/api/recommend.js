import jsonp from 'common/js/jsonp'
import {commonParams,options} from "./config"
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getRecommend() {  //获取轮播图片
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';// 域名

  const data = Object.assign({},commonParams,{
    platform:'h5',
    uin:0,
    needNewCode:1
  });
  //console.log(data); //data是除了回调函数名(jsonpCallback)之外的所有的参数集合
  // data:{format:"jsonp",g_tk:5381,inCharset:"utf-8",needNewCode:1,notice:0,outCharset:"utf-8",platform:"h5",uin:0}
  return jsonp(url,data,options);
}

export function getDiscList() { //获取推荐歌单列表
  const url = debug ? '/api/getDiscList' : 'http://demo2333.applinzi.com/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    sin: 0,
    needNewCode: 0,
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    categoryId: 10000000,
    sortId: 5,
    ein: 29,
    format:'json'
  });
  return axios.get(url,{params:data})
              .then((res)=>{
                return Promise.resolve(res.data)
              })
}
//'http://localhost:9000/api/getCdInfo'
export function getSongList(disstid) {  //取对应歌单的歌曲列表
  const url = debug ? '/api/getCdInfo' : 'http://demo2333.applinzi.com/api/getCdInfo'
  const data = Object.assign({},commonParams,{
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });
  return axios.get(url,{params:data})
              .then((res)=>{
                let ret = res.data;
                //console.log(ret)
                if (typeof ret === 'string') {
                  const reg = /^\w+\(({.+})\)$/
                  const matches = ret.match(reg)
                  if (matches) {
                    ret = JSON.parse(matches[1])
                  }
                }
                return Promise.resolve(ret)
               })
}
