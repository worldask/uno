var CardLayer = cc.Layer.extend({
	color : null,
	Color4B: null,
	isFront: false,
	cardNumber: -1,
	selected : false,
	
	ctor: function(isFront, color, number) {
		this._super();
		this.create(isFront, color, number);
		
		return true;
	},
	// 创建一张牌
	create: function(isFront, color, number) {
		this.setIsFront(isFront);
		this.setCardColor(color);
		this.setCardNumber(number);
		
		if (this.isFront === true) {
			// 牌面着色
			if (this.Color4B != null && this.number < 13) {
				colorLayer = cc.LayerColor.create(this.Color4B, gc_cardWidth, gc_cardHeight + gc_cardWidth * gc_cardMargin * 2);
				colorLayer.setPosition(cc.p(gc_cardWidth / -2, gc_cardHeight / -2 - gc_cardWidth * gc_cardMargin));
				
				this.addChild(colorLayer);
				
				// 添加椭圆层
				imgSprite2 = cc.Sprite.create(s_card2);
				imgSprite2.setScale(gc_cardScale);
				this.addChild(imgSprite2);
			}
		}

		// 牌面或牌背图片
		var imgSprite;
		if (this.isFront === false) {
			// 牌背朝上
			imgSprite = cc.Sprite.create(s_cardback);
		} else {
			// 牌面朝上
			if (this.number == 13) {
				imgSprite = cc.Sprite.create(s_card13);
			} else if (this.number == 14) {
					imgSprite = cc.Sprite.create(s_card14); 
			}else {
				imgSprite = cc.Sprite.create(s_card);
			}
		}
		imgSprite.setScale(gc_cardScale);
		this.addChild(imgSprite);
		
		if (this.isFront === true) {	
			// 添加牌面数字
			if (this.number >= 0 && this.number <= 9) {
				// TODO 6和9要加下划线区分
				
				// 中间数字，固定为白色
				numberLabel1 = cc.LabelTTF.create(this.number, s_font1, s_fontsize2);
				numberLabel1.setColor(this.Color4B);
				
				// 左上角数字
				numberLabel2 = cc.LabelTTF.create(this.number, s_font1, s_fontsize3);
				numberLabel2.setColor(cc.c3(255, 255, 255));
				numberLabel2.setPosition(cc.p(gc_cardWidth / -2 + gc_cardWidth * gc_cardMargin * 2, gc_cardHeight / 2 - gc_cardWidth * gc_cardMargin * 3));
				
				// 右下角数字
				numberLabel3 = cc.LabelTTF.create(this.number, s_font1, s_fontsize3);
				numberLabel3.setColor(cc.c3(255, 255, 255));
				numberLabel3.setPosition(cc.p(gc_cardWidth / 2 - gc_cardWidth * gc_cardMargin * 2, gc_cardHeight / -2 + gc_cardWidth * gc_cardMargin * 2));
				
				this.addChild(numberLabel1);
				this.addChild(numberLabel2);
				this.addChild(numberLabel3);
			} else if (this.number >= 10 && this.number <= 12) {
				switch (this.number) {
					case 10:
						sprite1 = cc.Sprite.create(s_card10);
						sprite2 = cc.Sprite.create(s_card10);
						sprite3 = cc.Sprite.create(s_card10);
						break;
					case 11:
						sprite1 = cc.Sprite.create(s_card11);
						sprite2 = cc.Sprite.create(s_card11);
						sprite3 = cc.Sprite.create(s_card11);
						break;
					case 12:
						sprite1 = cc.Sprite.create(s_card12);
						sprite2 = cc.Sprite.create(s_card12);
						sprite3 = cc.Sprite.create(s_card12);
						break;
				}
				
				sprite1.setScale(gc_cardScale);
				
				sprite2.setScale(gc_cardScriptScale);
				sprite2.setPosition(cc.p(gc_cardWidth / -2 + gc_cardWidth * gc_cardMargin * 2, gc_cardHeight / 2 - gc_cardWidth * gc_cardMargin * 3));
				
				sprite3.setScale(gc_cardScriptScale);
				sprite3.setPosition(cc.p(gc_cardWidth / 2 - gc_cardWidth * gc_cardMargin * 2, gc_cardHeight / -2 + gc_cardWidth * gc_cardMargin * 2));
				
				this.addChild(sprite1);
				this.addChild(sprite2);
				this.addChild(sprite3);
			}
		}
		
		this.setContentSize(imgSprite.getContentSize());
			
		return true;
	},
	// 触摸事件
	onTouchesEnded: function (touch, event) {
		// 计算点击位置是否在牌内部
		if (touch[0]._point.x > this.getPositionX() - gc_cardWidth / 2 && touch[0]._point.x < this.getPositionX() + gc_cardGap / 2
				&& touch[0]._point.y > this.getPositionY() - gc_cardHeight / 2 && touch[0]._point.y < this.getPositionY() + gc_cardHeight / 2) {
			if (this.selected === false) {
				this.setSelected(true);
			}  else {
				this.setSelected(false);
			}
		}
		return true;
    },
    // 设置牌面颜色
	setCardColor: function(color) {
		this.color = color;
		
		switch (color) {
			case gc_colorArray[0]:
				this.Color4B = gc_color1;
				break;
			case gc_colorArray[1]:
				this.Color4B = gc_color2;
				break;
			case gc_colorArray[2]:
				this.Color4B = gc_color3;
				break;
			case gc_colorArray[3]:
				this.Color4B = gc_color4;
				break;
			default:
				this.Color4B = gc_color0;
				break;
		}
	},
	// 设置显示牌面或牌背 
	setIsFront: function(isFront) {
		if (isFront == null) {
			isFront = false;
		}
		this.isFront = isFront;
	},
	// 设置牌数字
	setCardNumber: function(number) {
		this.number = number;
	},
	// 设置牌选中或未选中
	setSelected: function(selected) {
		if (selected === true && this.selected === false) {
			// 弹出
			this.setPositionY(this.getPositionY() + gc_cardHeight / 3);
		} else if (selected === false && this.selected === true) {
			// 还原
			this.setPositionY(this.getPositionY() - gc_cardHeight / 3);
		}
		this.selected = selected;
	}
});