// player.js

define(['cocos2d', 'src/config', 'src/pile'], function (cc, config, Pile) {
    'use strict';

    // 玩家类
    var Player = cc.Class.extend({
        // 是否人类玩家
        isHuman : false,
        // 发牌数量
        dealAmount : 0,
        // 玩家牌堆
        pile : null,
        // 得分
        score : 0,
        // 当前玩家序号
        seqNo: 0,
        
        ctor : function() {
            // 牌堆层
            this.pile = new Pile();
            this.cards = [];
            
            return true;
        },
        // 自动选中要出的牌
        autoSelect: function(cardCurrent) {
            this.unselectAll();
            
            var cards = this.pile.getChildren();
            
            // 遍历手中的牌，选中第一张颜色或数字相同
            for (var i = cards.length - 1; i >= 0; i--) {
                if (this.check(cards[i], cardCurrent) === true) {
                    cards[i].setSelected(true);
                    break;
                }
            }
        },
        // 检查出牌是否符合规则
        check: function(card, cardCurrent) {
            var result = false;
            
            // 转色牌允许自由出牌
            if (card.color == config.gc_colorMisc) {
                result = true;
            } else if (card.color == cardCurrent[0] || card.number == Math.abs(cardCurrent[1])) {
                // 此处数字条件用绝对值判断，因为特殊牌过牌后数字置为负值
                result = true;
            }
            
            return result;
        },
        // 获得当前选中的第一张牌
        getSelected: function() {
            var result = null;
            var cards = this.pile.getChildren();
            
            // 遍历手中的牌，选中第一张颜色或数字相同
            for (var i = cards.length - 1; i >= 0; i--) {
                if (cards[i].selected === true) {
                    result = cards[i];
                    break;
                }
            }
            
            return result;
        },
        // 点击处理
        touch: function(touch, cardCurrent) {
            var result;
            var cardCount = this.pile.getChildrenCount();
            var cards = this.pile.getChildren();
            
            if (touch[0] != null) {
                // 倒序遍历玩家手中的牌
                for (var i = cardCount - 1; i >= 0; i--) {
                    // 点击位置有牌
                    if (touch[0]._point.x > cards[i].getPositionX() - config.gc_cardWidth / 2 && touch[0]._point.x < cards[i].getPositionX() + config.gc_cardGap / 2
                        && touch[0]._point.y > cards[i].getPositionY() - config.gc_cardHeight / 2 && touch[0]._point.y < cards[i].getPositionY() + config.gc_cardHeight / 2) {
                        // 如牌已选中可出牌则返回选中牌，不可出牌则取消选择
                        if (cards[i].selected === true) {
                            if (this.check(cards[i], cardCurrent) === true) {
                                result = cards[i];
                            } else {
                                cards[i].setSelected(false);
                            }
                        } else {
                            // 如牌未选中，则选中
                            this.unselectAll();
                            cards[i].setSelected(true);
                        }
                        
                        break;
                    }
                }
            }
            
            return result;
        },
        // 设置是否人类玩家
        setIsHuman : function (isHuman){
            this.isHuman = isHuman;
        },
        // 设置序号
        setSeqNo : function (seqNo){
            this.seqNo = seqNo;
        },
        // 整理手中的牌
        settle: function() {
            var cardCount = this.pile.getChildrenCount();
            if (cardCount > 0) {
                var cards = this.pile.getChildren();
                var posTo;
                var pileWidth = this.pile.getWidth(cardCount);
                
                // 先按颜色，再按数字从小到大排序
                cards.sort(function(x, y) {
                    return (x.color == y.color) ? -(x.number - y.number) : (x.color.localeCompare(y.color));
                });
                
                // 重新排放牌的位置
                for (var i = 0; i < cards.length; i++) {
                    posTo = this.pile.getPosToByRotation(i, cardCount);
                    cards[i].setPositionX(posTo.x);
                    this.pile.reorderChild(cards[i], i);
                    //card[j].setTag("card" + j);
                }
                this.pile.sortAllChildren();
                
                // TODO 宽度超出牌桌时，排成两行
            }
        },
        // 全部取消选中
        unselectAll: function() {
            var cards = this.pile.getChildren();
            
            // 遍历手中的牌，取消所有选中
            for (var i = 0; i < cards.length; i++) {
                cards[i].setSelected(false);
            }
        }
    });

    return Player;
});
