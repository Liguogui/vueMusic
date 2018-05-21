<template>
   <scroll class="suggest"
           :data="result"
           :pullup="pullup"
           :beforeScroll="beforeScroll"
           @scrollToEnd="searchMore"
           ref="suggest"
   >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item of result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
     <div class="no-result-wrapper" v-show="!result.length && !hasMore">
       <no-result :title="noResultTitle"></no-result>
     </div>
   </scroll>
</template>

<script type='text/ecmascript-6'>
  import {search} from 'api/search'
  import {ERR_OK} from "api/config";
  import {createSong,processSongsUrl} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'
  import {mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer';
  const PERPAGE = 20;

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: { //是否展示歌手 ajax的参数之一
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result:[],
        pullup:true,
        hasMore:true, //标识位 loading是否展现
        noResultTitle:'抱歉,无搜索结果',
        beforeScroll:true,
        oneShowSinger:true //标识位 搜索结果只出现一次歌手，下拉时不再出现歌手
      }
    },
    methods: {
      search() {   //查询字段变化的时候触发
        this.page = 1; //重置一下
        this.$refs.suggest.scrollTo(0,0); //重置一下
        this.hasMore = true;
        search(this.query, this.page, this.showSinger, PERPAGE).then((res)=>{
          if(res.code === ERR_OK){
            this._getResult(res.data);
            this._checkMore(res.data);
          }
        })
      },
      searchMore(){ //查询结果列表，向下拉的时候触发
         if(!this.hasMore){
           return
         }
         this.page ++ ;
          search(this.query, this.page, this.showSinger, PERPAGE).then((res)=>{
          if(res.code === ERR_OK){
            this._getResult(res.data);
            this._checkMore(res.data);
          }
        })
      },
      _checkMore(data){
        const song = data.song;
        if(song.list.length === 0 ||(song.curpage*song.curnum)>=song.totalnum){
          this.hasMore = false;
        }
      },
      _getResult(data){
        let ret = [];
        if(this.oneShowSinger){ //标识位只出现一次歌手
          //判断是否zhida属性是否是对象
          if(data.zhida && data.zhida.singerid){
            ret.push({
              ...data.zhida,
              ...{type:TYPE_SINGER} //区分这条数据是歌手还是歌曲用的
            })
          }
          this.oneShowSinger = false;
        }
        //给所有的song实例加上url
        processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          this.result = this.result.concat(ret.concat(songs)); //[{zhida对象}{Song}{Song}...]
          //console.log(this.result); //查询结果
        });
      },
      _normalizeSongs(list){
        let ret = [];
        list.forEach((musicdata)=>{
          if(musicdata.songid && musicdata.albumid){
            ret.push(createSong(musicdata));
          }
        });
        return ret;//[Song,Song,Song...]
      },
      getIconCls(item){
        //console.log(item);
        return item.type === TYPE_SINGER ?'icon-mine':'icon-music'
      },
      getDisplayName(item){ //页面上显示查询结果文字
        if(item.type === TYPE_SINGER){ //判断是不是zhida对象
          return item.singername
        }
        else{
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item){
        if(item.type === TYPE_SINGER){ //点击的是搜索列表中的歌手
          const singer = new Singer({
            mid:item.singermid,
            name:item.singername,
          });
          this.$router.push({
            path:`/search/${singer.mid}`
          });
          this.setSinger(singer);
        }
        else{ //点击的是搜索列表中的歌曲
          //console.log(item);
          //console.log('点击了搜索列表的歌曲');
          this.insertSong(item);
        }
        this.$emit('select');
      },
      beforeScroll(){
        this.$emit('beforeScroll');
      },
      refresh(){
        this.$refs.suggest.refresh();
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        if(!newQuery){  //查询内容query为空时
          this.result = []; //重置结果列表
          this.oneShowSinger = true; //标识位重置
          return  //不再发送ajax
        }
        this.result = []; //当query的值改变的时候,重置查询结果列表
        this.search();
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
