// pile.js

define(['cocos2d', 'src/config', 'src/resource', 'src/cardLayer'], function (cc, config, res, cardLayer) {
    'use strict';

    var pile = cc.Layer.extend({
        ctor: function(type) {
            this._super();
            if (type == "left") {
                this.createLeft();
            } else if (type == "dump") {
                this.createDump();
            }
        },

        // 创建余牌堆
        createLeft : function() {
            var card = new cardLayer();
            // 居左上显示
            var offsetX = parseInt((config.gc_size.width - config.gc_cardWidth) / 3);
            var offsetY = parseInt((config.gc_size.height - config.gc_cardHeight) / 3 * 2);

            this.setPosition(cc.p(offsetX, offsetY));
            this.addChild(card);
            
            return true;
        },

        // 创建废牌堆
        createDump : function() {
            var dump = new cardLayer();
            var offsetX = (config.gc_size.width - config.gc_cardWidth) / 3 * 2;
            var offsetY = (config.gc_size.height - config.gc_cardHeight) / 3 * 2;
            dump.setPosition(cc.p(offsetX, offsetY));
            this.addChild(dump);
            
            // 上方显示当前牌颜色
            var label = cc.LabelTTF.create("", config.s_font1, config.s_fontsize1);
            label.setColor(config.gc_color5);
            var offsetX = (config.gc_size.width - config.gc_cardWidth) / 3 * 2;
            var offsetY = (config.gc_size.height) / 3 * 2 + config.gc_cardHeight / 4;
            label.setPosition(cc.p(offsetX, offsetY));
            this.addChild(label);
            
            this.setPosition(cc.p(0, 0));
            this.setContentSize(config.gc_size);
            
            return true;
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
        },

        // 设置废牌堆上方显示的文字
        setText : function(color, number) {
            if (number < 0 || number > 9) {
                number = "";
            }
    		
            if (color != null) {
                color = color.substr(1);
            }
            
            this.getChildren()[1].setString(color + "  " + number);
        }
    });

    return pile;
});
