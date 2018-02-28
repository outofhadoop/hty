if (LGlobal.canTouch) {
    LGlobal.stageScale = LStageScaleMode.EXACT_FIT;
    LSystem.screen(LStage.FULL_SCREEN);
}

var current_page;

LInit(50, "game", 1280, 720, main);

var _clickArr = new Array();
var _boxArr = new Array();
var _lineArr = new Array();

var warningBtnSt = 'unknown';

var GameClass = {
    curGame:null,
    images:{
    	getImg:function(key) {
    		return new LBitmap(new LBitmapData(imglist[key]))
    	}
    },
    sounds:{
        soundInstance:{},
        wait2Play:"",
        try2Play:function(id){
            if(this.wait2Play == id) {
                this.play(id);
            }
        },

        preload:function(sList){
            for(var i = 0; i < sList.length; i ++) {
                
                var o =sList[i];
                if(this.soundInstance.hasOwnProperty(o.id)) {
                    continue;
                }
                var s = new LSound();
                s.load(o.path);
                s.id = o.id;
                s.callback = null;
                s.addEventListener(LEvent.SOUND_COMPLETE, this.onSoundComplete);
                s.addEventListener(LEvent.COMPLETE, this.onSoundLoaded)
                this.soundInstance[o.id] = s;

            }
        },
        onSoundComplete:function(e) {
            if(e.currentTarget.callback) {
                e.currentTarget.callback();
            }
        },
        onSoundLoaded:function(e){
            GameClass.sounds.try2Play(e.currentTarget.id);
        },
        play:function(id, startOffset, loop, callback,volume) {
            if(arguments.length < 2) {
                startOffset = 0;
            }
            if(arguments.length < 3) {
                loop = 0;
            }
            callback = callback || null;
            //console.log("playsounds",arguments,this.soundInstance)
            this.soundInstance[id].callback = callback;
            this.soundInstance[id].play(startOffset, loop);
            if(!isNaN(volume)) {
                this.soundInstance[id].setVolume(volume)
            }
        },
        stop:function(id) {
            try{
                this.soundInstance[id].stop();
            }catch(err){}
        },
        clean:function(){
            for(var m in this.soundInstance) {
                try{
                    this.soundInstance[m].stop();
                }catch(err){

                }
            }
        }
    },
    createNew:function(id, _dataObj){
        var game = {};
        game.bgLayer = null;
        game.gameLayer = null;
        game.btnLayer = null;
        game.effectLayer = null;
        game.topLayer = null;
        game.container = null;
        game._id = id;
        game._dataObj = _dataObj;
        //var dragedItem = null;
        var dragObj = {};
        function onItemDown(e) {
            dragObj.curItem = e.currentTarget;
            dragObj.curItem.startDrag();
            if(dragObj.curItem.infoObj.onDragStart)
            {
                dragObj.curItem.infoObj.onDragStart.func.apply(dragObj.curItem.infoObj.onDragStart.thisObj,[dragObj.curItem]);
            }
        }
        function onItemStop(e) {
            dragObj.curItem.stopDrag();
            var isClick = LPoint.distance2(dragObj.curItem.x, dragObj.curItem.y,dragObj.curItem.infoObj.x, dragObj.curItem.infoObj.y) < 10;
            if(dragObj.curItem.infoObj.onDragStop) {
                dragObj.curItem.infoObj.onDragStop.func.apply(dragObj.curItem.infoObj.onDragStop.thisObj, [dragObj.curItem, isClick]);
            }
           
            if(dragObj.curItem.infoObj.autoReset) {
                dragObj.curItem.x = dragObj.curItem.infoObj.x;
                dragObj.curItem.y = dragObj.curItem.infoObj.y;
            }
        }
        /**
        * onDragStart(dragItem){};
        * onDragStop(dragItem,isClick){}
        * autoReset true/false
        */
        game.initDrag = function(arr, onDragStart, onDragStop, autoReset){
            var len = arr.length;
            for(var i = 0; i < len; i ++) {
                var item = arr[i];
                item.infoObj = {x:item.x,y:item.y, autoReset:autoReset,onDragStart:onDragStart,onDragStop:onDragStop};
                item.addEventListener(LMouseEvent.MOUSE_DOWN, onItemDown);
                item.addEventListener(LMouseEvent.MOUSE_UP, onItemStop)
            }
        };
        game.clearDrag = function(arr) {
            for(var i = arr.length - 1; i >= 0; i --) {
                var item = arr[i];
                item.removeEventListener(LMouseEvent.MOUSE_DOWN, onItemDown);
                item.removeEventListener(LMouseEvent.MOUSE_UP, onItemStop);
            }
            dragObj = {};
        };
        var _this = game;
        game.init = function(){
            LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
            LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
            LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,true);
            GameClass.curGame = this;
            this.container = new LSprite();
            addChild(this.container);
            this.bgLayer = new LSprite();
            this.container.addChild(this.bgLayer);
            this.gameLayer = new LSprite();
            this.container.addChild(this.gameLayer);
            this.btnLayer = new LSprite();
            this.container.addChild(this.btnLayer);
            this.effectLayer = new LSprite();
            this.container.addChild(this.effectLayer);
            this.actionLayer = new LSprite();
            this.container.addChild(this.actionLayer);
            this.topLayer = new LSprite();
            this.container.addChild(this.topLayer);
        };
        game.destroy = function(){
            GameClass.sounds.clean();
            this.container.parent.removeChild(this.container);
            this.container = null;
        };
        return game;
    },
    clean:function(){
        if(GameClass.curGame) {
            GameClass.curGame.destroy();
            GameClass.curGame = null;
        }
    },
    startGame:function(tClass) {
        $('#game').css('cursor','auto');
        GameClass.clean();
        current_page = null;
    	var t = window[tClass].createNew();
        t.init();
        setTimeout(function(){switchVideo(false);},800);
        //switchVideo(false);
        return t;
    }
};

