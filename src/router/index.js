import Vue from 'vue'
import Router from 'vue-router'
//import Recommend from 'pages/recommend/recommend'
const Recommend = () => import('pages/recommend/recommend')
const Singer = () => import('pages/singer/singer')
const Rank = () => import('pages/rank/rank')
const Search = () => import('pages/search/search')
const UserCenter = () => import('pages/user-center/user-center')
const Disc = () => import('pages/recommend/children/disc')
const SingerDetail = () => import('pages/singer/children/singer-detail')
const RankDetail = () => import('pages/rank/children/rank-detail')


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:Disc
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children:[{
        path:':id',
        component:SingerDetail
      }]
    },
    {
      path: '/rank',
      component: Rank,
      children:[{
        path:':id',
        component:RankDetail
      }]
    },
    {
      path: '/search',
      component: Search,
      children:[{
        path:':id',
        component:SingerDetail
      }]
    },
    {
      path:'/user',
      component:UserCenter
    }
  ]
})
