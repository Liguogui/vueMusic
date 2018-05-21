<template>
  <ul v-show="topList.length">
    <li class="item" v-for="item of topList" @click="selectItem(item)">
      <div class="icon">
        <img width="100" height="100" v-lazy="item.picUrl"/>
      </div>
      <ul class="songlist">
        <li class="song" v-for="(song,index) of item.songList">
          <span>{{index+1}}</span>
          <span>{{song.songname}}-{{song.singername}}</span>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script type='text/ecmascript-6'>
    export default{
      props:{
        topList:{
          type:Array,
          default:[]
        }
      },
      methods:{
        selectItem(item){
          this.$emit('selectItem',item)
        }
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .item
    display: flex
    margin: 0 20px
    padding-top: 20px
    height: 100px
    &:last-child
      padding-bottom: 20px
    .icon
      flex: 0 0 100px
      width: 100px
      height: 100px
    .songlist
      flex: 1
      display: flex
      flex-direction: column
      justify-content: center
      padding: 0 20px
      height: 100px
      overflow: hidden
      background: $color-highlight-background
      color: $color-text-d
      font-size: $font-size-small
      .song
        no-wrap()
        line-height: 26px
</style>