var loadingLayer;
//读取完的图片数组
var imglist = {};

//图片path数组
var imgData = new Array(

    { name: 'hd4_bg', path: 'images/rfbwx_zykx_hd_4/bg.png' },   //背景
    { name: 'hd4_b1', path: 'images/rfbwx_zykx_hd_4/1.png' },   //选项1
    { name: 'hd4_b2', path: 'images/rfbwx_zykx_hd_4/2.png' },   //选项2
    { name: 'hd4_b3', path: 'images/rfbwx_zykx_hd_4/3.png' },   //选项3
    { name: 'hd4_c1', path: 'images/rfbwx_zykx_hd_4/4.png' },   //选项1
    { name: 'hd4_c2', path: 'images/rfbwx_zykx_hd_4/5.png' },   //选项2
    { name: 'hd4_c3', path: 'images/rfbwx_zykx_hd_4/6.png' },   //选项3
    { name: 'hd4_jxxx', path: 'images/rfbwx_zykx_hd_4/jxxx.png' },

    { name: 'hd8_bg', path: 'images/rfbwx_zykx_hd_8/bg.png' },   //背景
    { name: 'hd8_b1', path: 'images/rfbwx_zykx_hd_8/1.png' },   //选项1
    { name: 'hd8_b2', path: 'images/rfbwx_zykx_hd_8/2.png' },   //选项2
    { name: 'hd8_c1', path: 'images/rfbwx_zykx_hd_8/3.png' },   //选项1
    { name: 'hd8_c2', path: 'images/rfbwx_zykx_hd_8/4.png' },   //选项2
    { name: 'hd8_jxxx', path: 'images/rfbwx_zykx_hd_8/5.png' },   //

    { name: 'hd10_bg', path: 'images/rfbwx_zykx_hd_10/bg.png' },   //背景
    { name: 'hd10_title', path: 'images/rfbwx_zykx_hd_10/7.png' },   //
    { name: 'hd10_map', path: 'images/rfbwx_zykx_hd_10/5.png' },   //
    { name: 'hd10_b1', path: 'images/rfbwx_zykx_hd_10/1.png' },   //选项1
    { name: 'hd10_b2', path: 'images/rfbwx_zykx_hd_10/2.png' },   //选项2
    { name: 'hd10_b3', path: 'images/rfbwx_zykx_hd_10/3.png' },   //选项3
    { name: 'hd10_c1', path: 'images/rfbwx_zykx_hd_10/6.png' },   //选项1点击

    { name: 'hd15_bg', path: 'images/rfbwx_zykx_hd_15/bg.png' },   //背景
    { name: 'hd15_title', path: 'images/rfbwx_zykx_hd_15/7.png' },   //
    { name: 'hd15_map', path: 'images/rfbwx_zykx_hd_15/5.png' },   //
    { name: 'hd15_b1', path: 'images/rfbwx_zykx_hd_15/1.png' },   //选项1
    { name: 'hd15_b2', path: 'images/rfbwx_zykx_hd_15/2.png' },   //选项2
    { name: 'hd15_b3', path: 'images/rfbwx_zykx_hd_15/3.png' },   //选项3
    { name: 'hd15_c2', path: 'images/rfbwx_zykx_hd_15/6.png' },   //选项2点击

    { name: 'hd19_bg', path: 'images/rfbwx_zykx_hd_19/bg.png' },   //背景
    { name: 'hd19_title', path: 'images/rfbwx_zykx_hd_19/7.png' },   //
    { name: 'hd19_map', path: 'images/rfbwx_zykx_hd_19/5.png' },   //
    { name: 'hd19_b1', path: 'images/rfbwx_zykx_hd_19/1.png' },   //选项1
    { name: 'hd19_b2', path: 'images/rfbwx_zykx_hd_19/2.png' },   //选项2
    { name: 'hd19_b3', path: 'images/rfbwx_zykx_hd_19/3.png' },   //选项3
    { name: 'hd19_c3', path: 'images/rfbwx_zykx_hd_19/6.png' },   //选项1点击

    { name: 'hd21_bg', path: 'images/rfbwx_zykx_hd_21/bg.png' },   //背景
    { name: 'hd21_title', path: 'images/rfbwx_zykx_hd_21/1.png' },   //标题
    { name: 'hd21_b1', path: 'images/rfbwx_zykx_hd_21/4.png' },   //选项1
    { name: 'hd21_b2', path: 'images/rfbwx_zykx_hd_21/5.png' },   //选项2
    { name: 'hd21_b3', path: 'images/rfbwx_zykx_hd_21/6.png' },   //选项3
    { name: 'hd21_speaker', path: 'images/rfbwx_zykx_hd_21/7.png' },   //
    { name: 'hd21_speaker_r', path: 'images/rfbwx_zykx_hd_21/7-1.png' },   //
    { name: 'hd21_jxxx', path: 'images/rfbwx_zykx_hd_21/8.png' },   //继续学习

    { name: 'hd24_bg', path: 'images/rfbwx_zykx_hd_24/bg.png' },   //背景
    { name: 'hd24_title', path: 'images/rfbwx_zykx_hd_24/1.png' },   //选项8
    { name: 'hd24_b1', path: 'images/rfbwx_zykx_hd_24/2.png' },   //选项1
    { name: 'hd24_b2', path: 'images/rfbwx_zykx_hd_24/3.png' },   //选项2
    { name: 'hd24_b3', path: 'images/rfbwx_zykx_hd_24/4.png' },   //选项3
    { name: 'hd24_b4', path: 'images/rfbwx_zykx_hd_24/5.png' },   //选项4
    { name: 'hd24_b5', path: 'images/rfbwx_zykx_hd_24/6.png' },   //选项5
    { name: 'hd24_b6', path: 'images/rfbwx_zykx_hd_24/7.png' },   //选项6
    { name: 'hd24_b7', path: 'images/rfbwx_zykx_hd_24/8.png' },   //选项7
    { name: 'hd24_b8', path: 'images/rfbwx_zykx_hd_24/9.png' },   //选项8
    { name: 'hd24_c3', path: 'images/rfbwx_zykx_hd_24/12.png' },   //
    { name: 'hd24_c4', path: 'images/rfbwx_zykx_hd_24/13.png' },   //
    { name: 'hd24_c5', path: 'images/rfbwx_zykx_hd_24/10.png' },   //
    { name: 'hd24_c6', path: 'images/rfbwx_zykx_hd_24/11.png' },   //
    { name: 'hd24_c8', path: 'images/rfbwx_zykx_hd_24/14.png' },   //
    { name: 'hd24_jxxx', path: 'images/rfbwx_zykx_hd_24/15.png' },   //继续学习

{ name: 'hd_end', path: 'images/end.png' },   //继续学习
{ name: 'hd_end1', path: 'images/end1.png' }   //继续学习

);

