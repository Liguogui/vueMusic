<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!--热门搜索-->
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" :data="shortcut" ref="scroll" :refreshDelay="100">
        <div>
          <hot-key :hotKey="hotKey" @addQuery="addQuery"></hot-key>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory"
                         @select="addQuery"
                         @deleteOne= "deleteOne"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div >
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query"
               @beforeScroll="blurInput"
               @select="saveSearch"
               ref="suggest"
      ></suggest>
    </div>
    <confirm ref="confirm"
             text="是否清空所有搜索历史"
             confirmBtnText="清空"
             @confirm="deleteAll"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import Suggest from 'components/suggest/suggest'
  import HotKey from 'pages/search/components/hot-key'
  import SearchList from 'components/search-list/search-list'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from  'api/config'
  import {mapActions,mapGetters} from 'vuex'
  import {playListMixin,searchMixin} from 'common/js/mixins'

  export default { //ajax,jsonp,vuex 传递数据
    mixins:[playListMixin,searchMixin],
    created(){
      this._getHotKey();
    },
    computed:{
      shortcut(){ //传给scroll组件的data值,一旦发生变化scroll组件就刷新
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory',
        'playList'
      ])
    },
    data(){
      return {
        hotKey:[]
      }
    },
    methods:{
      _getHotKey(){
        getHotKey().then((res)=>{
          if(res.code === ERR_OK){
            this.hotKey = res.data.hotkey.slice(0,10);
          }
        })
      },
      deleteAll(){
        this.clearSearchHistory();
      },
      showConfirm(){
        this.$refs.confirm.show();
      },
      handlePlayList(playList){
        const bottom = playList.length > 0 ?'60px': '';

        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.scroll.refresh();

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();

      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch:{
      query(newQuery){
        if(!newQuery){ //suggest组件消失时
          setTimeout(()=>{
            this.$refs.scroll.refresh();
          },20)
        }
      }
    },
    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll,
      HotKey
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              .icon
                extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
