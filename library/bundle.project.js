require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script/AI.js

"use strict";

var com = require('Common');
module.exports = {

    chuPai: function chuPai(player) {

        //有人要风
        if (com.getWindPlayerNum != -1) {

            if (com.isPlayerParty(com._currentPlayer, com.getWindPlayerNum)) {
                //队友  不出
                com.nextPlayer();

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

        if (com.getWindPlayerNum == com._currentPlayer || com._lastPai == null || com._lastPai.length == 0) {

            this.firstChuPai(player);
        } else {

            var pais = this.getEnableChuPai(player);

            com.nextPlayer(pais);
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
     * 剔除不合理的权值
     */
    trim: function trim(weightArr) {

        var trimWeightArr = new Array();

        if (weightArr != null && weightArr.length > 0) {

            var indexArr = new Array();

            for (var i = weightArr.length - 1; i >= 0; i--) {

                if (indexArr.indexOf(weightArr[i][1]) == -1) {

                    //大于等于最小的炸 不拆开用 //对鬼也没考虑拆开
                    if (weightArr[i][0] > 1600) {

                        for (var j = weightArr[i][1]; j < weightArr[i][1] + weightArr[i][2]; j++) {

                            indexArr.push(j);
                        }
                    }

                    trimWeightArr.push(weightArr[i]);
                }
            }
        }

        this.sortWeightArr(trimWeightArr);

        return trimWeightArr;
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

        return this.trim(weightArr);
    }

};

cc._RFpop();
},{"Common":"Common"}],"Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ce3dajz81FDajDPh6cF69x', 'Common');
// script/Common.js

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

    getWindPlayerNum: -1, //记录给风的记数

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
    nextPlayer: function nextPlayer(lastPai, message) {

        //设置默认值
        // getWindNum = getWindNum||-1;

        //清理当前玩家记录牌
        this.clearRecordPlayerPai();

        //当前调用该函数的玩家部分
        if (lastPai == null || lastPai.length == 0) {

            // this._buChuNum = this._buChuNum + 1;
            //不出
            if (message == null) {

                message = "不出";
            }

            if (this.getWindPlayerNum != -1) {
                //给风
                message = "给风";
            }

            this.players[this._currentPlayer].actionLabel.string = message;
        } else {
            //清除要风记录
            this.getWindPlayerNum = -1;

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

            //this.players[this._currentPlayer].shouPaiNum.string = "";

            this.players[this._currentPlayer].actionLabel.string = "NO. " + this.winPlayer.length;

            var party = this.partyPlayers.indexOf(this._currentPlayer) != -1;

            var isGameOver = false;

            if (this.partyPlayers.length == 1) {
                //1:3

                if (party) {
                    //双鬼胜
                    isGameOver = true;
                } else if (this.winPlayer.length == 3) {
                    //没鬼玩家胜
                    isGameOver = this.winPlayer.indexOf(this.partyPlayers[0]) == -1;
                }
            } else {
                //2:2

                if (this.winPlayer.length == 2) {

                    isGameOver = this.isPlayerParty(this.winPlayer[0], this.winPlayer[1]);
                } else if (this.winPlayer.length == 3) {

                    isGameOver = true;
                }
            }

            if (isGameOver) {

                //清理牌桌
                this.clearPaiZhuo();

                cc.director.getScene().getChildByName('Canvas').getComponent('Game').gameLabel.string = "游戏结束";

                return;
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

            //记录下一个出牌者，及要风者
            this.getWindPlayerNum = this._currentPlayer;

            // getWindNum = this._currentPlayer;

            //更新下一个出牌者+1 出找下下家要风
            this.checkNextPlayerNoWinner();
        }

        //通知玩家可以出牌了
        this.players[this._currentPlayer].toggle();
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

            if (this.getWindPlayerNum == p || this._lastPai == null || this._lastPai.length == 0) {

                this.clearPaiZhuo();

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

                //node.runAction(cc.rotateBy(0,this._currentPlayer*-90));

                // var node1 = cc.instantiate(node._prefab.asset);

                //记录每回合出牌画在头像下边
                if (this._currentPlayer != 0) {

                    var node1 = cc.instantiate(node);

                    var labelBottomNode = this.players[this._currentPlayer].node.getChildByName('LabelBottom');

                    labelBottomNode.addChild(node1);

                    // this.players[this._currentPlayer].node.addChild(node1);

                    node1.setScale(0.3, 0.3);

                    node1.setAnchorPoint(0, 0);

                    node1.setCascadeOpacityEnabled(false);

                    node1.setPosition(cc.p(-labelBottomNode.width / 2 + j * 10, -labelBottomNode.height / 2 - node1.height / 3));
                }
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
     * 清空记录在玩家头向下的出牌记录
     */
    clearRecordPlayerPai: function clearRecordPlayerPai() {

        var labelBottomNode = this.players[this._currentPlayer].node.getChildByName('LabelBottom');

        labelBottomNode.removeAllChildren();
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

        if (this.num <= 4 && this.partyPlayers.indexOf(pNum) != -1) {

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

        return pNum != pNum2 && !(this.partyPlayers.indexOf(pNum) == -1 ^ this.partyPlayers.indexOf(pNum2) == -1);
    }

};

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52296tYeOJGtoyHtGk1jFup', 'Game');
// script/Game.js

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

        gameLabel: {
            default: null,
            type: cc.Label
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

        node1.setPosition(cc.p(size.width - node1.width / 3 * 2, size.height / 3 * 2));

        var node2 = com.players[2].node;

        cc.director.getScene().addChild(node2);

        node2.setPosition(cc.p(size.width / 2, size.height - node2.height / 3 * 2));

        var node3 = com.players[3].node;

        cc.director.getScene().addChild(node3);

        node3.setPosition(cc.p(node3.width / 3 * 2, size.height / 3 * 2));

        //cc.log(com.players[0]);

        self.paiAn.getComponent('PaiAn').player = com.players[0];

        //如果是机器人，指定出牌
        if (com._currentPlayer != 0 && com.players[com._currentPlayer].isAI) {

            com.rounds = 1;

            com.players[com._currentPlayer].toggle();
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
// script/PaiAn.js

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

        node.setCascadeOpacityEnabled(false);

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

        this.xuanZhuanBtn.normalColor = cc.Color.GREY;

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

                this.xuanZhuanBtn.normalColor = cc.Color.GREY;
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

            this.xuanZhuanBtn.normalColor = cc.Color.GREY;
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

            pai.setCascadeOpacityEnabled(false);

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
// script/Player.js

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

            if (this.shouPai.length == 0) {

                this.shouPaiNum.string = "";
            } else {

                this.shouPaiNum.string = this.shouPai.length;
            }
        }
    },

    toggle: function toggle() {

        if (this.isAI) {

            this.scheduleOnce(function () {

                ai.chuPai(this);
            }, 1);
        } else {

            //不是AI

        }
    }

});

cc._RFpop();
},{"AI":"AI","Common":"Common"}]},{},["AI","Common","Game","PaiAn","Player"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQUkuanMiLCJhc3NldHMvc2NyaXB0L0NvbW1vbi5qcyIsImFzc2V0cy9zY3JpcHQvR2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvUGFpQW4uanMiLCJhc3NldHMvc2NyaXB0L1BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTs7QUFFSTs7QUFFSTtBQUNBOztBQUVJO0FBQ0k7QUFDQTs7QUFFQTtBQUVIO0FBRUo7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTtBQUVIOztBQUVHOztBQUVBO0FBR0g7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFSTs7QUFFQTtBQUVIO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVROztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUk7QUFDQTtBQUNJO0FBQ0E7QUFDSDs7QUFFRztBQUNBO0FBRUg7O0FBRUQ7QUFFSDtBQUVKOztBQUVEO0FBRVA7O0FBRUQ7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7O0FBR0E7O0FBRUk7O0FBRUk7O0FBRUk7O0FBRUk7O0FBRUE7O0FBRUE7QUFFSDtBQUVKO0FBRUo7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUk7O0FBRUk7QUFDQTs7QUFFSTs7QUFFSTtBQUVIO0FBRUo7O0FBRUQ7QUFFSDtBQUlKO0FBRUo7O0FBRUQ7O0FBRUE7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUE7O0FBRUk7QUFDQTtBQUNBOzs7QUFHQTs7QUFFSTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTtBQUNJO0FBQ0E7QUFDSjs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBRUo7QUFFSjtBQUNHO0FBQ0k7QUFDQTtBQUNKOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBRUg7QUFFSjs7QUFFRztBQUVIO0FBRUo7O0FBRUQ7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUVKO0FBRUo7QUFFSjs7QUFFRDs7QUFFQTtBQUVIOztBQXZVWTs7Ozs7Ozs7OztBQ0RqQjs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTtBQUVIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVJO0FBRUg7O0FBR0Q7O0FBRUE7O0FBRUk7QUFFSDtBQUVKO0FBQ0Q7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRVE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUk7QUFDQTtBQUNBOztBQUVJO0FBRUg7O0FBRUQ7QUFDSTtBQUNBO0FBRUg7O0FBRUQ7QUFFSDtBQUNHO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUVIO0FBRUo7QUFDRzs7QUFFQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTtBQUNBOztBQUVBOztBQUVBO0FBRUg7QUFFSjs7QUFJRDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBR0E7QUFDQTs7QUFFQTs7QUFFSTtBQUNBOztBQUVBO0FBRUg7O0FBSUQ7O0FBRUk7QUFDQTs7QUFHQTs7QUFFQTtBQUNBO0FBRUg7O0FBRUQ7QUFDQTtBQUlQOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFSTs7QUFFSTs7QUFFQTtBQUVIOztBQUVHOztBQUVBOztBQUVBO0FBQ0k7QUFDQTs7QUFFSTtBQUVIO0FBQ0c7QUFDQTs7QUFFQTtBQUVIO0FBRUo7QUFDRztBQUNBO0FBQ0k7QUFDQTtBQUVIO0FBQ0c7QUFDQTtBQUVIO0FBRUo7O0FBRUQ7QUFFSDtBQUVKOztBQUVEO0FBRUg7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJO0FBQ0g7O0FBRUc7O0FBRUE7O0FBRUE7QUFDSTtBQUNBOztBQUVJOztBQUVJO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRztBQUVIO0FBQ0o7O0FBRUc7QUFFSDtBQUdKO0FBQ0c7QUFDQTs7QUFFSTtBQUVIOztBQUVEOztBQUVBOztBQUVJO0FBRUg7QUFFSjtBQUVKOztBQUVEO0FBQ0E7QUFFSDs7QUFFRztBQUVIO0FBRUo7O0FBRUQ7Ozs7QUFJQTs7QUFFSTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBRUg7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7O0FBRUE7QUFDSTtBQUNBO0FBR0g7O0FBRUc7O0FBRUk7QUFFSDs7QUFFRztBQUVIO0FBRUo7QUFDRDtBQUNBOztBQUVJOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFFSjs7QUFFRztBQUVIO0FBRUo7O0FBRUQ7O0FBRUE7QUFHSDtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFSTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIOztBQUVHO0FBQ0E7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFDQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7O0FBRUQ7O0FBRUk7QUFFSDs7QUFFRztBQUVIO0FBRUo7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFFSDtBQUVKO0FBQ0o7QUFHSjtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUdIO0FBRUo7QUFFSjtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFSTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIO0FBRUo7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7QUFFSDs7QUFFRDs7Ozs7O0FBTUE7O0FBRUk7O0FBRUk7QUFFSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFFSDtBQUVKOztBQUVHO0FBQ0g7QUFDSjs7QUFFRDs7O0FBR0E7O0FBRUk7QUFFSDs7QUFwcUJZOzs7Ozs7Ozs7O0FDQWpCOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBRkc7O0FBS1A7QUFDSTtBQUNBO0FBRkU7O0FBS047QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTs7QUFLSjtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBOztBQUtKO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7O0FBS0o7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTs7QUFLSjtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEOztBQXBLSzs7QUE2S1o7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUk7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTtBQUVIOztBQUVEOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBRUg7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0k7QUFDQTtBQUVIO0FBRUo7O0FBR0Q7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFFSDs7QUFFRDs7QUFFQTs7QUFFQTtBQUVIO0FBcFNJOzs7Ozs7Ozs7O0FDRlQ7QUFDQTtBQUNJOztBQUVBOztBQUVJOztBQUVJO0FBQ0E7O0FBSEc7O0FBT1A7QUFDSTtBQUNBO0FBRlM7O0FBVEw7O0FBZ0JaO0FBQ0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRzs7QUFFQTtBQUVIOztBQUVEOztBQUdBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUVIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7OztBQUdBOztBQUVJOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUk7O0FBRUE7QUFFSDs7QUFHRDtBQUNBOztBQUVJO0FBRUg7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJOztBQUVJOztBQUVJOztBQUVBO0FBRUg7QUFDSjtBQUNKOztBQUVEOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBRUg7O0FBR0Q7O0FBRUE7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7QUFFSDtBQUNHO0FBQ0E7O0FBRUE7O0FBRUk7QUFFSDtBQUVKO0FBRUo7O0FBR0Q7O0FBRUk7QUFDSTs7QUFFQTtBQUNIOztBQUVEO0FBSUg7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFFSDtBQUdKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVBOztBQUVJOztBQUVJOztBQUVBO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTs7QUFFQTtBQUVIOztBQUVHOztBQUVBO0FBRUg7QUFFSjtBQTdSSTs7Ozs7Ozs7OztBQ0RUO0FBQ0E7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGTTs7QUFLVjtBQUNJO0FBQ0E7QUFGTzs7QUFLWDtBQUNJO0FBQ0E7QUFGUTs7QUFLWjtBQUNJO0FBQ0E7QUFGSzs7QUFLVDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFLSjtBQUNBOztBQUlBO0FBQ0E7O0FBRUk7QUFDSTtBQUNIOztBQUdEOztBQUVJOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKO0FBQ0o7O0FBRUQ7O0FBRUk7O0FBRUk7O0FBRUk7QUFFSDtBQUVKOztBQUVHOztBQUVIO0FBRUo7O0FBckZJIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBjaHVQYWk6IGZ1bmN0aW9uIChwbGF5ZXIpe1xuXG4gICAgICAgIC8v5pyJ5Lq66KaB6aOOXG4gICAgICAgIGlmKGNvbS5nZXRXaW5kUGxheWVyTnVtIT0tMSl7XG5cbiAgICAgICAgICAgIGlmKGNvbS5pc1BsYXllclBhcnR5KGNvbS5fY3VycmVudFBsYXllcixjb20uZ2V0V2luZFBsYXllck51bSkpe1xuICAgICAgICAgICAgICAgIC8v6Zif5Y+LICDkuI3lh7pcbiAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb20uc29ydFBhaShwbGF5ZXIuc2hvdVBhaSlcblxuICAgICAgICB2YXIgaXNFbmFibGVYdWFuWmhhbiA9IGNvbS5jaGVja0VuYWJsZVh1YW5aaGFuKCk7XG5cbiAgICAgICAgaWYoaXNFbmFibGVYdWFuWmhhbiE9MCl7XG4gICAgICAgICAgICAvL+WPr+S7peWuo+aImFxuICAgICAgICAgICAgLy/orr7nva7lrqPmiJhcbiAgICAgICAgICAgIHBsYXllci5pc1h1YW5aaGFuID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy/lrqPmiJgg5L+u5pS55YWo5bGA5Y+Y6YePXG4gICAgICAgICAgICBjb20uaXNYdWFuWmhhbiA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW49PTEpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi5a6j5oiYXCI7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGlzRW5hYmxlWHVhblpoYW49PTIpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi6LefXCI7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgaWYoKGNvbS5nZXRXaW5kUGxheWVyTnVtPT1jb20uX2N1cnJlbnRQbGF5ZXIpIHx8IGNvbS5fbGFzdFBhaT09bnVsbHx8Y29tLl9sYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgIHRoaXMuZmlyc3RDaHVQYWkocGxheWVyKTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBwYWlzID0gdGhpcy5nZXRFbmFibGVDaHVQYWkocGxheWVyKTtcblxuICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIocGFpcyk7XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog56ys5LiA5Liq5Ye654mMXG4gICAgICovXG4gICAgZmlyc3RDaHVQYWk6ZnVuY3Rpb24ocGxheWVyKXtcblxuICAgICAgICB2YXIgd2VpZ2h0QXJyID0gdGhpcy5hbmFseXplKHBsYXllci5zaG91UGFpKTtcblxuICAgICAgICAvL+WHuuS4gOS4quacgOWwj+adg+WAvOeahOe7hOWQiFxuICAgICAgICBpZih3ZWlnaHRBcnIubGVuZ3RoPjApe1xuXG4gICAgICAgICAgICB2YXIgcGFpcyA9IHBsYXllci5zaG91UGFpLnNwbGljZSh3ZWlnaHRBcnJbMF1bMV0sd2VpZ2h0QXJyWzBdWzJdKTtcblxuICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIocGFpcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOiuoeeul+WHuuWPr+S7peWHuueahOeJjFxuICAgICAqL1xuICAgIGdldEVuYWJsZUNodVBhaTpmdW5jdGlvbihwbGF5ZXIpe1xuXG4gICAgICAgICAgICB2YXIgd2VpZ2h0QXJyID0gdGhpcy5hbmFseXplKHBsYXllci5zaG91UGFpKTtcblxuICAgICAgICAgICAgdmFyIGxhc3RXZWlnaHQgPSBjb20uY29udmVydFZhbHVlTW9yZShjb20uX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAvL+imgeWHuueahOeJjFxuICAgICAgICAgICAgdmFyIHBhaXMgPSBudWxsO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHdlaWdodEFycltpXVswXTtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodD5sYXN0V2VpZ2h0ICYmICgoKGNvbS5fbGFzdFBhaS5sZW5ndGg9PTEgJiYgKHdlaWdodDw9MTgwIHx8IHdlaWdodD4xNjAwKSl8fGNvbS5fbGFzdFBhaS5sZW5ndGg+MSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvL+S4iuS4gOW8oOeJjOaYr+WQpuaYr+mYn+WPi+WHuueahFxuICAgICAgICAgICAgICAgICAgICBpZihjb20uaXNQbGF5ZXJQYXJ0eShjb20uX2N1cnJlbnRQbGF5ZXIsY29tLmxhc3RQbGF5ZXJOdW0pICYmICgoY29tLl9sYXN0UGFpLmxlbmd0aD09MSAmJiB3ZWlnaHQ+MTQwKSB8fCAoY29tLl9sYXN0UGFpLmxlbmd0aD4xICYmIHdlaWdodD4xNDAwKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3mgLzpmJ/lj4tcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5aSn5LqOQeaIluiAheWkp+S6juWvuUEg5LiN5Ye6XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lh7rniYxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhaXMgPSBwbGF5ZXIuc2hvdVBhaS5zcGxpY2Uod2VpZ2h0QXJyW2ldWzFdLHdlaWdodEFycltpXVsyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBwYWlzO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWHuueJjOWKqOS9nFxuICAgICAqL1xuICAgIC8vIGNodVBhaUFjdGlvbjpmdW5jdGlvbihwYWlzKXtcblxuICAgIC8vICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAvLyAgICAgLy8gLy/muIXnqbpsYXN0UGFpXG4gICAgLy8gICAgIC8vIGlmKGNvbS5fbGFzdFBhaSE9bnVsbCl7XG4gICAgLy8gICAgIC8vICAgICAvL+a4heepuuS4iuWutuWHuueahOeJjCDlh4blpIforrDlvZXmraTmrKHlh7rniYxcbiAgICAvLyAgICAgLy8gICAgIGNvbS5fbGFzdFBhaS5zcGxpY2UoMCxjb20uX2xhc3RQYWkubGVuZ3RoKTtcblxuICAgIC8vICAgICAvLyB9ZWxzZSB7XG5cbiAgICAvLyAgICAgLy8gICAgIGNvbS5fbGFzdFBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgLy8gICAgIC8vIH1cblxuICAgIC8vICAgICAvL+WxleekulxuICAgIC8vICAgICBmb3IodmFyIGogPSAwO2o8cGFpcy5sZW5ndGg7aisrKXtcblxuICAgIC8vICAgICAgICAgdmFyIG5vZGUgPSBwYWlzW2pdO1xuXG4gICAgLy8gICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgLy8gICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yICsgaiozMCxzaXplLmhlaWdodC8yKSk7XG5cbiAgICAvLyAgICAgICAgIC8v5pu05paw5YiwbGFzdFBhaVxuICAgIC8vICAgICAgICAgLy8gY29tLl9sYXN0UGFpLnB1c2gocGFpc1tqXSk7XG5cbiAgICAvLyAgICAgfVxuXG4gICAgLy8gfSxcblxuICAgIC8qKlxuICAgICAqIOaOkuW6j+adg+WAvOWIl+ihqFxuICAgICAqL1xuICAgIHNvcnRXZWlnaHRBcnI6ZnVuY3Rpb24od2VpZ2h0QXJyKXtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBmb3IodmFyIGogPSBpO2o8d2VpZ2h0QXJyLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgaWYod2VpZ2h0QXJyW2ldWzBdPndlaWdodEFycltqXVswXSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBcnIgPSB3ZWlnaHRBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyW2ldID0gd2VpZ2h0QXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodEFycltqXSA9IHRlbXBBcnI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5YmU6Zmk5LiN5ZCI55CG55qE5p2D5YC8XG4gICAgICovXG4gICAgdHJpbTpmdW5jdGlvbih3ZWlnaHRBcnIpe1xuXG4gICAgICAgIHZhciB0cmltV2VpZ2h0QXJyID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgaWYod2VpZ2h0QXJyIT1udWxsICYmIHdlaWdodEFyci5sZW5ndGg+MCl7XG5cbiAgICAgICAgICAgIHZhciBpbmRleEFyciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSB3ZWlnaHRBcnIubGVuZ3RoLTE7aT49MDtpLS0pe1xuXG4gICAgICAgICAgICAgICAgaWYoaW5kZXhBcnIuaW5kZXhPZih3ZWlnaHRBcnJbaV1bMV0pPT0tMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/lpKfkuo7nrYnkuo7mnIDlsI/nmoTngrgg5LiN5ouG5byA55SoIC8v5a+56ay85Lmf5rKh6ICD6JmR5ouG5byAXG4gICAgICAgICAgICAgICAgICAgIGlmKHdlaWdodEFycltpXVswXT4xNjAwKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBqID0gd2VpZ2h0QXJyW2ldWzFdO2o8KHdlaWdodEFycltpXVsxXSArIHdlaWdodEFycltpXVsyXSk7aisrKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QXJyLnB1c2goaik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHJpbVdlaWdodEFyci5wdXNoKHdlaWdodEFycltpXSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc29ydFdlaWdodEFycih0cmltV2VpZ2h0QXJyKTtcblxuICAgICAgICByZXR1cm4gdHJpbVdlaWdodEFycjtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqHnrpflj6/ku6Xlh7rniYznmoTmiYDmnInmnYPlgLxcbiAgICAgKi9cbiAgICBhbmFseXplOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSBuZXcgQXJyYXkoKTsvL1vmnYPlgLws5byA5aeL5LiL5qCHLOmVv+W6pl1cblxuICAgICAgICAvLyB2YXIgbGFzdExlbmd0aCA9IGNvbS5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgaWYocGFpcyE9bnVsbCl7XG5cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgLy8gICAgIGNjLmxvZyhwYWlzW2pdLl9uYW1lKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpOlwiK2kpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh3ZWlnaHRBcnIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocGFpc1tpXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6ay8IOWNleW8oFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0Q2xvd25WYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaSsxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGo8cGFpcy5sZW5ndGgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZjIgPSBwYWlzW2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZjIgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo5a+56ay855qE5p2D5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxqKzEpKSxpLDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWNleW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcG9zZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRve1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoaStqKTxwYWlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbDIgPSBwYXJzZUludChwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9zZSA9IGw9PWwyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGlzRGlmZmVyZW50Rml2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8v5a+56IqxNeeahOWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGw9PTUgJiYgaj09MSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGYyID0gcGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjb2RlID0gZi5jaGFyQ29kZUF0KCkrZjIuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5LiN5piv5a+56buRNee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoY29kZSE9MTk2ICYmIGNvZGUhPTE5OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzRGlmZmVyZW50Rml2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNDb21wb3NlICYmICghKGxhc3RMZW5ndGg9PTEgJiYgaj09MSkgfHwgKGw9PTUgJiYgIWlzRGlmZmVyZW50Rml2ZSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc0NvbXBvc2Upe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55aSa5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaStqKzEpKSxpLGorMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9d2hpbGUoaXNDb21wb3NlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsIT01KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vNeeJueauiuS4jeiDveecgeeVpei/meS4qui/h+eoi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ljrvpmaTph43lpI3mnYPlgLzorqHnrpdcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpK2otMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc29ydFdlaWdodEFycih3ZWlnaHRBcnIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRyaW0od2VpZ2h0QXJyKTtcblxuICAgIH0sXG5cblxuICAgIFxuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBwbGF5ZXJOdW0gOiA0LC8v546p5a625pWwXG5cbiAgICBwYWlOdW0gOiAzMiwvL+eJjOaVsFxuXG4gICAgcm91bmRzOjAsLy/lm57lkIjmlbBcblxuICAgIHBsYXllcnM6IG51bGwsLy/miYDmnInnjqnlrrbnmoTlrrnlmahcblxuICAgIF9sYXN0UGFpOm51bGwsLy/kuIrlrrblh7rnmoTniYxcblxuICAgIC8vX2ZpcnN0UGxheWVyOjAsLy/nrKzkuIDkuKrlh7rniYznmoTnjqnlrrZcblxuICAgIF9jdXJyZW50UGxheWVyOjAsLy/lvZPliY3lh7rniYznmoTnjqnlrrZcblxuICAgIC8vX2J1Q2h1TnVtOjAsLy/orrDlvZXkuI3lh7rniYzmrKHmlbBcblxuICAgIGxhc3RQbGF5ZXJOdW06MCwvL+acgOWQjuWHuueJjOeahOeOqeWutlxuXG4gICAgd2luUGxheWVyOm51bGwsLy/orrDlvZXog5zlh7rogIXluo/lj7dcblxuICAgIHBhcnR5UGxheWVyczpudWxsLC8v6K6w5b2V5ZCM5LiA5LyZ5Y+v5a6j5oiY55qE546p5a625pWw57uEXG5cbiAgICBpc1h1YW5aaGFuOmZhbHNlLC8v5piv5ZCm5a6j5oiYXG5cbiAgICBudW06MCwvL+iusOaVsFxuXG4gICAgZ2V0V2luZFBsYXllck51bTotMSwvL+iusOW9lee7memjjueahOiusOaVsFxuXG4gICAgLy92b3RlR2V0V2luZE51bTowLC8v5Y+C5LqO5oqV56Wo5Lq65pWwXG5cbiAgICBzZXRGaXJzdFBsYXllcjpmdW5jdGlvbihmaXJzdFBsYXllcil7XG5cbiAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9IGZpcnN0UGxheWVyO1xuXG4gICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5jdXJyZW50VGFnLnNldFZpc2libGUodHJ1ZSk7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5qOA5p+l546p5a6277yM5YmU6Zmk6IOc5Ye66ICF77yM57un57ut5ri45oiPXG4gICAgICovXG4gICAgY2hlY2tOZXh0UGxheWVyTm9XaW5uZXI6ZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLm51bSA9IHRoaXMubnVtICsxO1xuXG4gICAgICAgIC8v5o6n5Yi26YCS5b2S5rex5bqmXG4gICAgICAgIGlmKHRoaXMud2luUGxheWVyLmxlbmd0aDx0aGlzLnBsYXllck51bSl7XG5cbiAgICAgICAgICAgIGlmKHRoaXMubnVtJXRoaXMucGxheWVyTnVtPT0wKXtcblxuICAgICAgICAgICAgICAgIHRoaXMucm91bmRzID0gdGhpcy5yb3VuZHMgKyAxO1xuXG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpICUgdGhpcy5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIGlmKHRoaXMud2luUGxheWVyLmluZGV4T2YodGhpcy5fY3VycmVudFBsYXllcikhPS0xKXtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOZXh0UGxheWVyTm9XaW5uZXIoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8gY2MubG9nKFwiY2hla2MgcGxheWVyIGluZGV4OlwiK3RoaXMuX2N1cnJlbnRQbGF5ZXIpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOS4i+S4gOS4queOqeWutlxuICAgICAqL1xuICAgIG5leHRQbGF5ZXI6ZnVuY3Rpb24obGFzdFBhaSxtZXNzYWdlKXtcblxuICAgICAgICAgICAgLy/orr7nva7pu5jorqTlgLxcbiAgICAgICAgICAgIC8vIGdldFdpbmROdW0gPSBnZXRXaW5kTnVtfHwtMTtcblxuICAgICAgICAgICAgLy/muIXnkIblvZPliY3njqnlrrborrDlvZXniYxcbiAgICAgICAgICAgIHRoaXMuY2xlYXJSZWNvcmRQbGF5ZXJQYWkoKTtcblxuICAgICAgICAgICAgLy/lvZPliY3osIPnlKjor6Xlh73mlbDnmoTnjqnlrrbpg6jliIZcbiAgICAgICAgICAgIGlmKGxhc3RQYWk9PW51bGx8fGxhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2J1Q2h1TnVtID0gdGhpcy5fYnVDaHVOdW0gKyAxO1xuICAgICAgICAgICAgICAgIC8v5LiN5Ye6XG4gICAgICAgICAgICAgICAgaWYobWVzc2FnZT09bnVsbCl7XG5cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwi5LiN5Ye6XCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLmdldFdpbmRQbGF5ZXJOdW0hPS0xKXtcbiAgICAgICAgICAgICAgICAgICAgLy/nu5npo45cbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwi57uZ6aOOXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uYWN0aW9uTGFiZWwuc3RyaW5nID0gbWVzc2FnZTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIC8v5riF6Zmk6KaB6aOO6K6w5b2VXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRXaW5kUGxheWVyTnVtID0gLTE7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9idUNodU51bSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UGxheWVyTnVtID0gdGhpcy5fY3VycmVudFBsYXllcjtcbiAgICAgICAgICAgICAgICAvL+a4heeQhueJjOahjFxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICAvL+i1i+WAvFxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RQYWkgPSBsYXN0UGFpO1xuICAgICAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TGFzdFBhaSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5jdXJyZW50VGFnLnNldFZpc2libGUoZmFsc2UpO1xuXG4gICAgICAgICAgICB2YXIgaXNQbGF5ZXJXaW4gPSB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uc2hvdVBhaS5sZW5ndGggPT0gMCAmJiB0aGlzLndpblBsYXllci5pbmRleE9mKHRoaXMuX2N1cnJlbnRQbGF5ZXIpPT0tMTtcblxuICAgICAgICAgICAgaWYoaXNQbGF5ZXJXaW4pe1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2coXCJ3cCBsZW5naHQ6XCIrdGhpcy53aW5QbGF5ZXIubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMud2luUGxheWVyLnB1c2godGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICAgICAgICAgICAgICAvL3RoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5zaG91UGFpTnVtLnN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uYWN0aW9uTGFiZWwuc3RyaW5nID0gXCJOTy4gXCIrdGhpcy53aW5QbGF5ZXIubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhcnR5ID0gdGhpcy5wYXJ0eVBsYXllcnMuaW5kZXhPZih0aGlzLl9jdXJyZW50UGxheWVyKSE9LTE7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXNHYW1lT3ZlciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5wYXJ0eVBsYXllcnMubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAvLzE6M1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYocGFydHkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj4zprLzog5xcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMud2luUGxheWVyLmxlbmd0aD09Myl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+ayoemsvOeOqeWutuiDnFxuICAgICAgICAgICAgICAgICAgICAgICAgaXNHYW1lT3ZlciA9IHRoaXMud2luUGxheWVyLmluZGV4T2YodGhpcy5wYXJ0eVBsYXllcnNbMF0pPT0tMTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vMjoyXG5cbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy53aW5QbGF5ZXIubGVuZ3RoPT0yKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNHYW1lT3ZlciA9IHRoaXMuaXNQbGF5ZXJQYXJ0eSh0aGlzLndpblBsYXllclswXSx0aGlzLndpblBsYXllclsxXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodGhpcy53aW5QbGF5ZXIubGVuZ3RoPT0zKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNHYW1lT3ZlciA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYoaXNHYW1lT3Zlcil7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhaVpodW8oKTtcblxuICAgICAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmdldENoaWxkQnlOYW1lKCdDYW52YXMnKS5nZXRDb21wb25lbnQoJ0dhbWUnKS5nYW1lTGFiZWwuc3RyaW5nID0gXCLmuLjmiI/nu5PmnZ9cIlxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgLy8qKioqKioqKioqIOW9k+WJjeiwg+eUqOivpeWHveaVsOeahOeOqeWutumDqOWIhue7k+adnyAqKioqKioqKioqKipcblxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+S4i+S4gOS4queOqeWutumDqOWIhlxuICAgICAgICAgICAgLy/kuIvkuIDkuKrlkIjms5XnmoTlh7rniYzogIVcbiAgICAgICAgICAgIC8vdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpJXRoaXMucGxheWVyTnVtO1xuICAgICAgICAgICAgdGhpcy5jaGVja05leHRQbGF5ZXJOb1dpbm5lcigpO1xuXG4gICAgICAgICAgICAvL2NjLmxvZyh0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0pO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmN1cnJlbnRUYWcuc2V0VmlzaWJsZSh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwiXCI7XG5cblxuICAgICAgICAgICAgLy/kuInkuKrkuI3lh7rvvIzor7TmmI7lj4jova7liLDkuIrmrKHlh7rniYznmoTnjqnlrrYg5b2T5pyJ6IOc5Ye66ICF5ZCO77yM5Yik5pat55qE5pWw5a2X6KaB5YeP5bCRXG4gICAgICAgICAgICAvLyBpZih0aGlzLl9idUNodU51bT09KDMtdGhpcy53aW5QbGF5ZXIubGVuZ3RoKSl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHRoaXMubGFzdFBsYXllck51bT09dGhpcy5fY3VycmVudFBsYXllcil7XG5cbiAgICAgICAgICAgICAgICAvL+a4heeQhueJjOahjFxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UGFpID0gbnVsbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaWYoaXNQbGF5ZXJXaW4pe1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXkuIvkuIDkuKrlh7rniYzogIXvvIzlj4ropoHpo47ogIVcbiAgICAgICAgICAgICAgICB0aGlzLmdldFdpbmRQbGF5ZXJOdW0gPSB0aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZ2V0V2luZE51bSA9IHRoaXMuX2N1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgICAgICAgICAvL+abtOaWsOS4i+S4gOS4quWHuueJjOiAhSsxIOWHuuaJvuS4i+S4i+WutuimgemjjlxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tOZXh0UGxheWVyTm9XaW5uZXIoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+mAmuefpeeOqeWutuWPr+S7peWHuueJjOS6hlxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLnRvZ2dsZSgpO1xuXG4gICAgICAgIFxuXG4gICAgfSxcbiAgICAgICAgXG4gICAgLyoqXG4gICAgICog5qOA5p+l5Ye654mM55qE5ZCI5rOV5oCnXG4gICAgICovXG4gICAgY2hlY2tDaHVQYWk6ZnVuY3Rpb24oeHVhblBhaSxwKXtcblxuICAgICAgICB2YXIgaXNDdXJyZW50ID0gcD09dGhpcy5fY3VycmVudFBsYXllcjtcblxuICAgICAgICAvLyBpc0N1cnJlbnQgPSB0cnVlO1xuXG4gICAgICAgIC8v5piv5ZCm6K+l5Ye654mMXG4gICAgICAgIGlmKCFpc0N1cnJlbnQpe1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL+WIpOaWremAieS4reeahOeJjFxuICAgICAgICBpZih4dWFuUGFpIT1udWxsKXtcblxuICAgICAgICAgICAgaWYoKHRoaXMuZ2V0V2luZFBsYXllck51bT09cCkgfHwgdGhpcy5fbGFzdFBhaT09bnVsbCB8fCB0aGlzLl9sYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9zZUNoZWNrKHh1YW5QYWkpO1xuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0geHVhblBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB2YXIgbGFzdExlbmd0aCA9IHRoaXMuX2xhc3RQYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgIC8v5Y2VXG4gICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aCA9PSAxKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ngrgg5aSn5LqOMTYwMOS4uueCuFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU+MTYwMCAmJiB2YWx1ZT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobGFzdExlbmd0aCA+PSAyICYmIGxhc3RMZW5ndGggPCA1KXtcbiAgICAgICAgICAgICAgICAgICAgLy/lr7lcbiAgICAgICAgICAgICAgICAgICAgaWYobGVuZ3RoPj0yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+v5Lul5Ye65a+577yM5Lmf5Y+v5Lul5Ye654K4XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+S4jeiDveWHuuWNlVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog57uE5ZCI5qOA5p+lXG4gICAgICovXG4gICAgY29tcG9zZUNoZWNrOmZ1bmN0aW9uKGFycil7XG5cbiAgICAgICAgdmFyIGxlbmd0aCA9IGFyci5sZW5ndGg7XG5cbiAgICAgICAgaWYobGVuZ3RoPT0xKXtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1lbHNlIGlmKGxlbmd0aDw1KXtcblxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJyWzBdLl9uYW1lLnN1YnN0cmluZygxKTtcblxuICAgICAgICAgICAgdmFyIGlzQ2xvd24gPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIC8v6ay85piv5LiA5Liq54m55q6K55qE57uE5ZCIXG4gICAgICAgICAgICAgICAgaWYoYXJyW2ldLl9uYW1lLnN1YnN0cmluZygwLDEpPT1cIkVcIil7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDbG93bil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+q5pyJ5Lik5bygIOS4lOmDveaYr+msvFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobGVuZ3RoID09MiApe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ2xvd24gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL+i/m+WIsOi/memHjO+8jOi/meW8oOeJjOS4jeaYr+Wkp+Wwj+msvO+8jOWHuueOsOS4jeWQjOadg+WAvCDov5Tlm55mYWxzZVxuICAgICAgICAgICAgICAgICAgICBpZihpc0Nsb3duKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUyID0gYXJyW2ldLl9uYW1lLnN1YnN0cmluZygxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZSE9dmFsdWUyKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WmguaenOWIsOi/memHjCBpc0Nsb3duIOS4uuecn++8jOWPiuaciemsvOWtmOWcqO+8jOS9huWkmuW8oOeJjOWPquacieS4gOS4qumsvO+8jOivtOaYjueJjOe7hOWQiOS4jeWvuVxuICAgICAgICAgICAgcmV0dXJuICFpc0Nsb3duO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmnYPlgLzovazmjaIgXG4gICAgICog5LiN5YyF5ous5aSn5bCP6ay8XG4gICAgICovXG4gICAgY29udmVydFZhbHVlOmZ1bmN0aW9uKGwpe1xuXG4gICAgICAgIGlmKGw8NCl7XG5cbiAgICAgICAgICAgIHJldHVybiAoMTMrbCkqMTA7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICByZXR1cm4gbCoxMDtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5aSn5bCP6ay85p2D5YC86L2s5o2iIFxuICAgICAqIFxuICAgICAqL1xuICAgIGNvbnZlcnRDbG93blZhbHVlOmZ1bmN0aW9uKGwpe1xuICAgICAgICAvL+Wkp+msvCBsID0gMCAg5bCP6ay8IGw9MVxuICAgICAgICAvL+Wwj+msvOimgeWkp+S6juacgOWkp+eahOWNlVxuICAgICAgICByZXR1cm4gKDEzKzMrMi1sKSoxMDtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmnYPlgLzovazmjaIg5aSa5bygXG4gICAgICovXG4gICAgY29udmVydFZhbHVlTW9yZTpmdW5jdGlvbihhcnIpe1xuXG4gICAgICAgIHZhciB3ZWlnaHQgPSAwO1xuXG4gICAgICAgIGlmKGFycj09bnVsbCB8fCBhcnIubGVuZ3RoID09IDAgfHwgIXRoaXMuY29tcG9zZUNoZWNrKGFycikpe1xuXG4gICAgICAgICAgICByZXR1cm4gd2VpZ2h0O1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgdmFyIGYgPSBhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgIHZhciBsID0gcGFyc2VJbnQoYXJyWzBdLl9uYW1lLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgIC8v6ay8XG4gICAgICAgICAgICAgICAgd2VpZ2h0ID0gMTMrMysyLWw7XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmKGw8NCl7XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ID0gMTMrbDtcblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQgPSBsO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL+eJueS+i1xuICAgICAgICAgICAgaWYoYXJyLmxlbmd0aD09Mil7XG5cbiAgICAgICAgICAgICAgICBpZihsID09IDEwKXtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsMikrMTsvL+avlOWvuTPlpKcxXG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihsID09IDUpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGYuY2hhckNvZGVBdCgpK2FyclsxXS5fbmFtZS5zdWJzdHJpbmcoMCwxKS5jaGFyQ29kZUF0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUgPT0gMTk2KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+56buRNVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzM7Ly/mr5Tlr7nnuqI15aSnMVxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih2YWx1ZSA9PSAxOTgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7nnuqI1XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMi8v5q+U5a+56ay85aSnMVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGYgPT0gXCJFXCIpe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSsxOy8v5q+U5Zub5LiqM+WkpzFcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2NjLmxvZyhcIndlaWdodDpcIit3ZWlnaHQpO1xuXG4gICAgICAgICAgICByZXR1cm4gd2VpZ2h0ICogTWF0aC5wb3coMTAsYXJyLmxlbmd0aCk7XG5cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5o6S5bqP5pa55rOVXG4gICAgICovXG4gICAgc29ydFBhaTpmdW5jdGlvbihzcHJpdGVBcnIpe1xuXG4gICAgICAgIC8vY2MubG9nKHNwcml0ZUFycik7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPHNwcml0ZUFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgZm9yKHZhciBqID0gaSsxO2o8c3ByaXRlQXJyLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUxID0gc3ByaXRlQXJyW2ldLl9uYW1lO1xuXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUyID0gc3ByaXRlQXJyW2pdLl9uYW1lO1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2cobmFtZTEuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIC8vY2MubG9nKFwibmFtZTE6XCIrbmFtZTErXCIgbmFtZTI6XCIrbmFtZTIpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZihwYXJzZUludChuYW1lMS5zdWJzdHJpbmcoMSkpPnBhcnNlSW50KG5hbWUyLnN1YnN0cmluZygxKSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKFwiLW5hbWUxOlwiK25hbWUxK1wiIG5hbWUyOlwiK25hbWUyKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHNwcml0ZUFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbaV0gPSBzcHJpdGVBcnJbal07XG5cbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2pdID0gdGVtcDtcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5hbWUxLnN1YnN0cmluZygxKT09bmFtZTIuc3Vic3RyaW5nKDEpKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZTEgPSBuYW1lMS5zdWJzdHJpbmcoMCwxKS5jaGFyQ29kZUF0KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlMiA9IG5hbWUyLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAvLzXnmoTnibnmrormjpLluo9cbiAgICAgICAgICAgICAgICAgICAgaWYobmFtZTEuc3Vic3RyaW5nKDEpPT1cIjVcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aKiuWvuem7kTXmiJblr7nnuqI15pS+5Yiw5LiA6LW3XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+aKiue6ouahg+S4juiNieiKseS6kuaNolxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29kZTE9PTk5KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUxID0gOTg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGUxPT05OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMSA9IDk5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvZGUyPT05OSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMiA9IDk4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihjb2RlMj09OTgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTIgPSA5OTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihjb2RlMT5jb2RlMil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3ByaXRlQXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbaV0gPSBzcHJpdGVBcnJbal07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltqXSA9IHRlbXA7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWxleekuuWcqOeJjOahjOS4ilxuICAgICAqL1xuICAgIHNob3dMYXN0UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gY2MubG9nKFwicGxheWVyOlwiK3RoaXMuX2N1cnJlbnRQbGF5ZXIpO1xuXG4gICAgICAgIGlmKHRoaXMuX2xhc3RQYWkhPW51bGwgJiYgdGhpcy5fbGFzdFBhaS5sZW5ndGggIT0wKXtcblxuICAgICAgICAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgICAgICAvL+WxleekulxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDtqPHRoaXMuX2xhc3RQYWkubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2xhc3RQYWlbal07XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJub2RlOlwiKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihjYy5wKHNpemUud2lkdGgvMiArIGoqMzAsc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgICAgICAgICAgICAgLy9ub2RlLnJ1bkFjdGlvbihjYy5yb3RhdGVCeSgwLHRoaXMuX2N1cnJlbnRQbGF5ZXIqLTkwKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgbm9kZTEgPSBjYy5pbnN0YW50aWF0ZShub2RlLl9wcmVmYWIuYXNzZXQpO1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXmr4/lm57lkIjlh7rniYznlLvlnKjlpLTlg4/kuIvovrlcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jdXJyZW50UGxheWVyIT0wKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZTEgPSBjYy5pbnN0YW50aWF0ZShub2RlKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFiZWxCb3R0b21Ob2RlID0gdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ0xhYmVsQm90dG9tJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGFiZWxCb3R0b21Ob2RlLmFkZENoaWxkKG5vZGUxKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0ubm9kZS5hZGRDaGlsZChub2RlMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZTEuc2V0U2NhbGUoMC4zLDAuMyk7XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZTEuc2V0QW5jaG9yUG9pbnQoMCwwKTtcblxuICAgICAgICAgICAgICAgICAgICBub2RlMS5zZXRDYXNjYWRlT3BhY2l0eUVuYWJsZWQoZmFsc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vZGUxLnNldFBvc2l0aW9uKGNjLnAoLWxhYmVsQm90dG9tTm9kZS53aWR0aC8yICsgaioxMCwtbGFiZWxCb3R0b21Ob2RlLmhlaWdodC8yLW5vZGUxLmhlaWdodC8zKSk7XG5cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmuIXnqbrniYzmoYxcbiAgICAgKi9cbiAgICBjbGVhclBhaVpodW86ZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyBjYy5sb2coXCJjbGVhclBhaVpodW9cIik7XG5cbiAgICAgICAgaWYodGhpcy5fbGFzdFBhaSE9bnVsbCAmJiB0aGlzLl9sYXN0UGFpLmxlbmd0aCAhPTApe1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8dGhpcy5fbGFzdFBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fbGFzdFBhaVtpXTtcblxuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5riF56m66K6w5b2V5Zyo546p5a625aS05ZCR5LiL55qE5Ye654mM6K6w5b2VXG4gICAgICovXG4gICAgY2xlYXJSZWNvcmRQbGF5ZXJQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgbGFiZWxCb3R0b21Ob2RlID0gdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ0xhYmVsQm90dG9tJyk7XG5cbiAgICAgICAgbGFiZWxCb3R0b21Ob2RlLnJlbW92ZUFsbENoaWxkcmVuKCk7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5Y+v5Lul5a6j5oiY5oiW6Lef6ZqPXG4gICAgICog5LiN5Y+v5LulIDBcbiAgICAgKiDlrqPmiJggMVxuICAgICAqIOi3n+majyAyXG4gICAgICovXG4gICAgY2hlY2tFbmFibGVYdWFuWmhhbjpmdW5jdGlvbihwTnVtKXtcblxuICAgICAgICBpZihwTnVtPT1udWxsKXtcblxuICAgICAgICAgICAgcE51bSA9IHRoaXMuX2N1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNjLmxvZyhcInJvdW5kczpcIit0aGlzLnJvdW5kcyk7XG4gICAgICAgIC8vIGNjLmxvZyh0aGlzLnBhcnR5UGxheWVycyk7XG4gICAgICAgIC8vIGNjLmxvZyhwTnVtKTtcbiAgICAgICAgLy8gY2MubG9nKHRoaXMucGFydHlQbGF5ZXJzLmluZGV4T2YocE51bSkhPS0xKTtcblxuICAgICAgICBpZih0aGlzLm51bTw9NCAmJiB0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0pIT0tMSl7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaXNYdWFuWmhhbil7XG4gICAgICAgICAgICAgICAgLy/ot59cbiAgICAgICAgICAgICAgICByZXR1cm4gMjtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAvL+Wuo+aImFxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuaYr+WQjOS8mVxuICAgICAqL1xuICAgIGlzUGxheWVyUGFydHk6ZnVuY3Rpb24ocE51bSxwTnVtMil7XG5cbiAgICAgICAgcmV0dXJuIChwTnVtICE9IHBOdW0yKSAmJiAhKCh0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0pPT0tMSleKHRoaXMucGFydHlQbGF5ZXJzLmluZGV4T2YocE51bTIpPT0tMSkpO1xuXG4gICAgfSxcblxuXG59O1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYWlBbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBnYW1lTGFiZWw6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGE1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYjE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGIxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgYjExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBjMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGQxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQ1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGQxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgRTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIEUxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHBhaXMgPSBuZXcgQXJyYXkoc2VsZi5hMSxzZWxmLmEyLHNlbGYuYTMsc2VsZi5hNSxzZWxmLmExMCxzZWxmLmExMSxzZWxmLmExMixzZWxmLmExMyxzZWxmLmIxLHNlbGYuYjIsc2VsZi5iMyxzZWxmLmI1LHNlbGYuYjEwLHNlbGYuYjExLHNlbGYuYjEyLHNlbGYuYjEzLHNlbGYuYzEsc2VsZi5jMixzZWxmLmMzLHNlbGYuYzUsc2VsZi5jMTAsc2VsZi5jMTEsc2VsZi5jMTIsc2VsZi5jMTMsc2VsZi5kMSxzZWxmLmQyLHNlbGYuZDMsc2VsZi5kNSxzZWxmLmQxMCxzZWxmLmQxMSxzZWxmLmQxMixzZWxmLmQxMyxzZWxmLkUwLHNlbGYuRTEpO1xuXG4gICAgICAgIC8v5omT5Lmx5pWw57uEXG4gICAgICAgIHBhaXMuc29ydChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHAgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBjb20ucGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxjb20ucGxheWVyTnVtO2orKyl7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuc2hvdVBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnMucHVzaChub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL+WIneWni+WMluWQjOS4gOS8meaVsOe7hFxuICAgICAgICBjb20ucGFydHlQbGF5ZXJzID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPGNvbS5wYWlOdW07aSsrKXtcblxuICAgICAgICAgICAgdmFyIGogPSBpJWNvbS5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBjYy5pbnN0YW50aWF0ZShwYWlzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tqXS5zaG91UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgaWYoc3ByaXRlLl9uYW1lID09IFwiYTExXCIpe1xuXG4gICAgICAgICAgICAgICAgY29tLnNldEZpcnN0UGxheWVyKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHNwcml0ZS5fbmFtZS5zdWJzdHJpbmcoMCwxKT09XCJFXCIpe1xuICAgICAgICAgICAgICAgIC8v6K6w5b2V5aSn5bCP6ay85ZCM5LiA5LyZXG4gICAgICAgICAgICAgICAgY29tLnBhcnR5UGxheWVycy5wdXNoKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy/liJ3lp4vljJbog5zliKnogIXmlbDnu4RcbiAgICAgICAgY29tLndpblBsYXllciA9IG5ldyBBcnJheSgpO1xuICAgICAgICBcblxuICAgICAgICBjb20ucGxheWVyc1swXS5pc0FJID0gZmFsc2U7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzFdLmlzQUkgPSB0cnVlO1xuICAgICAgICBjb20ucGxheWVyc1syXS5pc0FJID0gdHJ1ZTtcbiAgICAgICAgY29tLnBsYXllcnNbM10uaXNBSSA9IHRydWU7XG5cbiAgICAgICAgLy/orr7nva7njqnlrrbkvY3nva5cbiAgICAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgIHZhciBub2RlMSA9IGNvbS5wbGF5ZXJzWzFdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMSk7XG5cbiAgICAgICAgbm9kZTEuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLShub2RlMS53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzMqMikpO1xuXG4gICAgICAgIHZhciBub2RlMiA9IGNvbS5wbGF5ZXJzWzJdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMik7XG5cbiAgICAgICAgbm9kZTIuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIsc2l6ZS5oZWlnaHQgLSAobm9kZTIuaGVpZ2h0LzMqMikpKTtcblxuICAgICAgICB2YXIgbm9kZTMgPSBjb20ucGxheWVyc1szXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTMpO1xuXG4gICAgICAgIG5vZGUzLnNldFBvc2l0aW9uKGNjLnAoKG5vZGUzLndpZHRoLzMqMiksc2l6ZS5oZWlnaHQvMyoyKSk7XG5cbiAgICAgICAgLy9jYy5sb2coY29tLnBsYXllcnNbMF0pO1xuXG4gICAgICAgIHNlbGYucGFpQW4uZ2V0Q29tcG9uZW50KCdQYWlBbicpLnBsYXllciA9IGNvbS5wbGF5ZXJzWzBdO1xuXG4gICAgICAgIC8v5aaC5p6c5piv5py65Zmo5Lq677yM5oyH5a6a5Ye654mMXG4gICAgICAgIGlmKGNvbS5fY3VycmVudFBsYXllciE9MCAmJiBjb20ucGxheWVyc1tjb20uX2N1cnJlbnRQbGF5ZXJdLmlzQUkpe1xuXG4gICAgICAgICAgICBjb20ucm91bmRzID0gMTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZm9yKHZhciBuID0gMDtuPHBwLmxlbmd0aDtuKyspe1xuXG4gICAgICAgIC8vICAgICBzZWxmLnBsYXllcjAuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5TaG91UGFpID0gcHBbMF07XG5cbiAgICAgICAgLy8gfVxuXG4gICAgfSxcbn0pO1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBwbGF5ZXI6e1xuXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcblxuICAgICAgICB9LFxuXG4gICAgICAgIHh1YW5aaHVhbkJ0bjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkJ1dHRvbixcbiAgICAgICAgfSxcblxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvL2NjLmxvZyh0aGlzLnh1YW5aaHVhbkJ0bik7XG5cbiAgICAgICAgaWYoY29tLmNoZWNrRW5hYmxlWHVhblpoYW4oMCkhPTApe1xuXG4gICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkPSB0cnVlO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgLy90aGlzLnh1YW5aaHVhbkJ0bi5ub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4ubm9kZS5kZXN0cm95KCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGxheWVyLnh1YW5QYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBcbiAgICAgICAgLy/njqnlrrblpLTlg49cbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnBsYXllci5ub2RlO1xuXG4gICAgICAgIG5vZGUuc2V0Q2FzY2FkZU9wYWNpdHlFbmFibGVkKGZhbHNlKTtcblxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoLXRoaXMubm9kZS53aWR0aC8yLShub2RlLndpZHRoLzMqMiksMCkpO1xuXG4gICAgICAgIC8v5bGV56S65omL54mMXG4gICAgICAgIHRoaXMuZHJhd1BhaSgpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeCueWHu+Wuo+aImFxuICAgICAqL1xuICAgIHh1YW5aaGFuOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzRW5hYmxlWHVhblpoYW4gPSBjb20uY2hlY2tFbmFibGVYdWFuWmhhbigpO1xuXG4gICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW49PTEpe1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIuWuo+aImFwiO1xuXG4gICAgICAgIH1lbHNlIGlmKGlzRW5hYmxlWHVhblpoYW49PTIpe1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIui3n1wiO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL+Wuo+aImCDkv67mlLnlhajlsYDlj5jph49cbiAgICAgICAgY29tLmlzWHVhblpoYW4gPSB0cnVlO1xuXG4gICAgICAgIHRoaXMueHVhblpodWFuQnRuLmVuYWJsZWQ9ZmFsc2U7XG5cbiAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4ubm9ybWFsQ29sb3IgPSBjYy5Db2xvci5HUkVZO1xuXG4gICAgICAgIHRoaXMucGxheWVyLmlzWHVhblpoYW4gPSB0cnVlO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYxcbiAgICAgKi9cbiAgICBjaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy/lh7rniYzlkIjms5XmgKdcbiAgICAgICAgaWYoY29tLmNoZWNrQ2h1UGFpKHNlbGYucGxheWVyLnh1YW5QYWksMCkpe1xuXG4gICAgICAgICAgICBpZih0aGlzLnh1YW5aaHVhbkJ0biE9bnVsbCYmdGhpcy54dWFuWmh1YW5CdG4uaXNWYWxpZCl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkID1mYWxzZTtcblxuICAgICAgICAgICAgICAgIHRoaXMueHVhblpodWFuQnRuLm5vcm1hbENvbG9yID0gY2MuQ29sb3IuR1JFWTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8v56e76ZmkVE9VQ0jnm5HlkKxcbiAgICAgICAgICAgIGZvcih2YXIgbSA9IDA7bTxzZWxmLnBsYXllci5zaG91UGFpLmxlbmd0aDttKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc2hvdVBhaVttXS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsc2VsZi50b3VjaFBhaSx0aGlzKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WQiOazlVxuICAgICAgICAgICAgdmFyIGluZGV4QXJyID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgICAgIHZhciB3aW5kb3dTaXplID0gY2Mud2luU2l6ZTtcblxuICAgICAgICAgICAgLy/lvpfliLDopoHlh7rnmoTniYzlnKjmiYvniYzkuK3nmoTkvY3nva5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBqPTA7ajxzZWxmLnBsYXllci5zaG91UGFpLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYucGxheWVyLnNob3VQYWlbal0uX25hbWU9PXNlbGYucGxheWVyLnh1YW5QYWlbaV0uX25hbWUpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NjLmxvZyhzZWxmLnBsYXllci5zaG91UGFpW2pdLl9uYW1lKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhBcnIucHVzaChqKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnNwbGljZSgwLHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoKTtcblxuICAgICAgICAgICAgaW5kZXhBcnIuc29ydCgpO1xuXG4gICAgICAgICAgICAvL+a4heepuueJjOahjFxuICAgICAgICAgICAgLy9jb20uY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgIHZhciBsYXN0UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgICAgIC8v5Ye654mM5Yqo5L2cXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8aW5kZXhBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3ByaXRlID0gc2VsZi5wbGF5ZXIuc2hvdVBhaVtpbmRleEFycltpXV07XG5cbiAgICAgICAgICAgICAgICAvL+iusOW9leWHuueJjFxuICAgICAgICAgICAgICAgIGxhc3RQYWkucHVzaChzcHJpdGUpO1xuXG4gICAgICAgICAgICAgICAgc3ByaXRlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciBwID0gc3ByaXRlLmNvbnZlcnRUb1dvcmxkU3BhY2UoY2MucCgwLDApKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciBub2RlUCA9IHNlbGYubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnAoc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgvMixzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQvMikpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIHggPSB3aW5kb3dTaXplLndpZHRoLzItbm9kZVAueCszMCppO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIHkgPSB3aW5kb3dTaXplLmhlaWdodC8yLXAueTtcblxuICAgICAgICAgICAgICAgIC8vIHNwcml0ZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuNSxjYy5wKHgseSkpKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGluZGV4QXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/ku47miYvniYzkuK3liKDpmaRcbiAgICAgICAgICAgIGZvcih2YXIgbiA9IDA7bjxpbmRleEFyci5sZW5ndGg7bisrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnNob3VQYWkuc3BsaWNlKGluZGV4QXJyW25dLDEpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5Yi35paw5omL54mM5bGV56S6XG4gICAgICAgICAgICBzZWxmLmRyYXdQYWkoKTtcblxuICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIobGFzdFBhaSk7XG5cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy/kuI3lkIjms5VcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5wb3AoKS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMSwwLC0zMCkpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgXG4gICAgYnVDaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICBpZih0aGlzLnh1YW5aaHVhbkJ0biE9bnVsbCYmdGhpcy54dWFuWmh1YW5CdG4uaXNWYWxpZCl7XG4gICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkPWZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5ub3JtYWxDb2xvciA9IGNjLkNvbG9yLkdSRVk7XG4gICAgICAgIH1cblxuICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgICAgIFxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWxleekuuaJi+eJjFxuICAgICAqL1xuICAgIGRyYXdQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY29tLnNvcnRQYWkoc2VsZi5wbGF5ZXIuc2hvdVBhaSk7XG5cbiAgICAgICAgdmFyIG51bSA9IHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO1xuXG4gICAgICAgIC8vdmFyIHNpemUgPSBzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8bnVtO2krKyl7XG5cbiAgICAgICAgICAgIHZhciBwYWkgPSBzZWxmLnBsYXllci5zaG91UGFpW2ldO1xuICAgICAgICAgICAgLy8gY2MubG9nKFwicGFpIGk6XCIraSk7XG4gICAgICAgICAgICAvLyBjYy5sb2cocGFpKTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInNlbGYubm9kZTpcIik7XG4gICAgICAgICAgICAvLyBjYy5sb2coc2VsZi5ub2RlKTtcblxuICAgICAgICAgICAgaWYocGFpLnBhcmVudCE9c2VsZi5ub2RlKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWxmLm5vZGUuYWRkQ2hpbGQocGFpKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYWkuc2V0Q2FzY2FkZU9wYWNpdHlFbmFibGVkKGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIHAgPSBjYy5wKC0ocGFpLndpZHRoKyhudW0tMSkqMzApLzIrcGFpLndpZHRoLzIraSozMCwwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gcGFpLnNldFNjYWxlKDAuNSk7XG4gICAgICAgICAgICBwYWkuc2V0UG9zaXRpb24ocCk7XG4gICAgICAgICAgICBwYWkub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsc2VsZi50b3VjaFBhaSx0aGlzKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRPVUNI55uR5ZCs5Zue6LCDXG4gICAgICovXG4gICAgdG91Y2hQYWk6ZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB2YXIgbm9kZSA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIGluZGV4ID0gLTE7XG5cbiAgICAgICAgZm9yKHZhciBqID0gMDtqPHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgIGlmKG5vZGUuX25hbWU9PXNlbGYucGxheWVyLnh1YW5QYWlbal0uX25hbWUpe1xuXG4gICAgICAgICAgICAgICAgaW5kZXggPSBqO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgaWYoaW5kZXg9PS0xKXtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5wdXNoKG5vZGUpO1xuXG4gICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5tb3ZlQnkoMC4xLDAsMzApKTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkuc3BsaWNlKGluZGV4LDEpO1xuXG4gICAgICAgICAgICBub2RlLnJ1bkFjdGlvbihjYy5tb3ZlQnkoMC4xLDAsLTMwKSk7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcbn0pO1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xudmFyIGFpID0gcmVxdWlyZSgnQUknKTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBzaG91UGFpTnVtOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGxheWVySW1nOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuU3ByaXRlLFxuICAgICAgICB9LFxuXG4gICAgICAgIGN1cnJlbnRUYWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYWN0aW9uTGFiZWw6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICB4dWFuWmhhbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIGlzQUk6bnVsbCwvL+aYr+WQpuaYr0FJXG5cbiAgICAgICAgc2hvdVBhaTpudWxsLC8v5omL54mMXG5cbiAgICAgICAgeHVhblBhaTpudWxsLC8v6YCJ5Lit55qE54mMXG5cbiAgICAgICAgaXNYdWFuWmhhbjpmYWxzZSwvL+aYr+WQpuWuo+aImFxuXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAgICAgaWYodGhpcy5pc1h1YW5aaGFuKXtcbiAgICAgICAgICAgIHRoaXMueHVhblpoYW4uc3RyaW5nID0gXCLlrqNcIjtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgICAgICBpZih0aGlzLnNob3VQYWkhPW51bGwpe1xuXG4gICAgICAgICAgICBpZih0aGlzLnNob3VQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdVBhaU51bS5zdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNob3VQYWlOdW0uc3RyaW5nID0gdGhpcy5zaG91UGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIGlmKHRoaXMuaXNBSSl7XG5cbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBhaS5jaHVQYWkodGhpcyk7XG5cbiAgICAgICAgICAgIH0sMSk7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAvL+S4jeaYr0FJXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9