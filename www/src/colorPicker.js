// colorPicker.js

define(['cocos2d', 'src/config'], function (cc, config) {
    'use strict';

    // 拾色器
    var ColorPicker = cc.LayerColor.extend({
        picked: null,
        
        ctor : function() {
            this._super();
            
            // 如果已有则显示，没有则创建
    //		if (this.getChildrenCount > 0) {
    //			this.setVisible(visible);
    //		} else {
                this.create();
    //		}
            
            
            return true;
        },
        
        // 创建
        create: function() {
            var color0 = cc.LayerColor.create(config.gc_color0, config.gc_colorPickerWidth * 2 + config.gc_colorPickerMargin * 3, config.gc_colorPickerWidth * 2 + config.gc_colorPickerMargin * 3);
            var color1 = cc.LayerColor.create(config.gc_color1, config.gc_colorPickerWidth, config.gc_colorPickerWidth);
            var color2 = cc.LayerColor.create(config.gc_color2, config.gc_colorPickerWidth, config.gc_colorPickerWidth);
            var color3 = cc.LayerColor.create(config.gc_color3, config.gc_colorPickerWidth, config.gc_colorPickerWidth);
            var color4 = cc.LayerColor.create(config.gc_color4, config.gc_colorPickerWidth, config.gc_colorPickerWidth);
            
            color1.setPosition(cc.p(config.gc_colorPickerMargin, config.gc_colorPickerWidth + config.gc_colorPickerMargin * 2));
            color2.setPosition(cc.p(config.gc_colorPickerWidth + config.gc_colorPickerMargin * 2, config.gc_colorPickerWidth + config.gc_colorPickerMargin * 2));
            color3.setPosition(cc.p(config.gc_colorPickerMargin, config.gc_colorPickerMargin));
            color4.setPosition(cc.p(config.gc_colorPickerWidth + config.gc_colorPickerMargin * 2, config.gc_colorPickerMargin));

            this.addChild(color0);
            this.addChild(color1);
            this.addChild(color2);
            this.addChild(color3);
            this.addChild(color4);
            
            this.setPosition(cc.p(config.gc_size.width / 2 - config.gc_colorPickerWidth, config.gc_size.height / 2 - config.gc_colorPickerWidth));

            this.setVisible(false);
        },
        // 得到选中的颜色
        getPicked: function() {
            var picked = this.picked;
            this.picked = null;
            
            return picked;
        },
        // 显示隐藏
        show: function(visible) {
            this.setVisible(visible);
        },
        touch: function(touch) {
            var result = false;
            
            if (this._visible === true && touch[0] != null) {
                var posthis = this.getPosition();
                
                // 遍历四个格子
                for (var i = 1; i < this.getChildrenCount(); i++) {
                    var size = this.getChildren()[i].getContentSize();
                    var pos = this.getChildren()[i].getPosition();

                    // 如果点击在格子内部
                    if (touch[0]._point.x > posthis.x + pos.x && touch[0]._point.x < posthis.x + pos.x + size.width
                            && touch[0]._point.y > posthis.y + pos.y && touch[0]._point.y < posthis.y + pos.y + size.height) {
                        result = true;
                        this.picked = config.gc_colorArray[i - 1];
                        this.setVisible(false);
                        break;
                    }
                }
            }
            
            if (result === true) {
                return this.picked;
            } else {
                return null;
            }
        }
    });

    return ColorPicker;
});
