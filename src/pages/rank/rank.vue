<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <rank-list :topList="topList" @selectItem="selectItem"></rank-list>
      <div class="loading-container" v-show="!topList.length">
        <Loading></Loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>

</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import RankList from 'pages/rank/components/rank-list'
  import {getTopList} from 'api/rank'
  import {ERR_OK} from "api/config"
  import {playListMixin} from "common/js/mixins";
  import {mapMutations} from 'vuex'
  export default { //ajax,jsonp,vuex 传递数据，跳转页面
    mixins:[playListMixin],
    created() {
      this._getTopList()
    },
    data() {
      return {
        topList: []
      }
    },
    methods: {
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
            //console.log(res.data.topList)
          }
        })
      },
      selectItem(item){
        this.$router.push({
          path:`/rank/${item.id}`
        });
        this.setTopMusic(item); //在vuex中写入topMusic对象
      },
      handlePlayList(playList){
        const bottom = playList.length  ? '60px': '' ;
        this.$refs.rank.style.bottom = bottom;
        this.$refs.toplist.refresh();
      },
      ...mapMutations({
        setTopMusic:'SET_TOP_MUSIC'
      })
    },
    components: {
      Scroll,
      RankList,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
