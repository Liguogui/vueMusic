<template>
  <div class="recommend" ref='recommend'>
    <scroll ref='scroll' class="recommend-content" :data='discList'>
      <div>
        <swiper :swiperList="recommends" @load="loadImage"></swiper>
        <recommend-list :discList="discList" @seletItem="seletItem"></recommend-list>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type='text/ecmascript-6'>
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Swiper from 'base/swiper/swiper'
  import RecommendList from 'pages/recommend/components/recommend-list'
  import { getRecommend, getDiscList } from "api/recommend";
  import { ERR_OK } from 'api/config'
  import {mapGetters} from 'vuex'
  import {mapMutations} from 'vuex'

  export default { //ajax,jsonp,vuex 传递数据，跳转页面
    name: 'Recommend',
    data() {
      return {
        recommends:[],
        discList:[]
      }
    },
    computed:{
      ...mapGetters([
        'playList'
      ])
    }, //mixins失效
    created(){
      this._getRecommend();
      this._getDiscList();
    },
    mounted(){
      this.handlePlayList(this.playList);
    }, //mixins失效
    activated(){
      this.handlePlayList(this.playList);
    },
    methods:{
      handlePlayList(playList){ //mixins失效
        const bottom = playList.length>0 ? '60px' : '';
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getRecommend(){
        getRecommend().then((res)=>{
          if(res.code === ERR_OK ){
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code === ERR_OK ){
            // console.log(res.data.list);
            this.discList = res.data.list;
          }
        })
      },
      loadImage(){
        if(!this.checkLoaded){ //加载图片后,scroll刷新一次
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
        }
      },
      seletItem(item){
        this.$router.push({ //进入二级页面
          path:`/recommend/+${item.dissid}`
        });
        this.setDisc(item); //在vuex中写入disc对象，这个对象有id,name,imgUrl
      },
      ...mapMutations({
        setDisc:'SET_DISC'
      })
    },
    watch:{
      playList(newVal){
        this.handlePlayList(newVal);
      }
    }, //mixins失效
    components:{
      // Slider,
      Swiper,
      Scroll,
      RecommendList,
      Loading
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>

  @import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .loading-container
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
</style>
