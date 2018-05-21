<template>
  <div class="recommend-list" v-show="discList.length">
    <h1 class="list-title">热门歌单推荐</h1>
    <ul>
      <li class="item"
          v-for='item of discList'
          :key = 'item.dissid'
          @click = 'seletItem(item)'
      >
        <div class="icon">
          <img width='60' height="60" v-lazy='item.imgurl'/>
        </div>
        <div class="text">
          <h2 class="name">
            {{item.creator.name}}
          </h2>
          <p class='desc'>
            {{item.dissname}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type='text/ecmascript-6'>
    export default{
      props:{
        discList:{
          type:Array,
          default:[]
        }
      },
      methods:{
        seletItem(item){
          this.$emit('seletItem',item)
        }
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>

  @import "~common/stylus/variable"
  .recommend-list
    .list-title
      height: 65px
      line-height: 65px
      text-align: center
      font-size: $font-size-medium
      color: $color-theme
    .item
      display: flex
      box-sizing: border-box
      align-items: center
      padding: 0 20px 20px 20px
      .icon
        flex: 0 0 60px
        width: 60px
        padding-right: 20px
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        font-size: $font-size-medium
        .name
          margin-bottom: 10px
          color: $color-text
        .desc
          color: $color-text-d
</style>
