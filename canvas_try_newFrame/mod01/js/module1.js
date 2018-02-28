$(function() {
    var p01 = setTimeout(function() {
        $(".navagation").css("visibility", "hidden");
        startP02();
    }, 1000);
    try {
        doLMSSetValue('cmi.core.lesson_location', 'S200001'); //-------------平台接口调用
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
    "sco/video/jd_qh_nj_1.mp4",
    "sco/video/jd_qh_nj_2.mp4",
    "sco/video/jd_qh_nj_4.mp4",
    "sco/video/jd_qh_nj_5.mp4",
    "sco/video/jd_qh_nj_6.mp4",
    "sco/video/jd_qh_nj_3.mp4", // 6
    ""
];

var audioSrcs = [
    "sco/audio/jd_qh_nj_t2_1.mp3",
    "sco/audio/jd_qh_nj_t2_2.mp3",
    "sco/audio/right.mp3",
    "sco/audio/wrong.mp3",
    "sco/audio/jd_qh_nj_t3_1.mp3",
    "sco/audio/jd_qh_nj_t3_2.mp3", //6
    "sco/audio/jd_qh_nj_t4_1.mp3", //7
    "sco/audio/jd_qh_nj_t4_2.mp3",
    "sco/audio/jd_qh_nj_t4_3.mp3",
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
function playVideo1(num) {
    $video.off("ended");
    $video.css("display", "block");
    $video.attr("src", videoSrcs[num - 1]);
    $video[0].play();
}

function playAudio(num) {
    $audio[0].pause();
    $audio.off("ended");
    $audio.attr("src", audioSrcs[num - 1]);
    $audio[0].play();
}



var iStep = ['b', 'a', 'b', 'a', 'a', 'a'];
var i = -1;

function startP02() {
    var dragPuzzle = 0;
    $("#p01").css("visibility", "hidden");
    $("#p02").css("visibility", "visible");
    playVideo(1, function() {
        $video.css("display", "none");
        playAudio(1);
    });
    
    $(".clothes").draggable({
        revert: true,
        scroll: false,
        start: function(event) {
            $(event.target).css("z-index","2")
            // objD = "<img src='"+ $(event.target).attr("src") +"' class='afterRM' alt='增加图' style='transform: rotate(193deg)'>"
            currentObj = $(event.target)
        },
        stop: function(event){
            $(event.target).css("z-index","1")
        }
    })
    $(".trunk").droppable({
        drop: function(event, ui) {
            event.stopPropagation()
            if (currentObj.attr("name") == 1) {
                if (dragPuzzle >= 5) {
                    playAudio(3)
                    currentObj.css("display","none")
                    $(".clothes").off()
                    $audio.on("ended", function() {
                        $(".clothes").css("display","none") 
                        // 出现反馈
                        $(".responseBox").css("display", "block")
                        playAudio(2)    
                    })
                }else{
                    $(".trunk").attr("src", "sco/img/1/bboxFull.png")
                    playAudio(3)
                    // $(this).append(objD)
                    currentObj.css("display","none")
                    dragPuzzle += 1;
                }
            } else {
                playAudio(4)
            }
        }
    })
    $(".p02next").click(function(){
        $audio[0].pause()
        startP03()
        $("#p02").css("visibility", "hidden");
    })
}


function startP03() {
    $("#p03").css("visibility", "visible");
    playVideo(2, function() {
        playAudio(5)
    })
    $(".earth").click(function() {
        playAudio(4)
    })
    $(".clickAntarctia").off().click(function() {
            playAudio(3)
            var int = setInterval(function() {
                $(".Antarctica").css("display", "block")
                setTimeout(function() {
                    $(".Antarctica").css("display", "none")
                }, 10)
            }, 20)
            $audio.on("ended", function() {
                setTimeout(function() {
                    window.clearInterval(int)
                    $(".responseBox1").css("display", "block")
                    playAudio(6)
                }, 500)

            })
        })
        // 点击下一环节，进入下一页
    $(".nextRound").click(function() {
        $audio[0].pause()
        $(".responseBox1").css("display", "none")
        $("#p03").css("visibility", "hidden");
        playVideo1(6)
        $video.on("ended",function(){
            $video.css("display", "none");
            exitFullscreen();
            playVideo1(3)
            $video.on("ended",function(){
                $video.css("display", "none");
                exitFullscreen();
                playVideo1(4)
                $video.on("ended",function(){
                    $video.css("display", "none");
                    exitFullscreen();
                    playVideo(5, function() {
                        playAudio(7)
                        startP04()
                    })
                })
            })
        })
    })

}

function startP04() {
    $("#p04").css("visibility", "visible");
    $(".sele").off().click(function(event) {
        if (event.target.name == "1") {
            //选对出现正确反馈
            $(".p04Response1").css("display", "block")
            playAudio(8)
            $(".p04next").click(function() {
                $(".p04Response1").css("display", "none")
                $("#p04").css("visibility", "hidden");
                $audio[0].pause()
                startP07()
            })
        } else {
            $(".p04Response2").css("display", "block")
            playAudio(9)
            $(".p04again").off().click(function() {
                $audio[0].pause()
                $(".p04Response2").css("display", "none")
            })
        }
    })
}



function startP07() {
    $("#p07").css("visibility", "visible");
    
    window.parent.onfinish(1);
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