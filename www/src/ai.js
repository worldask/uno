// ai.js

define(['cocos2d', 'src/config'], function (cc, config) {
    'use strict';
   
    // AI类
    var AI = cc.Class.extend({
        // 随机获取一种颜色
        randomColor: function() {
            var rand = Math.floor(Math.random() * config.gc_colorArray.length);
            return config.gc_colorArray[rand];
        }

    });

    return AI;
});

