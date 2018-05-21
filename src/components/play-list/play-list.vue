<template>
   <transition name="list-fade">
     <div v-show="showFlag">
      <div class="playlist" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="iconMode" @click="changeMode"></i>
              <span class="text">{{modeText}}</span>
              <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
            </h1>
          </div>
          <scroll class="list-content" :data="sequenceList" ref="scroll" :refreshDelay="100">
            <transition-group name="list" tag="ul">
              <li class="item" v-for="(item,index) of sequenceList"
                  @click.stop="selectItem(item,index)"
                  ref="listItem"
                  :key="item.id"
              >
                <i class="current" :class="getCurrentIcon(item)"></i>
                <span class="text">{{item.name}}</span>
                <span class="like" @click.stop="toggleFavorite(item)">
                  <i class="icon" :class="getFavoriteIcon(item)"
                  ></i>
                </span>
                <span class="delete" @click.stop="deleteItem(item,index)">
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-operate">
            <div class="add" @click.stop="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-close" @click="hide">
            <span>关闭</span>
          </div>
        </div>
      </div>
       <confirm ref="confirm"
                text="是否清空播放列表"
                confirmBtnText="清空"
                @confirm="clearList"
       ></confirm>
       <add-song ref="addSong"></add-song>
     </div>
   </transition>
</template>

<script type='text/ecmascript-6'>
  import {mapMutations,mapActions} from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import {playMode} from 'common/js/config'
  import Confirm from 'base/confirm/confirm'
  import {playerMixin} from 'common/js/mixins'
  import AddSong from 'components/add-song/add-song'

    export default{
      mixins:[playerMixin],
      data(){
        return{
          showFlag:false
        }
      },
      computed:{
        modeText(){
          return (this.mode === playMode.sequence) ? '顺序播放'
            : (this.mode === playMode.loop ? '单曲循环' :  '随机播放')
        }
      },
      methods:{
        show(){
          this.showFlag = true;
          setTimeout(()=>{
            this.$refs.scroll.refresh();
            this.scrollToCurrent(this.currentSong)
          },20)
        },
        hide(){
          this.showFlag = false;
        },
        getCurrentIcon(item){
           if(item.id === this.currentSong.id){
             return 'icon-play'
           }
           return ''
        },
        //由于有随机播放，所以sequenceList是表面歌单列表,playList是实际歌单列表
        selectItem(item,index){ //点哪首歌，哪首歌播放
          if(this.mode === playMode.random){ //随机播放
            let index = this.playList.findIndex((song)=>{
              return song.id === item.id
            });
            this.setCurrentIndex(index); //这个index和下面那个index可不一样
          }
          else{
            this.setCurrentIndex(index); //顺序播放或单曲循环
          }
          this.setPlayingState(true);
        },
        scrollToCurrent(currentSong){ //自动滚到当前播放歌曲
          let index = this.sequenceList.findIndex((song)=>{
            return song.id === currentSong.id
          });
          this.$refs.scroll.scrollToElement(this.$refs.listItem[index],300);
          //console.log(index);
          //console.log(this.$refs.listItem.length);
          if(index === this.$refs.listItem.length){ //新添加歌曲
            setTimeout(()=>{
              this.$refs.scroll.scrollTo(0,this.$refs.scroll.getScrollY());
            },200)
          }
        },
        deleteItem(item,index){ //点击×号删除当条item
          let playlist = this.playList.slice();
          let sequencelist = this.sequenceList.slice();
          if(playlist.length === 1){
            this.clearSongList();
            this.hide();
            return
          }
          if(playlist.length === 2 ){
            this.setCurrentIndex(0); //下面playlist会删掉，时间很短感觉不到
          }
          if(this.mode === playMode.random){ //随机播放
            let tindex = playlist.findIndex((song)=>{
              return song.id === item.id
            });
            if(tindex<this.currentIndex){
              this.setCurrentIndex(this.currentIndex-1);
            }
            playlist.splice(tindex,1);
          }
          else{
            if(index<this.currentIndex){
              this.setCurrentIndex(this.currentIndex-1);
            }
            playlist.splice(index,1);
          }
          sequencelist.splice(index,1);
          this.setPlayList(playlist);
          this.setSequenceList(sequencelist);
        },
        showConfirm(){
          this.$refs.confirm.show();
        },
        clearList(){
          this.clearSongList();
          this.hide();
        },
        showAddSong(){
          this.$refs.addSong.show();
        },
        ...mapMutations({
          setCurrentIndex:'SET_CURRENT_INDEX',
          setPlayingState:'SET_PLAYING_STATE',
          setPlayList:'SET_PLAY_LIST',
          setSequenceList:'SET_SEQUENCE_LIST'
        }),
        ...mapActions([
          'deletePlayListOnlyOne',
          'clearSongList'
        ])
      },
      watch:{
        currentSong(newSong,oldSong){
          if(!this.showFlag || newSong.id === oldSong.id){
            return
          }
          this.scrollToCurrent(newSong);
        }
      },
      components:{
        Scroll,
        Confirm,
        AddSong
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity .3s
      .list-wrapper
        transition: all .3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
