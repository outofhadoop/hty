/**
 * Created by 0LiH on 2016/4/20.
 */
$(function(){
    var spinner=$(".spinner").css({
        "z-index":"96",
        "background":"rgba(0,0,0,.8)",
        "display":"none"
    });

    $("video").on({
        "playing":function(){
            spinner.stop().fadeOut()
        }, "waiting":function(e){
            e.preventDefault();
            spinner.stop().fadeIn()
        }
    });


    //搜狗的极速模式会多出一个iframe，暂时只是把它remove掉，还不知道什么原因。
    window.parent.clearSouGou();
});

var audioEngine = {
    audioTank:null,
    begin:function (url, fun) {
        fun = fun || function () {};
        this.stopAudio();
        soundManager.setup({
            useHighPerformance: true,
            onready: function () {
                audioEngine.audioTank = soundManager.createSound({
                    autoPlay: true,
                    autoLoad: true,
                    url: url,
                    onfinish: fun,
                    onfailure: function () {
                        alert("音频加载失败，请检查您的网络连接！")
                    }
                });
            }
        });
    },
    stopAudio:function(){
        if (this.audioTank) {
            this.audioTank.stop()
        }
    }
};

/*
jQuery.fn.extend({
    visShow:function(speed){
        speed=speed||"normal";
        if(this.css("visibility")){
            this.css("visibility","inherit").animate({opacity:1},speed)
        }
        else{
            console.log("not jquery document")
        }
        return this
    },
    visHide:function(speed){
        speed=speed||"normal";
        if(this.css("visibility")){
            this.animate({opacity:0},speed,function(){
                this.css("visibility","hidden")
            })
        }
        else{
            console.log("not jquery document")
        }
        return this
    }
});
*/
