        // 所有配置的出口（看人家是这么写的，所以这么写，嗯）
        var resManager =  (function(){
            // 定义知识点内容的宽高和位置：
            this._modX = 40;
            this._modY = 18;
            // 视频
            var videoP;
            $(".videoBox").css({
                "left":_modX,
                "top":_modY
            });
            videoP = videojs('video-p',{width:915, height:500, preload:'auto', loop:false, autoplay: true},function(){
                videoP.on('play',function(){
                    if(resManager._commit && resManager.playVideoHome){
                        doLMSSetValue("cmi.core.lesson_status", "play");
                    }
                });
                videoP.on('pause',function(){
                    if(resManager._commit && resManager.playVideoHome){
                        doLMSSetValue("cmi.core.lesson_status", "pause");
                    }   
                });
            });

            var _sound; // 音频
            _sound = new LSound();
        // 音频资源
        var soundList = [
            'sco/audio/drag.mp3',
            'sco/audio/congratulation.mp3',
            'sco/audio/jd_qh_nj_t2_2.mp3'
        ];
        var moduleCount = 3;
        
        // 是否是提交版
        var _commit = false;
        
        // 是否在首页播放视频 ？ false : true
        var playVideoHome = true;
        
        // 定义内容宽高
        var view_WH = {
            'width': '1000',
            'height': '585'
        };
            // 图片资源
    var imgResource = new Array(
        { name: 'video_play', path: 'sco/img/video/play.png'},
        { name: 'video_pause', path: 'sco/img/video/pause.png'},
        // 首页
        //  首页模块入口：
        { name: 'module_in_1', path: 'sco/img/home/111.png'},
        { name: 'module_in_2', path: 'sco/img/home/222.png'},
        { name: 'module_in_3', path: 'sco/img/home/333.png'},
    
        // 首页背景图
        { name: 'homeBG', path: './sco/img/home/bg.png'},
    
        // 首页下方导航
        //  主页按钮
        { name: 'home_goHome', path: 'sco/img/home/icon-home.png'},
        //  目录按钮
        { name: 'home_catalog', path: 'sco/img/home/icon-list.png'},
        { name: 'home_catalog_hidden', path: 'sco/img/hidden.png'},
        { name: 'home_catalog_halfHidden', path: 'sco/img/haleHidden.png'},
    
        //  首页标题
        { name: 'home_title', path: 'sco/img/home/1.png'},
        { name: 'home_title1', path: 'sco/img/1/111.png'}, // 小节标题1
        { name: 'home_title2', path: 'sco/img/2/222.png'}, // 小节标题2
        { name: 'home_title3', path: 'sco/img/3/333.png'}, // 小节标题3
        // 目录
        { name: 'catalog_list', path: './sco/img/home/list.png'},
        // 知识点一图：
        { name: 'beginCoverImg', path: './sco/img/1/navbg.png'},
        { name: 'mod1_1_bg', path: './sco/img/1/bg.png'},
        { name: 'mod1_1_clothes1', path: 'sco/img/1/1.png'},
        { name: 'mod1_1_clothes2', path: 'sco/img/1/2.png'},
        { name: 'mod1_1_clothes3', path: 'sco/img/1/3.png'},
        { name: 'mod1_1_clothes4', path: 'sco/img/1/4.png'},
        { name: 'mod1_1_clothes5', path: 'sco/img/1/5.png'},
        { name: 'mod1_1_clothes6', path: 'sco/img/1/6.png'},
        { name: 'mod1_1_clothes7', path: 'sco/img/1/7.png'},
        { name: 'mod1_1_clothes8', path: 'sco/img/1/8.png'},
        { name: 'mod1_1_fullBox', path: 'sco/img/1/bboxFull.png'},
        { name: 'mod1_2_over', path: 'sco/img/1/responseBG.png'},
        { name: 'mod1_2_next', path: 'sco/img/back.png'},
        { name: 'mod1_2_child', path: 'sco/img/1/child.png'}
        // 知识点二图：
        // 知识点三图：
        // 知识点四图：
        // 知识点五图：
    );




            this.loadingLayer =  null; // 这可能是个进度条
            this.moduleCount = 3;
            this._commit =  false;
            this.view_WH = {'width': 1000,'height': '585'};
            this.imgResource = imgResource;
            this.imgColl = {}; // 所有图片集合
            this.playVideoHome = false;
            // 定义知识点，最多应该不会超过5个吧
            this.mod1 = function(){};
            this.mod2 = function(){};
            this.mod3 = function(){};
            this.mod4 = function(){};
            this.mod5 = function(){};
            this.mod6 = function(){};

            this._modWH ={
                width: 915,
                height: 500
            };
            // 知识点圆角度数
            this.angleRadius = 0;
            this.sound = {
                /**
                 * @param soudList数组的index
                 */
                playA: function(p){
                    _sound.load(soundList[p]);
                    _sound.addEventListener(LEvent.COMPLETE,function(){
                        _sound.play();
                    })
                    var fn = arguments[1] || function(){};
                    if(typeof fn == 'function'){
                        fn();
                    }
                    
                },
                pause: function(){
                    if(_sound.playing){
                        _sound.stop();
                    }
                }
            };
            
            /**
             * @name 删除数组中的某一项
             * @param 0数组，1某一项
             **/
            this.delArr = function(){
                var a = (arguments[0] === undefined && Object.prototype.toString.call(arguments[0] === "[object Array]")) ? [] : arguments[0];
                var b = arguments[1] === undefined ? null : arguments[1];
                for(var i_01=0; i_01<a.length;i_01++){
                    if(a[i_01] === b){
                        a.splice(i_01,1);
                    }
                }
            };
            // 加载所有图片资源
            this.loadImg = function(imgObj,fn){
                            var imgRes;
                            imgRes = imgObj || resManager.imgResource;
                            resManager.loadingLayer = new LoadingSample2();
                            addChild(resManager.loadingLayer);
                            LLoadManage.load(
                                imgRes,
                                function(progress){
                                    resManager.loadingLayer.setProgress(progress);
                                },
                                fn
                            );
                        };
            // 获取图片
            this.getImg = function(key){
                        return new LBitmap( new LBitmapData(resManager.imgColl[key]) );
                    };
            // 加载底部导航
            this.loadBottomNav = function(){
                        
                    };
            // 监听鼠标位置
            this.LinsterMouse = function(){
                $(document).mousemove(function(e){
                    console.log("X:" + e.pageX + "," + " " + "Y:" + e.pageY);
                });
            };
            // 简单的设置图片位置：para(x, y, 目标对象)
            this.setImgP = function(x,y,obj){
                var x = x || 0, y = y || 0;
                if(obj != undefined && obj != null){
                    obj.x = x;
                    obj.y = y;
                }else{
                    alert("setImgP×_×");
                }
            };
            // 以数组形式向层添加图（就是少敲几次键盘）arguments:(层对象, 目标数组, 从第几个位置开始, 到第几个位置结束,注意从零开始数，下面做了加一的操作)
            this.addArrImg = function(layer, obj, startIndex, endIndex){
                var startIndex = startIndex || 0, endIndex = endIndex + 1 || 0;
                if(typeof obj == "object"){
                    if(startIndex < 0){
                        startIndex = 0;
                    }else if(endIndex > obj.length){
                        endIndex = obj.length;
                    }
                    try{
                        for(var i=startIndex;i<endIndex;i++){
                            layer.addChild(obj[i]);
                        }
                    }catch(e){
                        console.log(e)
                    }
                    
                }
            };
            // 播放音频
            this.playVideo = function(url,fn){
                var fn = fn || function(){};
                videoP.off("ended");
                $(".videoBox").css("display","block");
                videoP.src({type:'video/mp4',src:url});
                videoP.on('ended',function(){
                    $(".videoBox").css("display","none");
                    fn();
                })
            };
            // 改变知识点位置（x,y,mod)
            this.setModXY = function(x,y,mod){
                this._modX = x || mod.x || 0;
                this._modY = y || mod.y || 0;
                mod.x = this._modX;
                mod.y = this._modY;
                
            };
            // 进入知识点后要隐藏首页按钮层，不然会点透
            this.hideHomeB = function(){
        
            };
            this.goHome = function(){
        
            };
            /**
             * 初始化拖动对象
             * @param  0拖动对象数组，1拖动目标对象数组，2对应拖动对象判断能否拖进去数组，3判断能否拖进的条件，4拖进后的函数,5托错后的函数，6拖动完成后的函数，7拖动结束是否隐藏，8拖动结束是否返回
             */
            this.initDrag = function(){
                var dragObj = arguments[0] || [],
                    dragIn = arguments[1] || [],
                    dragCheck = arguments[2] || [],
                    dragInDistance = arguments[3] || [0,100],
                    dragTrue = arguments[4] || function(){},
                    dragFalse = arguments[5] || function(){},
                    dragComplete = arguments[6] || function(){},
                    dragEndHide = arguments[7] || true,
                    dragEndBack = arguments[8] || false,
                    clickBack = arguments[9] || false,
                    stayPosition = arguments[10] || [0,0];
                // 拷贝拖动对象
                var copyObj = [];
                for(var i_3=0; i_3<dragObj.length; i_3++){
                    dragObj[i_3].useCursor = 'pointer';
                    dragObj[i_3].getParentByConstructor(LSprite).setChildIndex(dragObj[i_3],100);
                    var n = dragObj[i_3].clone();
                    copyObj.push(n);
                    copyObj[i_3] = dragObj[i_3].clone();
                }
                // 绑定事件
                for(var i_1=0; i_1<dragObj.length; i_1++){
                    dragObj[i_1].__mark = i_1; // shi liang ge xia hua xian _
                    // 记录初始位置
                    dragObj[i_1].__originalP = {
                        __x: dragObj[i_1].x,
                        __y: dragObj[i_1].y
                    };
                    dragObj[i_1].addEventListener(LMouseEvent.MOUSE_DOWN,function(e){
                        e.currentTarget.startDrag(e.touchPointID);
                        e.currentTarget.getParentByConstructor(LSprite).setChildIndex(e.currentTarget,102);
                    });
                    dragObj[i_1].addEventListener(LMouseEvent.MOUSE_UP,function(e){
                        e.currentTarget.stopDrag();
                        for(var i_2=0; i_2<dragIn.length; i_2++){
                            if(dragCheck[i_2].indexOf(e.currentTarget.__mark) != -1){
                                // 这里先这么写，应该计算两个对象的中心点距离
                                var dis = LPoint.distance2(e.currentTarget.x,e.currentTarget.y,dragIn[i_2].x,dragIn[i_2].y);
                                if(dis>=dragInDistance[0] && dis<=dragInDistance[1]){
                                    e.currentTarget.x = e.currentTarget.__originalP.__x;
                                    e.currentTarget.y = e.currentTarget.__originalP.__y;
                                    // 拖动正确就
                                    resManager.delArr(dragCheck[i_2],e.currentTarget.__mark);
                                    // 1.让克隆对象停留在目标,并隐藏拖动对象
                                    var baba =  e.currentTarget.getParentByConstructor(LSprite); 
                                    baba.addChild(copyObj[e.currentTarget.__mark])
                                    copyObj[e.currentTarget.__mark].x = dragIn[i_2].x;
                                    copyObj[e.currentTarget.__mark].y = dragIn[i_2].y;
                                    e.currentTarget.visible = false;
                                    // 2.是否点击后弹回原位置
                                    if(clickBack){
    
                                    }
                                    // 3.是否保留原对象
                                    if(dragEndBack){
                                        e.currentTarget.visible = true;
                                    }
                                    // 4.是否要再来一次
                                    // 5.执行参数函数
                                    dragTrue();
                                    // 6.怎么判断全部拖动完毕？
                                    var over = (function(){
                                        for(var i_4=0;i_4<dragCheck.length; i_4++){
                                            if(dragCheck[i_4].length!==0){
                                                return false;
                                            }
                                        }
                                        return true;
                                    })();
                                    if(over){
                                        dragComplete();
                                    }
                                }else{
                                    // 拖动不正确应该就返回原位置
                                    e.currentTarget.x = e.currentTarget.__originalP.__x;
                                    e.currentTarget.y = e.currentTarget.__originalP.__y;
                                    dragFalse();
                                }
                            }else{
                                // 拖动不正确应该就返回原位置
                                e.currentTarget.x = e.currentTarget.__originalP.__x;
                                e.currentTarget.y = e.currentTarget.__originalP.__y;
                                dragFalse();
                            }
                        }
                    })
                }
        
                if(dragObj.length > 0 && dragIn.length > 0){
                    // 如果拖动对象数组长度大于判断的数组，如果发现有哪些该拖进的拖不进，那可能是数组参数没有对应
                    // 没卵用
                    if(dragIn.length > dragCheck.length){
                        for(var i = dragCheck.length;i<=dragObj.length;i++){
                            dragCheck.push([]);
                        }
                    }
                }
            };
            this.stop = function(){
                if(_sound.playing){
                    _sound.stop();
                }
                $(".videoBox").css("display","none");
                videoP.pause();
            };
            // 检测是不是移动端
            this.mobile = function(){
                if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))){
                    return true;
                }
                return false;
            };
            /**
             * 用canvas播放视频
             * @param url Array 
             * @param fn function
             * @return LSprite
             */
            this.playV = function(url, fn, i){
                var i = arguments[2] !== undefined ? i : 0;
                var video = new LVideo()
                var videoLayer = new LSprite();
                var setProgress = new LSprite();
                var setProgressing = new LSprite();
                var playSprit = new LSprite();
                var pauseSprit = new LSprite();
                var control = new LSprite();
                var controlShow = false;

                video.width = 915;
                video.scaleX = 0.898;
                video.scaleY = 0.898;
                // video.x = 22;
                // video.y = 10;

                control.addChild(pauseSprit);
                control.addChild(playSprit);
                control.addChild(setProgress);
                control.addChild(setProgressing);
                // control.visible = false;
                // videoLayer.addEventListener(LMouseEvent.MOUSE_UP,function(){
                //     control.visible = true;
                //     setTimeout(function(){
                //         if(control.visible){
                //             control.visible = false;
                //         }
                //     },2000)
                // })
                playSprit.addChild(resManager.getImg('video_play'));
                playSprit.x = 90;
                playSprit.y = 438;
                playSprit.useCursor = 'pointer';
                // playSprit.visible = false;
                playSprit.addEventListener(LMouseEvent.MOUSE_UP,function(){
                    video.stop();
                    playSprit.visible = false;
                    pauseSprit.visible = true;
                })

                pauseSprit.addChild(resManager.getImg('video_pause'));
                pauseSprit.x = 90;
                pauseSprit.y = 438;
                pauseSprit.useCursor = 'pointer';
                pauseSprit.visible = false;
                pauseSprit.addEventListener(LMouseEvent.MOUSE_UP,function(){
                    video.play();
                    pauseSprit.visible = false;
                    playSprit.visible = true;
                })

                var ii;
                videoLayer.addChild(video);
                videoLayer.addChild(control);
                console.dir(videoLayer)
                setProgress.graphics.drawRect(1, "#080808", [160, 460, 700, 5], true, "#080808");

                video.addEventListener(LEvent.SOUND_COMPLETE,function(){
                    i++
                    video.stop();
                    clearInterval(ii);
                    if(i < url.length){
                        innerPlayVideo();
                    }else{
                        clearInterval(ii);
                        videoLayer.remove();
                        if(fn!==undefined && typeof fn === 'function'){
                            fn.call();
                        }
                    }
                });

                video.addEventListener(LEvent.COMPLETE,function(){
                    clearInterval(ii);
                    ii = setInterval(function(){
                        // console.log(video.getCurrentTime())
                        setProgressing.graphics.clear();
                        setProgressing.graphics.drawRect(1, "#F8F8FF", [160, 460, video.getCurrentTime()/video.length * 700, 5], true, "#F8F8FF");
                    },100)
                    video.play();
                })

                setProgress.removeEventListener(LMouseEvent.MOUSE_UP);
                setProgress.addEventListener(LMouseEvent.MOUSE_UP,function(e){
                    playSprit.visible = true;
                    pauseSprit.visible = false;
                    video.playTo((e.offsetX-200)/700*video.length,video.length)
                    clearInterval(ii);
                });

                innerPlayVideo();

                function innerPlayVideo(){
                    video.load(url[i]);
                }
                return videoLayer;
            };
            
            return {
                playV: playV,
                mobile: mobile,
                stop: stop,
                loadingLayer: loadingLayer,
                angleRadius: angleRadius,
                _modX: _modX,
                _modY: _modY,
                playVideoHome: playVideoHome,
                _commit: _commit,
                imgColl: imgColl,
                view_WH: view_WH,
                moduleCount: moduleCount,
                imgResource: imgResource,
                _modWH: _modWH,
                mod1: mod1,
                mod2: mod2,
                mod3: mod3,
                mod4: mod4,
                mod5: mod5,
                sound: sound,
                delArr: delArr,
                loadImg: loadImg,
                getImg: getImg,
                LinsterMouse: LinsterMouse,
                setImgP: setImgP,
                addArrImg: addArrImg,
                playVideo: playVideo,
                setModXY: setModXY,
                initDrag: initDrag
            }
        
        })(window.resManager || {});
        window.resManager = resManager;