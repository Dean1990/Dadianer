var com = require('Common');
module.exports = {

    // startGame : "开始游戏",
    // restart : "重新开始",
    // exit : "退出",
    // rules:"玩法介绍",
    // close:"关闭",
    // play:"出牌",
    // pass:"过",
    // declareWar:"宣战",
    // declare:"宣",
    // follow:"跟",
    // passTag:"不出",
    // allow:"给风",
    // gameOver:"游戏结束",

    init:function(){

        var langjson = "language/string_cn.json";

        if(cc.sys.language == cc.sys.LANGUAGE_CHINESE){
            langjson = "language/string_cn.json";
        }else if (cc.sys.language == LANGUAGE_ENGLISH){
            langjson = "language/string_eng.json";
        }

        cc.loader.loadRes(langjson,function(err,result){
            
            cc.log("系统语言："+cc.sys.language+" result>>"+result +" err>>" +err);

            com.lang = result;
            
            // this.startGames = result.startGame;
            // this.restart = result.restart;
            // this.exit = result.exit;
            // this.rules = result.rules;
            // this.close = result.close;
            // this.play = result.play;
            // this.pass = result.pass;
            // this.declareWar = result.declareWar;
            // this.declare = result.declare;
            // this.follow = result.follow;
            // this.passTag = result.passTag;
            // this.allow = result.allow;
            // this.gameOver = result.gameOver;

            // var res = cc.loader.getRes(langjson);

            // cc.log(res);
                        
        });

        



    }

};
