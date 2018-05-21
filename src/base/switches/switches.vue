<template>
   <ul class="switches">
     <li class="switch-item"
         v-for="(item,index) of switches"
         :class="{'active':index === current_Index}"
         @click="switchItem(index)"
     >
       <span>{{item.name}}</span>
     </li>
   </ul>
</template>

<script type='text/ecmascript-6'>
    export default{
      props:{
        switches:{
          type:Array,
          default:[]
        },
        current_Index:{
          type:Number,
          default:0
        }
      },
      methods:{
        switchItem(index){
          this.$emit('switchItem',index);
        }
      }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
