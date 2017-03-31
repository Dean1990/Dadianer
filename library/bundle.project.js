require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script\AI.js

"use strict";

var com = require('Common');
module.exports = {

    chuPai: function chuPai(player, getWindNum) {

        //有人要风
        if (getWindNum != -1) {

            if (getWindNum == com._currentPlayer) {

                com._lastPai = null;
            } else if (com.isPlayerParty(com._currentPlayer, getWindNum)) {
                //队友  不出
                com.nextPlayer(null, "给风", getWindNum);

                return;
            }
        }

        com.sortPai(player.shouPai);

        var isEnableXuanZhan = com.checkEnableXuanZhan();

        if (isEnableXuanZhan != 0) {
            //可以宣战
            //设置宣战
            player.isXuanZhan = true;

            //宣战 修改全局变量
            com.isXuanZhan = true;

            if (isEnableXuanZhan == 1) {

                player.actionLabel.string = "宣战";
            } else if (isEnableXuanZhan == 2) {

                player.actionLabel.string = "跟";
            }
        }

        if (com._lastPai == null || com._lastPai.length == 0) {

            this.firstChuPai(player);
        } else {

            var pais = this.getEnableChuPai(player);

            var message = null;

            var pNum = -1;

            if (pais != null && pais.length > 0) {
                //有人要风
                if (getWindNum != -1) {

                    message = "不给";
                }
            } else {

                message = "给风";

                pNum = getWindNum;
            }

            com.nextPlayer(pais, message, pNum);
        }
    },

    /**
     * 第一个出牌
     */
    firstChuPai: function firstChuPai(player) {

        var weightArr = this.analyze(player.shouPai);

        //出一个最小权值的组合
        if (weightArr.length > 0) {

            var pais = player.shouPai.splice(weightArr[0][1], weightArr[0][2]);

            com.nextPlayer(pais);
        }
    },

    /**
     * 计算出可以出的牌
     */
    getEnableChuPai: function getEnableChuPai(player) {

        var weightArr = this.analyze(player.shouPai);

        var lastWeight = com.convertValueMore(com._lastPai);

        //要出的牌
        var pais = null;

        for (var i = 0; i < weightArr.length; i++) {

            var weight = weightArr[i][0];

            if (weight > lastWeight && (com._lastPai.length == 1 && (weight <= 180 || weight > 1600) || com._lastPai.length > 1)) {

                //上一张牌是否是队友出的
                if (com.isPlayerParty(com._currentPlayer, com.lastPlayerNum) && (com._lastPai.length == 1 && weight > 140 || com._lastPai.length > 1 && weight > 1400)) {
                    //不怼队友
                    //大于A或者大于对A 不出
                } else {

                    //出牌
                    pais = player.shouPai.splice(weightArr[i][1], weightArr[i][2]);
                }

                break;
            }
        }

        return pais;
    },

    /**
     * 出牌动作
     */
    // chuPaiAction:function(pais){

    //     var size = cc.winSize;

    //     // //清空lastPai
    //     // if(com._lastPai!=null){
    //     //     //清空上家出的牌 准备记录此次出牌
    //     //     com._lastPai.splice(0,com._lastPai.length);

    //     // }else {

    //     //     com._lastPai = new Array();

    //     // }

    //     //展示
    //     for(var j = 0;j<pais.length;j++){

    //         var node = pais[j];

    //         cc.director.getScene().addChild(node);

    //         node.setPosition(cc.p(size.width/2 + j*30,size.height/2));

    //         //更新到lastPai
    //         // com._lastPai.push(pais[j]);

    //     }

    // },

    /**
     * 排序权值列表
     */
    sortWeightArr: function sortWeightArr(weightArr) {

        for (var i = 0; i < weightArr.length; i++) {

            for (var j = i; j < weightArr.length; j++) {

                if (weightArr[i][0] > weightArr[j][0]) {

                    var tempArr = weightArr[i];

                    weightArr[i] = weightArr[j];

                    weightArr[j] = tempArr;
                }
            }
        }
    },

    /**
     * 计算可以出牌的所有权值
     */
    analyze: function analyze(pais) {

        var weightArr = new Array(); //[权值,开始下标,长度]

        // var lastLength = com._lastPai.length;

        if (pais != null) {

            // for(var j = 0;j<pais.length;j++){
            //     cc.log(pais[j]._name);
            // }


            for (var i = 0; i < pais.length; i++) {

                // cc.log("i:"+i);
                // cc.log(weightArr.length);
                // cc.log(pais[i]._name);

                var f = pais[i]._name.substring(0, 1);

                var l = parseInt(pais[i]._name.substring(1));

                if (f == "E") {
                    // if(lastLength==1){
                    //鬼 单张
                    weightArr.push([com.convertClownValue(l), i, 1]);
                    // }

                    var j = i + 1;

                    if (j < pais.length) {

                        var f2 = pais[j]._name.substring(0, 1);
                        if (f2 == "E") {
                            //存储对鬼的权值
                            weightArr.push([com.convertValueMore(pais.slice(i, j + 1)), i, 2]);
                        }
                    }
                } else {
                    // if(lastLength==1){
                    //对单张的权值保存
                    weightArr.push([com.convertValue(l), i, 1]);
                    // }

                    var j = 0;

                    var isCompose = false;

                    do {
                        j++;

                        if (i + j < pais.length) {

                            var l2 = parseInt(pais[i + j]._name.substring(1));

                            isCompose = l == l2;

                            // var isDifferentFive = false;
                            // //对花5的处理
                            // if(l==5 && j==1){

                            //     var f2 = pais[i+j]._name.substring(0,1);

                            //     var code = f.charCodeAt()+f2.charCodeAt();

                            //     //不是对黑5红5
                            //     if(code!=196 && code!=198){

                            //         isDifferentFive = true;

                            //     }

                            // }

                            // if(isCompose && (!(lastLength==1 && j==1) || (l==5 && !isDifferentFive))){
                            if (isCompose) {

                                //对多张的权值保存
                                weightArr.push([com.convertValueMore(pais.slice(i, i + j + 1)), i, j + 1]);
                            }
                        } else {

                            break;
                        }
                    } while (isCompose);

                    if (l != 5) {
                        //5特殊不能省略这个过程
                        //去除重复权值计算
                        i = i + j - 1;
                    }
                }
            }
        }

        this.sortWeightArr(weightArr);

        return weightArr;
    }

};

cc._RFpop();
},{"Common":"Common"}],"Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ce3dajz81FDajDPh6cF69x', 'Common');
// script\Common.js

"use strict";