//var read1,read2,read3;
function main() {
    var sdList = [
        {id:'right',path:'sound/right.mp3'},
        {id:'wrong',path:'sound/wrong.mp3'},
    	{id:'fx10-1',path:'sound/19.mp3'},
    	{id:'fx10-2',path:'sound/20.mp3'},
        { id: 'fx21-1', path: 'sound/58.mp3' },
        { id: 'fx21-kongxijingbao', path: 'sound/kongxijingbao.mp3' },
        { id: 'fx21-yuxianjingbao', path: 'sound/yuxianjingbao.mp3' },
        { id: 'fx21-jiechujingbao', path: 'sound/jiechujingbao.mp3' },
        { id: 'fx24-1', path: 'sound/61.mp3' }


    ];
    LGlobal.setDebug(true);
    LMouseEventContainer.set(LMouseEvent.MOUSE_DOWN,true);
    LMouseEventContainer.set(LMouseEvent.MOUSE_UP,true);
    LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,true);
    GameClass.sounds.preload(sdList);
    loadingLayer = new LoadingSample2();
    //addChild(loadingLayer);
    LLoadManage.load(
        imgData,
        function (progress) {
           // loadingLayer.setProgress(progress);
        },
        function (result) {
           // console.log('loaded')
            imglist = result;
           // console.log(loadingLayer)
            //removeChild(loadingLayer);
            loadingLayer = null;

            var launch_data = SCOGetValue("cmi.launch_data");
            if(launch_data){
                var subject = jQuery.parseJSON( launch_data );

                if(subject.sco01 == '1'){
                    sel_num = 1;
                    Inheritance("changeSco");
                    $(".p1 .check_mark").css("display", "block");
                    Inheritance("completed");
                }
                if(subject.sco02 == '1'){
                    sel_num = 2;
                    Inheritance("changeSco");
                    $(".p2 .check_mark").css("display", "block");
                    Inheritance("completed");
                }
            }

            sel_part(1);
        }
    );
}

