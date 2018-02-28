/**
 * Created by MinYuanqi on 2017/8/14.
 */
var $startvideo = $("#startvideo");
$("#startvideo").attr("src", 'sco/video/m06u00s01p01.mp4');
$(function() {
    $(".spinner").fadeOut();
    setTimeout(function() {
        // $startvideo[0].play();
        $startvideo.on("ended", function() {
            exitFullscreen();
            $startvideo.off("ended");
            $('.zhskip').css('display', 'none');
            // $startvideo.fadeOut();
            $startvideo.css('display', 'none');
            $('.stage').fadeIn();
            $('.bottomMenu').fadeIn();
        });
    }, 500);
    // 点击跳过开场动画
    $(".zhskip").click(function() {
            $startvideo[0].pause();
            $startvideo.off("ended");
            // $startvideo.fadeOut();
            $startvideo.css('display', 'none');
            $('.zhskip').css('display', 'none');
            $('.stage').fadeIn();
            $('.bottomMenu').fadeIn();
            // onfinish(1);
            // onfinish(2);
            // onfinish(3);
        })
        // 点击中间按钮部分开始相应模块
    $(".chmiddleButtonpart").delegate("div", "click", function(e) {
        moduleStart(e.currentTarget.id);
    });
    // 底部导航栏显示标签
    $('.chbottomtitleimg').css('display', 'none');
    $('.chengming').css('display', 'block');

    // $("#allEndBtn").click(function() {
    //     window.location.reload();
    // });

    // $(".jixu").on("click", function() {
    //     window.location.href = "home.html"
    // })
    $("iframe").attr("src", "").css("display", "none");
});
// 定义模块是否完成变量
var module1finish = false;
var module2finish = false;
var module3finish = false;
var module4finish = false;
var showorhidecatalog = false;
var studyResult=JSON.parse(doLMSGetValue ('cmi.launch_data'));
$(function(){
    if(studyResult.S200001==1){
        module1finish=true;
        $('.dagou1').css('display','block');
    }
    if(studyResult.S200002==1){
        module2finish=true;
        $('.dagou2').css('display','block');
    }
    if(studyResult.S200003==1){
        module3finish=true;
        $('.dagou3').css('display','block');
    }
});


//-----------子页面调用
function moduleStart(num) {
    // 先隐藏掉目录菜单
    showorhidecatalog = false;
    //显示外边框：
    $(".borderBoss").css("display", "block")
    $('.chcatalog').css('display', 'none');
    var url;
    switch (num) {
        case "hb1":
        case "gomodule1":
            $('.chbottomtitleimg').css('display', 'none');
            $('.xingshi').css('display', 'block');
            url = 1;
            break;
        case "hb2":
        case "gomodule2":
            $('.chbottomtitleimg').css('display', 'none');
            $('.renming').css('display', 'block');
            url = 2;
            break;
        case "hb3":
        case "gomodule3":
            $('.chbottomtitleimg').css('display', 'none');
            $('.zihao').css('display', 'block');
            url = 3;
            break;
        case "hb4":
        case "gomodule4":
            $('.chbottomtitleimg').css('display', 'none');
            $('.zihao1').css('display', 'block');
            url = 4;
            break;
        case "littlebrief":
            url = 5;
            break;
        default:
            break;
    }
    if (url != 5) {
        var aaiframe = document.getElementById('iframe');
        aaiframe.src = "module" + url + ".html";
        $("iframe").css("display", "block");
        // $('.chtitle').css("display", 'none');
        $(".chmiddleButtonpart").css("display", "none");
    } else {
        $("iframe").attr("src", "finish.html").css("display", "block");
        // $('.chtitle').css("display",'none');
        $(".chmiddleButtonpart").css("display", "none");
    }
}
/**
 * 检测是否为Safari浏览器
 */

function safari(){
    var userAgent = navigator.userAgent.toLocaleUpperCase();
    if(userAgent.indexOf("SAFARI") > -1 && userAgent.indexOf("CHROME") <= -1){
        return true;
    }else{
        return false;
    }
}

// 点击显示目录
function showorhide() {
    
    showorhidecatalog = !showorhidecatalog;
    if (showorhidecatalog) {
        $('.chcatalog').css('display', 'block');
    } else {
        $('.chcatalog').css('display', 'none');
    }
}
// 点击hone按钮返回首页
function gohome() {
    //  //隐藏掉外边框
    $(".borderBoss").css("display", "none")
    $('.chbottomtitleimg').css('display', 'none');
    $('.chengming').css('display', 'block');
    $("iframe").attr("src", '').css("display", "none");
    $('.chtitle').css("display", 'block');
    $(".chmiddleButtonpart").css("display", "block");
}
// 接受从子级传上来的完成知识点
function onfinish(modulecode) {
    $('.dagou' + modulecode).css('display', 'block');
    switch (modulecode) {
        case 1:
            module1finish = true;
            break;
        case 2:
            module2finish = true;
            break;
        case 3:
            module3finish = true;
            break;

        default:
            break;
    }
    // if (module1finish && module2finish && module3finish) {
    //     // $('.chbrief').css('display','block');
    //     setTimeout(function() {
    //         moduleStart('littlebrief');
    //     }, 1000)
    // }

}
// 完成一个知识点的学习后，点击继续学习
function oncontinue(modulecode) {
    switch (modulecode) {
        case 2:
            url = 2;
            break;
        case 3:
            url = 3;
            break;
        case 0:
            url = 0;
            break;
        default:
            // url = false
            break;
    }
    if (url != 0) {
        $("iframe").attr("src", "module" + url + ".html").css("display", "block");
    } else {
        // 返回首页
        gohome();
    }
}

//------------自适应函数
var resizeWindow = function() {
    var t = $(".backGround"),
        tWith = t.width(),
        tHeight = t.height(),
        pWith,
        pHeight,
        scaleX, scaleY, tLeft, tTop;

    return function() {
        pWith = $(window).width();
        pHeight = $(window).height();
        scaleX = pWith / tWith;
        scaleY = pHeight / tHeight;
        scaleX = scaleX > scaleY ? scaleY : scaleX;

        tLeft = (pWith - tWith) / 2;
        tTop = (pHeight - tHeight) / 2;

        t.css({
            left: tLeft + "px",
            top: tTop + "px",
            "transform": "scale(" + scaleX + "," + scaleX + ")"
        });
    }
}();
resizeWindow();
$(window).resize(resizeWindow);

function clearSouGou() {
    $(".sogou_sugg_feedbackquan").remove();
}

function exitFullscreen() {
    var exitMethod = document.exitFullscreen || //W3C
        document.mozCancelFullScreen || //Chrome等
        document.webkitExitFullscreen || //FireFox
        document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}