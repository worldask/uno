// play.js

define(['cocos2d', 'src/config', 'src/resource', 'src/util', 'src/ai', 'src/player', 'src/card', 'src/message'], 
        function (cc, config, res, Util, AI, Player, Card, Message) {
    'use strict';

    // 打牌类
    var Play = cc.Class.extend({
        // 用到的牌数组
        cardArray : null,
        // 当前打出的牌
        cardCurrent : null,
        // 玩家数组
        playerArray : [],
        // 当前玩家
        playerCurrent : null,
        // 是否游戏中
        playing : false,
        // 牌桌层
        tableLayer: null,
        // 打牌顺序方向，默认0为顺时针，1为逆时针
        direction: 0,

        // 开始
        start:function() {
            // 乱序函数
            if (!Array.prototype.shuffle) {
                Array.prototype.shuffle = function() {
                    for(var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                };
            }

            this.tableLayer = cc.Director.getInstance().getRunningScene().getChildren()[0];

            this.initPlayer();

            // 清空文字信息
            this.tableLayer.msgLayer.removeAllChildren();
            this.tableLayer.setCardInfo();
            
            // 打牌方向还原为顺时针
            this.direction = 0;
            
            // 洗牌
            this.shuffle();
            
            // 发牌
            for (var i = 0; i < this.playerArray.length; i++) {
                this.playerCurrent = this.playerArray[i];
                this.playerArray[i].pile.removeAllChildren();
                this.playerArray[i].pile.removeFromParent();
                
                this.drawCard(this.playerArray[i], config.gc_dealAmount);
                
                this.tableLayer.addChild(this.playerArray[i].pile);
            }
            
            // 翻开第一张牌，显示在废牌堆
            this.cardCurrent = this.cardArray.shift();
            var firstCard = new Card(true, this.cardCurrent[0], this.cardCurrent[1]);
            var offsetX = (config.gc_size.width - config.gc_cardWidth) / 3 * 2;
            var offsetY = (config.gc_size.height - config.gc_cardHeight) / 3 * 2;
            firstCard.setPosition(cc.p(offsetX, offsetY));
            this.outCard(firstCard, true);

            this.playing = true;
            
            this.next();
        },
        // 玩家初始化
        initPlayer : function() {
            if (this.playerArray.length == 0) {
                // this.playerArray = [];
                
                for (var i = 0; i < config.gc_playerAmount; i++) {
                    this.playerArray[i] = new Player();
                    this.playerArray[i].setSeqNo(i);
                    
                    if (config.gc_playerNumber == "1" && i == 0) {
                        // 单人游戏，第一个玩家为人类玩家
                        this.playerArray[i].setIsHuman(true);
                    } else if (config.gc_playerNumber == "n") {
                        // 多人游戏
                        this.playerArray[i].setIsHuman(true);
                    }
                    
                    // 设置玩家牌堆坐标及牌面旋转角度
                    this.playerArray[i].pile.setRotation(i * 90);
                }
            }
        },
        // 洗牌
        shuffle : function() {
            this.cardArray = this.newPack();
            this.cardArray.shuffle();
        },
        // 生成一副新牌
        newPack: function() {
            var pack = [];
            var i, j, k = 0;
            
            // 生成数字牌及10、11、12特殊牌
            for (i = 0; i < config.gc_colorArray.length; i++) {
                for (j = 0; j < 13; j++) {
                    // 0牌生成一张
                    pack[k] = [config.gc_colorArray[i], j];
                    k++;
                    
                    // 其它牌多生成一张
                    if (j > 0) {
                        pack[k] = [config.gc_colorArray[i], j];
                        k++;
                    }
                }
            }
            
            // 生成转色牌
            for (i = 0; i < 4; i++) {
                for (j = 13; j <= 14; j++) {
                    pack[k] = [config.gc_colorMisc, j];
                    k++;
                }
            }
            
            return pack;
        },
        // 从牌堆中获得一张牌
        drawCard: function(player, quantity) {
            var posTo, posFrom, action;
            var cards = [];
            var tmp = [];
            
            // 参数检查
            if (player == null) {
                // 默认为当前玩家
                player = this.playerCurrent;
            }
            if (quantity == null) {
                // 默认抓一张牌
                quantity = 1;
            }
            
            posFrom = this.tableLayer.pileLeft.getPosition();
            posFrom = player.pile.getPosByRotation(posFrom);
            
            for (var j = 0; j < quantity; j++) {
                if (this.cardArray.length > 0) {
                    // 从牌堆中分发一张牌
                    tmp = this.cardArray.shift();
                    
                    if (player.isHuman === true || config.gc_godView === true) {
                        // 人类玩家显示正面，可点击
                        cards[j] = new Card(true, tmp[0], tmp[1]);
                    } else {
                        // 电脑玩家显示背面
                        cards[j] = new Card(false, tmp[0], tmp[1]);
                    }
                    tmp = null;

                    // 发牌动画
                    player.pile.addChild(cards[j]);
                    posTo = player.pile.getPosToByRotation(j, quantity);
                    action = cc.MoveTo.create(0.3, posTo);
                    cards[j].setPosition(posFrom);
                    cards[j].runAction(action);
                } else {
                    // TODO 检查牌堆中剩余的牌
                }
            }

            // 抓牌按钮不可用，跳过按钮可用
            if (player.isHuman === true) {
                this.tableLayer.btnDraw.setEnable(false);
                this.tableLayer.btnPass.setEnable(true);
            }
            
            // 自动理牌
            setTimeout(function() {player.settle();}, 800);
            
            tmp = null;
        },
        // 打出一张牌
        outCard: function(card, flagFirstCard) {
            // 检查要打的牌是否符合规则
            if (this.playerCurrent.check(card, this.cardCurrent) === true || flagFirstCard === true) {
                // 将打出的牌从玩家牌堆移到废牌堆
                var cardDump = new Card(true, card.color, card.number);
                var posFrom = card.getPosition();
                posFrom = this.playerCurrent.pile.getCardPosByRotation(posFrom);
                cardDump.setPosition(posFrom);
                if (card.getParent() != null) {
                    cardDump.setRotation(card.getParent().getRotation());
                }
                var posTo = this.tableLayer.pileDump.getChildren()[0].getPosition();
                var action1 = cc.MoveTo.create(0.5, posTo);
                var action2 = cc.RotateTo.create(0.5, 0);
                cardDump.runAction(action1);
                cardDump.runAction(action2);
                this.tableLayer.pileDump.addChild(cardDump);
                
                card.removeFromParent(true);
                this.tableLayer.btnDraw.setEnable(false);
                
                // 当前玩家剩余的牌
                var cardLeft = this.playerCurrent.pile.getChildrenCount();
                
                // 如果是转色牌，跳出拾色器，并退出当前方法
                if (cardLeft > 0 && (Math.abs(card.number) == 13 || Math.abs(card.number) == 14)) {
                    if (this.playerCurrent.isHuman === true) {
                        this.cardCurrent = [card.color, card.number];
                        this.tableLayer.colorPicker.show(true);
                        return;
                    } else {
                        // 电脑玩家随机选择一种颜色 
                        var ai = new AI();
                        this.cardCurrent = [ai.randomColor(), card.number];
                        this.tableLayer.setCardInfo(this.cardCurrent[0], this.cardCurrent[1]);
                    }
                } else {				
                    // 将当前牌置为打出的牌
                    this.cardCurrent = [card.color, card.number];
                    this.tableLayer.setCardInfo(card.color, card.number);
                }
                
                // 检查当前玩家剩余的牌
                if (cardLeft <= 1) {
                    var message = new Message();
                    
                    if (this.playerCurrent.pile.getChildrenCount() == 1) {
                        // 如果只剩一张，UNO
                        message.send(res.s_textMsg1, 3);
                    } else if (this.playerCurrent.pile.getChildrenCount() == 0) {
                        // 如果出完了，获胜或失败！
                        if (this.playerCurrent.seqNo == 0) {
                            message.send(res.s_textMsg2);
                        } else {
                            message.send(res.s_textMsg3);
                        }
                        
                        this.playing = false;
                    }

                    this.tableLayer.msgLayer.addChild(message);
                }
                
                // 下一玩家
                if (cardLeft > 0 && flagFirstCard !== true) {
                    setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
                    //var that = this.tableLayer.play;
                    //setTimeout(function(that) {
                    //    return function() {that.next();};
                    //}, 1000); 
                }
            }
        },
        // 下一玩家动作
        next: function() {
            // 是否再跳到下一玩家
            var flagNextNext = false;
            
            if (this.playing === true) {
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
                    var ai = new AI();
                    
                    switch (this.cardCurrent[1]) {
                        case 10:
                            // 禁手
                            flagNextNext = true;
                            break;
                        case 12:
                            // +2 并跳过
                            this.drawCard(this.playerCurrent, 2);
                            flagNextNext = true;
                            break;
                        case 13:
                            // 转色
                            break;
                        case 14:
                            // 转色+4并跳过
                            this.drawCard(this.playerCurrent, 4);
                            flagNextNext = true;
                            break;
                    }
                    this.cardCurrent[1] = -this.cardCurrent[1];
                } 
                
                if (flagNextNext === true) {
                    setTimeout(function(){cc.Director.getInstance().getRunningScene().getChildren()[0].play.next();}, 1000);
                    //var playNext = function() {
                    //    var that = this;
                    //    setTimeout(function(that){that.tableLayer.play.next();}, 1000); 
                    //}();
                } else {
                    if (this.playerCurrent.isHuman === true) {
                        // 是人类玩家
                        // 提示出牌
                        this.playerCurrent.autoSelect(this.cardCurrent);
                        // 抓牌按钮可用，跳过按钮不可用
                        this.tableLayer.btnDraw.setEnable(true);
                        this.tableLayer.btnPass.setEnable(false);
                        // 可点击
                        this.tableLayer.setTouchEnabled(true);
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
                this.tableLayer.setTouchEnabled(false);
                this.tableLayer.btnDraw.setEnable(false);
                this.tableLayer.btnPass.setEnable(false);
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
            }
            
            return result;
        },
    });

    return Play;
});
