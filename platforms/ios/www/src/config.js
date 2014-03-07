// 上帝视角，可以查看所有玩家的牌 TODO 调试用
var gc_godView = false;

var gc_size;

// 【牌堆】
// 牌堆显示牌数
var gc_pileCardNumber = 10;
// 叠放时两张牌的间隙宽度
var gc_cardGap = 18;

//【单张牌】
// 缩放比例
var gc_cardScale = 0.6;
// 牌边缘与牌宽的比例
var gc_cardMargin = 0.05;
// 宽高
var gc_cardWidth = 0;
var gc_cardHeight = 0;
// 牌颜色数组
var gc_colorArray = new Array("1red", "2blue", "3yellow", "4green");
// 转色牌
var gc_colorMisc = "0misc";
// 特殊牌小图与大图比例
var gc_cardScriptScale = 0.2;
//var gc_cardBackImg =cc.TextureCache.getInstance().addImage(s_cardback);
//var gc_cardImg =cc.TextureCache.getInstance().addImage(s_card);


// 【打牌】
//  玩家数量
var gc_playerAmount = 4;
// 使用几副牌
var gc_useCases = 1;
// 一副牌有几张
var gc_amountPerCase = 108;
// 发牌数量
var gc_dealAmount = 7;
// 每回合限时秒数
var gc_secondsPerRound = 10;

// 牌
// r开头为红，g开头为绿，b开头为蓝，y开头为黄，m开头为杂色
// 0到9为数字，10skip禁手，11reverse逆转，12draw2罚牌2张
// 13wild转色，14wildDraw4转色及罚牌4张
var gc_cards = new Array();

// 【拾色器】
// 单个格子宽高
var gc_colorPickerWidth = 100;
var gc_colorPickerMargin = 10;
// 

// 【颜色】
// 对应颜色对象
// 白、红、蓝、绿、橙
var gc_color0 = cc.c4b(255, 255, 255, 255);
var gc_color1 = cc.c4b(218, 37, 28, 255);
var gc_color2 = cc.c4b(0, 147, 221, 255);
var gc_color3 = cc.c4b(255, 150, 0, 255);
var gc_color4 = cc.c4b(0, 155, 0, 255);
// 菜单字体
var gc_color5 = cc.c3(99, 88, 155);
//var s_color1R = "99";
//var s_color1G = "88";
//var s_color1B = "155";

// 【字体】
var s_font1 = "Arial";

// 【字号】
var s_fontsize1 = 30;
var s_fontsize2 = 90;
var s_fontsize3 = 40;