var isHuawei = false;
var isMacOs = false;
var gIsVideo = false;

var effectSound = new Audio();
var soundOldCallback
function effecSoundPlay( filename, callback ){
    effectSound.pause();
    // effectSound.currentTime = 0;
    if( soundOldCallback != undefined )
        effectSound.removeEventListener('ended', soundOldCallback);
    effectSound.src = filename;
    effectSound.play();
    soundOldCallback = callback;
    effectSound.addEventListener('ended', callback);
}

var total_result = [0,0]

var hd1_cnt = [0,0];
var GameHd1 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd1", {});
        game._pInit = game.init;
        var b1, b2;
        var bg;
        var bjxxx;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd1_bg');
            this.bgLayer.addChild(bg);

            b1 = new LButton(GameClass.images.getImg("hd1_b1"),GameClass.images.getImg("hd1_c1"));
            b1.x = 406;
            b1.y = 225;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b1.bitmap_up.bitmapData = GameClass.images.getImg("hd1_c1").bitmapData;
                hd1_cnt[0] = 1;
                showPart('2');
            })

            b2 = new LButton(GameClass.images.getImg("hd1_b2"),GameClass.images.getImg("hd1_c2"));
            b2.x = 696;
            b2.y = 371;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                hd1_cnt[1] = 1;
                b2.bitmap_up.bitmapData = GameClass.images.getImg("hd1_c2").bitmapData;
                showPart('8');
            })

            if(hd1_cnt[0] == 1)
                b1.bitmap_up.bitmapData = GameClass.images.getImg("hd1_c1").bitmapData;
            if(hd1_cnt[1] == 1)
                b2.bitmap_up.bitmapData = GameClass.images.getImg("hd1_c2").bitmapData;
            if(hd1_cnt[0]== 1 && hd1_cnt[1] == 1 )
            {
                showPart('');
            }
        };

        return game;
    }
};

