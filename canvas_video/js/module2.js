$(function() {
    var p01 = setTimeout(function() {
        $(".navagation").css("visibility", "hidden");
        startP02();
    }, 1000);
    try {
        doLMSSetValue('cmi.core.lesson_location', 'S200002'); //-------------平台接口调用
        doLMSSetValue("cmi.core.lesson_status", "start"); //-------------平台接口调用
    } catch (e) {
        console.log(e);
    }
});

var $video = $("video"),
    $audio = $("audio");
    // 给视频播放添加绑定，向平台发送 。。。
    $video.on("play",function(){
        doLMSSetValue("cmi.core.lesson_status", "play");
    })
    $video.on("pause",function(){
        doLMSSetValue("cmi.core.lesson_status", "pause");
    })
var videoSrcs = [
    "sco/video/jd_qh_zj_1.mp4",
    "sco/video/jd_qh_zj_2.mp4",
    "sco/video/jd_qh_zj_3.mp4",
    ""
];
var audioSrcs = [
    "sco/audio/right.mp3", //1
    "sco/audio/wrong.mp3", //2
    "sco/audio/jd_qh_zj_t2_1.mp3",
    "sco/audio/jd_qh_zj_t2_2.mp3",
    "sco/audio/jd_qh_zj_t3.mp3",
    ""

];

function playVideo(num, foo) {
    $video.off("ended");
    $video.css("display", "block");
    $video.attr("src", videoSrcs[num - 1]);
    $video[0].play();
    $video.on("ended", function() {
        $video.css("display", "none");
        exitFullscreen();
        if(parent.safari()){
            $(".touchScreen").css("display", "block");
            $(".touchMe").off().click(function() {
                $(".touchScreen").css("display", "none");
                if (typeof(foo) == 'function') {
                    foo();
                } else {
                }
            });
        }else{
            if (typeof(foo) == 'function') {
                foo();
            } else {
            }
        }
    });
}

function playAudio(num) {
    $audio[0].pause();
    $audio.off("ended");
    $audio.attr("src", audioSrcs[num - 1]);
    $audio[0].play();
}
// 2.0播放视频音频
function playVideotwo(videostr) {
    $video.off("ended");
    $video.css("visibility", "visible");
    $video.attr("src", videostr);
    $video[0].play();
}

function playAudiotwo(audiostr) {
    $audio[0].pause();
    $audio.off("ended");
    $audio.attr("src", audiostr);
    $audio[0].play();
}

var fristIn = 0,
    finish2 = [false, false];

function startP02() {
    var objD, currentObj, dragPuzzle = 0;
    $("#p02").css("visibility", "visible");
    playVideo(1, function() {
        playAudio(3)
    })
    $(".puzzle").draggable({
        revert: true,
        scroll: false,
        start: function(event) {
            $(event.target).css("z-index","2")
            objD = "<img src='sco/img/2/"+event.target.name+".png' class='afterRM' alt='增加图'>"
            currentObj = $(event.target)
        },
        stop: function(event){
            $(event.target).css("z-index","1")
        }
    })
    $(".puzzleBox").droppable({
        drop: function(event, ui) {
            event.stopPropagation()
            if (currentObj.attr("name") == $(this).attr("name")) {
                playAudio(1)
                $(this).append(objD)
                currentObj.remove()
                dragPuzzle += 1;
                checkDrag()
            } else {
                playAudio(2)
            }
        }
    })

    function checkDrag() {
        if (dragPuzzle >= 9) {
            //结束，进入下一模块
            $audio.on("ended", function() {
                $(".p02Pass").css("display", "block")
                playAudio(4)
            })
        }
    }
    // 点击“进入北极”进行下一步
    $(".in").click(function() {
        $audio[0].pause()
        $(".p02Pass").css("display", "none")
        $("#p02").css("visibility", "hidden")
        playVideo(2, function() {
            playVideo(3, function() {
                playAudio(5)
                startP03()
            })
        })
    })
}


function startP03() {
    $("#p03").css("visibility", "visible");
    $(".p03Pass").click(function() {
        $audio[0].pause()
        $("#p03").css("visibility", "hidden");
        startP04()
    })
}

// new mode: p04
function startP04(){
    $("#p04").css("visibility", "visible");
    // click the options:
    $(".p04clickDiv").off().click(function(event){
        if($(event.target).attr("name") == '1'){
            playAudio(1)
            $(".p04true").css("display","block")
        }else{
            playAudio(2)
            $(".p04false").css("display","block")
        }
    })
    // click the again button:
    $(".p04again").off().click(function(){
        $audio[0].pause()
        $(".p04false").css("display","none")
    })
    // click the next button:
    $(".p04next").off().click(function(){
        $audio[0].pause()
        $("#p04").css("visibility", "hidden");
        startP17()
    })
}



function startP17() {
    $("#p16").css("visibility", "hidden");
    $("#p17").css("visibility", "visible");
    window.parent.onfinish(2);
    try {
        doLMSSetValue('cmi.core.lesson_status', 'completed'); //-------------平台接口调用
    } catch (e) {
        console.log(e);
    }
}

function replayfinish(modulecode) {
    window.parent.onfinish(modulecode);
    window.parent.gohome();
}


function exitFullscreen() {
    var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    }
}