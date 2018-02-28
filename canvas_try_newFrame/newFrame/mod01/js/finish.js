var $video = $("video"),
    $audio = $("audio");
// 2.0播放音频视频
var videoSrcs = [
    "sco/video/m06u03s03p01.mp4",
    "sco/video/m06u03s03p02.mp4",
    ""
];



function playVideo(num) {
    $video.off("ended");
    $video.css("display", "block");
    $video.attr("src", videoSrcs[num - 1]);
    $video[0].play();
}

function playAudiotwo(audiostr) {
    $audio[0].pause();
    $audio.off("ended");
    $audio.attr("src", audiostr);
    $audio[0].play();
}

$(function() {
    playVideo(1)
    $video.on("ended", function() {
        playVideo(2)
        $video.on("ended", function() {
            $video.css("visibility", "hidden");
            exitFullscreen();
        })
    })
});

playVideo(1)
$video.on("ended", function() {
    playVideo(2)
    $video.on("ended", function() {
        $video.css("visibility", "hidden");
        exitFullscreen();
    })
})

// 重新学习
function restart() {
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