module.exports = {

    playerNum: 4, //玩家数

    paiNum: 32, //牌数

    rounds: 0, //回合数

    players: null, //所有玩家的容器

    _lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    //_buChuNum:0,//记录不出牌次数

    lastPlayerNum: 0, //最后出牌的玩家

    winPlayer: null, //记录胜出者序号

    partyPlayers: null, //记录同一伙可宣战的玩家数组

    isXuanZhan: false, //是否宣战

    num: 0, //记数

    //voteGetWindNum:0,//参于投票人数

    setFirstPlayer: function setFirstPlayer(firstPlayer) {

        this._currentPlayer = firstPlayer;

        this.players[this._currentPlayer].currentTag.setVisible(true);
    },

    /**
     * 检查玩家，剔除胜出者，继续游戏
     */
    checkNextPlayerNoWinner: function checkNextPlayerNoWinner() {

        this.num = this.num + 1;

        //控制递归深度
        if (this.winPlayer.length < this.playerNum) {

            if (this.num % this.playerNum == 0) {

                this.rounds = this.rounds + 1;
            }

            this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

            if (this.winPlayer.indexOf(this._currentPlayer) != -1) {

                this.checkNextPlayerNoWinner();
            }
        }
        // cc.log("chekc player index:"+this._currentPlayer);
    },

    /**
     * 下一个玩家
     */
    nextPlayer: function nextPlayer(lastPai, message, getWindNum) {

        //设置默认值
        getWindNum = getWindNum || -1;

        //当前调用该函数的玩家部分
        if (lastPai == null || lastPai.length == 0) {

            // this._buChuNum = this._buChuNum + 1;
            //不出
            if (message == null) {

                message = "不出";
            }

            this.players[this._currentPlayer].actionLabel.string = message;
        } else {

            // this._buChuNum = 0;
            this.lastPlayerNum = this._currentPlayer;
            //清理牌桌
            this.clearPaiZhuo();
            //赋值
            this._lastPai = lastPai;
            //展示
            this.showLastPai();
        }

        this.players[this._currentPlayer].currentTag.setVisible(false);

        var isPlayerWin = this.players[this._currentPlayer].shouPai.length == 0 && this.winPlayer.indexOf(this._currentPlayer) == -1;

        if (isPlayerWin) {

            //cc.log("wp lenght:"+this.winPlayer.length);

            this.winPlayer.push(this._currentPlayer);

            this.players[this._currentPlayer].shouPaiNum.string = "";

            this.players[this._currentPlayer].actionLabel.string = "NO. " + this.winPlayer.length;

            var party = this.partyPlayers.indexOf(this._currentPlayer) != -1;

            var isGameOver = party;

            //游戏结束 人数条件
            var winNumCondition = party ? this.partyPlayers.length : this.playerNum - this.partyPlayers.length;

            if (this.winPlayer.length == winNumCondition) {

                for (var i = 0; i < winNumCondition; i++) {

                    isGameOver = isGameOver ^ this.partyPlayers.indexOf(this.winPlayer[i]) != -1;
                }

                if (isGameOver) {

                    //清理牌桌
                    this.clearPaiZhuo();

                    cc.director.getScene().getChildByName('GameLabel').string = "游戏结束";

                    return;
                }
            }
        }

        //********** 当前调用该函数的玩家部分结束 ************


        //下一个玩家部分
        //下一个合法的出牌者
        //this._currentPlayer = (this._currentPlayer+1)%this.playerNum;
        this.checkNextPlayerNoWinner();

        //cc.log(this.players[this._currentPlayer]);

        this.players[this._currentPlayer].currentTag.setVisible(true);

        this.players[this._currentPlayer].actionLabel.string = "";

        //三个不出，说明又轮到上次出牌的玩家 当有胜出者后，判断的数字要减少
        // if(this._buChuNum==(3-this.winPlayer.length)){

        if (this.lastPlayerNum == this._currentPlayer) {

            //清理牌桌
            this.clearPaiZhuo();

            this._lastPai = null;
        }

        if (isPlayerWin) {

            //记录下一个要牌者，及要风者
            getWindNum = this._currentPlayer;

            //更新下一个出牌者+1
            this.checkNextPlayerNoWinner();
        }

        //通知玩家可以出牌了
        this.players[this._currentPlayer].toggle(getWindNum);
    },

    /**
     * 检查出牌的合法性
     */
    checkChuPai: function checkChuPai(xuanPai, p) {

        var isCurrent = p == this._currentPlayer;

        // isCurrent = true;

        //是否该出牌
        if (!isCurrent) {

            return false;
        }

        //判断选中的牌
        if (xuanPai != null) {

            if (this._lastPai == null || this._lastPai.length == 0) {

                return this.composeCheck(xuanPai);
            } else {

                var length = xuanPai.length;

                var lastLength = this._lastPai.length;

                if (lastLength == 1) {
                    //单
                    if (length == 1) {

                        return this.convertValueMore(xuanPai) > this.convertValueMore(this._lastPai);
                    } else {
                        //炸 大于1600为炸
                        var value = this.convertValueMore(xuanPai);

                        return value > 1600 && value > this.convertValueMore(this._lastPai);
                    }
                } else if (lastLength >= 2 && lastLength < 5) {
                    //对
                    if (length >= 2) {
                        //可以出对，也可以出炸
                        return this.convertValueMore(xuanPai) > this.convertValueMore(this._lastPai);
                    } else {
                        //不能出单
                        return false;
                    }
                }

                return false;
            }
        }

        return false;
    },

    /**
     * 组合检查
     */
    composeCheck: function composeCheck(arr) {

        var length = arr.length;

        if (length == 1) {

            return true;
        } else if (length < 5) {

            var value = arr[0]._name.substring(1);

            var isClown = false;

            for (var i = 0; i < length; i++) {
                //鬼是一个特殊的组合
                if (arr[i]._name.substring(0, 1) == "E") {

                    if (isClown) {

                        //只有两张 且都是鬼
                        if (length == 2) {

                            return true;
                        } else {

                            return false;
                        }
                    } else {

                        isClown = true;
                    }
                } else {
                    //进到这里，这张牌不是大小鬼，出现不同权值 返回false
                    if (isClown) {

                        return false;
                    }

                    var value2 = arr[i]._name.substring(1);

                    if (value != value2) {

                        return false;
                    }
                }
            }

            //如果到这里 isClown 为真，及有鬼存在，但多张牌只有一个鬼，说明牌组合不对
            return !isClown;
        } else {

            return false;
        }
    },

    /**
     * 权值转换 
     * 不包括大小鬼
     */
    convertValue: function convertValue(l) {

        if (l < 4) {

            return (13 + l) * 10;
        } else {

            return l * 10;
        }
    },

    /**
     * 大小鬼权值转换 
     * 
     */
    convertClownValue: function convertClownValue(l) {
        //大鬼 l = 0  小鬼 l=1
        //小鬼要大于最大的单
        return (13 + 3 + 2 - l) * 10;
    },

    /**
     * 权值转换 多张
     */
    convertValueMore: function convertValueMore(arr) {

        var weight = 0;

        if (arr == null || arr.length == 0 || !this.composeCheck(arr)) {

            return weight;
        } else {

            var f = arr[0]._name.substring(0, 1);

            var l = parseInt(arr[0]._name.substring(1));

            if (f == "E") {
                //鬼
                weight = 13 + 3 + 2 - l;
            } else {

                if (l < 4) {

                    weight = 13 + l;
                } else {

                    weight = l;
                }
            }
            //特例
            if (arr.length == 2) {

                if (l == 10) {

                    return 16 * Math.pow(10, 2) + 1; //比对3大1
                } else if (l == 5) {

                    var value = f.charCodeAt() + arr[1]._name.substring(0, 1).charCodeAt();

                    if (value == 196) {
                        //对黑5
                        return 16 * Math.pow(10, 4) + 3; //比对红5大1
                    } else if (value == 198) {
                        //对红5
                        return 16 * Math.pow(10, 4) + 2; //比对鬼大1
                    }
                } else if (f == "E") {

                    return 16 * Math.pow(10, 4) + 1; //比四个3大1
                }
            }

            //cc.log("weight:"+weight);

            return weight * Math.pow(10, arr.length);
        }
    },

    /**
     * 排序方法
     */
    sortPai: function sortPai(spriteArr) {

        //cc.log(spriteArr);

        for (var i = 0; i < spriteArr.length; i++) {

            for (var j = i + 1; j < spriteArr.length; j++) {

                var name1 = spriteArr[i]._name;

                var name2 = spriteArr[j]._name;

                //cc.log(name1.substring(1));

                //cc.log("name1:"+name1+" name2:"+name2);

                if (parseInt(name1.substring(1)) > parseInt(name2.substring(1))) {

                    //cc.log("-name1:"+name1+" name2:"+name2);

                    var temp = spriteArr[i];

                    spriteArr[i] = spriteArr[j];

                    spriteArr[j] = temp;
                } else if (name1.substring(1) == name2.substring(1)) {

                    var code1 = name1.substring(0, 1).charCodeAt();
                    var code2 = name2.substring(0, 1).charCodeAt();

                    //5的特殊排序
                    if (name1.substring(1) == "5") {
                        //把对黑5或对红5放到一起
                        //把红桃与草花互换
                        if (code1 == 99) {

                            code1 = 98;
                        } else if (code1 == 98) {

                            code1 = 99;
                        }

                        if (code2 == 99) {

                            code2 = 98;
                        } else if (code2 == 98) {

                            code2 = 99;
                        }
                    }

                    if (code1 > code2) {

                        var temp = spriteArr[i];

                        spriteArr[i] = spriteArr[j];

                        spriteArr[j] = temp;
                    }
                }
            }
        }
    },

    /**
     * 展示在牌桌上
     */
    showLastPai: function showLastPai() {

        // cc.log("player:"+this._currentPlayer);

        if (this._lastPai != null && this._lastPai.length != 0) {

            var size = cc.winSize;

            //展示
            for (var j = 0; j < this._lastPai.length; j++) {

                var node = this._lastPai[j];

                // cc.log("node:");
                // cc.log(node);

                cc.director.getScene().addChild(node);

                node.setPosition(cc.p(size.width / 2 + j * 30, size.height / 2));
            }
        }
    },

    /**
     * 清空牌桌
     */
    clearPaiZhuo: function clearPaiZhuo() {

        // cc.log("clearPaiZhuo");

        if (this._lastPai != null && this._lastPai.length != 0) {

            for (var i = 0; i < this._lastPai.length; i++) {

                var node = this._lastPai[i];

                // cc.log(node);

                node.removeFromParent();

                node.destroy();
            }
        }
    },

    /**
     * 是否可以宣战或跟随
     * 不可以 0
     * 宣战 1
     * 跟随 2
     */
    checkEnableXuanZhan: function checkEnableXuanZhan(pNum) {

        if (pNum == null) {

            pNum = this._currentPlayer;
        }

        // cc.log("rounds:"+this.rounds);
        // cc.log(this.partyPlayers);
        // cc.log(pNum);
        // cc.log(this.partyPlayers.indexOf(pNum)!=-1);

        if (this.rounds == 1 && this.partyPlayers.indexOf(pNum) != -1) {

            if (this.isXuanZhan) {
                //跟
                return 2;
            } else {
                //宣战
                return 1;
            }
        } else {

            return 0;
        }
    },

    /**
     * 是否是同伙
     */
    isPlayerParty: function isPlayerParty(pNum, pNum2) {

        return pNum != pNum2 && this.partyPlayers.indexOf(pNum) == -1 ^ this.partyPlayers.indexOf(pNum2) == -1;
    }

};

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52296tYeOJGtoyHtGk1jFup', 'Game');
// script\Game.js

'use strict';

