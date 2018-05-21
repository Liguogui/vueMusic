<template>
  <div class="singer" ref="singer">
    <list-view @selectItem="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import { getSingerList } from "api/singer";
  import { ERR_OK } from 'api/config'
  import {mapMutations} from 'vuex'
  import {playListMixin} from  'common/js/mixins'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;

  export default { //ajax,jsonp,vuex 整理数据,传递数据，跳转页面
    mixins:[playListMixin],
    data(){
      return {
        singers:[]
      }
    },
    components:{
      ListView
    },
    created(){
      this._getSingerList();
    },
    methods:{
      handlePlayList(playList){
        const bottom = playList.length>0 ? '60px' : '';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      selectSinger(singer){
        this.$router.push({
          path:`/singer/${singer.mid}`
        });
        this.setSinger(singer) //this.$store.commit('SET_SINGER',singer)
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code === ERR_OK){
            this.singers = this._nomalizeSinger(res.data.list);
          }
        })
      },
      _nomalizeSinger(list){
        let map = {
          hot:{
            title : HOT_NAME,
            items:[]
          }
        };
        list.forEach((item,index)=>{
          if(index<HOT_SINGER_LEN){
            map.hot.items.push(new Singer({
                mid:item.Fsinger_mid,
                name:item.Fsinger_name
              })
            )
          }
          const key = item.Findex; //'A','Z'
          if(!map[key]){   //map['Z']
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            mid:item.Fsinger_mid,
            name:item.Fsinger_name
          }));
        });
        // console.log(this.map);
        //map:{'Z':{title:'Z',items:[{mid,name,avater}..{}]},'B':{..}...}
        // 为了得到有序的对象,需要处理map
        let hot =[];
        let ret = [];
        let re = /[a-zA-Z]/g;
        for(let i in map){
          let val = map[i];
          if(val.title.match(re)){
            ret.push(val)
          }else if(val.title === HOT_NAME){
            hot.push(val)
          }
        }
        // hot [{title:'热门',items:[{}..{}]}]
        //ret [{title:'Z',items:[{}..{}]}...] 有26个这样的对象
        ret.sort((a,b)=>{
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        });
        return hot.concat(ret) //大数组,有27个对象
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      })

    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    left:0
    right:0
</style>
