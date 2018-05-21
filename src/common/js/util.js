function getRandomInt(min,max) {
 return Math.floor(Math.random() * (max-min+1) + min); //min与max中的随机数，包括min，也包括max
}

export function shuffle(arr) { //打乱数组
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t
  }
  return _arr
}

//节流函数
export function debounce(func,delay) {
  let timer;
  return function(...args){
    timer && clearTimeout(timer);
    timer = setTimeout(()=>{
      func.apply(this,args)
    },delay)
  }
}