var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {

        player: {
            default: null,
            type: cc.Prefab
        },

        paiAn: {
            default: null,
            type: cc.Sprite
        },

        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        a1: {
            default: null,
            type: cc.Prefab
        },
        a2: {
            default: null,
            type: cc.Prefab
        },
        a3: {
            default: null,
            type: cc.Prefab
        },
        a5: {
            default: null,
            type: cc.Prefab
        },
        a10: {
            default: null,
            type: cc.Prefab
        },
        a11: {
            default: null,
            type: cc.Prefab
        },
        a12: {
            default: null,
            type: cc.Prefab
        },
        a13: {
            default: null,
            type: cc.Prefab
        },

        b1: {
            default: null,
            type: cc.Prefab
        },
        b2: {
            default: null,
            type: cc.Prefab
        },
        b3: {
            default: null,
            type: cc.Prefab
        },
        b5: {
            default: null,
            type: cc.Prefab
        },
        // b10:{
        //     default:null,
        //     type:cc.Prefab,
        // },
        b11: {
            default: null,
            type: cc.Prefab
        },
        b12: {
            default: null,
            type: cc.Prefab
        },
        b13: {
            default: null,
            type: cc.Prefab
        },

        c1: {
            default: null,
            type: cc.Prefab
        },
        c2: {
            default: null,
            type: cc.Prefab
        },
        c3: {
            default: null,
            type: cc.Prefab
        },
        c5: {
            default: null,
            type: cc.Prefab
        },
        c10: {
            default: null,
            type: cc.Prefab
        },
        c11: {
            default: null,
            type: cc.Prefab
        },
        c12: {
            default: null,
            type: cc.Prefab
        },
        c13: {
            default: null,
            type: cc.Prefab
        },

        d1: {
            default: null,
            type: cc.Prefab
        },
        d2: {
            default: null,
            type: cc.Prefab
        },
        d3: {
            default: null,
            type: cc.Prefab
        },
        d5: {
            default: null,
            type: cc.Prefab
        },
        // d10:{
        //     default:null,
        //     type:cc.Prefab,
        // },
        d11: {
            default: null,
            type: cc.Prefab
        },
        d12: {
            default: null,
            type: cc.Prefab
        },
        d13: {
            default: null,
            type: cc.Prefab
        },

        E0: {
            default: null,
            type: cc.Prefab
        },
        E1: {
            default: null,
            type: cc.Prefab
        }

    },

    // use this for initialization
    onLoad: function onLoad() {

        this.init();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    init: function init() {

        var self = this;

        var pais = new Array(self.a1, self.a2, self.a3, self.a5, self.a10, self.a11, self.a12, self.a13, self.b1, self.b2, self.b3, self.b5, self.b10, self.b11, self.b12, self.b13, self.c1, self.c2, self.c3, self.c5, self.c10, self.c11, self.c12, self.c13, self.d1, self.d2, self.d3, self.d5, self.d10, self.d11, self.d12, self.d13, self.E0, self.E1);

        //打乱数组
        pais.sort(function () {

            return 0.5 - Math.random();
        });

        var pp = new Array();

        com.players = new Array();

        for (var j = 0; j < com.playerNum; j++) {

            var node = cc.instantiate(this.player);

            node.getComponent('Player').shouPai = new Array();

            node.getComponent('Player').currentTag.setVisible(false);

            com.players.push(node.getComponent('Player'));
        }

        //初始化同一伙数组
        com.partyPlayers = new Array();

        for (var i = 0; i < com.paiNum; i++) {

            var j = i % com.playerNum;

            var sprite = cc.instantiate(pais.shift());

            com.players[j].shouPai.push(sprite);

            if (sprite._name == "a11") {

                com.setFirstPlayer(j);
            }

            if (sprite._name.substring(0, 1) == "E") {
                //记录大小鬼同一伙
                com.partyPlayers.push(j);
            }
        }

        //初始化胜利者数组
        com.winPlayer = new Array();

        com.players[0].isAI = false;
        com.players[1].isAI = true;
        com.players[2].isAI = true;
        com.players[3].isAI = true;

        //设置玩家位置
        var size = cc.winSize;

        var node1 = com.players[1].node;

        cc.director.getScene().addChild(node1);

        node1.setPosition(cc.p(size.width - node1.width / 3 * 2, size.height / 2));

        var node2 = com.players[2].node;

        cc.director.getScene().addChild(node2);

        node2.setPosition(cc.p(size.width / 2, size.height - node1.height / 3 * 2));

        var node3 = com.players[3].node;

        cc.director.getScene().addChild(node3);

        node3.setPosition(cc.p(node3.width / 3 * 2, size.height / 2));

        //cc.log(com.players[0]);

        self.paiAn.getComponent('PaiAn').player = com.players[0];

        //如果是机器人，指定出牌
        if (com._currentPlayer != 0 && com.players[com._currentPlayer].isAI) {

            com.rounds = 1;

            com.players[com._currentPlayer].toggle(-1);
        }

        // for(var n = 0;n<pp.length;n++){

        //     self.player0.getComponent('Player').ShouPai = pp[0];

        // }
    }
});

cc._RFpop();
},{"Common":"Common"}],"PaiAn":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b3ac1KyqV9HV74OMXSKmVzK', 'PaiAn');
// script\PaiAn.js

"use strict";

var com = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {

        player: {

            default: null,
            type: cc.Sprite

        },

        xuanZhuanBtn: {
            default: null,
            type: cc.Button
        }

    },

    // use this for initialization
    onLoad: function onLoad() {

        //cc.log(this.xuanZhuanBtn);

        if (com.checkEnableXuanZhan(0) != 0) {

            this.xuanZhuanBtn.enabled = true;
        } else {

            //this.xuanZhuanBtn.node.removeFromParent();

            this.xuanZhuanBtn.node.destroy();
        }

        this.player.xuanPai = new Array();

        //玩家头像
        var node = this.player.node;

        // cc.director.getScene().addChild(node);

        this.node.addChild(node);

        node.setPosition(cc.p(-this.node.width / 2 - node.width / 3 * 2, 0));

        //展示手牌
        this.drawPai();
    },

    /**
     * 点击宣战
     */
    xuanZhan: function xuanZhan() {

        var isEnableXuanZhan = com.checkEnableXuanZhan();

        if (isEnableXuanZhan == 1) {

            this.player.actionLabel.string = "宣战";
        } else if (isEnableXuanZhan == 2) {

            this.player.actionLabel.string = "跟";
        }

        //宣战 修改全局变量
        com.isXuanZhan = true;

        this.xuanZhuanBtn.enabled = false;

        this.player.isXuanZhan = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     * 出牌
     */
    chuPai: function chuPai() {

        var self = this;

        //出牌合法性
        if (com.checkChuPai(self.player.xuanPai, 0)) {

            if (this.xuanZhuanBtn != null && this.xuanZhuanBtn.isValid) {

                this.xuanZhuanBtn.enabled = false;
            }

            //移除TOUCH监听
            for (var m = 0; m < self.player.shouPai.length; m++) {

                self.player.shouPai[m].off(cc.Node.EventType.TOUCH_START, self.touchPai, this);
            }

            //合法
            var indexArr = new Array();

            var windowSize = cc.winSize;

            //得到要出的牌在手牌中的位置
            for (var i = 0; i < self.player.xuanPai.length; i++) {

                for (var j = 0; j < self.player.shouPai.length; j++) {

                    if (self.player.shouPai[j]._name == self.player.xuanPai[i]._name) {

                        //cc.log(self.player.shouPai[j]._name);

                        indexArr.push(j);
                    }
                }
            }

            self.player.xuanPai.splice(0, self.player.xuanPai.length);

            indexArr.sort();

            //清空牌桌
            //com.clearPaiZhuo();

            var lastPai = new Array();

            //出牌动作
            for (var i = 0; i < indexArr.length; i++) {

                var sprite = self.player.shouPai[indexArr[i]];

                //记录出牌
                lastPai.push(sprite);

                sprite.removeFromParent();

                // var p = sprite.convertToWorldSpace(cc.p(0,0));

                // var nodeP = self.node.convertToWorldSpace(cc.p(self.node.getContentSize().width/2,self.node.getContentSize().height/2));

                // var x = windowSize.width/2-nodeP.x+30*i;

                // var y = windowSize.height/2-p.y;

                // sprite.runAction(cc.moveTo(0.5,cc.p(x,y)));
            }

            indexArr.reverse();

            //从手牌中删除
            for (var n = 0; n < indexArr.length; n++) {

                self.player.shouPai.splice(indexArr[n], 1);
            }

            //刷新手牌展示
            self.drawPai();

            com.nextPlayer(lastPai);
        } else {
            //不合法
            var length = self.player.xuanPai.length;

            for (var i = 0; i < length; i++) {

                self.player.xuanPai.pop().runAction(cc.moveBy(0.1, 0, -30));
            }
        }
    },

    buChuPai: function buChuPai() {

        if (this.xuanZhuanBtn != null && this.xuanZhuanBtn.isValid) {
            this.xuanZhuanBtn.enabled = false;
        }

        com.nextPlayer();
    },

    /**
     * 展示手牌
     */
    drawPai: function drawPai() {

        var self = this;

        com.sortPai(self.player.shouPai);

        var num = self.player.shouPai.length;

        //var size = self.node.getContentSize();

        for (var i = 0; i < num; i++) {

            var pai = self.player.shouPai[i];
            // cc.log("pai i:"+i);
            // cc.log(pai);
            // cc.log("self.node:");
            // cc.log(self.node);

            if (pai.parent != self.node) {

                self.node.addChild(pai);
            }

            var p = cc.p(-(pai.width + (num - 1) * 30) / 2 + pai.width / 2 + i * 30, 0);

            // pai.setScale(0.5);
            pai.setPosition(p);
            pai.on(cc.Node.EventType.TOUCH_START, self.touchPai, this);
        }
    },

    /**
     * TOUCH监听回调
     */
    touchPai: function touchPai(event) {

        var self = this;

        var node = event.target;
        var index = -1;

        for (var j = 0; j < self.player.xuanPai.length; j++) {

            if (node._name == self.player.xuanPai[j]._name) {

                index = j;

                break;
            }
        }

        if (index == -1) {

            self.player.xuanPai.push(node);

            node.runAction(cc.moveBy(0.1, 0, 30));
        } else {

            self.player.xuanPai.splice(index, 1);

            node.runAction(cc.moveBy(0.1, 0, -30));
        }
    }
});

cc._RFpop();
},{"Common":"Common"}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8c5d8QamBFBuaHZjtQBUcp+', 'Player');
// script\Player.js

'use strict';

var com = require('Common');
var ai = require('AI');

