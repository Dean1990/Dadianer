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

        this.startGame();
    },

    startGame: function startGame() {
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
    },

    exit: function exit() {

        cc.game.end();
    },

    restart: function restart() {

        this.startGame();

        com._lastPai = null;

        cc.game.restart();
    }

});

cc._RFpop();
},{"Common":"Common"}],"Info":[function(require,module,exports){
"use strict";
cc._RFpush(module, '260eba28uVACaJSc1X2j0YK', 'Info');
// script/Info.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    close: function close() {

        cc.director.loadScene("launch");
    }
});

cc._RFpop();
},{}],"Launch":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9cac70OYI5K7qV8sa8VyBRS', 'Launch');
// script/Launch.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
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
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    startGame: function startGame() {

        cc.director.loadScene("main");
    },

    info: function info() {

        cc.director.loadScene("info");
    },

    exitGame: function exitGame() {

        cc.game.end();
    }
});

cc._RFpop();
},{}],"PaiAn":[function(require,module,exports){
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

        // if(this.shouPai!=null){

        //     if(this.shouPai.length==0){

        //         this.shouPaiNum.string = "";

        //     }else {

        //         this.shouPaiNum.string = this.shouPai.length;

        //     }

        // }
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
},{"AI":"AI","Common":"Common"}]},{},["AI","Common","Game","Info","Launch","PaiAn","Player"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHQvQUkuanMiLCJhc3NldHMvc2NyaXB0L0NvbW1vbi5qcyIsImFzc2V0cy9zY3JpcHQvR2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvSW5mby5qcyIsImFzc2V0cy9zY3JpcHQvTGF1bmNoLmpzIiwiYXNzZXRzL3NjcmlwdC9QYWlBbi5qcyIsImFzc2V0cy9zY3JpcHQvUGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTtBQUNBOztBQUVJOztBQUVJO0FBQ0E7O0FBRUk7QUFDSTtBQUNBOztBQUVBO0FBRUg7QUFFSjs7QUFFRDs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7QUFHSDtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVBO0FBRUg7QUFFSjs7QUFFRDs7O0FBR0E7O0FBRVE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0k7QUFDQTtBQUNIOztBQUVHO0FBQ0E7QUFFSDs7QUFFRDtBQUVIO0FBRUo7O0FBRUQ7QUFFUDs7QUFFRDs7O0FBR0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOzs7QUFHQTs7QUFFSTs7QUFFSTs7QUFFSTs7QUFFSTs7QUFFQTs7QUFFQTtBQUVIO0FBRUo7QUFFSjtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFSTs7QUFFSTtBQUNBOztBQUVJOztBQUVJO0FBRUg7QUFFSjs7QUFFRDtBQUVIO0FBSUo7QUFFSjs7QUFFRDs7QUFFQTtBQUVIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7OztBQUdBOztBQUVJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNJO0FBQ0k7QUFDQTtBQUNKOztBQUVBOztBQUVBOztBQUVJO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFFSjtBQUVKO0FBQ0c7QUFDSTtBQUNBO0FBQ0o7O0FBRUE7O0FBRUE7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFFSDtBQUVKOztBQUVHO0FBRUg7QUFFSjs7QUFFRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUo7QUFFSjtBQUVKOztBQUVEOztBQUVBO0FBRUg7O0FBdlVZOzs7Ozs7Ozs7O0FDRGpCOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVJOztBQUVBO0FBRUg7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUk7QUFFSDs7QUFHRDs7QUFFQTs7QUFFSTtBQUVIO0FBRUo7QUFDRDtBQUVIOztBQUVEOzs7QUFHQTs7QUFFUTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFSTtBQUNBO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNJO0FBQ0E7QUFFSDs7QUFFRDtBQUVIO0FBQ0c7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOztBQUVEOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBRUg7QUFDRztBQUNBO0FBRUg7QUFFSjtBQUNHOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKOztBQUVEOztBQUVJO0FBQ0E7O0FBRUE7O0FBRUE7QUFFSDtBQUVKOztBQUlEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFHQTtBQUNBOztBQUVBOztBQUVJO0FBQ0E7O0FBRUE7QUFFSDs7QUFJRDs7QUFFSTtBQUNBOztBQUdBOztBQUVBO0FBQ0E7QUFFSDs7QUFFRDtBQUNBO0FBSVA7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7QUFDSDs7QUFFRDtBQUNBOztBQUVJOztBQUVJOztBQUVBO0FBRUg7O0FBRUc7O0FBRUE7O0FBRUE7QUFDSTtBQUNBOztBQUVJO0FBRUg7QUFDRztBQUNBOztBQUVBO0FBRUg7QUFFSjtBQUNHO0FBQ0E7QUFDSTtBQUNBO0FBRUg7QUFDRztBQUNBO0FBRUg7QUFFSjs7QUFFRDtBQUVIO0FBRUo7O0FBRUQ7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFDSDs7QUFFRzs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7O0FBRUk7O0FBRUk7QUFDQTs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFDSjs7QUFFRztBQUVIO0FBR0o7QUFDRztBQUNBOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUE7O0FBRUk7QUFFSDtBQUVKO0FBRUo7O0FBRUQ7QUFDQTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7OztBQUlBOztBQUVJOztBQUVJO0FBRUg7O0FBRUc7QUFFSDtBQUVKOztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRzs7QUFFQTs7QUFFQTtBQUNJO0FBQ0E7QUFHSDs7QUFFRzs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjtBQUNEO0FBQ0E7O0FBRUk7O0FBRUk7QUFFSDs7QUFFRzs7QUFFQTtBQUNJO0FBQ0E7QUFDSDtBQUNHO0FBQ0E7QUFDSDtBQUVKOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFQTtBQUdIO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBRUg7O0FBRUc7QUFDQTs7QUFFQTtBQUNBO0FBQ0k7QUFDQTtBQUNBOztBQUVJO0FBRUg7O0FBRUc7QUFFSDs7QUFFRDs7QUFFSTtBQUVIOztBQUVHO0FBRUg7QUFFSjs7QUFFRDs7QUFFSTs7QUFFQTs7QUFFQTtBQUVIO0FBRUo7QUFDSjtBQUdKO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVJOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBR0g7QUFFSjtBQUVKO0FBRUo7O0FBRUQ7OztBQUdBOztBQUVJOztBQUVBOztBQUVJOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBRUg7QUFFSjtBQUVKOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUVIOztBQUVEOzs7Ozs7QUFNQTs7QUFFSTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJO0FBQ0k7QUFDQTtBQUNIO0FBQ0c7QUFDQTtBQUVIO0FBRUo7O0FBRUc7QUFDSDtBQUNKOztBQUVEOzs7QUFHQTs7QUFFSTtBQUVIOztBQXBxQlk7Ozs7Ozs7Ozs7QUNBakI7O0FBRUE7QUFDSTs7QUFFQTs7QUFFSTtBQUNJO0FBQ0E7QUFGRzs7QUFLUDtBQUNJO0FBQ0E7QUFGRTs7QUFLTjtBQUNJO0FBQ0E7QUFGTTs7QUFLVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBOztBQUtKO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7O0FBS0o7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBO0FBSUo7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTs7QUFLSjtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7QUFJSDtBQUNJO0FBQ0E7QUFGRDtBQUlIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRkE7QUFJSjtBQUNJO0FBQ0E7QUFGQTtBQUlKO0FBQ0k7QUFDQTtBQUZBOztBQUtKO0FBQ0k7QUFDQTtBQUZEO0FBSUg7QUFDSTtBQUNBO0FBRkQ7O0FBcEtLOztBQTZLWjtBQUNBOztBQUVJO0FBRUg7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0k7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTtBQUVIOztBQUVEOztBQUVBOztBQUVBOztBQUVJOztBQUVBOztBQUVBOztBQUVBO0FBRUg7O0FBRUQ7QUFDQTs7QUFFQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0k7QUFDQTtBQUVIO0FBRUo7O0FBR0Q7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFFSDs7QUFFRDs7QUFFQTs7QUFFQTtBQUNIOztBQUVEOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUk7O0FBRUE7O0FBRUE7QUFFSDs7QUF4VEk7Ozs7Ozs7Ozs7QUNGVDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWUTs7QUFhWjtBQUNBOztBQUlBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUk7QUFFSDtBQTlCSTs7Ozs7Ozs7OztBQ0FUO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZROztBQWFaO0FBQ0E7O0FBSUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNIOztBQUVEOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUk7QUFFSDtBQXpDSTs7Ozs7Ozs7OztBQ0FUO0FBQ0E7QUFDSTs7QUFFQTs7QUFFSTs7QUFFSTtBQUNBOztBQUhHOztBQU9QO0FBQ0k7QUFDQTtBQUZTOztBQVRMOztBQWdCWjtBQUNBOztBQUVJOztBQUVBOztBQUVJO0FBRUg7O0FBRUc7O0FBRUE7QUFFSDs7QUFFRDs7QUFHQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFFSDs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7O0FBRUk7QUFFSDs7QUFFRztBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFFSDs7QUFFRDtBQUNBOztBQUVBOztBQUVBOzs7QUFHQTs7QUFFSTs7QUFFQTtBQUNBOztBQUVJOztBQUVJOztBQUVBO0FBRUg7O0FBR0Q7QUFDQTs7QUFFSTtBQUVIOztBQUVEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFSTs7QUFFSTs7QUFFSTs7QUFFQTtBQUVIO0FBQ0o7QUFDSjs7QUFFRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUVIOztBQUdEOztBQUVBO0FBQ0E7O0FBRUk7QUFFSDs7QUFFRDtBQUNBOztBQUVBO0FBRUg7QUFDRztBQUNBOztBQUVBOztBQUVJO0FBRUg7QUFFSjtBQUVKOztBQUdEOztBQUVJO0FBQ0k7O0FBRUE7QUFDSDs7QUFFRDtBQUlIOztBQUVEOzs7QUFHQTs7QUFFSTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFSTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVJO0FBRUg7O0FBRUQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBRUg7QUFHSjs7QUFFRDs7O0FBR0E7O0FBRUk7O0FBRUE7QUFDQTs7QUFFQTs7QUFFSTs7QUFFSTs7QUFFQTtBQUVIO0FBRUo7O0FBRUQ7O0FBRUk7O0FBRUE7QUFFSDs7QUFFRzs7QUFFQTtBQUVIO0FBRUo7QUE3Ukk7Ozs7Ozs7Ozs7QUNEVDtBQUNBOztBQUVBO0FBQ0k7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRk07O0FBS1Y7QUFDSTtBQUNBO0FBRk87O0FBS1g7QUFDSTtBQUNBO0FBRlE7O0FBS1o7QUFDSTtBQUNBO0FBRks7O0FBS1Q7O0FBRUE7O0FBRUE7O0FBRUE7O0FBS0o7QUFDQTs7QUFJQTtBQUNBOztBQUVJO0FBQ0k7QUFDSDs7QUFHRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNIOztBQUVEOztBQUVJOztBQUVJOztBQUVJO0FBRUg7QUFFSjs7QUFFRzs7QUFFSDtBQUVKOztBQXJGSSIsInNvdXJjZXNDb250ZW50IjpbInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgY2h1UGFpOiBmdW5jdGlvbiAocGxheWVyKXtcblxuICAgICAgICAvL+acieS6uuimgemjjlxuICAgICAgICBpZihjb20uZ2V0V2luZFBsYXllck51bSE9LTEpe1xuXG4gICAgICAgICAgICBpZihjb20uaXNQbGF5ZXJQYXJ0eShjb20uX2N1cnJlbnRQbGF5ZXIsY29tLmdldFdpbmRQbGF5ZXJOdW0pKXtcbiAgICAgICAgICAgICAgICAvL+mYn+WPiyAg5LiN5Ye6XG4gICAgICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIoKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29tLnNvcnRQYWkocGxheWVyLnNob3VQYWkpXG5cbiAgICAgICAgdmFyIGlzRW5hYmxlWHVhblpoYW4gPSBjb20uY2hlY2tFbmFibGVYdWFuWmhhbigpO1xuXG4gICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW4hPTApe1xuICAgICAgICAgICAgLy/lj6/ku6XlrqPmiJhcbiAgICAgICAgICAgIC8v6K6+572u5a6j5oiYXG4gICAgICAgICAgICBwbGF5ZXIuaXNYdWFuWmhhbiA9IHRydWU7XG5cbiAgICAgICAgICAgIC8v5a6j5oiYIOS/ruaUueWFqOWxgOWPmOmHj1xuICAgICAgICAgICAgY29tLmlzWHVhblpoYW4gPSB0cnVlO1xuXG4gICAgICAgICAgICBpZihpc0VuYWJsZVh1YW5aaGFuPT0xKXtcblxuICAgICAgICAgICAgICAgIHBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIuWuo+aImFwiO1xuXG4gICAgICAgICAgICB9ZWxzZSBpZihpc0VuYWJsZVh1YW5aaGFuPT0yKXtcblxuICAgICAgICAgICAgICAgIHBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIui3n1wiO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKChjb20uZ2V0V2luZFBsYXllck51bT09Y29tLl9jdXJyZW50UGxheWVyKSB8fCBjb20uX2xhc3RQYWk9PW51bGx8fGNvbS5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICB0aGlzLmZpcnN0Q2h1UGFpKHBsYXllcik7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgcGFpcyA9IHRoaXMuZ2V0RW5hYmxlQ2h1UGFpKHBsYXllcik7XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKHBhaXMpO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOesrOS4gOS4quWHuueJjFxuICAgICAqL1xuICAgIGZpcnN0Q2h1UGFpOmZ1bmN0aW9uKHBsYXllcil7XG5cbiAgICAgICAgdmFyIHdlaWdodEFyciA9IHRoaXMuYW5hbHl6ZShwbGF5ZXIuc2hvdVBhaSk7XG5cbiAgICAgICAgLy/lh7rkuIDkuKrmnIDlsI/mnYPlgLznmoTnu4TlkIhcbiAgICAgICAgaWYod2VpZ2h0QXJyLmxlbmd0aD4wKXtcblxuICAgICAgICAgICAgdmFyIHBhaXMgPSBwbGF5ZXIuc2hvdVBhaS5zcGxpY2Uod2VpZ2h0QXJyWzBdWzFdLHdlaWdodEFyclswXVsyXSk7XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKHBhaXMpO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqHnrpflh7rlj6/ku6Xlh7rnmoTniYxcbiAgICAgKi9cbiAgICBnZXRFbmFibGVDaHVQYWk6ZnVuY3Rpb24ocGxheWVyKXtcblxuICAgICAgICAgICAgdmFyIHdlaWdodEFyciA9IHRoaXMuYW5hbHl6ZShwbGF5ZXIuc2hvdVBhaSk7XG5cbiAgICAgICAgICAgIHZhciBsYXN0V2VpZ2h0ID0gY29tLmNvbnZlcnRWYWx1ZU1vcmUoY29tLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgLy/opoHlh7rnmoTniYxcbiAgICAgICAgICAgIHZhciBwYWlzID0gbnVsbDtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHdlaWdodEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciB3ZWlnaHQgPSB3ZWlnaHRBcnJbaV1bMF07XG5cbiAgICAgICAgICAgICAgICBpZih3ZWlnaHQ+bGFzdFdlaWdodCAmJiAoKChjb20uX2xhc3RQYWkubGVuZ3RoPT0xICYmICh3ZWlnaHQ8PTE4MCB8fCB3ZWlnaHQ+MTYwMCkpfHxjb20uX2xhc3RQYWkubGVuZ3RoPjEpKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/kuIrkuIDlvKDniYzmmK/lkKbmmK/pmJ/lj4vlh7rnmoRcbiAgICAgICAgICAgICAgICAgICAgaWYoY29tLmlzUGxheWVyUGFydHkoY29tLl9jdXJyZW50UGxheWVyLGNvbS5sYXN0UGxheWVyTnVtKSAmJiAoKGNvbS5fbGFzdFBhaS5sZW5ndGg9PTEgJiYgd2VpZ2h0PjE0MCkgfHwgKGNvbS5fbGFzdFBhaS5sZW5ndGg+MSAmJiB3ZWlnaHQ+MTQwMCkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN5oC86Zif5Y+LXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wkp+S6jkHmiJbogIXlpKfkuo7lr7lBIOS4jeWHulxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Ye654mMXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWlzID0gcGxheWVyLnNob3VQYWkuc3BsaWNlKHdlaWdodEFycltpXVsxXSx3ZWlnaHRBcnJbaV1bMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcGFpcztcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYzliqjkvZxcbiAgICAgKi9cbiAgICAvLyBjaHVQYWlBY3Rpb246ZnVuY3Rpb24ocGFpcyl7XG5cbiAgICAvLyAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgLy8gICAgIC8vIC8v5riF56m6bGFzdFBhaVxuICAgIC8vICAgICAvLyBpZihjb20uX2xhc3RQYWkhPW51bGwpe1xuICAgIC8vICAgICAvLyAgICAgLy/muIXnqbrkuIrlrrblh7rnmoTniYwg5YeG5aSH6K6w5b2V5q2k5qyh5Ye654mMXG4gICAgLy8gICAgIC8vICAgICBjb20uX2xhc3RQYWkuc3BsaWNlKDAsY29tLl9sYXN0UGFpLmxlbmd0aCk7XG5cbiAgICAvLyAgICAgLy8gfWVsc2Uge1xuXG4gICAgLy8gICAgIC8vICAgICBjb20uX2xhc3RQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgIC8vICAgICAvLyB9XG5cbiAgICAvLyAgICAgLy/lsZXnpLpcbiAgICAvLyAgICAgZm9yKHZhciBqID0gMDtqPHBhaXMubGVuZ3RoO2orKyl7XG5cbiAgICAvLyAgICAgICAgIHZhciBub2RlID0gcGFpc1tqXTtcblxuICAgIC8vICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgIC8vICAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihjYy5wKHNpemUud2lkdGgvMiArIGoqMzAsc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgLy8gICAgICAgICAvL+abtOaWsOWIsGxhc3RQYWlcbiAgICAvLyAgICAgICAgIC8vIGNvbS5fbGFzdFBhaS5wdXNoKHBhaXNbal0pO1xuXG4gICAgLy8gICAgIH1cblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDmjpLluo/mnYPlgLzliJfooahcbiAgICAgKi9cbiAgICBzb3J0V2VpZ2h0QXJyOmZ1bmN0aW9uKHdlaWdodEFycil7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPHdlaWdodEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgZm9yKHZhciBqID0gaTtqPHdlaWdodEFyci5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodEFycltpXVswXT53ZWlnaHRBcnJbal1bMF0pe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wQXJyID0gd2VpZ2h0QXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodEFycltpXSA9IHdlaWdodEFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnJbal0gPSB0ZW1wQXJyO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWJlOmZpOS4jeWQiOeQhueahOadg+WAvFxuICAgICAqL1xuICAgIHRyaW06ZnVuY3Rpb24od2VpZ2h0QXJyKXtcblxuICAgICAgICB2YXIgdHJpbVdlaWdodEFyciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGlmKHdlaWdodEFyciE9bnVsbCAmJiB3ZWlnaHRBcnIubGVuZ3RoPjApe1xuXG4gICAgICAgICAgICB2YXIgaW5kZXhBcnIgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gd2VpZ2h0QXJyLmxlbmd0aC0xO2k+PTA7aS0tKXtcblxuICAgICAgICAgICAgICAgIGlmKGluZGV4QXJyLmluZGV4T2Yod2VpZ2h0QXJyW2ldWzFdKT09LTEpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5aSn5LqO562J5LqO5pyA5bCP55qE54K4IOS4jeaLhuW8gOeUqCAvL+WvuemsvOS5n+ayoeiAg+iZkeaLhuW8gFxuICAgICAgICAgICAgICAgICAgICBpZih3ZWlnaHRBcnJbaV1bMF0+MTYwMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IHdlaWdodEFycltpXVsxXTtqPCh3ZWlnaHRBcnJbaV1bMV0gKyB3ZWlnaHRBcnJbaV1bMl0pO2orKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRleEFyci5wdXNoKGopO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRyaW1XZWlnaHRBcnIucHVzaCh3ZWlnaHRBcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNvcnRXZWlnaHRBcnIodHJpbVdlaWdodEFycik7XG5cbiAgICAgICAgcmV0dXJuIHRyaW1XZWlnaHRBcnI7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6h566X5Y+v5Lul5Ye654mM55qE5omA5pyJ5p2D5YC8XG4gICAgICovXG4gICAgYW5hbHl6ZTpmdW5jdGlvbihwYWlzKXtcblxuICAgICAgICB2YXIgd2VpZ2h0QXJyID0gbmV3IEFycmF5KCk7Ly9b5p2D5YC8LOW8gOWni+S4i+aghyzplb/luqZdXG5cbiAgICAgICAgLy8gdmFyIGxhc3RMZW5ndGggPSBjb20uX2xhc3RQYWkubGVuZ3RoO1xuXG4gICAgICAgIGlmKHBhaXMhPW51bGwpe1xuXG4gICAgICAgICAgICAvLyBmb3IodmFyIGogPSAwO2o8cGFpcy5sZW5ndGg7aisrKXtcbiAgICAgICAgICAgIC8vICAgICBjYy5sb2cocGFpc1tqXS5fbmFtZSk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxwYWlzLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKFwiaTpcIitpKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cod2VpZ2h0QXJyLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKHBhaXNbaV0uX25hbWUpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGYgPSBwYWlzW2ldLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGwgPSBwYXJzZUludChwYWlzW2ldLl9uYW1lLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICBpZihmID09IFwiRVwiKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+msvCDljZXlvKBcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydENsb3duVmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IGkrMTtcblxuICAgICAgICAgICAgICAgICAgICBpZihqPHBhaXMubGVuZ3RoKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYyID0gcGFpc1tqXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGYyID09IFwiRVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WtmOWCqOWvuemsvOeahOadg+WAvFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaisxKSksaSwyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmKGxhc3RMZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7nljZXlvKDnmoTmnYPlgLzkv53lrZhcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlKGwpLGksMV0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGogPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBpc0NvbXBvc2UgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBkb3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGorKztcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoKGkraik8cGFpcy5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGwyID0gcGFyc2VJbnQocGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBvc2UgPSBsPT1sMjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBpc0RpZmZlcmVudEZpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAvL+WvueiKsTXnmoTlpITnkIZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihsPT01ICYmIGo9PTEpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBmMiA9IHBhaXNbaStqXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgY29kZSA9IGYuY2hhckNvZGVBdCgpK2YyLmNoYXJDb2RlQXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAvL+S4jeaYr+Wvuem7kTXnuqI1XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIGlmKGNvZGUhPTE5NiAmJiBjb2RlIT0xOTgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICBpc0RpZmZlcmVudEZpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGlzQ29tcG9zZSAmJiAoIShsYXN0TGVuZ3RoPT0xICYmIGo9PTEpIHx8IChsPT01ICYmICFpc0RpZmZlcmVudEZpdmUpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNDb21wb3NlKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWkmuW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnIucHVzaChbY29tLmNvbnZlcnRWYWx1ZU1vcmUocGFpcy5zbGljZShpLGkraisxKSksaSxqKzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfXdoaWxlKGlzQ29tcG9zZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYobCE9NSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLzXnibnmrorkuI3og73nnIHnlaXov5nkuKrov4fnqItcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y676Zmk6YeN5aSN5p2D5YC86K6h566XXG4gICAgICAgICAgICAgICAgICAgICAgICBpID0gaStqLTE7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNvcnRXZWlnaHRBcnIod2VpZ2h0QXJyKTtcblxuICAgICAgICByZXR1cm4gdGhpcy50cmltKHdlaWdodEFycik7XG5cbiAgICB9LFxuXG5cbiAgICBcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgcGxheWVyTnVtIDogNCwvL+eOqeWutuaVsFxuXG4gICAgcGFpTnVtIDogMzIsLy/niYzmlbBcblxuICAgIHJvdW5kczowLC8v5Zue5ZCI5pWwXG5cbiAgICBwbGF5ZXJzOiBudWxsLC8v5omA5pyJ546p5a6255qE5a655ZmoXG5cbiAgICBfbGFzdFBhaTpudWxsLC8v5LiK5a625Ye655qE54mMXG5cbiAgICAvL19maXJzdFBsYXllcjowLC8v56ys5LiA5Liq5Ye654mM55qE546p5a62XG5cbiAgICBfY3VycmVudFBsYXllcjowLC8v5b2T5YmN5Ye654mM55qE546p5a62XG5cbiAgICAvL19idUNodU51bTowLC8v6K6w5b2V5LiN5Ye654mM5qyh5pWwXG5cbiAgICBsYXN0UGxheWVyTnVtOjAsLy/mnIDlkI7lh7rniYznmoTnjqnlrrZcblxuICAgIHdpblBsYXllcjpudWxsLC8v6K6w5b2V6IOc5Ye66ICF5bqP5Y+3XG5cbiAgICBwYXJ0eVBsYXllcnM6bnVsbCwvL+iusOW9leWQjOS4gOS8meWPr+Wuo+aImOeahOeOqeWutuaVsOe7hFxuXG4gICAgaXNYdWFuWmhhbjpmYWxzZSwvL+aYr+WQpuWuo+aImFxuXG4gICAgbnVtOjAsLy/orrDmlbBcblxuICAgIGdldFdpbmRQbGF5ZXJOdW06LTEsLy/orrDlvZXnu5npo47nmoTorrDmlbBcblxuICAgIC8vdm90ZUdldFdpbmROdW06MCwvL+WPguS6juaKleelqOS6uuaVsFxuXG4gICAgc2V0Rmlyc3RQbGF5ZXI6ZnVuY3Rpb24oZmlyc3RQbGF5ZXIpe1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSBmaXJzdFBsYXllcjtcblxuICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uY3VycmVudFRhZy5zZXRWaXNpYmxlKHRydWUpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOajgOafpeeOqeWutu+8jOWJlOmZpOiDnOWHuuiAhe+8jOe7p+e7rea4uOaIj1xuICAgICAqL1xuICAgIGNoZWNrTmV4dFBsYXllck5vV2lubmVyOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5udW0gPSB0aGlzLm51bSArMTtcblxuICAgICAgICAvL+aOp+WItumAkuW9kua3seW6plxuICAgICAgICBpZih0aGlzLndpblBsYXllci5sZW5ndGg8dGhpcy5wbGF5ZXJOdW0pe1xuXG4gICAgICAgICAgICBpZih0aGlzLm51bSV0aGlzLnBsYXllck51bT09MCl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJvdW5kcyA9IHRoaXMucm91bmRzICsgMTtcblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSAodGhpcy5fY3VycmVudFBsYXllcisxKSAlIHRoaXMucGxheWVyTnVtO1xuXG4gICAgICAgICAgICBpZih0aGlzLndpblBsYXllci5pbmRleE9mKHRoaXMuX2N1cnJlbnRQbGF5ZXIpIT0tMSl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTmV4dFBsYXllck5vV2lubmVyKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vIGNjLmxvZyhcImNoZWtjIHBsYXllciBpbmRleDpcIit0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDkuIvkuIDkuKrnjqnlrrZcbiAgICAgKi9cbiAgICBuZXh0UGxheWVyOmZ1bmN0aW9uKGxhc3RQYWksbWVzc2FnZSl7XG5cbiAgICAgICAgICAgIC8v6K6+572u6buY6K6k5YC8XG4gICAgICAgICAgICAvLyBnZXRXaW5kTnVtID0gZ2V0V2luZE51bXx8LTE7XG5cbiAgICAgICAgICAgIC8v5riF55CG5b2T5YmN546p5a626K6w5b2V54mMXG4gICAgICAgICAgICB0aGlzLmNsZWFyUmVjb3JkUGxheWVyUGFpKCk7XG5cbiAgICAgICAgICAgIC8v5b2T5YmN6LCD55So6K+l5Ye95pWw55qE546p5a626YOo5YiGXG4gICAgICAgICAgICBpZihsYXN0UGFpPT1udWxsfHxsYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9idUNodU51bSA9IHRoaXMuX2J1Q2h1TnVtICsgMTtcbiAgICAgICAgICAgICAgICAvL+S4jeWHulxuICAgICAgICAgICAgICAgIGlmKG1lc3NhZ2U9PW51bGwpe1xuXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIuS4jeWHulwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5nZXRXaW5kUGxheWVyTnVtIT0tMSl7XG4gICAgICAgICAgICAgICAgICAgIC8v57uZ6aOOXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIue7memjjlwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IG1lc3NhZ2U7XG5cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAvL+a4hemZpOimgemjjuiusOW9lVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0V2luZFBsYXllck51bSA9IC0xO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fYnVDaHVOdW0gPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFBsYXllck51bSA9IHRoaXMuX2N1cnJlbnRQbGF5ZXI7XG4gICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICAgICAgLy/otYvlgLxcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UGFpID0gbGFzdFBhaTtcbiAgICAgICAgICAgICAgICAvL+WxleekulxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0xhc3RQYWkoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIGlzUGxheWVyV2luID0gdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLnNob3VQYWkubGVuZ3RoID09IDAgJiYgdGhpcy53aW5QbGF5ZXIuaW5kZXhPZih0aGlzLl9jdXJyZW50UGxheWVyKT09LTE7XG5cbiAgICAgICAgICAgIGlmKGlzUGxheWVyV2luKXtcblxuICAgICAgICAgICAgICAgIC8vY2MubG9nKFwid3AgbGVuZ2h0OlwiK3RoaXMud2luUGxheWVyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLndpblBsYXllci5wdXNoKHRoaXMuX2N1cnJlbnRQbGF5ZXIpO1xuXG4gICAgICAgICAgICAgICAgLy90aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uc2hvdVBhaU51bS5zdHJpbmcgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwiTk8uIFwiK3RoaXMud2luUGxheWVyLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHZhciBwYXJ0eSA9IHRoaXMucGFydHlQbGF5ZXJzLmluZGV4T2YodGhpcy5fY3VycmVudFBsYXllcikhPS0xO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlzR2FtZU92ZXIgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGFydHlQbGF5ZXJzLmxlbmd0aCA9PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgLy8xOjNcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcnR5KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+M6ay86IOcXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0dhbWVPdmVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih0aGlzLndpblBsYXllci5sZW5ndGg9PTMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/msqHprLznjqnlrrbog5xcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0aGlzLndpblBsYXllci5pbmRleE9mKHRoaXMucGFydHlQbGF5ZXJzWzBdKT09LTE7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLzI6MlxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMud2luUGxheWVyLmxlbmd0aD09Mil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0aGlzLmlzUGxheWVyUGFydHkodGhpcy53aW5QbGF5ZXJbMF0sdGhpcy53aW5QbGF5ZXJbMV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMud2luUGxheWVyLmxlbmd0aD09Myl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzR2FtZU92ZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGlzR2FtZU92ZXIpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8v5riF55CG54mM5qGMXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJykuZ2V0Q29tcG9uZW50KCdHYW1lJykuZ2FtZUxhYmVsLnN0cmluZyA9IFwi5ri45oiP57uT5p2fXCJcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vKioqKioqKioqKiDlvZPliY3osIPnlKjor6Xlh73mlbDnmoTnjqnlrrbpg6jliIbnu5PmnZ8gKioqKioqKioqKioqXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/kuIvkuIDkuKrnjqnlrrbpg6jliIZcbiAgICAgICAgICAgIC8v5LiL5LiA5Liq5ZCI5rOV55qE5Ye654mM6ICFXG4gICAgICAgICAgICAvL3RoaXMuX2N1cnJlbnRQbGF5ZXIgPSAodGhpcy5fY3VycmVudFBsYXllcisxKSV0aGlzLnBsYXllck51bTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tOZXh0UGxheWVyTm9XaW5uZXIoKTtcblxuICAgICAgICAgICAgLy9jYy5sb2codGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5jdXJyZW50VGFnLnNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIlwiO1xuXG5cbiAgICAgICAgICAgIC8v5LiJ5Liq5LiN5Ye677yM6K+05piO5Y+I6L2u5Yiw5LiK5qyh5Ye654mM55qE546p5a62IOW9k+acieiDnOWHuuiAheWQju+8jOWIpOaWreeahOaVsOWtl+imgeWHj+WwkVxuICAgICAgICAgICAgLy8gaWYodGhpcy5fYnVDaHVOdW09PSgzLXRoaXMud2luUGxheWVyLmxlbmd0aCkpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLmxhc3RQbGF5ZXJOdW09PXRoaXMuX2N1cnJlbnRQbGF5ZXIpe1xuXG4gICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFBhaSA9IG51bGw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGlmKGlzUGxheWVyV2luKXtcblxuICAgICAgICAgICAgICAgIC8v6K6w5b2V5LiL5LiA5Liq5Ye654mM6ICF77yM5Y+K6KaB6aOO6ICFXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRXaW5kUGxheWVyTnVtID0gdGhpcy5fY3VycmVudFBsYXllcjtcblxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGdldFdpbmROdW0gPSB0aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgICAgICAgICAgLy/mm7TmlrDkuIvkuIDkuKrlh7rniYzogIUrMSDlh7rmib7kuIvkuIvlrrbopoHpo45cbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrTmV4dFBsYXllck5vV2lubmVyKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/pgJrnn6Xnjqnlrrblj6/ku6Xlh7rniYzkuoZcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICBcblxuICAgIH0sXG4gICAgICAgIFxuICAgIC8qKlxuICAgICAqIOajgOafpeWHuueJjOeahOWQiOazleaAp1xuICAgICAqL1xuICAgIGNoZWNrQ2h1UGFpOmZ1bmN0aW9uKHh1YW5QYWkscCl7XG5cbiAgICAgICAgdmFyIGlzQ3VycmVudCA9IHA9PXRoaXMuX2N1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgLy8gaXNDdXJyZW50ID0gdHJ1ZTtcblxuICAgICAgICAvL+aYr+WQpuivpeWHuueJjFxuICAgICAgICBpZighaXNDdXJyZW50KXtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/liKTmlq3pgInkuK3nmoTniYxcbiAgICAgICAgaWYoeHVhblBhaSE9bnVsbCl7XG5cbiAgICAgICAgICAgIGlmKCh0aGlzLmdldFdpbmRQbGF5ZXJOdW09PXApIHx8IHRoaXMuX2xhc3RQYWk9PW51bGwgfHwgdGhpcy5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhaVpodW8oKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VDaGVjayh4dWFuUGFpKTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RMZW5ndGggPSB0aGlzLl9sYXN0UGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmKGxhc3RMZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgICAgICAvL+WNlVxuICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0gMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v54K4IOWkp+S6jjE2MDDkuLrngrhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlPjE2MDAgJiYgdmFsdWU+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGxhc3RMZW5ndGggPj0gMiAmJiBsYXN0TGVuZ3RoIDwgNSl7XG4gICAgICAgICAgICAgICAgICAgIC8v5a+5XG4gICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aD49Mil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peWHuuWvue+8jOS5n+WPr+S7peWHuueCuFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3og73lh7rljZVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOe7hOWQiOajgOafpVxuICAgICAqL1xuICAgIGNvbXBvc2VDaGVjazpmdW5jdGlvbihhcnIpe1xuXG4gICAgICAgIHZhciBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXG4gICAgICAgIGlmKGxlbmd0aD09MSl7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZSBpZihsZW5ndGg8NSl7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgIHZhciBpc0Nsb3duID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxsZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAvL+msvOaYr+S4gOS4queJueauiueahOe7hOWQiFxuICAgICAgICAgICAgICAgIGlmKGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMCwxKT09XCJFXCIpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPquacieS4pOW8oCDkuJTpg73mmK/prLxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aCA9PTIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3duID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ov5vliLDov5nph4zvvIzov5nlvKDniYzkuI3mmK/lpKflsI/prLzvvIzlh7rnjrDkuI3lkIzmnYPlgLwg6L+U5ZueZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDbG93bil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlMiA9IGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUhPXZhbHVlMil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lpoLmnpzliLDov5nph4wgaXNDbG93biDkuLrnnJ/vvIzlj4rmnInprLzlrZjlnKjvvIzkvYblpJrlvKDniYzlj6rmnInkuIDkuKrprLzvvIzor7TmmI7niYznu4TlkIjkuI3lr7lcbiAgICAgICAgICAgIHJldHVybiAhaXNDbG93bjtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIFxuICAgICAqIOS4jeWMheaLrOWkp+Wwj+msvFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZTpmdW5jdGlvbihsKXtcblxuICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICByZXR1cm4gKDEzK2wpKjEwO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgcmV0dXJuIGwqMTA7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWkp+Wwj+msvOadg+WAvOi9rOaNoiBcbiAgICAgKiBcbiAgICAgKi9cbiAgICBjb252ZXJ0Q2xvd25WYWx1ZTpmdW5jdGlvbihsKXtcbiAgICAgICAgLy/lpKfprLwgbCA9IDAgIOWwj+msvCBsPTFcbiAgICAgICAgLy/lsI/prLzopoHlpKfkuo7mnIDlpKfnmoTljZVcbiAgICAgICAgcmV0dXJuICgxMyszKzItbCkqMTA7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIOWkmuW8oFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZU1vcmU6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgd2VpZ2h0ID0gMDtcblxuICAgICAgICBpZihhcnI9PW51bGwgfHwgYXJyLmxlbmd0aCA9PSAwIHx8ICF0aGlzLmNvbXBvc2VDaGVjayhhcnIpKXtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBmID0gYXJyWzBdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICBpZihmID09IFwiRVwiKXtcbiAgICAgICAgICAgICAgICAvL+msvFxuICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzKzMrMi1sO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzK2w7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ID0gbDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/nibnkvotcbiAgICAgICAgICAgIGlmKGFyci5sZW5ndGg9PTIpe1xuXG4gICAgICAgICAgICAgICAgaWYobCA9PSAxMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDIpKzE7Ly/mr5Tlr7kz5aSnMVxuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobCA9PSA1KXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmLmNoYXJDb2RlQXQoKSthcnJbMV0uX25hbWUuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09IDE5Nil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuem7kTVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSszOy8v5q+U5a+557qiNeWkpzFcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodmFsdWUgPT0gMTk4KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+557qiNVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzIvL+avlOWvuemsvOWkpzFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihmID09IFwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMTsvL+avlOWbm+S4qjPlpKcxXG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jYy5sb2coXCJ3ZWlnaHQ6XCIrd2VpZ2h0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodCAqIE1hdGgucG93KDEwLGFyci5sZW5ndGgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaOkuW6j+aWueazlVxuICAgICAqL1xuICAgIHNvcnRQYWk6ZnVuY3Rpb24oc3ByaXRlQXJyKXtcblxuICAgICAgICAvL2NjLmxvZyhzcHJpdGVBcnIpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTxzcHJpdGVBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGkrMTtqPHNwcml0ZUFyci5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMSA9IHNwcml0ZUFycltpXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMiA9IHNwcml0ZUFycltqXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIC8vY2MubG9nKG5hbWUxLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIm5hbWUxOlwiK25hbWUxK1wiIG5hbWUyOlwiK25hbWUyKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYocGFyc2VJbnQobmFtZTEuc3Vic3RyaW5nKDEpKT5wYXJzZUludChuYW1lMi5zdWJzdHJpbmcoMSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIi1uYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltqXSA9IHRlbXA7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PW5hbWUyLnN1YnN0cmluZygxKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUxID0gbmFtZTEuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZTIgPSBuYW1lMi5zdWJzdHJpbmcoMCwxKS5jaGFyQ29kZUF0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8155qE54m55q6K5o6S5bqPXG4gICAgICAgICAgICAgICAgICAgIGlmKG5hbWUxLnN1YnN0cmluZygxKT09XCI1XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miorlr7npu5E15oiW5a+557qiNeaUvuWIsOS4gOi1t1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miornuqLmoYPkuI7ojYnoirHkupLmjaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPT05OSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMSA9IDk4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihjb2RlMT09OTgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5OTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMj09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTIgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTI9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoY29kZTE+Y29kZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHNwcml0ZUFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrlnKjniYzmoYzkuIpcbiAgICAgKi9cbiAgICBzaG93TGFzdFBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIC8vIGNjLmxvZyhcInBsYXllcjpcIit0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgICAgICBpZih0aGlzLl9sYXN0UGFpIT1udWxsICYmIHRoaXMuX2xhc3RQYWkubGVuZ3RoICE9MCl7XG5cbiAgICAgICAgICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgICAgICAgICAgLy/lsZXnpLpcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7ajx0aGlzLl9sYXN0UGFpLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9sYXN0UGFpW2pdO1xuXG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKFwibm9kZTpcIik7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgICAgIC8vbm9kZS5ydW5BY3Rpb24oY2Mucm90YXRlQnkoMCx0aGlzLl9jdXJyZW50UGxheWVyKi05MCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIG5vZGUxID0gY2MuaW5zdGFudGlhdGUobm9kZS5fcHJlZmFiLmFzc2V0KTtcblxuICAgICAgICAgICAgICAgIC8v6K6w5b2V5q+P5Zue5ZCI5Ye654mM55S75Zyo5aS05YOP5LiL6L65XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY3VycmVudFBsYXllciE9MCl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUxID0gY2MuaW5zdGFudGlhdGUobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhYmVsQm90dG9tTm9kZSA9IHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5ub2RlLmdldENoaWxkQnlOYW1lKCdMYWJlbEJvdHRvbScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsQm90dG9tTm9kZS5hZGRDaGlsZChub2RlMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLm5vZGUuYWRkQ2hpbGQobm9kZTEpO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vZGUxLnNldFNjYWxlKDAuMywwLjMpO1xuXG4gICAgICAgICAgICAgICAgICAgIG5vZGUxLnNldEFuY2hvclBvaW50KDAsMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgbm9kZTEuc2V0Q2FzY2FkZU9wYWNpdHlFbmFibGVkKGZhbHNlKTtcblxuICAgICAgICAgICAgICAgICAgICBub2RlMS5zZXRQb3NpdGlvbihjYy5wKC1sYWJlbEJvdHRvbU5vZGUud2lkdGgvMiArIGoqMTAsLWxhYmVsQm90dG9tTm9kZS5oZWlnaHQvMi1ub2RlMS5oZWlnaHQvMykpO1xuXG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5riF56m654mM5qGMXG4gICAgICovXG4gICAgY2xlYXJQYWlaaHVvOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy8gY2MubG9nKFwiY2xlYXJQYWlaaHVvXCIpO1xuXG4gICAgICAgIGlmKHRoaXMuX2xhc3RQYWkhPW51bGwgJiYgdGhpcy5fbGFzdFBhaS5sZW5ndGggIT0wKXtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHRoaXMuX2xhc3RQYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2xhc3RQYWlbaV07XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOa4heepuuiusOW9leWcqOeOqeWutuWktOWQkeS4i+eahOWHuueJjOiusOW9lVxuICAgICAqL1xuICAgIGNsZWFyUmVjb3JkUGxheWVyUGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGxhYmVsQm90dG9tTm9kZSA9IHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5ub2RlLmdldENoaWxkQnlOYW1lKCdMYWJlbEJvdHRvbScpO1xuXG4gICAgICAgIGxhYmVsQm90dG9tTm9kZS5yZW1vdmVBbGxDaGlsZHJlbigpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuWPr+S7peWuo+aImOaIlui3n+maj1xuICAgICAqIOS4jeWPr+S7pSAwXG4gICAgICog5a6j5oiYIDFcbiAgICAgKiDot5/pmo8gMlxuICAgICAqL1xuICAgIGNoZWNrRW5hYmxlWHVhblpoYW46ZnVuY3Rpb24ocE51bSl7XG5cbiAgICAgICAgaWYocE51bT09bnVsbCl7XG5cbiAgICAgICAgICAgIHBOdW0gPSB0aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyBjYy5sb2coXCJyb3VuZHM6XCIrdGhpcy5yb3VuZHMpO1xuICAgICAgICAvLyBjYy5sb2codGhpcy5wYXJ0eVBsYXllcnMpO1xuICAgICAgICAvLyBjYy5sb2cocE51bSk7XG4gICAgICAgIC8vIGNjLmxvZyh0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0pIT0tMSk7XG5cbiAgICAgICAgaWYodGhpcy5udW08PTQgJiYgdGhpcy5wYXJ0eVBsYXllcnMuaW5kZXhPZihwTnVtKSE9LTEpe1xuXG4gICAgICAgICAgICBpZih0aGlzLmlzWHVhblpoYW4pe1xuICAgICAgICAgICAgICAgIC8v6LefXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgLy/lrqPmiJhcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbmmK/lkIzkvJlcbiAgICAgKi9cbiAgICBpc1BsYXllclBhcnR5OmZ1bmN0aW9uKHBOdW0scE51bTIpe1xuXG4gICAgICAgIHJldHVybiAocE51bSAhPSBwTnVtMikgJiYgISgodGhpcy5wYXJ0eVBsYXllcnMuaW5kZXhPZihwTnVtKT09LTEpXih0aGlzLnBhcnR5UGxheWVycy5pbmRleE9mKHBOdW0yKT09LTEpKTtcblxuICAgIH0sXG5cblxufTtcbiIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcblxuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBwbGF5ZXI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFpQW46e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2FtZUxhYmVsOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cblxuICAgICAgICBhMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGIxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGI1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBiMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGIxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYzE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBkMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgLy8gZDEwOntcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgLy8gICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICAvLyB9LFxuICAgICAgICBkMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIEUwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBFMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgaW5pdDpmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5zdGFydEdhbWUoKTtcblxuICAgIH0sXG5cbiAgICBzdGFydEdhbWU6ZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBwYWlzID0gbmV3IEFycmF5KHNlbGYuYTEsc2VsZi5hMixzZWxmLmEzLHNlbGYuYTUsc2VsZi5hMTAsc2VsZi5hMTEsc2VsZi5hMTIsc2VsZi5hMTMsc2VsZi5iMSxzZWxmLmIyLHNlbGYuYjMsc2VsZi5iNSxzZWxmLmIxMCxzZWxmLmIxMSxzZWxmLmIxMixzZWxmLmIxMyxzZWxmLmMxLHNlbGYuYzIsc2VsZi5jMyxzZWxmLmM1LHNlbGYuYzEwLHNlbGYuYzExLHNlbGYuYzEyLHNlbGYuYzEzLHNlbGYuZDEsc2VsZi5kMixzZWxmLmQzLHNlbGYuZDUsc2VsZi5kMTAsc2VsZi5kMTEsc2VsZi5kMTIsc2VsZi5kMTMsc2VsZi5FMCxzZWxmLkUxKTtcblxuICAgICAgICAvL+aJk+S5seaVsOe7hFxuICAgICAgICBwYWlzLnNvcnQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgcmV0dXJuIDAuNSAtIE1hdGgucmFuZG9tKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHBwID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgY29tLnBsYXllcnMgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8Y29tLnBsYXllck51bTtqKyspe1xuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucGxheWVyKTtcblxuICAgICAgICAgICAgbm9kZS5nZXRDb21wb25lbnQoJ1BsYXllcicpLnNob3VQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgbm9kZS5nZXRDb21wb25lbnQoJ1BsYXllcicpLmN1cnJlbnRUYWcuc2V0VmlzaWJsZShmYWxzZSk7XG5cbiAgICAgICAgICAgIGNvbS5wbGF5ZXJzLnB1c2gobm9kZS5nZXRDb21wb25lbnQoJ1BsYXllcicpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy/liJ3lp4vljJblkIzkuIDkvJnmlbDnu4RcbiAgICAgICAgY29tLnBhcnR5UGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTxjb20ucGFpTnVtO2krKyl7XG5cbiAgICAgICAgICAgIHZhciBqID0gaSVjb20ucGxheWVyTnVtO1xuXG4gICAgICAgICAgICB2YXIgc3ByaXRlID0gY2MuaW5zdGFudGlhdGUocGFpcy5zaGlmdCgpKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnNbal0uc2hvdVBhaS5wdXNoKHNwcml0ZSk7XG5cbiAgICAgICAgICAgIGlmKHNwcml0ZS5fbmFtZSA9PSBcImExMVwiKXtcblxuICAgICAgICAgICAgICAgIGNvbS5zZXRGaXJzdFBsYXllcihqKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzcHJpdGUuX25hbWUuc3Vic3RyaW5nKDAsMSk9PVwiRVwiKXtcbiAgICAgICAgICAgICAgICAvL+iusOW9leWkp+Wwj+msvOWQjOS4gOS8mVxuICAgICAgICAgICAgICAgIGNvbS5wYXJ0eVBsYXllcnMucHVzaChqKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8v5Yid5aeL5YyW6IOc5Yip6ICF5pWw57uEXG4gICAgICAgIGNvbS53aW5QbGF5ZXIgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgXG5cbiAgICAgICAgY29tLnBsYXllcnNbMF0uaXNBSSA9IGZhbHNlO1xuICAgICAgICBjb20ucGxheWVyc1sxXS5pc0FJID0gdHJ1ZTtcbiAgICAgICAgY29tLnBsYXllcnNbMl0uaXNBSSA9IHRydWU7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzNdLmlzQUkgPSB0cnVlO1xuXG4gICAgICAgIC8v6K6+572u546p5a625L2N572uXG4gICAgICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgICAgICB2YXIgbm9kZTEgPSBjb20ucGxheWVyc1sxXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTEpO1xuXG4gICAgICAgIG5vZGUxLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC0obm9kZTEud2lkdGgvMyoyKSxzaXplLmhlaWdodC8zKjIpKTtcblxuICAgICAgICB2YXIgbm9kZTIgPSBjb20ucGxheWVyc1syXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTIpO1xuXG4gICAgICAgIG5vZGUyLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yLHNpemUuaGVpZ2h0IC0gKG5vZGUyLmhlaWdodC8zKjIpKSk7XG5cbiAgICAgICAgdmFyIG5vZGUzID0gY29tLnBsYXllcnNbM10ubm9kZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUzKTtcblxuICAgICAgICBub2RlMy5zZXRQb3NpdGlvbihjYy5wKChub2RlMy53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzMqMikpO1xuXG4gICAgICAgIC8vY2MubG9nKGNvbS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICBzZWxmLnBhaUFuLmdldENvbXBvbmVudCgnUGFpQW4nKS5wbGF5ZXIgPSBjb20ucGxheWVyc1swXTtcblxuICAgICAgICAvL+WmguaenOaYr+acuuWZqOS6uu+8jOaMh+WumuWHuueJjFxuICAgICAgICBpZihjb20uX2N1cnJlbnRQbGF5ZXIhPTAgJiYgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS5pc0FJKXtcblxuICAgICAgICAgICAgY29tLnJvdW5kcyA9IDE7XG5cbiAgICAgICAgICAgIGNvbS5wbGF5ZXJzW2NvbS5fY3VycmVudFBsYXllcl0udG9nZ2xlKCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvcih2YXIgbiA9IDA7bjxwcC5sZW5ndGg7bisrKXtcblxuICAgICAgICAvLyAgICAgc2VsZi5wbGF5ZXIwLmdldENvbXBvbmVudCgnUGxheWVyJykuU2hvdVBhaSA9IHBwWzBdO1xuXG4gICAgICAgIC8vIH1cbiAgICB9LFxuXG4gICAgZXhpdDpmdW5jdGlvbigpe1xuXG4gICAgICAgIGNjLmdhbWUuZW5kKCk7XG5cbiAgICB9LFxuXG4gICAgcmVzdGFydDpmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuc3RhcnRHYW1lKCk7XG5cbiAgICAgICAgY29tLl9sYXN0UGFpID0gbnVsbFxuXG4gICAgICAgIGNjLmdhbWUucmVzdGFydCgpO1xuXG4gICAgfSxcblxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgY2xvc2U6ZnVuY3Rpb24oKXtcblxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJsYXVuY2hcIik7XG5cbiAgICB9LFxufSk7XG4iLCJjYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgc3RhcnRHYW1lOmZ1bmN0aW9uICgpe1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcIm1haW5cIik7XG4gICAgfSxcblxuICAgIGluZm86ZnVuY3Rpb24oKXtcblxuICAgICAgICBjYy5kaXJlY3Rvci5sb2FkU2NlbmUoXCJpbmZvXCIpO1xuXG4gICAgfSxcblxuICAgIGV4aXRHYW1lOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgY2MuZ2FtZS5lbmQoKTtcblxuICAgIH0sXG59KTtcbiIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcGxheWVyOntcblxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG5cbiAgICAgICAgfSxcblxuICAgICAgICB4dWFuWmh1YW5CdG46e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5CdXR0b24sXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy9jYy5sb2codGhpcy54dWFuWmh1YW5CdG4pO1xuXG4gICAgICAgIGlmKGNvbS5jaGVja0VuYWJsZVh1YW5aaGFuKDApIT0wKXtcblxuICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4uZW5hYmxlZD0gdHJ1ZTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIC8vdGhpcy54dWFuWmh1YW5CdG4ubm9kZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cbiAgICAgICAgICAgIHRoaXMueHVhblpodWFuQnRuLm5vZGUuZGVzdHJveSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnBsYXllci54dWFuUGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgXG4gICAgICAgIC8v546p5a625aS05YOPXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXIubm9kZTtcblxuICAgICAgICBub2RlLnNldENhc2NhZGVPcGFjaXR5RW5hYmxlZChmYWxzZSk7XG5cbiAgICAgICAgLy8gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihjYy5wKC10aGlzLm5vZGUud2lkdGgvMi0obm9kZS53aWR0aC8zKjIpLDApKTtcblxuICAgICAgICAvL+WxleekuuaJi+eJjFxuICAgICAgICB0aGlzLmRyYXdQYWkoKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDngrnlh7vlrqPmiJhcbiAgICAgKi9cbiAgICB4dWFuWmhhbjpmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0VuYWJsZVh1YW5aaGFuID0gY29tLmNoZWNrRW5hYmxlWHVhblpoYW4oKTtcblxuICAgICAgICBpZihpc0VuYWJsZVh1YW5aaGFuPT0xKXtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYWN0aW9uTGFiZWwuc3RyaW5nID0gXCLlrqPmiJhcIjtcblxuICAgICAgICB9ZWxzZSBpZihpc0VuYWJsZVh1YW5aaGFuPT0yKXtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuYWN0aW9uTGFiZWwuc3RyaW5nID0gXCLot59cIjtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy/lrqPmiJgg5L+u5pS55YWo5bGA5Y+Y6YePXG4gICAgICAgIGNvbS5pc1h1YW5aaGFuID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkPWZhbHNlO1xuXG4gICAgICAgIHRoaXMueHVhblpodWFuQnRuLm5vcm1hbENvbG9yID0gY2MuQ29sb3IuR1JFWTtcblxuICAgICAgICB0aGlzLnBsYXllci5pc1h1YW5aaGFuID0gdHJ1ZTtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgLyoqXG4gICAgICog5Ye654mMXG4gICAgICovXG4gICAgY2h1UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8v5Ye654mM5ZCI5rOV5oCnXG4gICAgICAgIGlmKGNvbS5jaGVja0NodVBhaShzZWxmLnBsYXllci54dWFuUGFpLDApKXtcblxuICAgICAgICAgICAgaWYodGhpcy54dWFuWmh1YW5CdG4hPW51bGwmJnRoaXMueHVhblpodWFuQnRuLmlzVmFsaWQpe1xuXG4gICAgICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4uZW5hYmxlZCA9ZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5ub3JtYWxDb2xvciA9IGNjLkNvbG9yLkdSRVk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvL+enu+mZpFRPVUNI55uR5ZCsXG4gICAgICAgICAgICBmb3IodmFyIG0gPSAwO208c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7bSsrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnNob3VQYWlbbV0ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHNlbGYudG91Y2hQYWksdGhpcyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lkIjms5VcbiAgICAgICAgICAgIHZhciBpbmRleEFyciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICB2YXIgd2luZG93U2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgIC8v5b6X5Yiw6KaB5Ye655qE54mM5Zyo5omL54mM5Lit55qE5L2N572uXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihzZWxmLnBsYXllci5zaG91UGFpW2pdLl9uYW1lPT1zZWxmLnBsYXllci54dWFuUGFpW2ldLl9uYW1lKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QXJyLnB1c2goaik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoMCxzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGluZGV4QXJyLnNvcnQoKTtcblxuICAgICAgICAgICAgLy/muIXnqbrniYzmoYxcbiAgICAgICAgICAgIC8vY29tLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICAvL+WHuueJjOWKqOS9nFxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGluZGV4QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNlbGYucGxheWVyLnNob3VQYWlbaW5kZXhBcnJbaV1dO1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXlh7rniYxcbiAgICAgICAgICAgICAgICBsYXN0UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgICAgIHNwcml0ZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgcCA9IHNwcml0ZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnAoMCwwKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgbm9kZVAgPSBzZWxmLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKHNlbGYubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoLzIsc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB4ID0gd2luZG93U2l6ZS53aWR0aC8yLW5vZGVQLngrMzAqaTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB5ID0gd2luZG93U2l6ZS5oZWlnaHQvMi1wLnk7XG5cbiAgICAgICAgICAgICAgICAvLyBzcHJpdGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjUsY2MucCh4LHkpKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpbmRleEFyci5yZXZlcnNlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8v5LuO5omL54mM5Lit5Yig6ZmkXG4gICAgICAgICAgICBmb3IodmFyIG4gPSAwO248aW5kZXhBcnIubGVuZ3RoO24rKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpLnNwbGljZShpbmRleEFycltuXSwxKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WIt+aWsOaJi+eJjOWxleekulxuICAgICAgICAgICAgc2VsZi5kcmF3UGFpKCk7XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKGxhc3RQYWkpO1xuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIC8v5LiN5ZCI5rOVXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gc2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxsZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkucG9wKCkucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIFxuICAgIGJ1Q2h1UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYodGhpcy54dWFuWmh1YW5CdG4hPW51bGwmJnRoaXMueHVhblpodWFuQnRuLmlzVmFsaWQpe1xuICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4uZW5hYmxlZD1mYWxzZTtcblxuICAgICAgICAgICAgdGhpcy54dWFuWmh1YW5CdG4ubm9ybWFsQ29sb3IgPSBjYy5Db2xvci5HUkVZO1xuICAgICAgICB9XG5cbiAgICAgICAgY29tLm5leHRQbGF5ZXIoKTtcblxuICAgICAgICBcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrmiYvniYxcbiAgICAgKi9cbiAgICBkcmF3UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNvbS5zb3J0UGFpKHNlbGYucGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIHZhciBudW0gPSBzZWxmLnBsYXllci5zaG91UGFpLmxlbmd0aDtcblxuICAgICAgICAvL3ZhciBzaXplID0gc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPG51bTtpKyspe1xuXG4gICAgICAgICAgICB2YXIgcGFpID0gc2VsZi5wbGF5ZXIuc2hvdVBhaVtpXTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInBhaSBpOlwiK2kpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHBhaSk7XG4gICAgICAgICAgICAvLyBjYy5sb2coXCJzZWxmLm5vZGU6XCIpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHNlbGYubm9kZSk7XG5cbiAgICAgICAgICAgIGlmKHBhaS5wYXJlbnQhPXNlbGYubm9kZSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VsZi5ub2RlLmFkZENoaWxkKHBhaSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFpLnNldENhc2NhZGVPcGFjaXR5RW5hYmxlZChmYWxzZSk7XG5cbiAgICAgICAgICAgIHZhciBwID0gY2MucCgtKHBhaS53aWR0aCsobnVtLTEpKjMwKS8yK3BhaS53aWR0aC8yK2kqMzAsMCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHBhaS5zZXRTY2FsZSgwLjUpO1xuICAgICAgICAgICAgcGFpLnNldFBvc2l0aW9uKHApO1xuICAgICAgICAgICAgcGFpLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHNlbGYudG91Y2hQYWksdGhpcyk7XG5cbiAgICAgICAgfVxuICAgICAgICBcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUT1VDSOebkeWQrOWbnuiwg1xuICAgICAqL1xuICAgIHRvdWNoUGFpOmZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIG5vZGUgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIHZhciBpbmRleCA9IC0xO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICBpZihub2RlLl9uYW1lPT1zZWxmLnBsYXllci54dWFuUGFpW2pdLl9uYW1lKXtcblxuICAgICAgICAgICAgICAgIGluZGV4ID0gajtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGluZGV4PT0tMSl7XG5cbiAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkucHVzaChub2RlKTtcblxuICAgICAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMSwwLDMwKSk7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnNwbGljZShpbmRleCwxKTtcblxuICAgICAgICAgICAgbm9kZS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMSwwLC0zMCkpO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG59KTtcbiIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbnZhciBhaSA9IHJlcXVpcmUoJ0FJJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgc2hvdVBhaU51bTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIHBsYXllckltZzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBjdXJyZW50VGFnOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuU3ByaXRlLFxuICAgICAgICB9LFxuXG4gICAgICAgIGFjdGlvbkxhYmVsOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgeHVhblpoYW46e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBpc0FJOm51bGwsLy/mmK/lkKbmmK9BSVxuXG4gICAgICAgIHNob3VQYWk6bnVsbCwvL+aJi+eJjFxuXG4gICAgICAgIHh1YW5QYWk6bnVsbCwvL+mAieS4reeahOeJjFxuXG4gICAgICAgIGlzWHVhblpoYW46ZmFsc2UsLy/mmK/lkKblrqPmiJhcblxuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgICAgIGlmKHRoaXMuaXNYdWFuWmhhbil7XG4gICAgICAgICAgICB0aGlzLnh1YW5aaGFuLnN0cmluZyA9IFwi5a6jXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICAgICAgLy8gaWYodGhpcy5zaG91UGFpIT1udWxsKXtcblxuICAgICAgICAvLyAgICAgaWYodGhpcy5zaG91UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgLy8gICAgICAgICB0aGlzLnNob3VQYWlOdW0uc3RyaW5nID0gXCJcIjtcblxuICAgICAgICAvLyAgICAgfWVsc2Uge1xuXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5zaG91UGFpTnVtLnN0cmluZyA9IHRoaXMuc2hvdVBhaS5sZW5ndGg7XG5cbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAvLyB9XG4gICAgfSxcblxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKXtcblxuICAgICAgICBpZih0aGlzLmlzQUkpe1xuXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgYWkuY2h1UGFpKHRoaXMpO1xuXG4gICAgICAgICAgICB9LDEpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgLy/kuI3mmK9BSVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==