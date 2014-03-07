/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org


 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
var cocos2dApp = cc.Application.extend({
    config:document['ccConfig'],
    ctor:function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.initDebugSetting();
        cc.setup(this.config['tag']);
        cc.Loader.getInstance().onloading = function () {
            cc.LoaderScene.getInstance().draw();
        };
        cc.Loader.getInstance().onload = function () {
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        };
        cc.Loader.getInstance().preload(g_ressources);
    },
    applicationDidFinishLaunching:function () {
        // initialize director
        var director = cc.Director.getInstance();
        
        // 初始化全局尺寸
        gc_size = director.getWinSize();
        gc_cardScale = gc_size.width / 700 * gc_cardScale;
        gc_cardWidth = gc_size.width * gc_cardScale * 0.135;
        gc_cardHeight = gc_cardWidth  * 1.5625;
        gc_cardGap = gc_cardWidth / 5 * 2;
        s_fontsize2 = s_fontsize2 * gc_cardScale;
        s_fontsize3 = s_fontsize3 * gc_cardScale;
        gc_colorPickerWidth = gc_cardHeight;
        gc_colorPickerMargin = gc_colorPickerWidth * 0.1;

        // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);

        // turn on display FPS
        director.setDisplayStats(this.config['showFPS']);

        // set FPS. the default value is 1.0/60 if you don't call this
        director.setAnimationInterval(1.0 / this.config['frameRate']);

        // create a scene. it's an autorelease object

        // run
        director.runWithScene(new this.startScene());
        
        // 自适应浏览器窗口缩放
        Game.Func.getInstance().adjustSizeForWindow();
        window.addEventListener("resize", function (event) {
            Game.Func.getInstance().adjustSizeForWindow();
        });

        return true;
    }
});


//GameFunc.js 游戏的全局函数
var Game=Game||{};
Game.Func=(function(){
	var instance;
	function constructor() {
		return {
			adjustSizeForWindow:function () {
				//目标高宽比
				var targetRatio=cc.originalCanvasSize.height/cc.originalCanvasSize.width;
				//窗口高宽比
				var winRatio=window.innerHeight/window.innerWidth;

				//重新设置画布的大小，使画布高宽比与目标高宽比相同。
				//根据比例，设置高度或宽度与窗口大小一样
				if (winRatio<=targetRatio) {
					cc.canvas.height = window.innerHeight;
					cc.canvas.width=window.innerHeight/targetRatio;
				}else{
					cc.canvas.height = window.innerWidth*targetRatio;
					cc.canvas.width=window.innerWidth;
				}

				//缩放比例
				var xScale = cc.canvas.width / cc.originalCanvasSize.width;

				//设置垂直和水平居中
				var parentDiv = document.getElementById("Cocos2dGameContainer");
				if (parentDiv) {
					parentDiv.style.width = cc.canvas.width + "px";
					parentDiv.style.height = cc.canvas.height + "px";
					parentDiv.style.position = "absolute";
					parentDiv.style.top = "50%";
					parentDiv.style.left = "50%";
					parentDiv.style.marginLeft = (-cc.canvas.width / 2) + "px";
					parentDiv.style.marginTop = (-cc.canvas.height / 2) + "px";
				}
				//重置坐标
				cc.renderContext.translate(0, cc.canvas.height);

				//内容缩放
				cc.renderContext.scale(xScale, xScale);
				cc.Director.getInstance().setContentScaleFactor(xScale);
			}
		}
	}

	return{
		getInstance:function () {
			if (!instance) {
				instance=constructor();
			};
			return instance;
		}
	}
})();

var myApp = new cocos2dApp(TableScene);
// 游戏人数，1为单人，n为多人
var g_playerNumber = "1";