// button.js

define(['cocos2d', 'src/config', 'src/resource'], function (cc, config, res) {
    'use strict';

    var Button = cc.Layer.extend({
        type: null,
        enable: false,
        
        ctor: function(img, text, number) {
            this._super();
            this.create(img, text, number);
            
            return true;
        },

        // 创建一个按钮
        create: function(img, text, number) {
            this.setType(text);
            
            // 牌面或牌背图片
            var imgSprite = cc.Sprite.create(img); 
            this.addChild(imgSprite);
            imgSprite.setScale(config.gc_cardScale);
            imgSprite.setPosition(cc.p(config.gc_size.width - config.gc_cardWidth * 1.8 - config.gc_cardWidth * 1.3 * number, config.gc_cardHeight * 1.4));
            
            // TODO 牌多时按钮会被挡住
            
            // 文字，固定为白色
            var txt = cc.LabelTTF.create(text, config.s_font1, config.s_fontsize1);
            imgSprite.addChild(txt);
            txt.setColor(cc.c4b(255, 255, 255, 255));
            
            // 文字居中
            txt.setAnchorPoint(0.5, 0.5);
            var posX = config.gc_cardWidth / 4;
            var posY = config.gc_cardHeight / 3;
            txt.setPosition(cc.p(posX, posY));
            
    //		this.setContentSize(imgSprite.getContentSize());
    //		this.setPosition(cc.p(gc_size.width - gc_cardWidth * 2.5 - gc_cardWidth * 1.3 * number, gc_cardHeight));
                
            return true;
        },

        // 设置按钮可用
        setEnable: function(flag) {
            this.enable = flag;
            
            // 可用时动态效果
            var sprite = this.getChildren()[0];
            if (flag === true) {
                var action = cc.RepeatForever.create(cc.Blink.create(2.4, 2));
                sprite.runAction(action);
            } else {
                sprite.setVisible(true);
                sprite.stopAllActions();
            }
        },

        // 设置按钮文字
        setType: function(text) {
            this.type = text;
        },

        // 点击事件
        touch: function(touch) {
            if (this.enable === true && touch[0] != null) {
                var size = this.getChildren()[0].getContentSize();
                var pos = this.getChildren()[0].getPosition();
                
                if (touch[0]._point.x > pos.x - size.width / 2 && touch[0]._point.x < pos.x + size.width / 2
                        && touch[0]._point.y > pos.y - size.height / 2 && touch[0]._point.y < pos.y + size.height / 2) {
                    if (this.type == res.s_textButton1) {
                        // draw按钮事件
                        // cc.Director.getInstance().getRunningScene().getChildren()[0].play.drawCard();
                        cc.Director.getInstance().getRunningScene().getChildren()[0].play.oneHandAuto();
                    } else if (this.type == res.s_textButton2) {
                        // pass按钮事件
                        cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();
                    }
                }
            }
        }
    });

    return Button;
});
