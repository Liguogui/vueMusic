<template>
   <scroll class="listview"
           :data='data'
           ref="listview"
           :listenScroll="listenScroll"
           @scroll="handleScroll"
   >
     <ul>
       <!--字母标题和相应列表-->
       <li class="list-group" v-for="group of data" ref="listGroup">
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li  v-for="item of group.items"
                 class="list-group-item"
                 :key="item.mid"
                 @click="selectItem(item)"
            >
                <img v-lazy="item.imgUrl" class="avatar"/>
                <span class="name">{{item.name}}</span>
            </li>
          </ul>
       </li>
     </ul>
      <!--字母表-->
     <div class="list-shortcut"
          @touchstart.stop.prevent="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          @touchend= "onShortcutTouchEnd"
     >
       <ul>
         <li v-for="(item,index) of shortcutList"
             class='item'
             :data-index="index"
             :class="{'current':currentIndex===index}"
         >
            {{item}}
         </li>
       </ul>
     </div>

      <!--滚动固定标题-->
     <div class="list-fixed" ref="fixed">
       <h1 class="fixed-title" v-show="fixedTitle">
         {{fixedTitle}}
       </h1>
     </div>

     <div v-show="!data.length" class="loading-container">
       <loading></loading>
     </div>
   </scroll>
</template>

<script type='text/ecmascript-6'>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18; //每个字母的高度
  const TITLE_HEIGHT = 30; //每个字母标题的高度

    export default{
      props:{
        data:{
          type:Array,
          default:[]
        }
      },
      created(){
        this.touch = {};
        this.listenScroll = true;
        this.listHeight = [];
      },
      data(){
        return{
          scrollY:-1, //滚动子页面的滚动距离
          currentIndex:0, //当前应该高亮第几个 默认0，第一个‘热字高亮’
          diff:-1  //下限与滚动距离的差，完善滚动固定标题
        }
      },
      computed:{
        shortcutList(){ //右边的字母表 ['热','A','B'...'Z'] <=27个
          return this.data.map((group)=>{
            return group.title.substr(0,1)
          })
        },
        fixedTitle(){ //固定到顶部的标题
          if(this.scrollY > 0){
            return ''
          }
          return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
      },
     components:{
       Scroll,
       Loading
     },
      methods:{
        selectItem(item){
          this.$emit('selectItem',item);
        },
        onShortcutTouchStart(e){
          this.touch.initiated = true;
          //获取点击第几个字母 比如‘热’0号位, ‘A’一号位
          let anchorIndex = getData(e.target,'index'); //e.target.getAttribute('data-index')

          let firstTouch = e.touches[0];
          this.touch.y1 = firstTouch.pageY;
          this.touch.anchorIndex = anchorIndex;

          this._scrollTo(anchorIndex);  //让better-scroll滚动到相应位置
        },
        onShortcutTouchMove(e){
          if(!this.touch.initiated){
            return
          }
          //利用点击位置和滑动位置的距离，除以单个字母的大小,算出向上向下移动了多少个字母
          //再用当前点击的字母位置加上此值，得出新的字母位置
          let firstTouch = e.touches[0];
          this.touch.y2 = firstTouch.pageY;
          let delta = Math.floor((this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT);
          //console.log(delta);//1,2,3,-1,-2,-3
          let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
          this._scrollTo(anchorIndex)
        },
        onShortcutTouchEnd(e){
          this.touch.initiated = false;
        },
        handleScroll(pos){ //处理better-scroll滚动事件
          // console.log(pos);
          this.scrollY = pos.y; //实时获取better-scroll滚动Y轴的距离
        },
        refresh(){
          this.$refs.listview.refresh();
        },
        _scrollTo(index){ //点击字母表跳转
          if(!index && index !==0 ){ //点击内边距时,index会为null或者NAN，并且排除误伤index为0的时候
            return
          }
          if(index<0){ //当往顶部上滑动时，例：往‘热’字上滑动
             index = 0
          }else if(index>this.listHeight.length - 2){ //当index大于最后一个字母的index值时，把index的值设为最后一个字母的index的值
              index = this.listHeight.length -2 ;
          }
          // console.log(index);
          //改变scrollY的值,为了触发watch scrollY的方法，得出this.currentIndex的值，让相应的字母高亮
          this.scrollY = -this.listHeight[index];
          this.$refs.listview.scrollToElement(this.$refs.listGroup[index])
        },
        _calculateHeight(){
          //获取每个list-group的高度，例如获取“A”标题及其下歌手，这整块的高度
          //用累加的方式获取每个list-group到顶端的高度
          this.listHeight = [];
          const list = this.$refs.listGroup;
          let height = 0;
          this.listHeight.push(height);
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            height += item.clientHeight;
            this.listHeight.push(height)
          }
          // console.log(this.listHeight); //[0,760,1030...]
        }
      }
      ,
      watch:{
        //主要视图来源于外部传进来的data数据，而外部的data数据又是通过异步获取，
        //要定位在li标签渲染之后才进行处理的话，用watch监视data值最好
        data(){ //当data从无值到有值或者data发生变化时，获取每个list-group的高度
          setTimeout(()=>{
            this._calculateHeight();
          },20);
        },
        scrollY(newY) { //比较scrollY的值和this.listHeight数组中的值，算出当前滑动到哪个字母歌手列表内
          const listHeight = this.listHeight;
          // 当滚动到顶部，newY>0
          if (newY > 0) {
            this.currentIndex = 0;
            return
          }
          // 在中间部分滚动
          for (let i = 0; i < listHeight.length-1; i++) {
            let height1 = listHeight[i];
            let height2 = listHeight[i + 1];
            // console.log(-newY);
            if (-newY >= height1 && -newY < height2) {
              this.currentIndex = i;
              // console.log(this.currentIndex);
              this.diff = height2 + newY; //下限与滚动距离的差,newY本身就是负值，被误会了
              // console.log(this.diff);
              return
            }
          }
          //当滚动到底部，且-newY大于最后一个元素的上限
          this.currentIndex = listHeight.length - 2
        },
        diff(newVal) {
          let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
          // console.log(fixedTop);
          // console.log(this.fixedTop); //先undefined 然后很多0,性能优化,没必要一直translate3d(0,0,0)
          if (this.fixedTop === fixedTop) {
            return
          }
          this.fixedTop = fixedTop;
          this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
      }
    }

</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "~common/stylus/variable"
  .listview
    position:relative
    width:100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
