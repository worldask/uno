require.config({
    paths: {
        'underscore': 'bower_components/underscore/underscore',
        'cocos2d': 'bower_components/cocos2d/cocos2d.dev',
    },
    shim: {
        'underscore': {exports: '_'},
        'cocos2d': {exports: 'cc'}
    }
});

//the "main" function to bootstrap your code
require(['cocos2d', 'src/config', 'src/resource', 'src/table'], function (cc, config, res, TableScene) {
    'use strict';

    var c = {
        COCOS2D_DEBUG:0, //0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d:false,
        chipmunk:false,
        showFPS:true,
        frameRate:60,
        loadExtension:false,
        renderMode:0,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        tag:'gameCanvas', //the dom element to run cocos2d on
    };

    var cocos2dApp = cc.Application.extend({
        ctor:function (scene) {
            this._super();
            document.ccConfig = c;
            this.startScene = scene;
            cc.COCOS2D_DEBUG = c['COCOS2D_DEBUG'];
            cc.initDebugSetting();
            cc.setup(c['tag']);
            cc.AppController.shareAppController().didFinishLaunchingWithOptions();
        },
        applicationDidFinishLaunching: function() {
            if(cc.RenderDoesnotSupport()){
                // show Information to user
                alert("Browser doesn't support WebGL");
                return false;
            }
            // initialize director
            var director = cc.Director.getInstance();

            // cc.EGLView.getInstance().resizeWithBrowserSize(true);
            cc.EGLView.getInstance().setDesignResolutionSize(800, 450, cc.RESOLUTION_POLICY.SHOW_ALL);

            // 初始化全局尺寸
            config.gc_size = director.getWinSize();
            config.gc_cardScale = config.gc_size.width / 700 * config.gc_cardScale;
            config.gc_cardWidth = config.gc_size.width * config.gc_cardScale * 0.135;
            config.gc_cardHeight = config.gc_cardWidth  * 1.5625;
            config.gc_cardGap = config.gc_cardWidth / 5 * 2;
            config.s_fontsize2 = config.s_fontsize2 * config.gc_cardScale;
            config.s_fontsize3 = config.s_fontsize3 * config.gc_cardScale;
            config.gc_colorPickerWidth = config.gc_cardHeight;
            config.gc_colorPickerMargin = config.gc_colorPickerWidth * 0.1;

            // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
    //     director->enableRetinaDisplay(true);

            // turn on display FPS
            director.setDisplayStats(c['showFPS']);

            // set FPS. the default value is 1.0/60 if you don't call this
            director.setAnimationInterval(1.0 / c['frameRate']);

            // create a scene. it's an autorelease object

            // load resources & run
            cc.LoaderScene.preload(res.g_resources, function () {
                director.replaceScene(new this.startScene);
            }, this);
            
            // 自适应浏览器窗口缩放
            //Game.Func.getInstance().adjustSizeForWindow();
            //window.addEventListener("resize", function (event) {
            //    Game.Func.getInstance().adjustSizeForWindow();
            //});

            return true;
        }
    });


    //GameFunc.js 游戏的全局函数
    var Game = Game||{};
    Game.Func = (function(){
        var instance;
        function constructor() {
            return {
                adjustSizeForWindow: function () {
                    //目标高宽比
                    var targetRatio = cc.originalCanvasSize.height / cc.originalCanvasSize.width;
                    //窗口高宽比
                    var winRatio = window.innerHeight / window.innerWidth;

                    //重新设置画布的大小，使画布高宽比与目标高宽比相同。
                    //根据比例，设置高度或宽度与窗口大小一样
                    if (winRatio <= targetRatio) {
                        cc.canvas.height = window.innerHeight;
                        cc.canvas.width = window.innerHeight / targetRatio;
                    }else{
                        cc.canvas.height = window.innerWidth * targetRatio;
                        cc.canvas.width = window.innerWidth;
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
                    //cc.renderContext.translate(0, cc.canvas.height);

                    //内容缩放
                    //cc.renderContext.scale(xScale, xScale);
                    //cc.Director.getInstance().setContentScaleFactor(xScale);
                }
            }
        }

        return{
            getInstance: function () {
                if (!instance) {
                    instance = constructor();
                };
                return instance;
            }
        }
    })();

    var myApp = new cocos2dApp(TableScene);
});
