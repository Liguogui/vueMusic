import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk:1928093487,
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
//query查询字段，page查第几页,zhida要不要查相关歌手,perpage请求多少条
export function search(query, page, zhida,perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