cc.Class({
    extends: cc.Component,

    properties: {

        shouPaiNum: {
            default: null,
            type: cc.Label
        },

        playerImg: {
            default: null,
            type: cc.Sprite
        },

        currentTag: {
            default: null,
            type: cc.Sprite
        },

        actionLabel: {
            default: null,
            type: cc.Label
        },

        xuanZhan: {
            default: null,
            type: cc.Label
        },

        isAI: null, //是否是AI

        shouPai: null, //手牌

        xuanPai: null, //选中的牌

        isXuanZhan: false },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.isXuanZhan) {
            this.xuanZhan.string = "宣";
        }

        if (this.shouPai != null) {
            this.shouPaiNum.string = this.shouPai.length;
        }
    },

    toggle: function toggle(getWindNum) {

        if (this.isAI) {

            this.scheduleOnce(function () {

                ai.chuPai(this, getWindNum);
            }, 1);
        } else {

            //不是AI


        }
    }

});

cc._RFpop();
},{"AI":"AI","Common":"Common"}]},{},["AI","Common","Game","PaiAn","Player"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQUkuanMiLCJhc3NldHMvc2NyaXB0L0NvbW1vbi5qcyIsImFzc2V0cy9zY3JpcHQvR2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvUGFpQW4uanMiLCJhc3NldHMvc2NyaXB0L1BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFSTs7QUFFSTtBQUNBOztBQUVJOztBQUVJO0FBRUg7QUFDRztBQUNBOztBQUVBO0FBRUg7QUFFSjs7QUFFRDs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTtBQUNBOztBQUVJO0FBQ0g7QUFFSjs7QUFFRzs7QUFFQTtBQUVIOztBQUVEO0FBR0g7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFSTs7QUFFQTtBQUVIO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVROztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRztBQUNBO0FBRUg7O0FBRUQ7QUFFSDtBQUVKOztBQUVEO0FBRVA7O0FBRUQ7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7O0FBR0E7O0FBRUk7O0FBRUk7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7QUFFSDtBQUVKO0FBRUo7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTtBQUNBOzs7QUFHQTs7QUFFSTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFDSjs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBRUo7QUFFSjtBQUNHO0FBQ0k7QUFDQTtBQUNKOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBRUg7QUFFSjs7QUFFRztBQUVIO0FBRUo7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBRUo7QUFFSjs7QUFFRDs7QUFFQTtBQUVIOztBQXBUWTs7Ozs7Ozs7OztBQ0RqQjs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTtBQUVIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUE7O0FBRUk7QUFFSDtBQUVKO0FBQ0Q7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRVE7QUFDQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBRUg7O0FBRUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOztBQUVEOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7O0FBRUk7QUFFSDs7QUFFRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBO0FBRUg7QUFFSjtBQUVKOztBQUlEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFHQTtBQUNBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFJRDs7QUFFSTtBQUNBOztBQUVBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBSVA7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVLO0FBRUo7O0FBRUc7O0FBRUE7O0FBRUE7QUFDSTtBQUNBOztBQUVJO0FBRUg7QUFDRztBQUNBOztBQUVBO0FBRUg7QUFFSjtBQUNHO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFDRztBQUNBO0FBRUg7QUFFSjs7QUFFRDtBQUVIO0FBRUo7O0FBRUQ7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFDSDs7QUFFRzs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFDSjs7QUFFRztBQUVIO0FBR0o7QUFDRztBQUNBOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUE7O0FBRUk7QUFFSDtBQUVKO0FBRUo7O0FBRUQ7QUFDQTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7OztBQUlBOztBQUVJOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKOztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRzs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFHSDs7QUFFRzs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjtBQUNEO0FBQ0E7O0FBRUk7O0FBRUk7QUFFSDs7QUFFRzs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUVKOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFQTtBQUdIO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBRUg7O0FBRUc7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBOztBQUVJO0FBRUg7O0FBRUc7QUFFSDs7QUFFRDs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUVIO0FBRUo7QUFDSjtBQUdKO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUVIO0FBRUo7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7QUFFSDtBQUVKO0FBRUo7O0FBRUQ7Ozs7OztBQU1BOztBQUVJOztBQUVJO0FBRUg7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBRUg7QUFFSjs7QUFFRztBQUNIO0FBQ0o7O0FBRUQ7OztBQUdBOztBQUVJO0FBRUg7O0FBNWxCWTs7Ozs7Ozs7OztBQ0FqQjs7QUFFQTtBQUNJOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUZHOztBQUtQO0FBQ0k7QUFDQTtBQUZFOztBQUtOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7O0FBS0o7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTs7QUFLSjtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBOztBQUtKO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7O0FBS0o7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDs7QUEvSks7O0FBd0taO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNBOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRDtBQUNJO0FBQ0E7QUFFSDtBQUVKOztBQUdEO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJOztBQUVBO0FBRUg7O0FBSUQ7O0FBRUE7O0FBRUE7QUFFSDtBQWpTSTs7Ozs7Ozs7OztBQ0ZUO0FBQ0E7QUFDSTs7QUFFQTs7QUFFSTs7QUFFSTtBQUNBOztBQUhHOztBQU9QO0FBQ0k7QUFDQTtBQUZTOztBQVRMOztBQWdCWjtBQUNBOztBQUVJOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7QUFFSDs7QUFFRDs7QUFHQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRztBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7QUFFSDs7QUFFRDtBQUNBOztBQUVBOztBQUVBOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVJO0FBRUg7O0FBR0Q7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTs7QUFFSTs7QUFFSTs7QUFFQTtBQUVIO0FBQ0o7QUFDSjs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIOztBQUdEOztBQUVBO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNBOztBQUVBO0FBRUg7QUFDRztBQUNBOztBQUVBOztBQUVJO0FBRUg7QUFFSjtBQUVKOztBQUdEOztBQUVJO0FBQ0k7QUFDSDs7QUFFRDtBQUVIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUE7QUFDQTtBQUNBO0FBRUg7QUFHSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFSTs7QUFFSTs7QUFFQTtBQUVIO0FBRUo7O0FBRUQ7O0FBRUk7O0FBRUE7QUFFSDs7QUFFRzs7QUFFQTtBQUVIO0FBRUo7QUFqUkk7Ozs7Ozs7Ozs7QUNEVDtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRlE7O0FBS1o7QUFDSTtBQUNBO0FBRks7O0FBS1Q7O0FBRUE7O0FBRUE7O0FBRUE7O0FBS0o7QUFDQTs7QUFJQTtBQUNBOztBQUVJO0FBQ0k7QUFDSDs7QUFHRDtBQUNJO0FBQ0g7QUFDSjs7QUFFRDs7QUFFSTs7QUFFSTs7QUFFSTtBQUVIO0FBRUo7O0FBRUc7OztBQUdIO0FBRUo7O0FBNUVJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBjaHVQYWk6IGZ1bmN0aW9uIChwbGF5ZXIsZ2V0V2luZE51bSl7XG5cbiAgICAgICAgLy/mnInkurropoHpo45cbiAgICAgICAgaWYoZ2V0V2luZE51bSE9LTEpe1xuXG4gICAgICAgICAgICBpZihnZXRXaW5kTnVtPT1jb20uX2N1cnJlbnRQbGF5ZXIpe1xuXG4gICAgICAgICAgICAgICAgY29tLl9sYXN0UGFpID0gbnVsbDtcblxuICAgICAgICAgICAgfWVsc2UgaWYoY29tLmlzUGxheWVyUGFydHkoY29tLl9jdXJyZW50UGxheWVyLGdldFdpbmROdW0pKXtcbiAgICAgICAgICAgICAgICAvL+mYn+WPiyAg5LiN5Ye6XG4gICAgICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIobnVsbCxcIue7memjjlwiLGdldFdpbmROdW0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb20uc29ydFBhaShwbGF5ZXIuc2hvdVBhaSlcblxuICAgICAgICB2YXIgaXNFbmFibGVYdWFuWmhhbiA9IGNvbS5jaGVja0VuYWJsZVh1YW5aaGFuKCk7XG5cbiAgICAgICAgaWYoaXNFbmFibGVYdWFuWmhhbiE9MCl7XG4gICAgICAgICAgICAvL+WPr+S7peWuo+aImFxuICAgICAgICAgICAgLy/orr7nva7lrqPmiJhcbiAgICAgICAgICAgIHBsYXllci5pc1h1YW5aaGFuID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy/lrqPmiJgg5L+u5pS55YWo5bGA5Y+Y6YePXG4gICAgICAgICAgICBjb20uaXNYdWFuWmhhbiA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW49PTEpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi5a6j5oiYXCI7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGlzRW5hYmxlWHVhblpoYW49PTIpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi6LefXCI7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgaWYoY29tLl9sYXN0UGFpPT1udWxsfHxjb20uX2xhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgdGhpcy5maXJzdENodVBhaShwbGF5ZXIpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgdmFyIHBhaXMgPSB0aGlzLmdldEVuYWJsZUNodVBhaShwbGF5ZXIpO1xuXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IG51bGw7XG5cbiAgICAgICAgICAgIHZhciBwTnVtID0gLTE7XG5cbiAgICAgICAgICAgIGlmKHBhaXMhPW51bGwgJiYgcGFpcy5sZW5ndGg+MCl7XG4gICAgICAgICAgICAgICAgLy/mnInkurropoHpo45cbiAgICAgICAgICAgICAgICBpZihnZXRXaW5kTnVtIT0tMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwi5LiN57uZXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gXCLnu5npo45cIjtcblxuICAgICAgICAgICAgICAgIHBOdW0gPSBnZXRXaW5kTnVtO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKHBhaXMsbWVzc2FnZSxwTnVtKTtcblxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnrKzkuIDkuKrlh7rniYxcbiAgICAgKi9cbiAgICBmaXJzdENodVBhaTpmdW5jdGlvbihwbGF5ZXIpe1xuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSB0aGlzLmFuYWx5emUocGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIC8v5Ye65LiA5Liq5pyA5bCP5p2D5YC855qE57uE5ZCIXG4gICAgICAgIGlmKHdlaWdodEFyci5sZW5ndGg+MCl7XG5cbiAgICAgICAgICAgIHZhciBwYWlzID0gcGxheWVyLnNob3VQYWkuc3BsaWNlKHdlaWdodEFyclswXVsxXSx3ZWlnaHRBcnJbMF1bMl0pO1xuXG4gICAgICAgICAgICBjb20ubmV4dFBsYXllcihwYWlzKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6h566X5Ye65Y+v5Lul5Ye655qE54mMXG4gICAgICovXG4gICAgZ2V0RW5hYmxlQ2h1UGFpOmZ1bmN0aW9uKHBsYXllcil7XG5cbiAgICAgICAgICAgIHZhciB3ZWlnaHRBcnIgPSB0aGlzLmFuYWx5emUocGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFdlaWdodCA9IGNvbS5jb252ZXJ0VmFsdWVNb3JlKGNvbS5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgIC8v6KaB5Ye655qE54mMXG4gICAgICAgICAgICB2YXIgcGFpcyA9IG51bGw7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTx3ZWlnaHRBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gd2VpZ2h0QXJyW2ldWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYod2VpZ2h0Pmxhc3RXZWlnaHQgJiYgKCgoY29tLl9sYXN0UGFpLmxlbmd0aD09MSAmJiAod2VpZ2h0PD0xODAgfHwgd2VpZ2h0PjE2MDApKXx8Y29tLl9sYXN0UGFpLmxlbmd0aD4xKSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5LiK5LiA5byg54mM5piv5ZCm5piv6Zif5Y+L5Ye655qEXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbS5pc1BsYXllclBhcnR5KGNvbS5fY3VycmVudFBsYXllcixjb20ubGFzdFBsYXllck51bSkgJiYgKChjb20uX2xhc3RQYWkubGVuZ3RoPT0xICYmIHdlaWdodD4xNDApIHx8IChjb20uX2xhc3RQYWkubGVuZ3RoPjEgJiYgd2VpZ2h0PjE0MDApKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+S4jeaAvOmYn+WPi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lpKfkuo5B5oiW6ICF5aSn5LqO5a+5QSDkuI3lh7pcbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WHuueJjFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpcyA9IHBsYXllci5zaG91UGFpLnNwbGljZSh3ZWlnaHRBcnJbaV1bMV0sd2VpZ2h0QXJyW2ldWzJdKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHBhaXM7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Ye654mM5Yqo5L2cXG4gICAgICovXG4gICAgLy8gY2h1UGFpQWN0aW9uOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgLy8gICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgIC8vICAgICAvLyAvL+a4heepumxhc3RQYWlcbiAgICAvLyAgICAgLy8gaWYoY29tLl9sYXN0UGFpIT1udWxsKXtcbiAgICAvLyAgICAgLy8gICAgIC8v5riF56m65LiK5a625Ye655qE54mMIOWHhuWkh+iusOW9leatpOasoeWHuueJjFxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpLnNwbGljZSgwLGNvbS5fbGFzdFBhaS5sZW5ndGgpO1xuXG4gICAgLy8gICAgIC8vIH1lbHNlIHtcblxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAvLyAgICAgLy8gfVxuXG4gICAgLy8gICAgIC8v5bGV56S6XG4gICAgLy8gICAgIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuXG4gICAgLy8gICAgICAgICB2YXIgbm9kZSA9IHBhaXNbal07XG5cbiAgICAvLyAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAvLyAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgIC8vICAgICAgICAgLy/mm7TmlrDliLBsYXN0UGFpXG4gICAgLy8gICAgICAgICAvLyBjb20uX2xhc3RQYWkucHVzaChwYWlzW2pdKTtcblxuICAgIC8vICAgICB9XG5cbiAgICAvLyB9LFxuXG4gICAgLyoqXG4gICAgICog5o6S5bqP5p2D5YC85YiX6KGoXG4gICAgICovXG4gICAgc29ydFdlaWdodEFycjpmdW5jdGlvbih3ZWlnaHRBcnIpe1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTx3ZWlnaHRBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGk7ajx3ZWlnaHRBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICBpZih3ZWlnaHRBcnJbaV1bMF0+d2VpZ2h0QXJyW2pdWzBdKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFyciA9IHdlaWdodEFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnJbaV0gPSB3ZWlnaHRBcnJbal07XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyW2pdID0gdGVtcEFycjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqHnrpflj6/ku6Xlh7rniYznmoTmiYDmnInmnYPlgLxcbiAgICAgKi9cbiAgICBhbmFseXplOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSBuZXcgQXJyYXkoKTsvL1vmnYPlgLws5byA5aeL5LiL5qCHLOmVv+W6pl1cblxuICAgICAgICAvLyB2YXIgbGFzdExlbmd0aCA9IGNvbS5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgaWYocGFpcyE9bnVsbCl7XG5cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgLy8gICAgIGNjLmxvZyhwYWlzW2pdLl9uYW1lKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpOlwiK2kpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh3ZWlnaHRBcnIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocGFpc1tpXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6ay8IOWNleW8oFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0Q2xvd25WYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaSsxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGo8cGFpcy5sZW5ndGgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZjIgPSBwYWlzW2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZjIgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo5a+56ay855qE5p2D5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxqKzEpKSxpLDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWNleW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcG9zZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRve1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoaStqKTxwYWlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbDIgPSBwYXJzZUludChwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9zZSA9IGw9PWwyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGlzRGlmZmVyZW50Rml2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8v5a+56IqxNeeahOWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGw9PTUgJiYgaj09MSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGYyID0gcGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjb2RlID0gZi5jaGFyQ29kZUF0KCkrZjIuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5LiN5piv5a+56buRNee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoY29kZSE9MTk2ICYmIGNvZGUhPTE5OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzRGlmZmVyZW50Rml2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNDb21wb3NlICYmICghKGxhc3RMZW5ndGg9PTEgJiYgaj09MSkgfHwgKGw9PTUgJiYgIWlzRGlmZmVyZW50Rml2ZSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc0NvbXBvc2Upe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55aSa5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaStqKzEpKSxpLGorMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9d2hpbGUoaXNDb21wb3NlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsIT01KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vNeeJueauiuS4jeiDveecgeeVpei/meS4qui/h+eoi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ljrvpmaTph43lpI3mnYPlgLzorqHnrpdcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpK2otMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc29ydFdlaWdodEFycih3ZWlnaHRBcnIpO1xuXG4gICAgICAgIHJldHVybiB3ZWlnaHRBcnI7XG5cbiAgICB9LFxuXG5cbiAgICBcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgcGxheWVyTnVtIDogNCwvL+eOqeWutuaVsFxuXG4gICAgcGFpTnVtIDogMzIsLy/niYzmlbBcblxuICAgIHJvdW5kczowLC8v5Zue5ZCI5pWwXG5cbiAgICBwbGF5ZXJzOiBudWxsLC8v5omA5pyJ546p5a6255qE5a655ZmoXG5cbiAgICBfbGFzdFBhaTpudWxsLC8v5LiK5a625Ye655qE54mMXG5cbiAgICAvL19maXJzdFBsYXllcjowLC8v56ys5LiA5Liq5Ye654mM55qE546p5a62XG5cbiAgICBfY3VycmVudFBsYXllcjowLC8v5b2T5YmN5Ye654mM55qE546p5a62XG5cbiAgICAvL19idUNodU51bTowLC8v6K6w5b2V5LiN5Ye654mM5qyh5pWwXG5cbiAgICBsYXN0UGxheWVyTnVtOjAsLy/mnIDlkI7lh7rniYznmoTnjqnlrrZcblxuICAgIHdpblBsYXllcjpudWxsLC8v6K6w5b2V6IOc5Ye66ICF5bqP5Y+3XG5cbiAgICBwYXJ0eVBsYXllcnM6bnVsbCwvL+iusOW9leWQjOS4gOS8meWPr+Wuo+aImOeahOeOqeWutuaVsOe7hFxuXG4gICAgaXNYdWFuWmhhbjpmYWxzZSwvL+aYr+WQpuWuo+aImFxuXG4gICAgbnVtOjAsLy/orrDmlbBcblxuICAgIC8vdm90ZUdldFdpbmROdW06MCwvL+WPguS6juaKleelqOS6uuaVsFxuXG4gICAgc2V0Rmlyc3RQbGF5ZXI6ZnVuY3Rpb24oZmlyc3RQbGF5ZXIpe1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSBmaXJzdFBsYXllcjtcblxuICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uY3VycmVudFRhZy5zZXRWaXNpYmxlKHRydWUpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOajgOafpeeOqeWutu+8jOWJlOmZpOiDnOWHuuiAhe+8jOe7p+e7rea4uOaIj1xuICAgICAqL1xuICAgIGNoZWNrTmV4dFBsYXllck5vV2lubmVyOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5udW0gPSB0aGlzLm51bSArMTtcblxuICAgICAgICAvL+aOp+WItumAkuW9kua3seW6plxuICAgICAgICBpZih0aGlzLndpblBsYXllci5sZW5ndGg8dGhpcy5wbGF5ZXJOdW0pe1xuXG4gICAgICAgICAgICBpZih0aGlzLm51bSV0aGlzLnBsYXllck51bT09MCl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJvdW5kcyA9IHRoaXMucm91bmRzICsgMTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50UGxheWVyID0gKHRoaXMuX2N1cnJlbnRQbGF5ZXIrMSkgJSB0aGlzLnBsYXllck51bTtcblxuICAgICAgICAgICAgaWYodGhpcy53aW5QbGF5ZXIuaW5kZXhPZih0aGlzLl9jdXJyZW50UGxheWVyKSE9LTEpe1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja05leHRQbGF5ZXJOb1dpbm5lcigpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyBjYy5sb2coXCJjaGVrYyBwbGF5ZXIgaW5kZXg6XCIrdGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5LiL5LiA5Liq546p5a62XG4gICAgICovXG4gICAgbmV4dFBsYXllcjpmdW5jdGlvbihsYXN0UGFpLG1lc3NhZ2UsZ2V0V2luZE51bSl7XG5cbiAgICAgICAgICAgIC8v6K6+572u6buY6K6k5YC8XG4gICAgICAgICAgICBnZXRXaW5kTnVtID0gZ2V0V2luZE51bXx8LTE7XG5cbiAgICAgICAgICAgIC8v5b2T5YmN6LCD55So6K+l5Ye95pWw55qE546p5a626YOo5YiGXG4gICAgICAgICAgICBpZihsYXN0UGFpPT1udWxsfHxsYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9idUNodU51bSA9IHRoaXMuX2J1Q2h1TnVtICsgMTtcbiAgICAgICAgICAgICAgICAvL+S4jeWHulxuICAgICAgICAgICAgICAgIGlmKG1lc3NhZ2U9PW51bGwpe1xuXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIuS4jeWHulwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2J1Q2h1TnVtID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQbGF5ZXJOdW0gPSB0aGlzLl9jdXJyZW50UGxheWVyO1xuICAgICAgICAgICAgICAgIC8v5riF55CG54mM5qGMXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhaVpodW8oKTtcbiAgICAgICAgICAgICAgICAvL+i1i+WAvFxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RQYWkgPSBsYXN0UGFpO1xuICAgICAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TGFzdFBhaSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5jdXJyZW50VGFnLnNldFZpc2libGUoZmFsc2UpO1xuXG4gICAgICAgICAgICB2YXIgaXNQbGF5ZXJXaW4gPSB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uc2hvdVBhaS5sZW5ndGggPT0gMCAmJiB0aGlzLndpblBsYXllci5pbmRleE9mKHRoaXMuX2N1cnJlbnRQbGF5ZXIpPT0tMTtcblxuICAgICAgICAgICAgaWYoaXNQbGF5ZXJXaW4pe1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2coXCJ3cCBsZW5naHQ6XCIrdGhpcy53aW5QbGF5ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMud2luUGxheWVyLnB1c2godGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uc2hvdVBhaU51bS5zdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwiTk8uIFwiK3RoaXMud2luUGxheWVyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHZhciBwYXJ0eSA9IHRoaXMucGFydHlQbGF5ZXJzLmluZGV4T2YodGhpcy5fY3VycmVudFBsYXllcikhPS0xO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlzR2FtZU92ZXIgPSBwYXJ0eTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL+a4uOaIj+e7k+adnyDkurrmlbDmnaHku7ZcbiAgICAgICAgICAgICAgICB2YXIgd2luTnVtQ29uZGl0aW9uID0gcGFydHk/dGhpcy5wYXJ0eVBsYXllcnMubGVuZ3RoOnRoaXMucGxheWVyTnVtLXRoaXMucGFydHlQbGF5ZXJzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMud2luUGxheWVyLmxlbmd0aD09d2luTnVtQ29uZGl0aW9uKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2luTnVtQ29uZGl0aW9uO2krKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSBpc0dhbWVPdmVyXih0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHRoaXMud2luUGxheWVyW2ldKSE9LTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihpc0dhbWVPdmVyKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoJ0dhbWVMYWJlbCcpLnN0cmluZyA9IFwi5ri45oiP57uT5p2fXCJcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8qKioqKioqKioqIOW9k+WJjeiwg+eUqOivpeWHveaVsOeahOeOqeWutumDqOWIhue7k+adnyAqKioqKioqKioqKipcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+S4i+S4gOS4queOqeWutumDqOWIhlxuICAgICAgICAgICAgLy/kuIvkuIDkuKrlkIjms5XnmoTlh7rniYzogIVcbiAgICAgICAgICAgIC8vdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpJXRoaXMucGxheWVyTnVtO1xuICAgICAgICAgICAgdGhpcy5jaGVja05leHRQbGF5ZXJOb1dpbm5lcigpO1xuXG4gICAgICAgICAgICAvL2NjLmxvZyh0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0pO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmN1cnJlbnRUYWcuc2V0VmlzaWJsZSh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwiXCI7XG5cblxuICAgICAgICAgICAgLy/kuInkuKrkuI3lh7rvvIzor7TmmI7lj4jova7liLDkuIrmrKHlh7rniYznmoTnjqnlrrYg5b2T5pyJ6IOc5Ye66ICF5ZCO77yM5Yik5pat55qE5pWw5a2X6KaB5YeP5bCRXG4gICAgICAgICAgICAvLyBpZih0aGlzLl9idUNodU51bT09KDMtdGhpcy53aW5QbGF5ZXIubGVuZ3RoKSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHRoaXMubGFzdFBsYXllck51bT09dGhpcy5fY3VycmVudFBsYXllcil7XG5cbiAgICAgICAgICAgICAgICAvL+a4heeQhueJjOahjFxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UGFpID0gbnVsbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYoaXNQbGF5ZXJXaW4pe1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXkuIvkuIDkuKropoHniYzogIXvvIzlj4ropoHpo47ogIVcbiAgICAgICAgICAgICAgICBnZXRXaW5kTnVtID0gdGhpcy5fY3VycmVudFBsYXllcjtcblxuICAgICAgICAgICAgICAgIC8v5pu05paw5LiL5LiA5Liq5Ye654mM6ICFKzFcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTmV4dFBsYXllck5vV2lubmVyKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/pgJrnn6Xnjqnlrrblj6/ku6Xlh7rniYzkuoZcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS50b2dnbGUoZ2V0V2luZE51bSk7XG5cbiAgICAgICAgXG5cbiAgICB9LFxuICAgICAgICBcbiAgICAvKipcbiAgICAgKiDmo4Dmn6Xlh7rniYznmoTlkIjms5XmgKdcbiAgICAgKi9cbiAgICBjaGVja0NodVBhaTpmdW5jdGlvbih4dWFuUGFpLHApe1xuXG4gICAgICAgIHZhciBpc0N1cnJlbnQgPSBwPT10aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgIC8vIGlzQ3VycmVudCA9IHRydWU7XG5cbiAgICAgICAgLy/mmK/lkKbor6Xlh7rniYxcbiAgICAgICAgaWYoIWlzQ3VycmVudCl7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5Yik5pat6YCJ5Lit55qE54mMXG4gICAgICAgIGlmKHh1YW5QYWkhPW51bGwpe1xuXG4gICAgICAgICAgICBpZih0aGlzLl9sYXN0UGFpPT1udWxsIHx8IHRoaXMuX2xhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb3NlQ2hlY2soeHVhblBhaSk7XG5cbiAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSB4dWFuUGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHZhciBsYXN0TGVuZ3RoID0gdGhpcy5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgLy/ljZVcbiAgICAgICAgICAgICAgICAgICAgaWYobGVuZ3RoID09IDEpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eCuCDlpKfkuo4xNjAw5Li654K4XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZT4xNjAwICYmIHZhbHVlPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihsYXN0TGVuZ3RoID49IDIgJiYgbGFzdExlbmd0aCA8IDUpe1xuICAgICAgICAgICAgICAgICAgICAvL+WvuVxuICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGg+PTIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6/ku6Xlh7rlr7nvvIzkuZ/lj6/ku6Xlh7rngrhcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95Ye65Y2VXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu4TlkIjmo4Dmn6VcbiAgICAgKi9cbiAgICBjb21wb3NlQ2hlY2s6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblxuICAgICAgICBpZihsZW5ndGg9PTEpe1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfWVsc2UgaWYobGVuZ3RoPDUpe1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICB2YXIgaXNDbG93biA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8bGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgLy/prLzmmK/kuIDkuKrnibnmrornmoTnu4TlkIhcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk9PVwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihpc0Nsb3duKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6rmnInkuKTlvKAg5LiU6YO95piv6ay8XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0yICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6L+b5Yiw6L+Z6YeM77yM6L+Z5byg54mM5LiN5piv5aSn5bCP6ay877yM5Ye6546w5LiN5ZCM5p2D5YC8IOi/lOWbnmZhbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlIT12YWx1ZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5aaC5p6c5Yiw6L+Z6YeMIGlzQ2xvd24g5Li655yf77yM5Y+K5pyJ6ay85a2Y5Zyo77yM5L2G5aSa5byg54mM5Y+q5pyJ5LiA5Liq6ay877yM6K+05piO54mM57uE5ZCI5LiN5a+5XG4gICAgICAgICAgICByZXR1cm4gIWlzQ2xvd247XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiBcbiAgICAgKiDkuI3ljIXmi6zlpKflsI/prLxcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWU6ZnVuY3Rpb24obCl7XG5cbiAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgcmV0dXJuICgxMytsKSoxMDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBsKjEwO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlpKflsI/prLzmnYPlgLzovazmjaIgXG4gICAgICogXG4gICAgICovXG4gICAgY29udmVydENsb3duVmFsdWU6ZnVuY3Rpb24obCl7XG4gICAgICAgIC8v5aSn6ay8IGwgPSAwICDlsI/prLwgbD0xXG4gICAgICAgIC8v5bCP6ay86KaB5aSn5LqO5pyA5aSn55qE5Y2VXG4gICAgICAgIHJldHVybiAoMTMrMysyLWwpKjEwO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiDlpJrlvKBcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWVNb3JlOmZ1bmN0aW9uKGFycil7XG5cbiAgICAgICAgdmFyIHdlaWdodCA9IDA7XG5cbiAgICAgICAgaWYoYXJyPT1udWxsIHx8IGFyci5sZW5ndGggPT0gMCB8fCAhdGhpcy5jb21wb3NlQ2hlY2soYXJyKSl7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQ7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgZiA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBwYXJzZUludChhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgaWYoZiA9PSBcIkVcIil7XG4gICAgICAgICAgICAgICAgLy/prLxcbiAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMyszKzItbDtcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMytsO1xuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IGw7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v54m55L6LXG4gICAgICAgICAgICBpZihhcnIubGVuZ3RoPT0yKXtcblxuICAgICAgICAgICAgICAgIGlmKGwgPT0gMTApe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCwyKSsxOy8v5q+U5a+5M+WkpzFcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGwgPT0gNSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZi5jaGFyQ29kZUF0KCkrYXJyWzFdLl9uYW1lLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZSA9PSAxOTYpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7npu5E1XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMzsvL+avlOWvuee6ojXlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbHVlID09IDE5OCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSsyLy/mr5Tlr7nprLzlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoZiA9PSBcIkVcIil7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzE7Ly/mr5Tlm5vkuKoz5aSnMVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2MubG9nKFwid2VpZ2h0OlwiK3dlaWdodCk7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQgKiBNYXRoLnBvdygxMCxhcnIubGVuZ3RoKTtcblxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmjpLluo/mlrnms5VcbiAgICAgKi9cbiAgICBzb3J0UGFpOmZ1bmN0aW9uKHNwcml0ZUFycil7XG5cbiAgICAgICAgLy9jYy5sb2coc3ByaXRlQXJyKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8c3ByaXRlQXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBmb3IodmFyIGogPSBpKzE7ajxzcHJpdGVBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTEgPSBzcHJpdGVBcnJbaV0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTIgPSBzcHJpdGVBcnJbal0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhuYW1lMS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2coXCJuYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHBhcnNlSW50KG5hbWUxLnN1YnN0cmluZygxKSk+cGFyc2VJbnQobmFtZTIuc3Vic3RyaW5nKDEpKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coXCItbmFtZTE6XCIrbmFtZTErXCIgbmFtZTI6XCIrbmFtZTIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3ByaXRlQXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobmFtZTEuc3Vic3RyaW5nKDEpPT1uYW1lMi5zdWJzdHJpbmcoMSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlMSA9IG5hbWUxLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUyID0gbmFtZTIuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vNeeahOeJueauiuaOkuW6j1xuICAgICAgICAgICAgICAgICAgICBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PVwiNVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK5a+56buRNeaIluWvuee6ojXmlL7liLDkuIDotbdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK57qi5qGD5LiO6I2J6Iqx5LqS5o2iXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMT09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTE9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUxID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29kZTI9PTk5KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGUyPT05OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMiA9IDk5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPmNvZGUyKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2pdID0gdGVtcDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5bGV56S65Zyo54mM5qGM5LiKXG4gICAgICovXG4gICAgc2hvd0xhc3RQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyBjYy5sb2coXCJwbGF5ZXI6XCIrdGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICAgICAgaWYodGhpcy5fbGFzdFBhaSE9bnVsbCAmJiB0aGlzLl9sYXN0UGFpLmxlbmd0aCAhPTApe1xuXG4gICAgICAgICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwO2o8dGhpcy5fbGFzdFBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fbGFzdFBhaVtqXTtcblxuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhcIm5vZGU6XCIpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhub2RlKTtcblxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yICsgaiozMCxzaXplLmhlaWdodC8yKSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5riF56m654mM5qGMXG4gICAgICovXG4gICAgY2xlYXJQYWlaaHVvOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gY2MubG9nKFwiY2xlYXJQYWlaaHVvXCIpO1xuXG4gICAgICAgIGlmKHRoaXMuX2xhc3RQYWkhPW51bGwgJiYgdGhpcy5fbGFzdFBhaS5sZW5ndGggIT0wKXtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHRoaXMuX2xhc3RQYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2xhc3RQYWlbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuWPr+S7peWuo+aImOaIlui3n+maj1xuICAgICAqIOS4jeWPr+S7pSAwXG4gICAgICog5a6j5oiYIDFcbiAgICAgKiDot5/pmo8gMlxuICAgICAqL1xuICAgIGNoZWNrRW5hYmxlWHVhblpoYW46ZnVuY3Rpb24ocE51bSl7XG5cbiAgICAgICAgaWYocE51bT09bnVsbCl7XG5cbiAgICAgICAgICAgIHBOdW0gPSB0aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYy5sb2coXCJyb3VuZHM6XCIrdGhpcy5yb3VuZHMpO1xuICAgICAgICAvLyBjYy5sb2codGhpcy5wYXJ0eVBsYXllcnMpO1xuICAgICAgICAvLyBjYy5sb2cocE51bSk7XG4gICAgICAgIC8vIGNjLmxvZyh0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0pIT0tMSk7XG5cbiAgICAgICAgaWYodGhpcy5yb3VuZHM9PTEgJiYgdGhpcy5wYXJ0eVBsYXllcnMuaW5kZXhPZihwTnVtKSE9LTEpe1xuXG4gICAgICAgICAgICBpZih0aGlzLmlzWHVhblpoYW4pe1xuICAgICAgICAgICAgICAgIC8v6LefXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lrqPmiJhcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbmmK/lkIzkvJlcbiAgICAgKi9cbiAgICBpc1BsYXllclBhcnR5OmZ1bmN0aW9uKHBOdW0scE51bTIpe1xuXG4gICAgICAgIHJldHVybiAocE51bSAhPSBwTnVtMikgJiYgKCh0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0pPT0tMSleKHRoaXMucGFydHlQbGF5ZXJzLmluZGV4T2YocE51bTIpPT0tMSkpO1xuXG4gICAgfSxcblxuXG59O1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYWlBbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGE1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYjE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGIxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgYjExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBjMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGQxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQ1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGQxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgRTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIEUxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHBhaXMgPSBuZXcgQXJyYXkoc2VsZi5hMSxzZWxmLmEyLHNlbGYuYTMsc2VsZi5hNSxzZWxmLmExMCxzZWxmLmExMSxzZWxmLmExMixzZWxmLmExMyxzZWxmLmIxLHNlbGYuYjIsc2VsZi5iMyxzZWxmLmI1LHNlbGYuYjEwLHNlbGYuYjExLHNlbGYuYjEyLHNlbGYuYjEzLHNlbGYuYzEsc2VsZi5jMixzZWxmLmMzLHNlbGYuYzUsc2VsZi5jMTAsc2VsZi5jMTEsc2VsZi5jMTIsc2VsZi5jMTMsc2VsZi5kMSxzZWxmLmQyLHNlbGYuZDMsc2VsZi5kNSxzZWxmLmQxMCxzZWxmLmQxMSxzZWxmLmQxMixzZWxmLmQxMyxzZWxmLkUwLHNlbGYuRTEpO1xuXG4gICAgICAgIC8v5omT5Lmx5pWw57uEXG4gICAgICAgIHBhaXMuc29ydChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHAgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBjb20ucGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxjb20ucGxheWVyTnVtO2orKyl7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuc2hvdVBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnMucHVzaChub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL+WIneWni+WMluWQjOS4gOS8meaVsOe7hFxuICAgICAgICBjb20ucGFydHlQbGF5ZXJzID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPGNvbS5wYWlOdW07aSsrKXtcblxuICAgICAgICAgICAgdmFyIGogPSBpJWNvbS5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBjYy5pbnN0YW50aWF0ZShwYWlzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tqXS5zaG91UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgaWYoc3ByaXRlLl9uYW1lID09IFwiYTExXCIpe1xuXG4gICAgICAgICAgICAgICAgY29tLnNldEZpcnN0UGxheWVyKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHNwcml0ZS5fbmFtZS5zdWJzdHJpbmcoMCwxKT09XCJFXCIpe1xuICAgICAgICAgICAgICAgIC8v6K6w5b2V5aSn5bCP6ay85ZCM5LiA5LyZXG4gICAgICAgICAgICAgICAgY29tLnBhcnR5UGxheWVycy5wdXNoKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy/liJ3lp4vljJbog5zliKnogIXmlbDnu4RcbiAgICAgICAgY29tLndpblBsYXllciA9IG5ldyBBcnJheSgpO1xuICAgICAgICBcblxuICAgICAgICBjb20ucGxheWVyc1swXS5pc0FJID0gZmFsc2U7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzFdLmlzQUkgPSB0cnVlO1xuICAgICAgICBjb20ucGxheWVyc1syXS5pc0FJID0gdHJ1ZTtcbiAgICAgICAgY29tLnBsYXllcnNbM10uaXNBSSA9IHRydWU7XG5cbiAgICAgICAgLy/orr7nva7njqnlrrbkvY3nva5cbiAgICAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgIHZhciBub2RlMSA9IGNvbS5wbGF5ZXJzWzFdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMSk7XG5cbiAgICAgICAgbm9kZTEuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLShub2RlMS53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICB2YXIgbm9kZTIgPSBjb20ucGxheWVyc1syXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTIpO1xuXG4gICAgICAgIG5vZGUyLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yLHNpemUuaGVpZ2h0IC0gKG5vZGUxLmhlaWdodC8zKjIpKSk7XG5cbiAgICAgICAgdmFyIG5vZGUzID0gY29tLnBsYXllcnNbM10ubm9kZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUzKTtcblxuICAgICAgICBub2RlMy5zZXRQb3NpdGlvbihjYy5wKChub2RlMy53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAvL2NjLmxvZyhjb20ucGxheWVyc1swXSk7XG5cbiAgICAgICAgc2VsZi5wYWlBbi5nZXRDb21wb25lbnQoJ1BhaUFuJykucGxheWVyID0gY29tLnBsYXllcnNbMF07XG5cbiAgICAgICAgLy/lpoLmnpzmmK/mnLrlmajkurrvvIzmjIflrprlh7rniYxcbiAgICAgICAgaWYoY29tLl9jdXJyZW50UGxheWVyIT0wICYmIGNvbS5wbGF5ZXJzW2NvbS5fY3VycmVudFBsYXllcl0uaXNBSSl7XG5cbiAgICAgICAgICAgIGNvbS5yb3VuZHMgPSAxO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tjb20uX2N1cnJlbnRQbGF5ZXJdLnRvZ2dsZSgtMSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgICAgIC8vIGZvcih2YXIgbiA9IDA7bjxwcC5sZW5ndGg7bisrKXtcblxuICAgICAgICAvLyAgICAgc2VsZi5wbGF5ZXIwLmdldENvbXBvbmVudCgnUGxheWVyJykuU2hvdVBhaSA9IHBwWzBdO1xuXG4gICAgICAgIC8vIH1cblxuICAgIH0sXG59KTtcbiIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcGxheWVyOntcblxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG5cbiAgICAgICAgfSxcblxuICAgICAgICB4dWFuWmh1YW5CdG46e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5CdXR0b24sXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy9jYy5sb2codGhpcy54dWFuWmh1YW5CdG4pO1xuXG4gICAgICAgIGlmKGNvbS5jaGVja0VuYWJsZVh1YW5aaGFuKDApIT0wKXtcblxuICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4uZW5hYmxlZD0gdHJ1ZTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIC8vdGhpcy54dWFuWmh1YW5CdG4ubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cbiAgICAgICAgICAgIHRoaXMueHVhblpodWFuQnRuLm5vZGUuZGVzdHJveSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBsYXllci54dWFuUGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgXG4gICAgICAgIC8v546p5a625aS05YOPXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXIubm9kZTtcblxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoLXRoaXMubm9kZS53aWR0aC8yLShub2RlLndpZHRoLzMqMiksMCkpO1xuXG4gICAgICAgIC8v5bGV56S65omL54mMXG4gICAgICAgIHRoaXMuZHJhd1BhaSgpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeCueWHu+Wuo+aImFxuICAgICAqL1xuICAgIHh1YW5aaGFuOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzRW5hYmxlWHVhblpoYW4gPSBjb20uY2hlY2tFbmFibGVYdWFuWmhhbigpO1xuXG4gICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW49PTEpe1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIuWuo+aImFwiO1xuXG4gICAgICAgIH1lbHNlIGlmKGlzRW5hYmxlWHVhblpoYW49PTIpe1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIui3n1wiO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL+Wuo+aImCDkv67mlLnlhajlsYDlj5jph49cbiAgICAgICAgY29tLmlzWHVhblpoYW4gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMueHVhblpodWFuQnRuLmVuYWJsZWQ9ZmFsc2U7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIuaXNYdWFuWmhhbiA9IHRydWU7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcblxuICAgIC8qKlxuICAgICAqIOWHuueJjFxuICAgICAqL1xuICAgIGNodVBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvL+WHuueJjOWQiOazleaAp1xuICAgICAgICBpZihjb20uY2hlY2tDaHVQYWkoc2VsZi5wbGF5ZXIueHVhblBhaSwwKSl7XG5cbiAgICAgICAgICAgIGlmKHRoaXMueHVhblpodWFuQnRuIT1udWxsJiZ0aGlzLnh1YW5aaHVhbkJ0bi5pc1ZhbGlkKXtcblxuICAgICAgICAgICAgICAgIHRoaXMueHVhblpodWFuQnRuLmVuYWJsZWQgPWZhbHNlO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgLy/np7vpmaRUT1VDSOebkeWQrFxuICAgICAgICAgICAgZm9yKHZhciBtID0gMDttPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO20rKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpW21dLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5ZCI5rOVXG4gICAgICAgICAgICB2YXIgaW5kZXhBcnIgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd1NpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgICAgICAvL+W+l+WIsOimgeWHuueahOeJjOWcqOaJi+eJjOS4reeahOS9jee9rlxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtpXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKHNlbGYucGxheWVyLnNob3VQYWlbal0uX25hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleEFyci5wdXNoKGopO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkuc3BsaWNlKDAsc2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpbmRleEFyci5zb3J0KCk7XG5cbiAgICAgICAgICAgIC8v5riF56m654mM5qGMXG4gICAgICAgICAgICAvL2NvbS5jbGVhclBhaVpodW8oKTtcblxuICAgICAgICAgICAgdmFyIGxhc3RQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgLy/lh7rniYzliqjkvZxcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxpbmRleEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciBzcHJpdGUgPSBzZWxmLnBsYXllci5zaG91UGFpW2luZGV4QXJyW2ldXTtcblxuICAgICAgICAgICAgICAgIC8v6K6w5b2V5Ye654mMXG4gICAgICAgICAgICAgICAgbGFzdFBhaS5wdXNoKHNwcml0ZSk7XG5cbiAgICAgICAgICAgICAgICBzcHJpdGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIHAgPSBzcHJpdGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKDAsMCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIG5vZGVQID0gc2VsZi5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2UoY2MucChzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aC8yLHNlbGYubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodC8yKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgeCA9IHdpbmRvd1NpemUud2lkdGgvMi1ub2RlUC54KzMwKmk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgeSA9IHdpbmRvd1NpemUuaGVpZ2h0LzItcC55O1xuXG4gICAgICAgICAgICAgICAgLy8gc3ByaXRlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC41LGNjLnAoeCx5KSkpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaW5kZXhBcnIucmV2ZXJzZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+S7juaJi+eJjOS4reWIoOmZpFxuICAgICAgICAgICAgZm9yKHZhciBuID0gMDtuPGluZGV4QXJyLmxlbmd0aDtuKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc2hvdVBhaS5zcGxpY2UoaW5kZXhBcnJbbl0sMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/liLfmlrDmiYvniYzlsZXnpLpcbiAgICAgICAgICAgIHNlbGYuZHJhd1BhaSgpO1xuXG4gICAgICAgICAgICBjb20ubmV4dFBsYXllcihsYXN0UGFpKTtcblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvL+S4jeWQiOazlVxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8bGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnBvcCgpLnJ1bkFjdGlvbihjYy5tb3ZlQnkoMC4xLDAsLTMwKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBcbiAgICBidUNodVBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIGlmKHRoaXMueHVhblpodWFuQnRuIT1udWxsJiZ0aGlzLnh1YW5aaHVhbkJ0bi5pc1ZhbGlkKXtcbiAgICAgICAgICAgIHRoaXMueHVhblpodWFuQnRuLmVuYWJsZWQ9ZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWxleekuuaJi+eJjFxuICAgICAqL1xuICAgIGRyYXdQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY29tLnNvcnRQYWkoc2VsZi5wbGF5ZXIuc2hvdVBhaSk7XG5cbiAgICAgICAgdmFyIG51bSA9IHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO1xuXG4gICAgICAgIC8vdmFyIHNpemUgPSBzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8bnVtO2krKyl7XG5cbiAgICAgICAgICAgIHZhciBwYWkgPSBzZWxmLnBsYXllci5zaG91UGFpW2ldO1xuICAgICAgICAgICAgLy8gY2MubG9nKFwicGFpIGk6XCIraSk7XG4gICAgICAgICAgICAvLyBjYy5sb2cocGFpKTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInNlbGYubm9kZTpcIik7XG4gICAgICAgICAgICAvLyBjYy5sb2coc2VsZi5ub2RlKTtcblxuICAgICAgICAgICAgaWYocGFpLnBhcmVudCE9c2VsZi5ub2RlKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWxmLm5vZGUuYWRkQ2hpbGQocGFpKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcCA9IGNjLnAoLShwYWkud2lkdGgrKG51bS0xKSozMCkvMitwYWkud2lkdGgvMitpKjMwLDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBwYWkuc2V0U2NhbGUoMC41KTtcbiAgICAgICAgICAgIHBhaS5zZXRQb3NpdGlvbihwKTtcbiAgICAgICAgICAgIHBhaS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVE9VQ0jnm5HlkKzlm57osINcbiAgICAgKi9cbiAgICB0b3VjaFBhaTpmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgaWYobm9kZS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtqXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGo7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleD09LTEpe1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnB1c2gobm9kZSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwzMCkpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoaW5kZXgsMSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG52YXIgYWkgPSByZXF1aXJlKCdBSScpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNob3VQYWlOdW06e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXJJbWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3VycmVudFRhZzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25MYWJlbDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIHh1YW5aaGFuOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBSTpudWxsLC8v5piv5ZCm5pivQUlcblxuICAgICAgICBzaG91UGFpOm51bGwsLy/miYvniYxcblxuICAgICAgICB4dWFuUGFpOm51bGwsLy/pgInkuK3nmoTniYxcblxuICAgICAgICBpc1h1YW5aaGFuOmZhbHNlLC8v5piv5ZCm5a6j5oiYXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgICAgICBpZih0aGlzLmlzWHVhblpoYW4pe1xuICAgICAgICAgICAgdGhpcy54dWFuWmhhbi5zdHJpbmcgPSBcIuWuo1wiO1xuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIGlmKHRoaXMuc2hvdVBhaSE9bnVsbCl7XG4gICAgICAgICAgICB0aGlzLnNob3VQYWlOdW0uc3RyaW5nID0gdGhpcy5zaG91UGFpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKGdldFdpbmROdW0pe1xuXG4gICAgICAgIGlmKHRoaXMuaXNBSSl7XG5cbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBhaS5jaHVQYWkodGhpcyxnZXRXaW5kTnVtKTtcblxuICAgICAgICAgICAgfSwxKTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIC8v5LiN5pivQUlcblxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==