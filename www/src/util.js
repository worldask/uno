// util.js
// 工具类

define(['cocos2d'], function(cc) {
    'use strict';

    var Util = cc.Class.extend({ 
        // 防抖动，只有当两次触发之间的时间间隔大于事先设定的值，这个新函数才会运行实际的任务
        debounce: function(fn, delay){
            // 声明计时器
             var timer = null;
             
             return function(){
                 var context = this, args = arguments;
                 clearTimeout(timer);
                 timer = setTimeout(function(){
                     fn.apply(context, args);
                 }, delay);
             };
         }
    });

    return Util;
});
