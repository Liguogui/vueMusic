<template>
  <div class="search-hot-history">
    <div class="hot-key">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li @click="addQuery(item.k)" class="item" v-for="item of hotKey">
          <span>{{item.k}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
    export default{
      props:{
        hotKey:{
          type:Array,
          default:[]
        }
      },
      methods:{
        addQuery(hotKey){
          this.$emit('addQuery',hotKey);
        }
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .hot-key
    margin: 0 20px 20px 20px
    .title
      margin-bottom: 20px
      font-size: $font-size-medium
      color: $color-text-l
    .item
      display: inline-block
      padding: 5px 10px
      margin: 0 20px 10px 0
      border-radius: 6px
      background: $color-highlight-background
      font-size: $font-size-medium
      color: $color-text-d
</style>
