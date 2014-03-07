// 菜单场景
var MenuScene = cc.Scene.extend({
    //进入场景时
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});

// 菜单层
var MenuLayer = cc.Layer.extend({
    init: function () {
		var size = cc.Director.getInstance().getWinSize();
		
		// 背景图精灵，居中显示
		var bgSprite = cc.Sprite.create(s_bgMenu);
		offsetX = (size.width - bgSprite.getContentSize().width) / 2;
		offsetY = (size.height - bgSprite.getContentSize().height) / 2;
		bgSprite.setAnchorPoint(cc.p(0, 0));
		bgSprite.setPosition(cc.p(offsetX, offsetY));
		
		// 背景层
		var bgLayer = cc.Layer.create();
		bgLayer.addChild(bgSprite);
		
        // 菜单层
		var menuLayer = cc.Layer.create();

		//创建菜单项内容
		var menuLabel1 = cc.LabelTTF.create(s_textMenuitem1, s_font1, s_fontsize1);
		var menuLabel2 = cc.LabelTTF.create(s_textMenuitem2, s_font1, s_fontsize1);
		menuLabel1.setColor(cc.c3(s_color1R, s_color1G, s_color1B));
		menuLabel2.setColor(cc.c3(s_color1R, s_color1G, s_color1B));
		
		//创建菜单项
		var menuItem1 = cc.MenuItemLabel.create(menuLabel1, this.menu1Selected);
		var menuItem2 = cc.MenuItemLabel.create(menuLabel2, this.menu2Selected);  
		
		var menuItemHeight = menuItem1.getContentSize().height;
		menuItem1.setPosition(cc.p(0, menuItemHeight * -2)); 
		menuItem2.setPosition(cc.p(0, menuItemHeight * -4));  

		//创建游戏菜单
		var menu = cc.Menu.create(menuItem1, menuItem2);
		
		//将菜单添加到层
		menuLayer.addChild(menu);
		bgLayer.addChild(menuLayer);
		
		this.addChild(bgLayer);

		return true;
    },
	menu1Selected:function (e) {
		g_playerNumber = "1";
		var scene2 = new TableScene();
		var tranScene = cc.TransitionMoveInL.create(0.5, scene2);
		cc.Director.getInstance().replaceScene(tranScene);
	},
	menu2Selected:function (e) {
		g_playerNumber = "n";
		var scene2 = new TableScene();
		var tranScene = cc.TransitionMoveInL.create(0.5, scene2);
		cc.Director.getInstance().replaceScene(tranScene);
	}
});