$(function() {
    var p01 = setTimeout(function() {
        $(".navagation").css("visibility", "hidden");
        if(parent.safari()){
            $(".touchScreen").css("display", "block");
            $(".touchMe").off().click(function() {
                $(".touchScreen").css("display", "none");
                startP02();
            });
        }else{
            startP02();
        }
    }, 1000);
    try {
        doLMSSetValue('cmi.core.lesson_location', 'S200003'); //-------------平台接口调用
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
    "sco/video/jd_qh_sq_1.mp4",
    "sco/video/jd_qh_sq_2.mp4",
    "sco/video/jd_qh_sq_3.mp4",
    "sco/video/jd_qh_sq_4.mp4",
    ""

];
var audioSrcs = [
    "sco/audio/right.mp3", //1
    "sco/audio/wrong.mp3", //2
    "sco/audio/jd_qh_sq_t2_1.mp3",
    "sco/audio/jd_qh_sq_t2_2.mp3",
    "sco/audio/jd_qh_sq_t2_3.mp3",
    "sco/audio/jd_qh_sq_t3.mp3", //6
    "sco/audio/drag.mp3",
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

function startP02() {
    var objD, currentObj, dragNum = 0,
        dragRightNum = [];
    $("#p02").css("visibility", "visible");
    playAudio(3)
    $(".word").draggable({
        revert: true,
        scroll: false,
        start: function(event) {
            $audio[0].pause()
            objD = "<img src='sco/img/3/word"+event.target.name+".png' style='left:-13px' class='afterRM' alt='增加图'>"
            currentObj = $(event.target)
        }
    })
    $(".dot").off().droppable({
        drop: function(event, ui) {
            event.stopPropagation()
            dragNum ++
            checkDrag()
            currentObj.css("display","none")
            playAudio(7);
            if (currentObj.attr("name") == $(this).attr("name")) {
                $(event.target).append(objD)
                .attr("alt",currentObj.attr("class"))
                .droppable("disable")
                .click(function(){
                    dragNum --
                    checkDrag()
                    $(event.target).droppable("enable").off("click")
                    $(event.target)[0].removeChild($(event.target)[0].childNodes[1])
                    for(var i = 1; i <= 4; i++){
                        if($(this).attr("alt").indexOf("word" + i) != -1){
                            $(".word" + i).css("display","block")
                        }
                    }
                })
            } else {
                dragRightNum.push(false)
                $(event.target).append(objD)
                .attr("alt",currentObj.attr("class"))
                .droppable("disable")
                .click(function(){
                    dragNum --
                    dragRightNum.pop()
                    checkDrag()
                    $(event.target).droppable("enable").off("click")
                    $(event.target)[0].removeChild($(event.target)[0].childNodes[1])
                    for(var i = 1; i <= 4; i++){
                        if($(this).attr("alt").indexOf("word" + i) != -1){
                            $(".word" + i).css("display","block")
                        }
                    }
                })
            }
            checkDrag()
        }
    })
    function checkDrag(){
        if(dragNum >= 4){
            $(".p02submit").css("display","block")
        }else{
            $(".p02submit").css("display","none")
        }
    }
        // 点击提交btn
    $(".p02submit").off().click(function() {
            if (dragRightNum.indexOf(false) == -1) {
                playAudio(4)
                $(".p02Right").css("display", "block")
            } else {
                playAudio(5)
                $(".p02Error").css("display", "block")
            }
        })
        // 点击再来一次
    $(".p02Again").off().click(function() {
            $audio[0].pause()
                //先恢复所有图和状态
            $(".word").css("display", "block")
            $(".p02submit").css("display", "none")
            $(".dot").droppable("enable").off("click")
            $(".afterRM").remove()
            dragRightNum = []
            dragNum = 0
            $(".p02Error").css("display", "none")
        })
        // 点tongguo
    $(".p02Understand").click(function() {
        $audio[0].pause()
        $(".p02Right").css("display", "none")
        $("#p02").css("visibility", "hidden");
        playVideo(1, function() {
            playAudio(6)
            startP03()
        })
    })
}

function startP03() {
    var progress = [false,false,false];
    $("#p03").css("visibility", "visible")
    $(".p03Img").off().click(function(event) {
        $audio[0].pause()
        playVideo(event.target.name, function() {
            $(".p03done" + (event.target.name - 1)).css("display", "block")
            progress[event.target.name - 2] = true;
            if (progress.indexOf(false) == -1) {
                $(".finish").css("display", "block")
            }
        })
    })
    $(".finish").click(function() {
        $("#p03").css("visibility", "hidden")
        startP04()
    })

}

function startP05() {

}

function startP04() {
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
        startP18()
    })


}

// 进入模块结束页面
function startP18() {
    $("#p17").css("visibility", "hidden");
    $("#p18").css("visibility", "visible");
    window.parent.onfinish(3);
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
// 点击进入第二个知识点的学习
// function replaycontinue(modulecode) {
//     // window.parent.oncontinue(modulecode);
//     window.parent.gohome();
// }
function exitFullscreen() {
    var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    }
}