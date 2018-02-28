var titleAudio = new Audio();
var vpWidth = 0;
var vpHeight = 0;

function switchVideo(b) {
	gIsVideo = b;
	try {
		GameClass.sounds.clean();
		titleAudio.pause();
        effectSound.pause();///when game

	}catch(err){}
	if(b) {

        vplayer.width(vpWidth);//video-switch
        vplayer.height(vpHeight);

		$('.videoContent').show();        
		$('.gameContent').hide();
		
	} else {

        vplayer.width(0);//huawei-pms
        vplayer.height(0);

        switch (current_page){
            case '21':
                //GameClass.sounds.play('fx21-1');
                break;
            case '24':
				titleAudio.src = 'sound/61.mp3';
				titleAudio.play();
                break;
        }
        $('.gameContent').show();
        vplayer.pause();
        $('.videoContent').hide();
    }
}
var vplayer;
var screenApi = {} ;
var currentID = -1;

(function(lib){
	lib.isFullscreen = function(){
		if(document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreen  || document.isFullscreen || document.msIsFullscreen|| document.msFullscreenElement) {
			return true;
		}
		return false
	};

	lib.requestFullscreen = function(){
		if(this.isFullscreen()) {
			return;
		}
		var dom = document.getElementById('contentWrap');
		if (dom.requestFullscreen) {
	          dom.requestFullscreen();
	     } else if (dom.mozRequestFullScreen) {
	         dom.mozRequestFullScreen();
	     } else if (dom.webkitRequestFullscreen) {
	         dom.webkitRequestFullscreen();
	     } else if(dom.msRequestFullscreen) {
	     	dom.msRequestFullscreen();
	     }
	};
	lib.quitFullscreen = function(){
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
	};
	lib.toggleFullscreen = function(){
		
		if(this.isFullscreen()) {
			this.quitFullscreen();
		} else {
			this.requestFullscreen();
		}
	};
	lib.onScreenChange = function(){
		onresize();
	};

	var initRatio,lastRatio,bodyScale;
	function getDevicePixelRatio() {
		if(window.devicePixelRatio) {
			return window.devicePixelRatio;
		}
		return screen.deviceXDPI / screen.logicalXDPI;
	}
	lib.init = function(){
		document.addEventListener("fullscreenchange", this.onScreenChange);
		document.addEventListener("webkitfullscreenchange", this.onScreenChange);
		document.addEventListener("mozfullscreenchange", this.onScreenChange);
		document.addEventListener("MSFullscreenChange", this.onScreenChange);
        document.addEventListener("orientationchange",this.onScreenChange);
		window.addEventListener('resize',function(e){
			onresize(e);
		});
        initRatio = getDevicePixelRatio();
		lastRatio = initRatio;
		bodyScale = 1/initRatio;
		//$('body').css({width:window.innerWidth * initRatio, height:window.innerHeight * initRatio,transform:'scale(' +(bodyScale)+')'})
		onresize(null);
	};

    function onresize(e) {
		var ratio = getDevicePixelRatio()/initRatio;
		var w = window.innerWidth;
		var h = window.innerHeight;
		var scale_x = Math.min(w/1280,w/1280) * ratio;
		var scale_y = Math.min(h/720,h/720) * ratio;
		var fsize = 9 + 1/getDevicePixelRatio()*13;
		//$('.vjs-control').css({'font-size':window.innerWidth/1280 + 'em'})
        $('.vjs-control').css({height:'3em'});
		$('.vjs-control-bar').css({height:'3em',bottom:70 * scale_y});
		//$('.video-js .vjs-play-control').css({'font-size':22,'width':'2em'})
		//$('.video-js .vjs-volume-menu-button').css({'font-size':22})
		if(lib.isFullscreen()) {
			$('.contentWrap').css({width:w,height:h,position:'absoulte','top':0,'left':0});
			try {
				vplayer.width(w);
				vplayer.height(h);

                vpWidth = w;///This is for huawei-pms video switching problem
                vpHeight = h;///This is for huawei

				$('#videoPlayer').css({'margin-left':0, 'margin-top':0});
			}catch(err) {

			}
			var scale_x = Math.min(w/1280,w/1280);
			var scale_y = Math.min(h/720,h/720);
			//$('.gameContent').css({width:1280,height:720,transform:'scale(' +scale_x + ',' + scale_y + ')','margin-left':(w-1280*scale_x)/2});
			$('.gameContent').css({width:Math.round(1280),height:Math.round(720),transform:'scale(' + 1 * scale_x + ',' + 1 * scale_y + ')','margin-left':0});
			$('.gameContent').css({width:Math.round(1280),height:Math.round(720),'-webkit-transform':'scale(' + 1 * scale_x + ',' + 1 * scale_y + ')','margin-left':0});
			return;
		}

		$('.wrap').css({width:Math.round(1280*scale_x),height:Math.round(720*scale_y),left:Math.round(w*ratio-1280*scale_x)/2});
        $('.title').css({width:Math.round(271*scale_x),height:Math.round(58*scale_y),margin:Math.round(10*scale_y) + 'px'});
		$('.content').css({width:Math.round(1280*scale_x),height:Math.round(720*scale_y)});
		$('.contentWrap').css({position:'relative',width:Math.round(1280*scale_x),height:Math.round(720*scale_y)});
		$('.gameContent').css({width:Math.round(1280),height:Math.round(720),transform:'scale(' + 1 * scale_x + ',' + 1 * scale_y + ')','margin-left':0});
		$('.gameContent').css({width:Math.round(1280),height:Math.round(720),'-webkit-transform':'scale(' + 1 * scale_x + ',' + 1 * scale_y + ')','margin-left':0});

		isHuawei = false;
		isMacOs = false;
		var nagt = navigator.userAgent;
		var pos1 = nagt.indexOf("HonorSCL");
		var pos2 = nagt.indexOf("Chrome");
		var pos3 = nagt.indexOf("Mac OS");
        var pos4 = nagt.indexOf("UCBrowser");
		var pos5 = nagt.indexOf("SM-A8000");
        ////For Mac Osx
		var MacCPUVersion = nagt.indexOf('CPU OS 8');

		if ((pos1 > -1 && pos2 < 0) || (pos5 > 0 && pos4 > 0)||(pos3>0&&MacCPUVersion>0)) {
			if(pos1 > -1 && pos2 < 0) isHuawei = true;
			var offsetX = Math.round(((1280-w)/2)/scale_x);
			var offsetY = Math.round(((720-h)/2)/scale_y);
			// $('.gameContent').css({width:Math.round(1280),height:Math.round(720),transform:'scale(' + 1 * scale_x + ',' + 1 * scale_y + ') translate(-'+parseInt(1280*scale_x)+'px, -'+parseInt(720*scale_y)+'px)','margin-left':0});
			// $('.gameContent').css({width:Math.round(1280),height:Math.round(720),transform:'scale(' + 0.4678 + ',' + 0.3986 + ') translate(-559px, -228px)','margin-left':0});
			$('.gameContent').css({width:Math.round(1280),height:Math.round(720),transform:'scale(' + scale_x + ',' + scale_y + ') translate(-'+offsetX+'px, -'+offsetY+'px)','margin-left':0});
			$('.gameContent').css({width:Math.round(1280),height:Math.round(720),'-webkit-transform':'scale(' + scale_x + ',' + scale_y + ') translate(-'+offsetX+'px, -'+offsetY+'px)','margin-left':0});
		}
		else if( pos3 > -1 ){
			isMacOs = true;
		}


        $('#game_canvas').css({width:1280,height:720,margin:0});
		try {
			vplayer.width(Math.round(1280*scale_x));
			vplayer.height(Math.round(720*scale_y));

            vpWidth = vplayer.width();///This is for huawei-pms- video-game switching problem
            vpHeight = vplayer.height();///This is for huawei

		}catch(err){

		}

        $(".nav").css({'z-index':10000,width:Math.round(1280*scale_x),height:Math.round(73*scale_y)});
        $('.nav ul').css({width:(1280 * scale_x),height:Math.round(59*scale_y), marginTop:Math.round(10*scale_y)});
        $('.nav ul li.p1').css({ width: (284 * scale_x), height: 59 * scale_y, left: (261 * scale_x) });
        $('.nav ul li.p2').css({ width: (284 * scale_x), height: 59 * scale_y, left: (713 * scale_x) });
		$('.check_mark').css({width:(30*scale_x),height:(30*scale_y), marginTop:(-7*scale_y)});

		return;
	};
	
})(screenApi);

