// 初始化资源以及配置
// 记得把所有的console删掉
// 模块数量
$(document).ready(function(){
    var stageLayer,bottomNavLayer,iframeLayer,clickLayer,btnHomeL,catalogsLayer,modLayer;
    var shape;
    btnHomeL = new LSprite();
    var goWhere = function(g){
        var g = g || '?';
        if(g !== 'home'){
            btnHomeL.visible = false;
        }

        switch(g){
            case 'mod1':
            resManager.stop();
            modLayer.removeAllChild();
            resManager.mod1();
            break;

            case 'mod2':
            modLayer.removeAllChild();
            resManager.mod2();
            break;

            case 'mod3':
            modLayer.removeAllChild();
            resManager.mod3();
            break;

            case 'mod4':
            modLayer.removeAllChild();
            resManager.mod4();
            break;

            case 'mod5':
            modLayer.removeAllChild();
            resManager.mod5();
            break;

            case 'mod6':
            modLayer.removeAllChild();
            resManager.mod6();
            break;
        }
        if(g === 'home'){
            btnHomeL.visible = true;
            resManager.stop();
        }
    }
    function main(){
        LGlobal.preventDefault=false;
        //------------自适应函数
    //     var resizeWindow = function() {
    //     var t = $(".bottomNav"),
    //         tWith = t.width(),
    //         tHeight = t.height(),
    //         pWith,
    //         pHeight,
    //         scaleX, scaleY, tLeft, tTop;
    //     return function() {
    //         pWith = $(window).width();
    //         pHeight = $(window).height();
    //         scaleX = pWith / tWith;
    //         scaleY = pHeight / tHeight;
    //         scaleX = scaleX > scaleY ? scaleY : scaleX;
    
    //         tLeft = (pWith - tWith) / 2;
    //         tTop = (pHeight - tHeight) / 2;
    //         t.css({
    //             left: tLeft + "px",
    //             top: tTop + "px",
    //             "transform": "scale(" + scaleX + "," + scaleX + ")"
    //         });
    //     }
    // }();
    // resizeWindow();
    // $(window).resize(resizeWindow);
        shape = new LShape();
        addChild(shape);
                // 如果是提交版就加域
                if(resManager._commit){
                    try{
                        document.domain = "ztjy.edu.sh.cn";
                    }catch(e){
                    console.log(e);
                    }  
                }
                resManager.loadImg(imgResource,gameInit);
            }

    
    // 暂时采取向根元素插入元素的方式初始化
    // var _root_dom = document.getElementById("_root");
    // _root_dom.innerHTML = "<div id='stage'><div id='canvas_game'></div></div>";
    // var _canvas_game = document.getElementById("canvas_game");
    
    // LInit(50, 'canvas_game', resManager.view_WH.width, resManager.view_WH.height, main);
    LInit(50, 'canvas_game', 1000, 585, main);

    function loadBitmapdata(){
        var bitmapdata = new LBitmapData(loader.content);
        var bitmap = new LBitmap(bitmapdata);
        addChild(bitmap);
    }
    
    function gameInit(result){
        removeChild(resManager.loadingLayer);
        resManager.loadingLayer = null; 
        resManager.imgColl = result;
        loadHome();
    }
    
    // 找大致位置用的....不用时要注掉 PPP
    // resManager.LinsterMouse();

    // 展示首页
    function loadHome(){
        LGlobal.preventDefault=false;
        // if(resManager.mobile){
        //     LGlobal.canTouch = true;
        //     alert('yes')
        // }
        var catalogShow = false;
        var imgHomeB = [
            new LButton(resManager.getImg("module_in_1")),
            new LButton(resManager.getImg("module_in_2")),
            new LButton(resManager.getImg("module_in_3")),
            resManager.getImg("catalog_list"),
            new LButton(resManager.getImg("home_catalog")),
            new LButton(resManager.getImg("home_goHome")),
            resManager.getImg("home_title"),
            resManager.getImg("home_title1"), // 7
            resManager.getImg("home_title2"),
            resManager.getImg("home_title3"),
            resManager.getImg("home_catalog_hidden"),
            resManager.getImg("home_catalog_halfHidden")
            ],
            imgHomeBG = resManager.getImg('homeBG');
        // 中间按钮部分
        resManager.setImgP(40,50,imgHomeB[0]);
        resManager.setImgP(350,50,imgHomeB[1]);
        resManager.setImgP(650,50,imgHomeB[2]);
        LMouseEventContainer.set(LMouseEvent.MOUSE_MOVE,false);
        stageLayer = new LSprite();
        bottomNavLayer = new LSprite();
        addChild(stageLayer);
        resManager.addArrImg(btnHomeL,imgHomeB,0,2);
        stageLayer.addChild(imgHomeBG);
        stageLayer.addChild(btnHomeL);
        imgHomeB[0].addEventListener(LMouseEvent.MOUSE_UP,function(e){
            btnHomeL.visible = false;
            goWhere('mod1');
        })
       
        // 模块层
        modLayer = new LSprite();
        stageLayer.addChild(modLayer);
    
        // 右边目录和首页按钮
        resManager.setImgP(780,278,imgHomeB[3]);
        imgHomeB[3].visible = false;
        $(".chgohome").click(function(){
            goWhere('home');
        })
        $(".chcatalog1").click(function(){
            goWhere('mod1');
            $(".chcatalog").css('display','none');
            catalogShow = !catalogShow;
        })
        $(".chcatalog2").click(function(){
            goWhere('mod2');
            $(".chcatalog").css('display','none');
            catalogShow = !catalogShow;
        })
        $(".chcatalog3").click(function(){
            goWhere('mod3');
            $(".chcatalog").css('display','none');
            catalogShow = !catalogShow;
        })
    
        resManager.setImgP(915,520,imgHomeB[4]);
        resManager.addArrImg(bottomNavLayer,imgHomeB,3,4);
        bottomNavLayer.addChild(imgHomeB[4])
        bottomNavLayer.addChild(imgHomeB[5])
        // addChild(bottomNavLayer);
    
            //    目录进入模块的按钮
        // catalogsLayer = new LSprite();
        // catalogsLayer.visible = false;
        // catalogsLayer.x = imgHomeB[3].x;
        // catalogsLayer.y = imgHomeB[3].y;
        // var catalogs1 = new LButton(imgHomeB[10],imgHomeB[11]);
        // catalogs1.x = 20;
        // catalogs1.y = 20;
        // catalogsLayer.addChild(catalogs1)
    
        // var catalogs2 = catalogs1.clone();
        // catalogs2.x = 20;
        // catalogs2.y = 80;
        // catalogsLayer.addChild(catalogs2)
    
        // var catalogs3 = catalogs1.clone();
        // catalogs3.x = 20;
        // catalogs3.y = 145;
        // catalogsLayer.addChild(catalogs3)
        // bottomNavLayer.addChild(catalogsLayer); 
    
        imgHomeB[4].addEventListener(LMouseEvent.MOUSE_UP,function(){
            catalogShow = !catalogShow;
            imgHomeB[3].visible = catalogShow;
            // catalogsLayer.visible = catalogShow;
        });
        $(".chshowcatalog").click(function(){
            catalogShow = !catalogShow;
            if(catalogShow){
                $(".chcatalog").css('display','block')
            }else{
                $(".chcatalog").css('display','none')
            }
            
        })
        // catalogs1.addEventListener(LMouseEvent.MOUSE_UP,function(){
        //     catalogShow = !catalogShow;
        //     imgHomeB[3].visible = catalogShow;
        //     // catalogsLayer.visible = catalogShow;
        //     goWhere('mod1');
        // });
        // catalogs2.addEventListener(LMouseEvent.MOUSE_UP,function(){
        //     catalogShow = !catalogShow;
        //     imgHomeB[3].visible = catalogShow;
        //     // catalogsLayer.visible = catalogShow;
        //     goWhere('mod2');
        // });
        // catalogs3.addEventListener(LMouseEvent.MOUSE_UP,function(){
        //     catalogShow = !catalogShow;
        //     imgHomeB[3].visible = catalogShow;
        //     // catalogsLayer.visible = catalogShow;
        //     goWhere('mod3');
        // });
    
    
        // 左下角标题
        // resManager.setImgP(10,515,imgHomeB[6]);
        // bottomNavLayer.addChild(imgHomeB[6]);
        // resManager.setImgP(10,515,imgHomeB[7]);
        // imgHomeB[7].visible = false;
        // bottomNavLayer.addChild(imgHomeB[7]);
        // resManager.setImgP(10,515,imgHomeB[8]);
        // imgHomeB[8].visible = false;
        // bottomNavLayer.addChild(imgHomeB[8]);
        // resManager.setImgP(10,515,imgHomeB[9]);
        // imgHomeB[9].visible = false;
        // bottomNavLayer.addChild(imgHomeB[9]);
        
    }
    
    // 各知识点函数重写。。。最好写的有头有尾，有鼻子有眼，有鼻屎有眼屎
    resManager.mod1 = function(){
        var mod1 = new LSprite();
        mod1.x = 40;
        mod1.y = 18;
        mod1.graphics.drawRoundRect(1,'#ffffff',[0,0,resManager._modWH.width,resManager._modWH.height,35],true,'#ffffff')
        modLayer.addChild(mod1);
        var beginCoverImg = new LSprite();
        beginCoverImg.addChild(resManager.getImg('beginCoverImg'));
        mod1.addChild(beginCoverImg);
        setTimeout(function(){
            beginCoverImg.remove();
            mod1.graphics.clear();
            resManager.playVideo('./sco/video/jd_qh_nj_1.mp4',function(){
                resManager.playVideo('./sco/video/jd_qh_nj_2.mp4',mod1game1);
            });
        },1000);
        function mod1game1(){
            var game1Layer = new LSprite();
            game1Layer.name = 'game1Layer';
            var game1 = [
                resManager.getImg('mod1_1_bg'),
                resManager.getImg('mod1_1_clothes1'),
                resManager.getImg('mod1_1_clothes2'),
                resManager.getImg('mod1_1_clothes3'),
                resManager.getImg('mod1_1_clothes4'),
                resManager.getImg('mod1_1_clothes5'),
                resManager.getImg('mod1_1_clothes6'),
                resManager.getImg('mod1_1_clothes7'),
                resManager.getImg('mod1_1_clothes8'),
                resManager.getImg('mod1_1_fullBox')
            ];
            game1Layer.addChild(game1[0]);

            var drop = new LSprite();
            drop.addChild(game1[9]);
            drop.x = 580;
            drop.y = 160;
            game1Layer.addChild(drop)

            var drag1 = new LSprite();
            drag1.x = 19;
            drag1.y = 100;
            drag1.addChild(game1[1]);
            game1Layer.addChild(drag1);

            
            var drag2 = new LSprite();
            drag2.x = 142;
            drag2.y = 100;
            drag2.addChild(game1[2]);
            game1Layer.addChild(drag2);

            var drag3 = new LSprite();
            drag3.x = 265;
            drag3.y = 100;
            drag3.addChild(game1[3]);
            game1Layer.addChild(drag3);

            var drag4 = new LSprite();
            drag4.x = 388;
            drag4.y = 100;
            drag4.addChild(game1[4]);
            game1Layer.addChild(drag4);
            
            var drag5 = new LSprite();
            drag5.x = 19;
            drag5.y = 300;
            drag5.addChild(game1[5]);
            game1Layer.addChild(drag5);
            
            var drag6 = new LSprite();
            drag6.x = 142;
            drag6.y = 300;
            drag6.addChild(game1[6]);
            game1Layer.addChild(drag6);
            
            var drag7 = new LSprite();
            drag7.x = 265;
            drag7.y = 300;
            drag7.addChild(game1[7]);
            game1Layer.addChild(drag7);
            
            var drag8 = new LSprite();
            drag8.x = 388;
            drag8.y = 300;
            drag8.addChild(game1[8]);
            game1Layer.addChild(drag8);
            
            var dragObj = [drag1,drag2,drag3,drag4,drag5,drag6,drag7,drag8];

            resManager.initDrag(dragObj,[drop],[[1,2,3,4,5,7]],[0,150],function(){
                resManager.sound.playA(0);
            },function(){

            },function(){
                game1Layer.remove();
                mod1game2();
            });      
            mod1.addChild(game1Layer);
        }

        function mod1game2(){
            var game2 = [
                resManager.getImg('mod1_2_over'),
                resManager.getImg('mod1_2_child'), 
                resManager.getImg('mod1_2_next')
            ]
            resManager.sound.playA(2);
            var game2Layer = new LSprite();
            game2Layer.addChild(game2[0]);
            
            var overGame1 = new LSprite();
            overGame1.addChild(game2[1]);
            overGame1.x = 350;
            overGame1.y = 107;
            game2Layer.addChild(overGame1);

            var next = new LSprite();
            next.addChild(game2[2]);
            next.x = 390;
            next.y = 400;
            game2Layer.addChild(next);
            next.useCursor = 'pointer';
            next.addEventListener(LMouseEvent.MOUSE_UP,function(e){
                resManager.sound.pause();
                game2Layer.remove();
            });
            mod1.addChild(game2Layer);
        }
    }
})
