// pile.js

define(['cocos2d', 'src/config', 'src/resource'], function (cc, config, res) {
    'use strict';

    var Pile = cc.Layer.extend({
        ctor: function(type) {
            this._super();
        },
        
        // 根据牌堆未旋转时的位置，换算出旋转后的位置
        getPosByRotation : function(pos) {
            var posTo;
            
            switch(this.getRotation()) {
                case 0:
                    posTo = pos;
                    break;
                case 90:
                    posTo = cc.p(pos.x * -1, pos.y);
                    break;
                case 180:
                    posTo = cc.p(pos.x * -1, pos.y * -1);
                    break;
                case 270:
                    posTo = cc.p(pos.x, pos.y * -1);
                    break;
            }
            
            return posTo;
        },

        // 根据未旋转时的位置，换算出牌旋转后的位置
        getCardPosByRotation : function(pos) {
            var posTo;
            
            switch(this.getRotation()) {
                case 0:
                    posTo = pos;
                    break;
                case 90:
                    if (pos.x > 0) {
                        pos.x = pos.x * -1
                    }
                    posTo = cc.p(pos.y, pos.x * -1);
                    break;
                case 180:
                    if (pos.x > 0) {
                        pos.x = pos.x * -1
                    }
                    if (pos.y > 0) {
                        pos.y = pos.y * -1
                    }
                    posTo = cc.p(pos.x * -1, pos.y * -1);
                    break;
                case 270:
                    if (pos.y > 0) {
                        pos.y = pos.y * -1
                    }
                    posTo = cc.p(pos.y * -1, pos.x);
                    break;
            }
            
            return posTo;
        },

        // 根据牌堆旋转角度，获取牌堆中牌的位置
        getPosToByRotation : function(i, quantity) {
            var pileWidth = this.getWidth(quantity);
            var posTo;
            
            switch(this.getRotation()) {
                case 0:
                    posTo = cc.p((config.gc_size.width -  pileWidth) / 10 * 2.8 + config.gc_cardGap * i, config.gc_cardHeight / 2);
                    break;
                case 90:
                    posTo = cc.p((config.gc_size.height +  pileWidth) / -2 + config.gc_cardGap * i, config.gc_cardHeight / 5);
                    break;
                case 180:
                    posTo = cc.p((config.gc_size.width +  pileWidth) / -2 + config.gc_cardGap * i, config.gc_size.height * -1 + config.gc_cardHeight / 5);
                    break;
                case 270:
                    posTo = cc.p((config.gc_size.height -  pileWidth) / 2 + config.gc_cardGap * i, (config.gc_size.width) * -1 + config.gc_cardHeight / 5);
                    break;
            }
            
            return posTo;
        },

        getWidth : function(cardQuantity) {
            if (cardQuantity == null) {
                cardQuantity = this.getChildrenCount();
            }

            var width = config.gc_cardGap * (cardQuantity - 1) + config.gc_cardWidth;
            return width;
        }
    });

    return Pile;
});