function gloalHandle(e) {
	screenApi.toggleFullscreen();
}
window.addEventListener('load',function(){
    vplayer = videojs('videoPlayer',{controls:true,width:1280,height:720,preload:'auto',autoplay:true,loop:false},function(){
			vplayer.on('play', function(){
				play_lesson_status();
			});
			vplayer.on("pause",function(){
				pause_lesson_status();
			});
	});
	$(".nav li").each(function(i) {
		$(this).attr('ud',i + 1);
		$(this).click(function(){
            var n = $(this).attr('ud');
            sel_part(n);
		});
	});
	screenApi.init();
});
function sel_part(n) {
    var indexs = [0, '1','8'];
    showPart(indexs[n]);
}
function showVideo(vfile, onComplete) {
    switchVideo(true);
	vplayer.pause();
    vplayer.src({type:'video/mp4',src:vfile});
    var callback = function(){
        vplayer.off("ended", arguments.callee);
        if(onComplete) {
            onComplete();
        }
    }
    vplayer.on("ended", callback);
}

function showPart(id) {
    $('.nav').css('display','block');
    GameClass.clean();
    switch(id) {
        case '1':
            currentID = id;
			sel_num = 1;
			Inheritance("changeSco");
            $('.nav li.sel').removeClass('sel');
            $('.nav li.p1').addClass('sel');
            if(currentID == id)
                if(currentID == id) showVideo("video/rfbwx_zykx_sp_2.mp4",function(){
                    if(currentID == id) showVideo("video/rfbwx_zykx_sp_3.mp4",function(){
                        if(currentID == id) showVideo("video/rfbwx_zykx_sp_4.mp4",function(){
                            GameClass.startGame('GameHd4');
                            hd1_cnt[0] = 1;
                        })
                    })
                })
            break;
		case '2':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_2.mp4" , function(){
				if(currentID == id) showVideo("video/rfbwx_zykx_sp_3.mp4" , function(){
					if(currentID == id) showVideo("video/rfbwx_zykx_sp_4.mp4" , function(){
						if(currentID == id) GameClass.startGame('GameHd4');
					})
				})
			})
			break;
		case '5':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_5.mp4" , function(){
				if(currentID == id) GameClass.startGame('GameHd4');
			})
			break;
		case '6':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_6.mp4" , function(){
				if(currentID == id) GameClass.startGame('GameHd4');
			})
			break;
		case '7':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_7.mp4" , function(){
				if(currentID == id) GameClass.startGame('GameHd4');
			})
			break;
        case '8':
            currentID = id;
			sel_num = 2;
			Inheritance("changeSco");
            $('.nav li.sel').removeClass('sel');
            $('.nav li.p2').addClass('sel');
            if(currentID == id) GameClass.startGame("GameHd8");
            break;
		case '9':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_9.mp4" , function(){
				if(currentID == id) GameClass.startGame('GameHd10');
			})
			break;
        case '11':
            currentID = id;
            if(currentID == id) showVideo("video/rfbwx_zykx_sp_11.mp4" , function(){
                if(currentID == id) showVideo("video/rfbwx_zykx_sp_12.mp4" , function(){
                    if(currentID == id) GameClass.startGame("GameHd15");
                })
			})
            break;
        case '16':
            currentID = id;
            if(currentID == id) showVideo("video/rfbwx_zykx_sp_14.mp4" , function(){
                if(currentID == id) showVideo("video/rfbwx_zykx_sp_15.mp4" , function(){
                    if(currentID == id) GameClass.startGame("GameHd19");
                })
            })
            break;
		case '19':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_19.mp4" , function(){
				if(currentID == id) GameClass.startGame('GameHd8');
			})
			break;
        case '20':
            currentID = id;
            if(currentID == id) showVideo("video/rfbwx_zykx_sp_17.mp4" , function(){
                if(currentID == id) showVideo("video/rfbwx_zykx_sp_18.mp4" , function(){
                    if(currentID == id) GameClass.startGame("GameHd21");
                })
            })
            break;
		case '22':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_20.mp4" , function(){
				if(currentID == id) showVideo("video/rfbwx_zykx_sp_22.mp4" , function(){
					if(currentID == id) GameClass.startGame("GameHd8");
				})
			})
			break;
		case '23':
			currentID = id;
			if(currentID == id) showVideo("video/rfbwx_zykx_sp_22.mp4" , function(){
				if(hd8_cnt[0]== 1) {
					total_result[1] = 1;
					$(".p2 .check_mark").css("display", "block");
					Inheritance("completed");
					GameClass.startGame("GameHd23");
				}else{
					GameClass.startGame("GameHd8");
				}
			})
			break;
        case '33':
            currentID = id;
            GameClass.startGame("GameHd21");
            break;

    }
}
function Inheritance(object) {
	console.log("object : " + object + " : " + sel_num);
	if (object == "play") {
		play_lesson_status();
	}
	else if (object == "pause") {
		pause_lesson_status();
	}
	else if (object == "completed") {
		$('#chapter' + sel_num).css("display", "block");
		sco_completed();
	}
	else if (object == "changeSco") {
		changeSco("sco0" + parseInt(sel_num)); //interface
	}
}