var hd4_cnt = [0,0,0];
var GameHd4 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd4", {});
        game._pInit = game.init;
        var b1, b2, b3, btn_jxxx;
        var bg;
        var bjxxx;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd4_bg');
            this.bgLayer.addChild(bg);

            b1 = new LButton(GameClass.images.getImg("hd4_b1"),GameClass.images.getImg("hd4_c1"));
            b1.x = 95;
            b1.y = 256;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                hd4_cnt[0] = 1;
                showPart('5');
            })

            b2 = new LButton(GameClass.images.getImg("hd4_b2"),GameClass.images.getImg("hd4_c2"));
            b2.x = 511;
            b2.y = 209;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                hd4_cnt[1] = 1;
                showPart('6');
            })

            b3 = new LButton(GameClass.images.getImg("hd4_b3"),GameClass.images.getImg("hd4_c3"));
            b3.x = 850;
            b3.y = 245;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                hd4_cnt[2] = 1;
                showPart('7');
            })

            btn_jxxx = new LButton(GameClass.images.getImg("hd4_jxxx"));
            btn_jxxx.x = 950;
            btn_jxxx.y = 500;
            btn_jxxx.visible = false;
            this.btnLayer.addChild(btn_jxxx);
            btn_jxxx.addEventListener(LMouseEvent.MOUSE_UP , function(){
                total_result[0] = 1;
                $(".p1 .check_mark").css("display", "block");
                Inheritance("completed");
                showPart('8');
            })
            if(hd4_cnt[0] == 1)b1.bitmap_up.bitmapData = GameClass.images.getImg("hd4_c1").bitmapData;
            if(hd4_cnt[1] == 1)b2.bitmap_up.bitmapData = GameClass.images.getImg("hd4_c2").bitmapData;
            if(hd4_cnt[2] == 1)b3.bitmap_up.bitmapData = GameClass.images.getImg("hd4_c3").bitmapData;

            if(hd4_cnt[0]== 1 && hd4_cnt[1] == 1 && hd4_cnt[2] == 1 )
            {
                btn_jxxx.visible = true;
            }
        };
        return game;
    }
};

var hd8_cnt = [0,0];
var GameHd8 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd8", {});
        game._pInit = game.init;
        var b1, b2;
        var bg;
        var bjxxx;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd8_bg');
            this.bgLayer.addChild(bg);

            b1 = new LButton(GameClass.images.getImg("hd8_b1"),GameClass.images.getImg("hd8_c1"));
            b1.x = 162;
            b1.y = 123;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b1.bitmap_up.bitmapData = GameClass.images.getImg("hd8_c1").bitmapData;
                hd8_cnt[0] = 1;
                showPart('9');
            })

            b2 = new LButton(GameClass.images.getImg("hd8_b2"),GameClass.images.getImg("hd8_c2"));
            b2.x = 138;
            b2.y = 327;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b2.bitmap_up.bitmapData = GameClass.images.getImg("hd8_c2").bitmapData;
                hd8_cnt[1] = 1;
                showPart('22');
            })


            bjxxx = new LButton(GameClass.images.getImg("hd8_jxxx"));
            bjxxx.x = 973;
            bjxxx.y = 540;
            bjxxx.visible = false;
            this.btnLayer.addChild(bjxxx);
            bjxxx.addEventListener(LMouseEvent.MOUSE_UP , function(){
                if(hd8_cnt[0]== 1 && hd8_cnt[1] == 1) {
                    total_result[1] = 1;
                    $(".p2 .check_mark").css("display", "block");
                    Inheritance("completed");
                    bg.bitmapData = GameClass.images.getImg("hd_end").bitmapData;
                    game.gameLayer.visible = false;
                    game.btnLayer.visible = false;
                }
            })

            if(hd8_cnt[0] == 1)
                b1.bitmap_up.bitmapData = GameClass.images.getImg("hd8_c1").bitmapData;
            if(hd8_cnt[1] == 1)
                b2.bitmap_up.bitmapData = GameClass.images.getImg("hd8_c2").bitmapData;

            if(hd8_cnt[0]== 1 && hd8_cnt[1] == 1)
            {
                bjxxx.visible = true;
            }
        };

        return game;
    }
};

var GameHd10 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd10", {});
        game._pInit = game.init;
        var b1, b2, b3;
        var bg;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd10_bg');
            this.bgLayer.addChild(bg);

            var title = GameClass.images.getImg('hd10_title');
            title.x = 270;
            title.y = 25;
            this.bgLayer.addChild(title);

            var map = GameClass.images.getImg('hd10_map');
            map.x = 166;
            map.y = 196;
            this.bgLayer.addChild(map);

            b1 = new LButton(GameClass.images.getImg("hd10_b1"));
            b1.x = 811;
            b1.y = 225;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b1.bitmap_up.bitmapData = GameClass.images.getImg("hd10_c1").bitmapData;
                effecSoundPlay('sound/19.mp3',function(){
                    showPart('11');
                });
            })

            b2 = new LButton(GameClass.images.getImg("hd10_b2"));
            b2.x = 813;
            b2.y = 344;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

            b3 = new LButton(GameClass.images.getImg("hd10_b3"));
            b3.x = 813;
            b3.y = 456;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

        };

        return game;
    }
};

