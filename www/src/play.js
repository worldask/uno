// 打牌类
var Play = cc.Class.extend({
	// 用到的牌数组
	cardArray : null,
	// 当前打出的牌
	cardCurrent : null,
	// 玩家数组
	playerArray : null,
	// 当前玩家
	playerCurrent : null,
	// 是否游戏中
	playing : false,
	// 牌桌层
	tableScene: null,
	// 打牌顺序方向，默认0为顺时针，1为逆时针
	direction: 0,

	init : function() {
		this.tableScene = cc.Director.getInstance().getRunningScene();
		this.initPlayer();
		
		return true;
	},
	// 从牌堆中获得一张牌
	drawCard: function(player, quantity) {
		var posTo, posFrom, action;
		var cardLayers = new Array();
		var tmp = new Array();
		
		// 参数检查
		if (player == null) {
			// 默认为当前玩家
			player = this.playerCurrent;
		}
		if (quantity == null) {
			// 默认抓一张牌
			quantity = 1;
		}
		
		posFrom = this.tableScene.getChildren()[0].pileLeft.getPosition();
		posFrom = player.pile.getPosByRotation(posFrom);
		
		for (var j = 0; j < quantity; j++) {
			if (this.cardArray.length > 0) {
				// 从牌堆中分发一张牌
				tmp = this.cardArray.shift();
				
				if (player.isHuman === true || gc_godView === true) {
					// 人类玩家显示正面，可点击
					cardLayers[j] = new CardLayer(true, tmp[0], tmp[1]);
				} else {
					// 电脑玩家显示背面
					cardLayers[j] = new CardLayer(false, tmp[0], tmp[1]);
				}
				tmp = null;

				// 发牌动画
				player.pile.addChild(cardLayers[j]);
				posTo = player.pile.getPosToByRotation(j, quantity);
				action = cc.MoveTo.create(0.3, posTo);
				cardLayers[j].setPosition(posFrom);
				cardLayers[j].runAction(action);
			} else {
				// TODO 检查牌堆中剩余的牌
			}
		}

		// 抓牌按钮不可用，跳过按钮可用
		if (player.isHuman === true) {
			this.tableScene.getChildren()[0].btnDraw.setEnable(false);
    		this.tableScene.getChildren()[0].btnPass.setEnable(true);
		}
		
		setTimeout(function(){
			cc.Director.getInstance().getRunningScene().getChildren()[0].play.playerCurrent.settle();}
		, 800);
		
		tmp = null;
	},
	// 玩家初始化
	initPlayer : function() {
		this.playerArray = new Array();
		
		for (var i = 0; i < gc_playerAmount; i++) {
			this.playerArray[i] = new Player();
			this.playerArray[i].setSeqNo(i);
			
			if (g_playerNumber == "1" && i == 0) {
				// 单人游戏，第一个玩家为人类玩家
				this.playerArray[i].setIsHuman(true);
			} else if (g_playerNumber == "n") {
				// 多人游戏
				this.playerArray[i].setIsHuman(true);
			}
			
			// 设置玩家牌堆坐标及牌面旋转角度
			this.playerArray[i].pile.setRotation(i * 90);
		}
	},
	// 生成一副新牌
	newPack: function() {
		var pack = new Array();
		var i, j, k = 0;
		
		// 生成数字牌及10、11、12特殊牌
		for (i = 0; i < gc_colorArray.length; i++) {
			for (j = 0; j < 13; j++) {
				// 0牌生成一张
				pack[k] = [gc_colorArray[i], j];
				k++;
				
				// 其它牌多生成一张
				if (j > 0) {
					pack[k] = [gc_colorArray[i], j];
					k++;
				}
			}
		}
		
		// 生成转色牌
		for (i = 0; i < 4; i++) {
			for (j = 13; j <= 14; j++) {
				pack[k] = [gc_colorMisc, j];
				k++;
			}
		}
		
		return pack;
	},
    // 下一玩家动作
    next: function() {
    	// 是否再跳到下一玩家
    	var flagNext = false;
    	
    	if (this.playing === true) {
//    		if (this.playerCurrent == null) {
//    			this.playerCurrent = this.playerArray[0];
//    		}
	    	var currentSeqNo = this.playerCurrent.seqNo;
	    	
	    	// 转向牌处理
	    	if (this.cardCurrent[1] == 11) {
	    		this.cardCurrent[1] = -11;
	    		this.direction = !this.direction;
	    	}
	    	
	    	if (this.direction == 0) {
	    		// 顺时针方向
		    	if (currentSeqNo >= this.playerArray.length - 1) {
		    		// 如果已经是最后一个玩家，再从第一个开始
		    		this.playerCurrent = this.playerArray[0];
		    	} else {
		    		// 否则选择下一玩家
		    		currentSeqNo++;
		    		this.playerCurrent = this.playerArray[currentSeqNo];
		    	}
	    	} else if (this.direction == 1) {
	    		// 逆时针方向
	    		if (currentSeqNo == 0) {
		    		// 如果已经是最后一个玩家，再从第一个开始
		    		this.playerCurrent = this.playerArray[this.playerArray.length - 1];
		    	} else {
		    		// 否则选择下一玩家
		    		currentSeqNo--;
		    		this.playerCurrent = this.playerArray[currentSeqNo];
		    	}
	    	}
	    	
	    	// 特殊牌处理
	    	if (this.cardCurrent[1] >= 10 && this.cardCurrent[1] != 11) {
//	    		var color;
	    		
	    		switch (this.cardCurrent[1]) {
		    		case 10:
				    	// 禁手
			    		flagNext = true;
		    			break;
		    		case 12:
			    		// +2 并跳过
		    			this.drawCard(this.playerCurrent, 2);
		    			flagNext = true;
		    			break;
		    		case 13:
			    		// 转色
//		    			if (this.playerCurrent.isHuman === true) {
//			    			color = this.tableScene.getChildren()[0].colorPicker.getPicked();
//						} else {
//							// 电脑玩家随机选择一种颜色 
//							color = this.randomColor();
//						}
//			    		this.cardCurrent[0] = color;
		    			break;
		    		case 14:
			    		// 转色+4并跳过
//		    			if (this.playerCurrent.isHuman === true) {
//			    			color = this.tableScene.getChildren()[0].colorPicker.getPicked();
//						} else {
//							// 电脑玩家随机选择一种颜色 
//							color = this.randomColor();
//						}
		    			
//		    			this.cardCurrent[0] = color;
		    			this.drawCard(this.playerCurrent, 4);
		    			flagNext = true;
		    			break;
	    		}
	    		this.cardCurrent[1] = -this.cardCurrent[1];
	    	} 
	    	
	    	if (flagNext === true) {
	    		setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
	    	} else {
		    	if (this.playerCurrent.isHuman === true) {
		    		// 是人类玩家
		    		// 提示出牌
		    		this.playerCurrent.autoSelect(this.cardCurrent);
		    		// 抓牌按钮可用，跳过按钮不可用
		    		this.tableScene.getChildren()[0].btnDraw.setEnable(true);
		    		this.tableScene.getChildren()[0].btnPass.setEnable(false);
		    		// 可点击
		    		this.tableScene.getChildren()[0].setTouchEnabled(true);
		    	} else {
		    		// 是电脑玩家 自动出牌
		    		this.oneHandAuto();
		    	}
	    	}
    	}
    },
	// 自动打牌，flagDrawed表示当前玩家是否已经抓过牌
	oneHandAuto : function(flagDrawed) {
		var result = false;
		
		if (flagDrawed !== true) {
			// 不可点击，按钮不可用
			this.tableScene.getChildren()[0].setTouchEnabled(false);
			this.tableScene.getChildren()[0].btnDraw.setEnable(false);
			this.tableScene.getChildren()[0].btnPass.setEnable(false);
		}
		
		this.playerCurrent.autoSelect(this.cardCurrent);
		var card = this.playerCurrent.getSelected();
		
		// 有没有可打的牌
		if (card != null) {
			this.outCard(card);
		} else {
			// 是否已抓过牌
			if (flagDrawed === true) {
				// 下一玩家
				setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
			} else {
				// 没有可打的牌，从牌堆抓一张牌
				this.drawCard(this.playerCurrent, 1);
				
				// 再检查有没可打的牌
				this.oneHandAuto(true);
			}
			/*
			this.playerCurrent.autoSelect(this.cardCurrent);
			card = this.playerCurrent.getSelected();
			if (card != null) {
				this.outCard(card);
			} else {
				// 下一玩家
				setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
			}*/
		}
		
		return result;
	},
	// 打出一张牌
//	oneHand : function(card) {
//		this.tableScene.getChildren()[0].setTouchEnabled(false);
//		
//		var result = false;
////		var card = this.playerCurrent.getSelected();
//		
//		// 有没有可打的牌
//		if (card != null) {
//			this.outCard(card);
//		} else {
//			// 没有可打的牌，从牌堆抓一张牌
//			this.drawCard(this.playerCurrent, 1);
//			
//			// 再检查有没可打的牌
////			card = this.playerCurrent.getSelected();
////			if (card != null) {
////				this.outCard(card);
////			}
//		}
//		
//		// 下一玩家
//		setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
//		
//		return result;
//	},
    // 打出一张牌
    outCard: function(card, flagFirstCard) {
    	// 检查要打的牌是否符合规则
		if (this.playerCurrent.check(card, this.cardCurrent) === true || flagFirstCard === true) {
			// 将打出的牌从玩家牌堆移到废牌堆
			var cardTmp = new CardLayer(true, card.color, card.number);
			var posFrom = card.getPosition();
			posFrom = this.playerCurrent.pile.getCardPosByRotation(posFrom);
			var posTo = this.tableScene.getChildren()[0].pileDump.getChildren()[0].getPosition();
			var action1 = cc.MoveTo.create(0.5, posTo);
			var action2 = cc.RotateTo.create(0.5, 0);
			cardTmp.setPosition(posFrom);
			if (card.getParent() != null) {
				cardTmp.setRotation(card.getParent().getRotation());
			}
			cardTmp.runAction(action1);
			cardTmp.runAction(action2);
			this.tableScene.getChildren()[0].pileDump.addChild(cardTmp);
			
			card.removeFromParent(true);
			this.tableScene.getChildren()[0].btnDraw.setEnable(false);
			
			// 当前玩家剩余的牌
			var cardLeft = this.playerCurrent.pile.getChildrenCount();
			
			// 如果是转色牌，跳出拾色器，并退出当前方法
			if (cardLeft > 0 && (Math.abs(card.number) == 13 || Math.abs(card.number) == 14)) {
				if (this.playerCurrent.isHuman === true) {
					this.cardCurrent = [card.color, card.number];
					this.tableScene.getChildren()[0].colorPicker.show(true);
					return;
				} else {
					// 电脑玩家随机选择一种颜色 
					this.cardCurrent = [this.randomColor(), card.number];
					this.tableScene.getChildren()[0].pileDump.setText(this.cardCurrent[0], this.cardCurrent[1]);
				}
			} else {				
				// 将当前牌置为打出的牌
				this.cardCurrent = [card.color, card.number];
				this.tableScene.getChildren()[0].pileDump.setText(card.color, card.number);
			}
			
			// 检查当前玩家剩余的牌
			if (cardLeft <= 1) {
				var message = new Message();
				
				if (this.playerCurrent.pile.getChildrenCount() == 1) {
					// 如果只剩一张，UNO
					message.send(s_textMsg1, 3);
				} else if (this.playerCurrent.pile.getChildrenCount() == 0) {
					// 如果出完了，获胜或失败！
					if (this.playerCurrent.seqNo == 0) {
						message.send(s_textMsg2);
					} else {
						message.send(s_textMsg3);
					}
					
					this.playing = false;
				}

				this.tableScene.getChildren()[0].msgLayer.addChild(message);
			}
			
			// 下一玩家
			if (cardLeft > 0 && flagFirstCard !== true) {
				setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
			}
		}
    },
    // 随机获取一种颜色 TODO AI判断最优颜色
    randomColor: function() {
    	var rand = Math.floor(Math.random() * gc_colorArray.length);
		return gc_colorArray[rand];
    },
	// 洗牌
	shuffle : function() {
		// 乱序函数
		if (!Array.prototype.shuffle) {
			Array.prototype.shuffle = function() {
				for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
				return this;
			};
		}
		this.cardArray = this.newPack();
		this.cardArray.shuffle();
	},
	// 开始
	start:function() {
//		cc.Director.getInstance().getRunningScene().getChildren()[0].pileDump.removeAllChildren();
//		cc.Director.getInstance().getRunningScene().getChildren()[0].pileLeft.removeAllChildren();
		cc.Director.getInstance().getRunningScene().getChildren()[0].msgLayer.removeAllChildren();
		cc.Director.getInstance().getRunningScene().getChildren()[0].pileDump.getChildren()[1].setString("");
		
		// 打牌方向还原为顺时针
		this.direction = 0;
		
		// 洗牌
		this.shuffle();
		
		// 发牌
		for (var i = 0; i < this.playerArray.length; i++) {
			this.playerCurrent = this.playerArray[i];
			this.playerArray[i].pile.removeAllChildren();
			this.playerArray[i].pile.removeFromParent();
			
			this.drawCard(this.playerArray[i], gc_dealAmount);
			
			this.tableScene.getChildren()[0].addChild(this.playerArray[i].pile);
		}
		
		// 翻开第一张牌，显示在废牌堆
		this.cardCurrent = this.cardArray.shift();
		var firstCard = new CardLayer(true, this.cardCurrent[0], this.cardCurrent[1]);
//		var firstCard = new CardLayer(true, "0misc", 13);
		var offsetX = (gc_size.width - gc_cardWidth) / 3 * 2;
		var offsetY = (gc_size.height - gc_cardHeight) / 3 * 2;
		firstCard.setPosition(cc.p(offsetX, offsetY));
		this.outCard(firstCard, true);

//		this.tableScene.getChildren()[0].pileDump.addChild(firstCard);

		this.playing = true;
		
		this.next();
	}
});