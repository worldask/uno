// table.js

define(['cocos2d', 'src/config', 'src/resource', 'src/play', 'src/pile', 'src/button', 'src/colorPicker'], 
        function (cc, config, res, Play, Pile, Button, ColorPicker) {
    'use strict';

    // 牌桌场景
    var Table = cc.Scene.extend({
        //ctor: function() {
        //    this._super();
        //},
        //进入场景
        onEnter: function() {
            this._super();
            var layer = new layer();
            layer.init();
            
            this.addChild(layer);
        }
    });

    // 牌桌层
    var layer = cc.Layer.extend({
        // 余牌堆
        pileLeft : null,
        // 废牌堆
        pileDump : null,
        // 消息层
        msgLayer: null,
    //	actionLayer: null,
        // 打牌类
        play: null,
        // 菜单层
        menu: null,
        // 按钮
        btnPass: null,
        btnDraw: null,
        // 拾色器层
        
        olorPicker: null,
        
        init: function () {
            this.play = new Play();
            this.play.init();
            
            this.removeAllChildren();
            
            // 创建背景
            this.createBg();
            
            // 创建菜单
            this.createMenu();
            
            // 创建动画层
    //		this.createAction();
            
            return true;
        },
        // 创建动画层
    //	createAction:function() {
    //		this.actionLayer = cc.Layer.create();
    //		this.actionLayer.setPosition(0, 0);
    //		this.actionLayer.setContentSize(config.gc_size);
    //		
    //		this.addChild(this.actionLayer);
    //	},
        // 创建背景
        createBg: function() {
            // 背景层
            var bgLayer = cc.Layer.create();
            var bgSprite = cc.Sprite.create(res.s_bgTable);
            // 精灵居中显示
            var offsetX = (config.gc_size.width - bgSprite.getContentSize().width) / 2;
            var offsetY = (config.gc_size.height - bgSprite.getContentSize().height) / 2;
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(offsetX, offsetY));
            bgLayer.addChild(bgSprite);
            
            this.addChild(bgLayer);
        },
        // 创建按钮
        createButton: function() {
            if (this.btnDraw != null) {
                this.removeChild(this.btnDraw);
                this.btnPass = null;
            }
            if (this.btnPass != null) {
                this.removeChild(this.btnPass);
                this.btnPass = null;
            }
            
            this.btnDraw = new Button(res.s_bgButton1, res.s_textButton1, 0);
            this.btnPass = new Button(res.s_bgButton1, res.s_textButton2, 1);
            
            this.addChild(this.btnDraw);
            this.addChild(this.btnPass);
        },
        // 创建拾色器层
        createColorPicker: function() {
            if (this.colorPicker != null) {
                this.removeChild(this.colorPicker);
                this.colorPicker = null;
            }
            
            this.colorPicker = new ColorPicker();
            
            this.addChild(this.colorPicker);
        },
        // 创建菜单
        createMenu: function() {
            if (this.menu != null) {
                this.removeChild(this.menu);
                this.menu = null;
            }
            
            // 创建菜单项内容
            var menuLabel1 = cc.LabelTTF.create(res.s_textMenuitem3, res.s_font1, res.s_fontsize1);
            var menuLabel2 = cc.LabelTTF.create(res.s_textMenuitem4, res.s_font1, res.s_fontsize1);
            var menuLabel3 = cc.LabelTTF.create(res.s_textMenuitem5, res.s_font1, res.s_fontsize1);
            menuLabel1.setColor(config.gc_color5);
            menuLabel2.setColor(config.gc_color5);
            menuLabel3.setColor(config.gc_color5);
            
            // 创建菜单项，显示在左上角
            var menuItem1=cc.MenuItemLabel.create(menuLabel1, this.menu1Selected);
            var menuItem2=cc.MenuItemLabel.create(menuLabel2, this.menu2Selected);
            var menuItem3=cc.MenuItemLabel.create(menuLabel3, this.menu3Selected);
            var menuItem1Width = menuItem1.getContentSize().width;
            var menuItem2Width = menuItem2.getContentSize().width;
            var menuItemHeight = menuItem1.getContentSize().height;
            var offsetX1 = (config.gc_size.width - menuItem1Width) / 2;
            var offsetX2 = (config.gc_size.width - menuItem2Width) / 2;
            var offsetY = (config.gc_size.height - menuItemHeight) / 2;
            menuItem1.setPosition(cc.p(offsetX1 * -1, offsetY));
            menuItem2.setPosition(cc.p(offsetX2 * -1 + menuItem1Width * 1.1, offsetY));
            menuItem3.setPosition(cc.p(offsetX2 * -1 + menuItem1Width * 1.1, offsetY));

            // 创建游戏菜单
            this.menu = cc.Menu.create(menuItem1, menuItem2, menuItem3);
            //if (this.play.playing === false) {
            //    // 未开始，显示菜单、开始
                menuItem2.setVisible(true);
                menuItem3.setVisible(false);
            //} else {
            //    // 已开始，显示菜单、暂停
            //    menuItem2.setVisible(false);
            //    menuItem3.setVisible(true);
            //}
            
            var menuLayer = cc.Layer.create();
            this.addChild(this.menu);
    //		this.addChild(menuLayer);
        },
        // 创建消息层
        createMessage: function() {
            if (this.msgLayer != null) {
                this.removeChild(this.msgLayer);
                this.msgLayer = null;
            }
            
            this.msgLayer = cc.Layer.create();
            var offsetX = config.gc_size.width / 2;
            var offsetY = config.gc_size.height / 2;
            this.msgLayer.setPosition(cc.p(offsetX, offsetY));
            
            this.addChild(this.msgLayer);
        },
        // 创建牌堆
        createPile: function() {
            if (this.pileLeft != null) {
                this.removeChild(this.pileLeft);
                this.pileLeft = null;
            }
            if (this.pileDump != null) {
                this.removeChild(this.pileDump);
                this.pileDump = null;
            }
            
            // 余牌堆
            this.pileLeft = new Pile("left");
            this.addChild(this.pileLeft);
            
            // 废牌堆
            this.pileDump = new Pile("dump"); 
            this.addChild(this.pileDump);
        },
        // 返回主菜单
        menu1Selected: function (e) {
            var scene2 = new Menu();
            var tranScene = cc.TransitionMoveInR.create(0.5, scene2);
            cc.Director.getInstance().replaceScene(tranScene);
        },
        // 开始
        menu2Selected: function (e) {
            e.getParent().getParent().start();
        },
        // 暂停
        menu3Selected: function (e) {
            //window.alert(e.getLabel().getString());
        },
        // 触摸事件
        onTouchesEnded: function (touch, event) {
            // TODO 如果点击在菜单范围，不响应
            
            // 是否在游戏中
            if (this.play.playerCurrent != null && this.play.playing === true) {
                // 遍历按钮，检查是否点击在按钮
                this.btnDraw.touch(touch);
                this.btnPass.touch(touch);
                
                // 检查是否点击在拾色器，如果是得到点中的颜色
                var color = this.colorPicker.touch(touch);
                if (color != null) {
                    this.play.cardCurrent[0] = color;
                    this.pileDump.setText(color, this.play.cardCurrent[1]);
                    setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
                }
                
                // 得到已选中且可出的牌
                var card = this.play.playerCurrent.touch(touch, this.play.cardCurrent);
                
                if (card != null) {
                    // 打出这张牌
                    this.play.outCard(card);
                }
            }
            
            return true;
        },
        // 开始
        start: function() {
            // 创建牌堆
            this.createPile();
            
            // 创建按钮
            this.createButton();
            
            // 创建消息层
            this.createMessage();
            
            this.createColorPicker();
            
            this.play.start();
                
        //		menuItem2.setVisible(false);
        //		menuItem3.setVisible(true);
        }
    });

    return Table;
});