var GameHd15 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd15", {});
        game._pInit = game.init;
        var b1, b2, b3 ;
        var bg;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd15_bg');
            this.bgLayer.addChild(bg);

            var title = GameClass.images.getImg('hd15_title');
            title.x = 270;
            title.y = 25;
            this.bgLayer.addChild(title);

            var map = GameClass.images.getImg('hd15_map');
            map.x = 166;
            map.y = 196;
            this.bgLayer.addChild(map);

            b1 = new LButton(GameClass.images.getImg("hd15_b1"));
            b1.x = 811;
            b1.y = 225;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

            b2 = new LButton(GameClass.images.getImg("hd15_b2"));
            b2.x = 813;
            b2.y = 344;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b2.bitmap_up.bitmapData = GameClass.images.getImg("hd15_c2").bitmapData;
                effecSoundPlay('sound/19.mp3',function(){
                    showPart('16');
                })
            })

            b3 = new LButton(GameClass.images.getImg("hd15_b3"));
            b3.x = 813;
            b3.y = 456;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

        };

        return game;
    }
};


var GameHd19 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd19", {});
        game._pInit = game.init;
        var b1, b2, b3 , b4,b5,b6;
        var bg;
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd19_bg');
            this.bgLayer.addChild(bg);

            var title = GameClass.images.getImg('hd19_title');
            title.x = 270;
            title.y = 25;
            this.bgLayer.addChild(title);

            var map = GameClass.images.getImg('hd19_map');
            map.x = 166;
            map.y = 196;
            this.bgLayer.addChild(map);

            b1 = new LButton(GameClass.images.getImg("hd19_b1"));
            b1.x = 811;
            b1.y = 225;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

            b2 = new LButton(GameClass.images.getImg("hd19_b2"));
            b2.x = 813;
            b2.y = 344;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/20.mp3',function(){

                })
            })

            b3 = new LButton(GameClass.images.getImg("hd19_b3"));
            b3.x = 813;
            b3.y = 456;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b3.bitmap_up.bitmapData = GameClass.images.getImg("hd19_c3").bitmapData;
                effecSoundPlay('sound/19.mp3',function(){
                    showPart('20');
                })
            })

        };

        return game;
    }
};

