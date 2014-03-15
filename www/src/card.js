// card.js

define(['cocos2d', 'src/config', 'src/resource'], function (cc, config, res) {
    'use strict';

    var Card = cc.Layer.extend({
        layerFront: null,
        layerBack: null,
        color : null,
        Color4B: null,
        isFront: false,
        cardNumber: -1,
        selected : false,
        ctor: function (isFront, color, number) {
            this._super();
            this.create(isFront, color, number);
        },

        // 创建一张牌，isFront是否牌面朝上，color牌的颜色，number牌的数字
        create : function(isFront, color, number) {
            this.setCardColor(color);
            this.setCardNumber(number);

            this.layerFront = cc.Layer.create();
            this.layerBack = cc.Layer.create();
            
            // 牌面着色
            if (this.Color4B != null && this.number < 13) {
                var layerColor = cc.LayerColor.create(this.Color4B, config.gc_cardWidth, config.gc_cardHeight + config.gc_cardWidth * config.gc_cardMargin * 2);
                layerColor.setPosition(cc.p(config.gc_cardWidth / -2, config.gc_cardHeight / -2 - config.gc_cardWidth * config.gc_cardMargin));
                
                this.layerFront.addChild(layerColor);
                
                // 添加椭圆层
                var imgSprite2 = cc.Sprite.create(res.s_card2);
                imgSprite2.setScale(config.gc_cardScale);
                this.layerFront.addChild(imgSprite2);
            }
            
            // 牌面图片
            var imgSpriteFront;
            if (this.number == 13) {
                imgSpriteFront = cc.Sprite.create(res.s_card13);
            } else if (this.number == 14) {
                    imgSpriteFront = cc.Sprite.create(res.s_card14); 
            }else {
                imgSpriteFront = cc.Sprite.create(res.s_card);
            }
            imgSpriteFront.setScale(config.gc_cardScale);
            this.layerFront.addChild(imgSpriteFront);
            
            // 添加牌面数字
            if (this.number >= 0 && this.number <= 9) {
                // TODO 6和9要加下划线区分
                
                // 中间数字，固定为白色
                var numberLabel1 = cc.LabelTTF.create(this.number, config.s_font1, config.s_fontsize2);
                numberLabel1.setColor(this.Color4B);
                
                // 左上角数字
                var numberLabel2 = cc.LabelTTF.create(this.number, config.s_font1, config.s_fontsize3);
                numberLabel2.setColor(cc.c3(255, 255, 255));
                numberLabel2.setPosition(cc.p(config.gc_cardWidth / -2 + config.gc_cardWidth * config.gc_cardMargin * 2, config.gc_cardHeight / 2 - config.gc_cardWidth * config.gc_cardMargin * 3));
                
                // 右下角数字
                var numberLabel3 = cc.LabelTTF.create(this.number, config.s_font1, config.s_fontsize3);
                numberLabel3.setColor(cc.c3(255, 255, 255));
                numberLabel3.setPosition(cc.p(config.gc_cardWidth / 2 - config.gc_cardWidth * config.gc_cardMargin * 2, config.gc_cardHeight / -2 + config.gc_cardWidth * config.gc_cardMargin * 2));
                
                this.layerFront.addChild(numberLabel1);
                this.layerFront.addChild(numberLabel2);
                this.layerFront.addChild(numberLabel3);
            } else if (this.number >= 10 && this.number <= 12) {
                var sprite1, sprite2, sprite3;

                switch (this.number) {
                    case 10:
                        sprite1 = cc.Sprite.create(res.s_card10);
                        sprite2 = cc.Sprite.create(res.s_card10);
                        sprite3 = cc.Sprite.create(res.s_card10);
                        break;
                    case 11:
                        sprite1 = cc.Sprite.create(res.s_card11);
                        sprite2 = cc.Sprite.create(res.s_card11);
                        sprite3 = cc.Sprite.create(res.s_card11);
                        break;
                    case 12:
                        sprite1 = cc.Sprite.create(res.s_card12);
                        sprite2 = cc.Sprite.create(res.s_card12);
                        sprite3 = cc.Sprite.create(res.s_card12);
                        break;
                }
                
                sprite1.setScale(config.gc_cardScale);
                
                sprite2.setScale(config.gc_cardScriptScale);
                sprite2.setPosition(cc.p(config.gc_cardWidth / -2 + config.gc_cardWidth * config.gc_cardMargin * 2, config.gc_cardHeight / 2 - config.gc_cardWidth * config.gc_cardMargin * 3));
                
                sprite3.setScale(config.gc_cardScriptScale);
                sprite3.setPosition(cc.p(config.gc_cardWidth / 2 - config.gc_cardWidth * config.gc_cardMargin * 2, config.gc_cardHeight / -2 + config.gc_cardWidth * config.gc_cardMargin * 2));
                
                this.layerFront.addChild(sprite1);
                this.layerFront.addChild(sprite2);
                this.layerFront.addChild(sprite3);
            }
            
            this.setContentSize(imgSpriteFront.getContentSize());

            // 牌背图片
            var imgSpriteBack = cc.Sprite.create(res.s_cardback);
            imgSpriteBack.setScale(config.gc_cardScale);
            this.layerBack.addChild(imgSpriteBack);

            this.addChild(this.layerFront);
            this.addChild(this.layerBack);

            // 牌面或牌背朝上
            if (isFront === true) {
                this.layerFront.setVisible(true);
                this.layerBack.setVisible(false);
            } else {
                this.layerFront.setVisible(false);
                this.layerBack.setVisible(true);
            }
                
            return true;
        },

        // 触摸事件
        onTouchesEnded : function (touch, event) {
            // 计算点击位置是否在牌内部
            if (touch[0]._point.x > this.getPositionX() - config.gc_cardWidth / 2 && touch[0]._point.x < this.getPositionX() + config.gc_cardGap / 2
                    && touch[0]._point.y > this.getPositionY() - config.gc_cardHeight / 2 && touch[0]._point.y < this.getPositionY() + config.gc_cardHeight / 2) {
                if (this.selected === false) {
                    this.setSelected(true);
                }  else {
                    this.setSelected(false);
                }
            }
            return true;
        },

        // 设置牌面颜色
        setCardColor : function(color) {
            this.color = color;
            
            switch (color) {
                case config.gc_colorArray[0]:
                    this.Color4B = config.gc_color1;
                    break;
                case config.gc_colorArray[1]:
                    this.Color4B = config.gc_color2;
                    break;
                case config.gc_colorArray[2]:
                    this.Color4B = config.gc_color3;
                    break;
                case config.gc_colorArray[3]:
                    this.Color4B = config.gc_color4;
                    break;
                default:
                    this.Color4B = config.gc_color0;
                    break;
            }
        },

        // 设置牌数字
        setCardNumber : function(number) {
            this.number = number;
        },

        // 设置牌选中或未选中
        setSelected : function(selected) {
            if (selected === true && this.selected === false) {
                // 弹出
                this.setPositionY(this.getPositionY() + config.gc_cardHeight / 3);
            } else if (selected === false && this.selected === true) {
                // 还原
                this.setPositionY(this.getPositionY() - config.gc_cardHeight / 3);
            }
            this.selected = selected;
        }
    });

    return Card;
});