var GameHd21 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd21" , {});
        var b1, b2, b3, b4, b5, b6,bjxxx;
        var hd21_cnt = [0,0,0];
        var hd21_cnt2 = [0,0,0];
        game._pInit = game.init;
        current_page = '21';
        var click_cnt=0;
        game.init = function () {
            this._pInit();
            var bg = GameClass.images.getImg("hd21_bg");
            this.gameLayer.addChild(bg);

            var title = GameClass.images.getImg("hd21_title");
            title.x = 38;
            title.y = 76;
            this.gameLayer.addChild(title);

            b1 = new LButton(GameClass.images.getImg("hd21_b1"));
            b1.x = 97;
            b1.y = 185;
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                if(warningBtnSt=='speaker')
                {
                    warningBtnSt = 'Title';
                    game.checkState(21);
                    return;
                }
                if(warningBtnSt=='unknown'||warningBtnSt=='Title')
                {
                    warningBtnSt = 'Title';
                    effecSoundPlay('sound/wrong.mp3');
                }

            });

            b2 = new LButton(GameClass.images.getImg("hd21_b2"));
            b2.x = 478;
            b2.y = 182;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                if(warningBtnSt=='speaker')
                {
                    warningBtnSt = 'Title';
                      game.checkState(31);
                    return;
                }
                if(warningBtnSt=='unknown'||warningBtnSt=='Title')
                {
                    warningBtnSt=='Title'
                    effecSoundPlay('sound/wrong.mp3');
                }

            });

            b3 = new LButton(GameClass.images.getImg("hd21_b3"));
            b3.x = 867;
            b3.y = 180;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                if(warningBtnSt=='speaker')
                {
                    warningBtnSt = 'Title';
                    game.checkState(11);
                    return;
                }
                if(warningBtnSt=='unknown'||warningBtnSt=='Title')
                {
                    warningBtnSt=='Title'
                    effecSoundPlay('sound/wrong.mp3');
                }

            });

            var speaker_over = GameClass.images.getImg("hd21_speaker_r");

            b4 = new LButton(GameClass.images.getImg("hd21_speaker"),GameClass.images.getImg("hd21_speaker_r"));
            b4.x = 194;
            b4.y = 459;
            this.btnLayer.addChild(b4);
            b4.addEventListener(LMouseEvent.MOUSE_UP , function(){
                warningBtnSt = 'speaker';
                effectSound.pause();
                hd21_cnt2[0] = 1;hd21_cnt2[1] = 0;hd21_cnt2[1] = 0 ;
                effecSoundPlay('sound/jiechujingbao.mp3');

            });
            b5 = new LButton(GameClass.images.getImg("hd21_speaker"),GameClass.images.getImg("hd21_speaker_r"));
            b5.x = 578;
            b5.y = 459;
            this.btnLayer.addChild(b5);
            b5.addEventListener(LMouseEvent.MOUSE_UP , function(){
                warningBtnSt = 'speaker';
                effectSound.pause();
                hd21_cnt2[0] = 0;hd21_cnt2[1] = 1; hd21_cnt2[2] = 0 ;
                effecSoundPlay('sound/yuxianjingbao.mp3');
            });
            b6 = new LButton(GameClass.images.getImg("hd21_speaker"),GameClass.images.getImg("hd21_speaker_r"));
            b6.x = 987;
            b6.y = 459;
            this.btnLayer.addChild(b6);
            b6.addEventListener(LMouseEvent.MOUSE_UP , function(){
                warningBtnSt = 'speaker';
                effectSound.pause();
                hd21_cnt2[0] = 0;hd21_cnt2[1] = 0; hd21_cnt2[2] = 1 ;
                effecSoundPlay('sound/kongxijingbao.mp3');

            });
            bjxxx = new LButton(GameClass.images.getImg("hd21_jxxx"));
            bjxxx.x = 1008;
            bjxxx.y = 554;
            bjxxx.visible = false;
            this.btnLayer.addChild(bjxxx);
            bjxxx.addEventListener(LMouseEvent.MOUSE_UP , function(){
                showPart('19');
            });

        };
        game.checkState = function (param) {
            click_cnt++;
            var shape = new LShape();
            this.gameLayer.addChild(shape);
            switch(param) {
                case 11:
                    if (hd21_cnt2[0] == 1) {
                        hd21_cnt[0] = 1;
                        shape.graphics.drawLine(2, "#ff0000", [1035, 284, 258, 493]);
                        effecSoundPlay('sound/right.mp3',function(){
                            hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                            game.nextPage();
                        })
                    }
                    else {
                        hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                        effecSoundPlay('sound/wrong.mp3');
                    }
                    break;
                case 21:
                    if (hd21_cnt2[1] == 1) {
                        hd21_cnt[1] = 1;
                        shape.graphics.drawLine(2, "#ff0000", [298, 292, 625, 489]);
                          effecSoundPlay('sound/right.mp3',function(){
                            hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                            game.nextPage();
                        })
                    }
                    else {
                        hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                        effecSoundPlay('sound/wrong.mp3');
                    }
                    break;
                case 31:
                    if (hd21_cnt2[2] == 1) {
                        hd21_cnt[2] = 1;
                        shape.graphics.drawLine(2, "#ff0000",[722, 310, 1045, 502]);
                        effecSoundPlay('sound/right.mp3',function(){
                            hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                            game.nextPage();
                        })
                    }
                    else {
                        hd21_cnt2[0] = hd21_cnt2[1] = hd21_cnt2[2] = 0;
                        effecSoundPlay('sound/wrong.mp3');
                    }
                    break;
            }
        }
        game.nextPage = function()
        {
            if( gIsVideo ) return;
            if(hd21_cnt[0] == 1 && hd21_cnt[1] == 1 && hd21_cnt[2] == 1)
                bjxxx.visible = true;
        }

        return game;
    }

};

var GameHd24 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd24", {});
        game._pInit = game.init;
        current_page = '24';
        var b1, b2, b3 , b4 , b5, b6, b7, b8;
        var bg;
        var hd24_cnt = [0,0,0,0,0];
        game.init = function(){
            this._pInit();

            bg = GameClass.images.getImg('hd24_bg');
            this.bgLayer.addChild(bg);

            var title = GameClass.images.getImg('hd24_title');
            title.x = 292;
            title.y = 56;
            this.bgLayer.addChild(title);

            b1 = new LButton(GameClass.images.getImg("hd24_b1"));
            b1.x = 80;//88
            b1.y = 207;//257
            this.btnLayer.addChild(b1);
            b1.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/wrong.mp3',function(){
                    game.nextPage();
                })
            })

            b2 = new LButton(GameClass.images.getImg("hd24_b2"));
            b2.x = 462;
            b2.y = 279;
            this.btnLayer.addChild(b2);
            b2.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/wrong.mp3',function(){
                    game.nextPage();
                })
            })

            b3 = new LButton(GameClass.images.getImg("hd24_b3"));
            b3.x = 857;
            b3.y = 208;
            this.btnLayer.addChild(b3);
            b3.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b3.bitmap_up.bitmapData = GameClass.images.getImg("hd24_c3").bitmapData;
                hd24_cnt[0] = 1;
                effecSoundPlay('sound/right.mp3',function(){
                    game.nextPage();
                })
            })

            b4 = new LButton(GameClass.images.getImg("hd24_b4"));
            b4.x = 857;
            b4.y = 349;
            this.btnLayer.addChild(b4);
            b4.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b4.bitmap_up.bitmapData = GameClass.images.getImg("hd24_c4").bitmapData;
                hd24_cnt[1] = 1;
                effecSoundPlay('sound/right.mp3',function(){
                    game.nextPage();
                })
            })

            b5 = new LButton(GameClass.images.getImg("hd24_b5"));
            b5.x = 77;
            b5.y = 344;
            this.btnLayer.addChild(b5);
            b5.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b5.bitmap_up.bitmapData = GameClass.images.getImg("hd24_c5").bitmapData;
                hd24_cnt[2] = 1;
                effecSoundPlay('sound/right.mp3',function(){
                    game.nextPage();
                })
            })

            b6 = new LButton(GameClass.images.getImg("hd24_b6"));
            b6.x = 73;
            b6.y = 479;
            this.btnLayer.addChild(b6);
            b6.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b6.bitmap_up.bitmapData = GameClass.images.getImg("hd24_c6").bitmapData;
                hd24_cnt[3] = 1;
                effecSoundPlay('sound/right.mp3',function(){
                    game.nextPage();
                })
            })

            b7 = new LButton(GameClass.images.getImg("hd24_b7"));
            b7.x = 465;
            b7.y = 419;
            this.btnLayer.addChild(b7);
            b7.addEventListener(LMouseEvent.MOUSE_UP , function(){
                effecSoundPlay('sound/wrong.mp3',function(){
                    game.nextPage();
                })
            })

            b8 = new LButton(GameClass.images.getImg("hd24_b8"));
            b8.x = 859;
            b8.y = 481;
            this.btnLayer.addChild(b8);
            b8.addEventListener(LMouseEvent.MOUSE_UP , function(){
                b8.bitmap_up.bitmapData = GameClass.images.getImg("hd24_c8").bitmapData;
                hd24_cnt[4] = 1;
                effecSoundPlay('sound/right.mp3',function(){
                    game.nextPage();
                })
            })

            bjxxx = new LButton(GameClass.images.getImg("hd24_jxxx"));
            bjxxx.x = 980;
            bjxxx.y = 557;
            bjxxx.visible = false;
            this.btnLayer.addChild(bjxxx);
            bjxxx.addEventListener(LMouseEvent.MOUSE_UP , function(){
                showPart('23');
            })

        };

        game.nextPage = function(){
            if( gIsVideo ) return;
            if(hd24_cnt[0] == 1 && hd24_cnt[1] == 1 && hd24_cnt[2] == 1 &&
                hd24_cnt[3] == 1 && hd24_cnt[4] == 1 )
                bjxxx.visible = true;
        }

        return game;
    }


};

var GameHd23 = {
    _data:{},
    createNew:function(){
        var game = GameClass.createNew("Hd23", {});
        game._pInit = game.init;
        var bg;
        game.init = function(){
            this._pInit();

            if(total_result[0] == 1 && total_result[1] == 1)bg = GameClass.images.getImg('hd_end');
            else bg = GameClass.images.getImg("hd_end1");
            this.bgLayer.addChild(bg);
        };
        return game;
    }
};

