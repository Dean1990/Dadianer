require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script/AI.js

var com = require('Common');
module.exports = {

    chuPai: function chuPai(player) {

        com.sortPai(player.shouPai);

        var isEnableXuanZhan = com.checkEnableXuanZhan(player.shouPai);

        if (isEnableXuanZhan != 0) {
            //可以宣战
            //设置宣战
            player.isXuanZhan = true;

            if (isEnableXuanZhan == 1) {

                player.actionLabel.string = "宣战";
            } else if (isEnableXuanZhan == 2) {

                player.actionLabel.string = "跟";
            }
        }

        var weightArr = this.analyze(player.shouPai);

        this.sortWeightArr(weightArr);

        if (com._lastPai == null || com._lastPai.length == 0) {

            //出一个最小权值的组合
            if (weightArr.length > 0) {

                var pais = player.shouPai.splice(weightArr[0][1], weightArr[0][2]);

                com.nextPlayer(pais);
            }
        } else {

            var lastWeight = com.convertValueMore(com._lastPai);

            var isBuChuPai = true;

            for (var i = 0; i < weightArr.length; i++) {

                var weight = weightArr[i][0];

                if (weight > lastWeight && (com._lastPai.length == 1 && (weight <= 180 || weight > 1600) || com._lastPai.length > 1)) {

                    //  var canvas = cc.director.getScene().getChildByName('Canvas');

                    //  cc.log(canvas);
                    //出牌
                    var pais = player.shouPai.splice(weightArr[i][1], weightArr[i][2]);

                    //清空牌桌
                    //com.clearPaiZhuo();

                    //this.chuPaiAction(pais);

                    com.nextPlayer(pais);

                    isBuChuPai = false;

                    break;
                }
            }

            if (isBuChuPai) {

                com.nextPlayer();
            }
        }
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

        return weightArr;
    }

};
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{"Common":"Common"}],"Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2ce3dajz81FDajDPh6cF69x', 'Common');
// script/Common.js

module.exports = {

    playerNum: 4, //玩家数

    paiNum: 32, //牌数

    rounds: 0, //回合数

    players: null, //所有玩家的容器

    _lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    _buChuNum: 0, //记录不出牌次数

    winPlayer: null, //记录胜出者序号

    partyPlayers: null, //记录同一伙的玩家的二维数组

    num: 0, //记数

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

                this.checkPlayerNoWinner();
            }
        }
        // cc.log("chekc player index:"+this._currentPlayer);
    },

    /**
     * 下一个玩家
     */
    nextPlayer: function nextPlayer(lastPai) {

        //当前调用该函数的玩家部分
        if (lastPai == null || lastPai.length == 0) {

            this._buChuNum = this._buChuNum + 1;
            //不出
            this.players[this._currentPlayer].getComponent("Player").actionLabel.string = "不出";
        } else {

            this._buChuNum = 0;
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

            this.players[this._currentPlayer].getComponent("Player").actionLabel.string = "NO. " + this.winPlayer.length;
        }

        //3个玩家胜出，游戏结束
        if (this.winPlayer.length == this.playerNum - 1) {

            //清理牌桌
            this.clearPaiZhuo();

            cc.director.getScene().getChildByName('GameLabel').string = "游戏结束";

            return;
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
        if (this._buChuNum == 3 - this.winPlayer.length) {

            //清理牌桌
            this.clearPaiZhuo();

            this._lastPai = null;
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
    checkEnableXuanZhan: function checkEnableXuanZhan(pais) {

        // cc.log("rounds:"+this.rounds);

        //宣战
        if (this.rounds == 1) {

            for (var i = 0; i < pais.length; i++) {

                var f = pais[i]._name.substring(0, 1);

                if (f == "E") {

                    this.partyPlayers[0].push(this._currentPlayer);

                    break;
                }
            }

            return this.partyPlayers[0].length;
        } else {

            return 0;
        }
    }

};

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52296tYeOJGtoyHtGk1jFup', 'Game');
// script/Game.js

var com = require('Common');

cc.Class({
    'extends': cc.Component,

    properties: {

        player: {
            'default': null,
            type: cc.Prefab
        },

        paiAn: {
            'default': null,
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
            'default': null,
            type: cc.Prefab
        },
        a2: {
            'default': null,
            type: cc.Prefab
        },
        a3: {
            'default': null,
            type: cc.Prefab
        },
        a5: {
            'default': null,
            type: cc.Prefab
        },
        a10: {
            'default': null,
            type: cc.Prefab
        },
        a11: {
            'default': null,
            type: cc.Prefab
        },
        a12: {
            'default': null,
            type: cc.Prefab
        },
        a13: {
            'default': null,
            type: cc.Prefab
        },

        b1: {
            'default': null,
            type: cc.Prefab
        },
        b2: {
            'default': null,
            type: cc.Prefab
        },
        b3: {
            'default': null,
            type: cc.Prefab
        },
        b5: {
            'default': null,
            type: cc.Prefab
        },
        // b10:{
        //     default:null,
        //     type:cc.Prefab,
        // },
        b11: {
            'default': null,
            type: cc.Prefab
        },
        b12: {
            'default': null,
            type: cc.Prefab
        },
        b13: {
            'default': null,
            type: cc.Prefab
        },

        c1: {
            'default': null,
            type: cc.Prefab
        },
        c2: {
            'default': null,
            type: cc.Prefab
        },
        c3: {
            'default': null,
            type: cc.Prefab
        },
        c5: {
            'default': null,
            type: cc.Prefab
        },
        c10: {
            'default': null,
            type: cc.Prefab
        },
        c11: {
            'default': null,
            type: cc.Prefab
        },
        c12: {
            'default': null,
            type: cc.Prefab
        },
        c13: {
            'default': null,
            type: cc.Prefab
        },

        d1: {
            'default': null,
            type: cc.Prefab
        },
        d2: {
            'default': null,
            type: cc.Prefab
        },
        d3: {
            'default': null,
            type: cc.Prefab
        },
        d5: {
            'default': null,
            type: cc.Prefab
        },
        // d10:{
        //     default:null,
        //     type:cc.Prefab,
        // },
        d11: {
            'default': null,
            type: cc.Prefab
        },
        d12: {
            'default': null,
            type: cc.Prefab
        },
        d13: {
            'default': null,
            type: cc.Prefab
        },

        E0: {
            'default': null,
            type: cc.Prefab
        },
        E1: {
            'default': null,
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

        for (var i = 0; i < com.paiNum; i++) {

            var j = i % com.playerNum;

            var sprite = cc.instantiate(pais.shift());

            com.players[j].shouPai.push(sprite);

            if (sprite._name == "a11") {

                com.setFirstPlayer(j);
            }
        }
        //初始化胜利者数组
        com.winPlayer = new Array();
        //初始化一伙数组
        com.partyPlayers = new Array();
        com.partyPlayers.push(new Array()); //有鬼的
        com.partyPlayers.push(new Array()); //没鬼的

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

var com = require('Common');
cc.Class({
    "extends": cc.Component,

    properties: {

        player: {

            "default": null,
            type: cc.Sprite

        },

        xuanZhuanBtn: {
            "default": null,
            type: cc.Button
        }

    },

    // use this for initialization
    onLoad: function onLoad() {

        //cc.log(this.xuanZhuanBtn);

        this.xuanZhuanBtn.enabled = com.checkEnableXuanZhan(this.player.shouPai) != 0;

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

        var isEnableXuanZhan = com.checkEnableXuanZhan(this.player.shouPai);

        if (isEnableXuanZhan == 1) {

            player.actionLabel.string = "宣战";
        } else if (isEnableXuanZhan == 2) {

            player.actionLabel.string = "跟";
        }

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

            this.xuanZhuanBtn.enabled = false;

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

        this.xuanZhuanBtn.enabled = false;

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
            self.node.addChild(pai);
            // pai.setScale(0.5);
            pai.setPosition(cc.p(-(pai.width + (num - 1) * 30) / 2 + pai.width / 2 + i * 30, 0));
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

var com = require('Common');
var ai = require('AI');

cc.Class({
    'extends': cc.Component,

    properties: {

        shouPaiNum: {
            'default': null,
            type: cc.Label
        },

        playerImg: {
            'default': null,
            type: cc.Sprite
        },

        currentTag: {
            'default': null,
            type: cc.Sprite
        },

        actionLabel: {
            'default': null,
            type: cc.Label
        },

        xuanZhan: {
            'default': null,
            type: cc.Label
        },

        isAI: null, //是否是AI

        shouPai: null, //手牌

        xuanPai: null, //选中的牌

        isXuanZhan: false },

    //是否宣战

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdC9BSS5qcyIsImFzc2V0cy9zY3JpcHQvQ29tbW9uLmpzIiwiYXNzZXRzL3NjcmlwdC9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdC9QYWlBbi5qcyIsImFzc2V0cy9zY3JpcHQvUGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDQTtBQUNZO0FBQ1o7QUFDWTtBQUNaO0FBQ2dCO0FBQ2hCO0FBQ0E7QUFFZ0I7QUFBaEI7QUFDQTtBQUNBO0FBS1E7QUFIUjtBQUtRO0FBSFI7QUFLUTtBQUhSO0FBQ0E7QUFLWTtBQUhaO0FBS2dCO0FBSGhCO0FBS2dCO0FBSGhCO0FBQ0E7QUFDQTtBQU9ZO0FBTFo7QUFPWTtBQUxaO0FBT1k7QUFMWjtBQU9nQjtBQUxoQjtBQU9nQjtBQUxoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT29CO0FBTHBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9vQjtBQUxwQjtBQU9vQjtBQUxwQjtBQU9vQjtBQUxwQjtBQUNBO0FBQ0E7QUFTWTtBQVBaO0FBU2dCO0FBUGhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFhSTtBQVhKO0FBYVE7QUFYUjtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHSTtBQURKO0FBR1E7QUFEUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlJO0FBRko7QUFJUTtBQUZSO0FBSVE7QUFGUjtBQUNBO0FBSVE7QUFGUjtBQUlZO0FBRlo7QUFDQTtBQUtRO0FBSFI7QUFLUTtBQUhSO0FBS1E7QUFIUjtBQUtZO0FBSFo7QUFLWTtBQUha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QUNBO0FBQ0E7QUFDQTtBQUVJO0FBQUo7QUFDQTtBQUlJO0FBRko7QUFJUTtBQUNJO0FBRlo7QUFDQTtBQUtRO0FBQ0k7QUFIWjtBQUNBO0FBQ0E7QUFLSTtBQUhKO0FBS1E7QUFIUjtBQUtZO0FBSFo7QUFLZ0I7QUFIaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBjaHVQYWk6IGZ1bmN0aW9uIChwbGF5ZXIpe1xuXG4gICAgICAgIGNvbS5zb3J0UGFpKHBsYXllci5zaG91UGFpKVxuXG4gICAgICAgIHZhciBpc0VuYWJsZVh1YW5aaGFuID0gY29tLmNoZWNrRW5hYmxlWHVhblpoYW4ocGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW4hPTApe1xuICAgICAgICAgICAgLy/lj6/ku6XlrqPmiJhcbiAgICAgICAgICAgIC8v6K6+572u5a6j5oiYXG4gICAgICAgICAgICBwbGF5ZXIuaXNYdWFuWmhhbiA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmKGlzRW5hYmxlWHVhblpoYW49PTEpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi5a6j5oiYXCI7XG5cbiAgICAgICAgICAgIH1lbHNlIGlmKGlzRW5hYmxlWHVhblpoYW49PTIpe1xuXG4gICAgICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi6LefXCI7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgd2VpZ2h0QXJyID0gdGhpcy5hbmFseXplKHBsYXllci5zaG91UGFpKTtcblxuICAgICAgICB0aGlzLnNvcnRXZWlnaHRBcnIod2VpZ2h0QXJyKTtcblxuICAgICAgICBpZihjb20uX2xhc3RQYWk9PW51bGx8fGNvbS5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAvL+WHuuS4gOS4quacgOWwj+adg+WAvOeahOe7hOWQiFxuICAgICAgICAgICAgaWYod2VpZ2h0QXJyLmxlbmd0aD4wKXtcblxuICAgICAgICAgICAgICAgIHZhciBwYWlzID0gcGxheWVyLnNob3VQYWkuc3BsaWNlKHdlaWdodEFyclswXVsxXSx3ZWlnaHRBcnJbMF1bMl0pO1xuXG4gICAgICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIocGFpcyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBsYXN0V2VpZ2h0ID0gY29tLmNvbnZlcnRWYWx1ZU1vcmUoY29tLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgdmFyIGlzQnVDaHVQYWkgPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHdlaWdodEFycltpXVswXTtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodD5sYXN0V2VpZ2h0ICYmICgoKGNvbS5fbGFzdFBhaS5sZW5ndGg9PTEgJiYgKHdlaWdodDw9MTgwIHx8IHdlaWdodD4xNjAwKSl8fGNvbS5fbGFzdFBhaS5sZW5ndGg+MSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgdmFyIGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoJ0NhbnZhcycpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICBjYy5sb2coY2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lh7rniYxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhaXMgPSBwbGF5ZXIuc2hvdVBhaS5zcGxpY2Uod2VpZ2h0QXJyW2ldWzFdLHdlaWdodEFycltpXVsyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrniYzmoYxcbiAgICAgICAgICAgICAgICAgICAgLy9jb20uY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmNodVBhaUFjdGlvbihwYWlzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcihwYWlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpc0J1Q2h1UGFpID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaXNCdUNodVBhaSl7XG5cbiAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Ye654mM5Yqo5L2cXG4gICAgICovXG4gICAgLy8gY2h1UGFpQWN0aW9uOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgLy8gICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgIC8vICAgICAvLyAvL+a4heepumxhc3RQYWlcbiAgICAvLyAgICAgLy8gaWYoY29tLl9sYXN0UGFpIT1udWxsKXtcbiAgICAvLyAgICAgLy8gICAgIC8v5riF56m65LiK5a625Ye655qE54mMIOWHhuWkh+iusOW9leatpOasoeWHuueJjFxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpLnNwbGljZSgwLGNvbS5fbGFzdFBhaS5sZW5ndGgpO1xuXG4gICAgLy8gICAgIC8vIH1lbHNlIHtcblxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAvLyAgICAgLy8gfVxuXG4gICAgLy8gICAgIC8v5bGV56S6XG4gICAgLy8gICAgIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuXG4gICAgLy8gICAgICAgICB2YXIgbm9kZSA9IHBhaXNbal07XG5cbiAgICAvLyAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAvLyAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgIC8vICAgICAgICAgLy/mm7TmlrDliLBsYXN0UGFpXG4gICAgLy8gICAgICAgICAvLyBjb20uX2xhc3RQYWkucHVzaChwYWlzW2pdKTtcblxuICAgIC8vICAgICB9XG5cbiAgICAvLyB9LFxuXG4gICAgLyoqXG4gICAgICog5o6S5bqP5p2D5YC85YiX6KGoXG4gICAgICovXG4gICAgc29ydFdlaWdodEFycjpmdW5jdGlvbih3ZWlnaHRBcnIpe1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTx3ZWlnaHRBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGk7ajx3ZWlnaHRBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICBpZih3ZWlnaHRBcnJbaV1bMF0+d2VpZ2h0QXJyW2pdWzBdKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFyciA9IHdlaWdodEFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnJbaV0gPSB3ZWlnaHRBcnJbal07XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyW2pdID0gdGVtcEFycjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqHnrpflj6/ku6Xlh7rniYznmoTmiYDmnInmnYPlgLxcbiAgICAgKi9cbiAgICBhbmFseXplOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSBuZXcgQXJyYXkoKTsvL1vmnYPlgLws5byA5aeL5LiL5qCHLOmVv+W6pl1cblxuICAgICAgICAvLyB2YXIgbGFzdExlbmd0aCA9IGNvbS5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgaWYocGFpcyE9bnVsbCl7XG5cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgLy8gICAgIGNjLmxvZyhwYWlzW2pdLl9uYW1lKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpOlwiK2kpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh3ZWlnaHRBcnIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocGFpc1tpXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6ay8IOWNleW8oFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0Q2xvd25WYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaSsxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGo8cGFpcy5sZW5ndGgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZjIgPSBwYWlzW2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZjIgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo5a+56ay855qE5p2D5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxqKzEpKSxpLDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWNleW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcG9zZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRve1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoaStqKTxwYWlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbDIgPSBwYXJzZUludChwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9zZSA9IGw9PWwyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGlzRGlmZmVyZW50Rml2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8v5a+56IqxNeeahOWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGw9PTUgJiYgaj09MSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGYyID0gcGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjb2RlID0gZi5jaGFyQ29kZUF0KCkrZjIuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5LiN5piv5a+56buRNee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoY29kZSE9MTk2ICYmIGNvZGUhPTE5OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzRGlmZmVyZW50Rml2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNDb21wb3NlICYmICghKGxhc3RMZW5ndGg9PTEgJiYgaj09MSkgfHwgKGw9PTUgJiYgIWlzRGlmZmVyZW50Rml2ZSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc0NvbXBvc2Upe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55aSa5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaStqKzEpKSxpLGorMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9d2hpbGUoaXNDb21wb3NlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsIT01KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vNeeJueauiuS4jeiDveecgeeVpei/meS4qui/h+eoi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ljrvpmaTph43lpI3mnYPlgLzorqHnrpdcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpK2otMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3ZWlnaHRBcnI7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIHBsYXllck51bSA6IDQsLy/njqnlrrbmlbBcblxuICAgIHBhaU51bSA6IDMyLC8v54mM5pWwXG5cbiAgICByb3VuZHM6MCwvL+WbnuWQiOaVsFxuXG4gICAgcGxheWVyczogbnVsbCwvL+aJgOacieeOqeWutueahOWuueWZqFxuXG4gICAgX2xhc3RQYWk6bnVsbCwvL+S4iuWutuWHuueahOeJjFxuXG4gICAgLy9fZmlyc3RQbGF5ZXI6MCwvL+esrOS4gOS4quWHuueJjOeahOeOqeWutlxuXG4gICAgX2N1cnJlbnRQbGF5ZXI6MCwvL+W9k+WJjeWHuueJjOeahOeOqeWutlxuXG4gICAgX2J1Q2h1TnVtOjAsLy/orrDlvZXkuI3lh7rniYzmrKHmlbBcblxuICAgIHdpblBsYXllcjpudWxsLC8v6K6w5b2V6IOc5Ye66ICF5bqP5Y+3XG5cbiAgICBwYXJ0eVBsYXllcnM6bnVsbCwvL+iusOW9leWQjOS4gOS8meeahOeOqeWutueahOS6jOe7tOaVsOe7hFxuXG4gICAgbnVtOjAsLy/orrDmlbBcblxuICAgIHNldEZpcnN0UGxheWVyOmZ1bmN0aW9uKGZpcnN0UGxheWVyKXtcblxuICAgICAgICB0aGlzLl9jdXJyZW50UGxheWVyID0gZmlyc3RQbGF5ZXI7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmN1cnJlbnRUYWcuc2V0VmlzaWJsZSh0cnVlKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmo4Dmn6XnjqnlrrbvvIzliZTpmaTog5zlh7rogIXvvIznu6fnu63muLjmiI9cbiAgICAgKi9cbiAgICBjaGVja05leHRQbGF5ZXJOb1dpbm5lcjpmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMubnVtID0gdGhpcy5udW0gKzE7XG5cbiAgICAgICAgLy/mjqfliLbpgJLlvZLmt7HluqZcbiAgICAgICAgaWYodGhpcy53aW5QbGF5ZXIubGVuZ3RoPHRoaXMucGxheWVyTnVtKXtcblxuICAgICAgICAgICAgaWYodGhpcy5udW0ldGhpcy5wbGF5ZXJOdW09PTApe1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yb3VuZHMgPSB0aGlzLnJvdW5kcyArIDE7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpICUgdGhpcy5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIGlmKHRoaXMud2luUGxheWVyLmluZGV4T2YodGhpcy5fY3VycmVudFBsYXllcikhPS0xKXtcblxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tQbGF5ZXJOb1dpbm5lcigpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyBjYy5sb2coXCJjaGVrYyBwbGF5ZXIgaW5kZXg6XCIrdGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5LiL5LiA5Liq546p5a62XG4gICAgICovXG4gICAgbmV4dFBsYXllcjpmdW5jdGlvbihsYXN0UGFpKXtcblxuICAgICAgICAgICAgLy/lvZPliY3osIPnlKjor6Xlh73mlbDnmoTnjqnlrrbpg6jliIZcbiAgICAgICAgICAgIGlmKGxhc3RQYWk9PW51bGx8fGxhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2J1Q2h1TnVtID0gdGhpcy5fYnVDaHVOdW0gKyAxO1xuICAgICAgICAgICAgICAgIC8v5LiN5Ye6XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmdldENvbXBvbmVudChcIlBsYXllclwiKS5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIuS4jeWHulwiO1xuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9idUNodU51bSA9IDA7XG4gICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuICAgICAgICAgICAgICAgIC8v6LWL5YC8XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFBhaSA9IGxhc3RQYWk7XG4gICAgICAgICAgICAgICAgLy/lsZXnpLpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dMYXN0UGFpKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmN1cnJlbnRUYWcuc2V0VmlzaWJsZShmYWxzZSk7XG5cbiAgICAgICAgICAgIHZhciBpc1BsYXllcldpbiA9IHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5zaG91UGFpLmxlbmd0aCA9PSAwICYmIHRoaXMud2luUGxheWVyLmluZGV4T2YodGhpcy5fY3VycmVudFBsYXllcik9PS0xO1xuXG4gICAgICAgICAgICBpZihpc1BsYXllcldpbil7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIndwIGxlbmdodDpcIit0aGlzLndpblBsYXllci5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy53aW5QbGF5ZXIucHVzaCh0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5nZXRDb21wb25lbnQoXCJQbGF5ZXJcIikuYWN0aW9uTGFiZWwuc3RyaW5nID0gXCJOTy4gXCIrdGhpcy53aW5QbGF5ZXIubGVuZ3RoO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vM+S4queOqeWutuiDnOWHuu+8jOa4uOaIj+e7k+adn1xuICAgICAgICAgICAgaWYodGhpcy53aW5QbGF5ZXIubGVuZ3RoPT0odGhpcy5wbGF5ZXJOdW0tMSkpe1xuXG4gICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnR2FtZUxhYmVsJykuc3RyaW5nID0gXCLmuLjmiI/nu5PmnZ9cIlxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vKioqKioqKioqKiDlvZPliY3osIPnlKjor6Xlh73mlbDnmoTnjqnlrrbpg6jliIbnu5PmnZ8gKioqKioqKioqKioqXG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/kuIvkuIDkuKrnjqnlrrbpg6jliIZcbiAgICAgICAgICAgIC8v5LiL5LiA5Liq5ZCI5rOV55qE5Ye654mM6ICFXG4gICAgICAgICAgICAvL3RoaXMuX2N1cnJlbnRQbGF5ZXIgPSAodGhpcy5fY3VycmVudFBsYXllcisxKSV0aGlzLnBsYXllck51bTtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tOZXh0UGxheWVyTm9XaW5uZXIoKTtcblxuICAgICAgICAgICAgLy9jYy5sb2codGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdKTtcbiAgICBcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5jdXJyZW50VGFnLnNldFZpc2libGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIlwiO1xuXG5cbiAgICAgICAgICAgIC8v5LiJ5Liq5LiN5Ye677yM6K+05piO5Y+I6L2u5Yiw5LiK5qyh5Ye654mM55qE546p5a62IOW9k+acieiDnOWHuuiAheWQju+8jOWIpOaWreeahOaVsOWtl+imgeWHj+WwkVxuICAgICAgICAgICAgaWYodGhpcy5fYnVDaHVOdW09PSgzLXRoaXMud2luUGxheWVyLmxlbmd0aCkpe1xuXG4gICAgICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFBhaSA9IG51bGw7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/pgJrnn6Xnjqnlrrblj6/ku6Xlh7rniYzkuoZcbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICBcblxuICAgIH0sXG4gICAgICAgIFxuICAgIC8qKlxuICAgICAqIOajgOafpeWHuueJjOeahOWQiOazleaAp1xuICAgICAqL1xuICAgIGNoZWNrQ2h1UGFpOmZ1bmN0aW9uKHh1YW5QYWkscCl7XG5cbiAgICAgICAgdmFyIGlzQ3VycmVudCA9IHA9PXRoaXMuX2N1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgLy8gaXNDdXJyZW50ID0gdHJ1ZTtcblxuICAgICAgICAvL+aYr+WQpuivpeWHuueJjFxuICAgICAgICBpZighaXNDdXJyZW50KXtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/liKTmlq3pgInkuK3nmoTniYxcbiAgICAgICAgaWYoeHVhblBhaSE9bnVsbCl7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuX2xhc3RQYWk9PW51bGwgfHwgdGhpcy5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VDaGVjayh4dWFuUGFpKTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RMZW5ndGggPSB0aGlzLl9sYXN0UGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmKGxhc3RMZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgICAgICAvL+WNlVxuICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0gMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v54K4IOWkp+S6jjE2MDDkuLrngrhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlPjE2MDAgJiYgdmFsdWU+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGxhc3RMZW5ndGggPj0gMiAmJiBsYXN0TGVuZ3RoIDwgNSl7XG4gICAgICAgICAgICAgICAgICAgIC8v5a+5XG4gICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aD49Mil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peWHuuWvue+8jOS5n+WPr+S7peWHuueCuFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3og73lh7rljZVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOe7hOWQiOajgOafpVxuICAgICAqL1xuICAgIGNvbXBvc2VDaGVjazpmdW5jdGlvbihhcnIpe1xuXG4gICAgICAgIHZhciBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXG4gICAgICAgIGlmKGxlbmd0aD09MSl7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZSBpZihsZW5ndGg8NSl7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgIHZhciBpc0Nsb3duID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxsZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAvL+msvOaYr+S4gOS4queJueauiueahOe7hOWQiFxuICAgICAgICAgICAgICAgIGlmKGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMCwxKT09XCJFXCIpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPquacieS4pOW8oCDkuJTpg73mmK/prLxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aCA9PTIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3duID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ov5vliLDov5nph4zvvIzov5nlvKDniYzkuI3mmK/lpKflsI/prLzvvIzlh7rnjrDkuI3lkIzmnYPlgLwg6L+U5ZueZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDbG93bil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlMiA9IGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUhPXZhbHVlMil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lpoLmnpzliLDov5nph4wgaXNDbG93biDkuLrnnJ/vvIzlj4rmnInprLzlrZjlnKjvvIzkvYblpJrlvKDniYzlj6rmnInkuIDkuKrprLzvvIzor7TmmI7niYznu4TlkIjkuI3lr7lcbiAgICAgICAgICAgIHJldHVybiAhaXNDbG93bjtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIFxuICAgICAqIOS4jeWMheaLrOWkp+Wwj+msvFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZTpmdW5jdGlvbihsKXtcblxuICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICByZXR1cm4gKDEzK2wpKjEwO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgcmV0dXJuIGwqMTA7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWkp+Wwj+msvOadg+WAvOi9rOaNoiBcbiAgICAgKiBcbiAgICAgKi9cbiAgICBjb252ZXJ0Q2xvd25WYWx1ZTpmdW5jdGlvbihsKXtcbiAgICAgICAgLy/lpKfprLwgbCA9IDAgIOWwj+msvCBsPTFcbiAgICAgICAgLy/lsI/prLzopoHlpKfkuo7mnIDlpKfnmoTljZVcbiAgICAgICAgcmV0dXJuICgxMyszKzItbCkqMTA7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIOWkmuW8oFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZU1vcmU6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgd2VpZ2h0ID0gMDtcblxuICAgICAgICBpZihhcnI9PW51bGwgfHwgYXJyLmxlbmd0aCA9PSAwIHx8ICF0aGlzLmNvbXBvc2VDaGVjayhhcnIpKXtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBmID0gYXJyWzBdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICBpZihmID09IFwiRVwiKXtcbiAgICAgICAgICAgICAgICAvL+msvFxuICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzKzMrMi1sO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzK2w7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ID0gbDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/nibnkvotcbiAgICAgICAgICAgIGlmKGFyci5sZW5ndGg9PTIpe1xuXG4gICAgICAgICAgICAgICAgaWYobCA9PSAxMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDIpKzE7Ly/mr5Tlr7kz5aSnMVxuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobCA9PSA1KXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmLmNoYXJDb2RlQXQoKSthcnJbMV0uX25hbWUuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09IDE5Nil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuem7kTVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSszOy8v5q+U5a+557qiNeWkpzFcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodmFsdWUgPT0gMTk4KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+557qiNVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzIvL+avlOWvuemsvOWkpzFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihmID09IFwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMTsvL+avlOWbm+S4qjPlpKcxXG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jYy5sb2coXCJ3ZWlnaHQ6XCIrd2VpZ2h0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodCAqIE1hdGgucG93KDEwLGFyci5sZW5ndGgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaOkuW6j+aWueazlVxuICAgICAqL1xuICAgIHNvcnRQYWk6ZnVuY3Rpb24oc3ByaXRlQXJyKXtcblxuICAgICAgICAvL2NjLmxvZyhzcHJpdGVBcnIpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTxzcHJpdGVBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGkrMTtqPHNwcml0ZUFyci5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMSA9IHNwcml0ZUFycltpXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMiA9IHNwcml0ZUFycltqXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIC8vY2MubG9nKG5hbWUxLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIm5hbWUxOlwiK25hbWUxK1wiIG5hbWUyOlwiK25hbWUyKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYocGFyc2VJbnQobmFtZTEuc3Vic3RyaW5nKDEpKT5wYXJzZUludChuYW1lMi5zdWJzdHJpbmcoMSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIi1uYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltqXSA9IHRlbXA7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PW5hbWUyLnN1YnN0cmluZygxKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUxID0gbmFtZTEuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZTIgPSBuYW1lMi5zdWJzdHJpbmcoMCwxKS5jaGFyQ29kZUF0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8155qE54m55q6K5o6S5bqPXG4gICAgICAgICAgICAgICAgICAgIGlmKG5hbWUxLnN1YnN0cmluZygxKT09XCI1XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miorlr7npu5E15oiW5a+557qiNeaUvuWIsOS4gOi1t1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miornuqLmoYPkuI7ojYnoirHkupLmjaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPT05OSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMSA9IDk4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihjb2RlMT09OTgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5OTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMj09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTIgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTI9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoY29kZTE+Y29kZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHNwcml0ZUFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrlnKjniYzmoYzkuIpcbiAgICAgKi9cbiAgICBzaG93TGFzdFBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIC8vIGNjLmxvZyhcInBsYXllcjpcIit0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgICAgICBpZih0aGlzLl9sYXN0UGFpIT1udWxsICYmIHRoaXMuX2xhc3RQYWkubGVuZ3RoICE9MCl7XG5cbiAgICAgICAgICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgICAgICAgICAgLy/lsZXnpLpcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7ajx0aGlzLl9sYXN0UGFpLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9sYXN0UGFpW2pdO1xuXG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKFwibm9kZTpcIik7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmuIXnqbrniYzmoYxcbiAgICAgKi9cbiAgICBjbGVhclBhaVpodW86ZnVuY3Rpb24oKXtcblxuICAgICAgICAvLyBjYy5sb2coXCJjbGVhclBhaVpodW9cIik7XG5cbiAgICAgICAgaWYodGhpcy5fbGFzdFBhaSE9bnVsbCAmJiB0aGlzLl9sYXN0UGFpLmxlbmd0aCAhPTApe1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8dGhpcy5fbGFzdFBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fbGFzdFBhaVtpXTtcblxuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5Y+v5Lul5a6j5oiY5oiW6Lef6ZqPXG4gICAgICog5LiN5Y+v5LulIDBcbiAgICAgKiDlrqPmiJggMVxuICAgICAqIOi3n+majyAyXG4gICAgICovXG4gICAgY2hlY2tFbmFibGVYdWFuWmhhbjpmdW5jdGlvbihwYWlzKXtcblxuICAgICAgICAvLyBjYy5sb2coXCJyb3VuZHM6XCIrdGhpcy5yb3VuZHMpO1xuXG4gICAgICAgIC8v5a6j5oiYXG4gICAgICAgIGlmKHRoaXMucm91bmRzPT0xKXtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICBpZihmPT1cIkVcIil7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJ0eVBsYXllcnNbMF0ucHVzaCh0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJ0eVBsYXllcnNbMF0ubGVuZ3RoO1xuXG4gICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuXG4gICAgfSxcblxuICAgIFxuXG59O1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYWlBbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGE1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYjE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGIxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgYjExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBjMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGQxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQ1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGQxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgRTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIEUxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHBhaXMgPSBuZXcgQXJyYXkoc2VsZi5hMSxzZWxmLmEyLHNlbGYuYTMsc2VsZi5hNSxzZWxmLmExMCxzZWxmLmExMSxzZWxmLmExMixzZWxmLmExMyxzZWxmLmIxLHNlbGYuYjIsc2VsZi5iMyxzZWxmLmI1LHNlbGYuYjEwLHNlbGYuYjExLHNlbGYuYjEyLHNlbGYuYjEzLHNlbGYuYzEsc2VsZi5jMixzZWxmLmMzLHNlbGYuYzUsc2VsZi5jMTAsc2VsZi5jMTEsc2VsZi5jMTIsc2VsZi5jMTMsc2VsZi5kMSxzZWxmLmQyLHNlbGYuZDMsc2VsZi5kNSxzZWxmLmQxMCxzZWxmLmQxMSxzZWxmLmQxMixzZWxmLmQxMyxzZWxmLkUwLHNlbGYuRTEpO1xuXG4gICAgICAgIC8v5omT5Lmx5pWw57uEXG4gICAgICAgIHBhaXMuc29ydChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHAgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBjb20ucGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxjb20ucGxheWVyTnVtO2orKyl7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuc2hvdVBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnMucHVzaChub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8Y29tLnBhaU51bTtpKyspe1xuXG4gICAgICAgICAgICB2YXIgaiA9IGklY29tLnBsYXllck51bTtcblxuICAgICAgICAgICAgdmFyIHNwcml0ZSA9IGNjLmluc3RhbnRpYXRlKHBhaXMuc2hpZnQoKSk7XG5cbiAgICAgICAgICAgIGNvbS5wbGF5ZXJzW2pdLnNob3VQYWkucHVzaChzcHJpdGUpO1xuXG4gICAgICAgICAgICBpZihzcHJpdGUuX25hbWUgPT0gXCJhMTFcIil7XG5cbiAgICAgICAgICAgICAgICBjb20uc2V0Rmlyc3RQbGF5ZXIoaik7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8v5Yid5aeL5YyW6IOc5Yip6ICF5pWw57uEXG4gICAgICAgIGNvbS53aW5QbGF5ZXIgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgLy/liJ3lp4vljJbkuIDkvJnmlbDnu4RcbiAgICAgICAgY29tLnBhcnR5UGxheWVycyA9IG5ldyBBcnJheSgpO1xuICAgICAgICBjb20ucGFydHlQbGF5ZXJzLnB1c2gobmV3IEFycmF5KCkpOy8v5pyJ6ay855qEXG4gICAgICAgIGNvbS5wYXJ0eVBsYXllcnMucHVzaChuZXcgQXJyYXkoKSk7Ly/msqHprLznmoRcblxuICAgICAgICBjb20ucGxheWVyc1swXS5pc0FJID0gZmFsc2U7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzFdLmlzQUkgPSB0cnVlO1xuICAgICAgICBjb20ucGxheWVyc1syXS5pc0FJID0gdHJ1ZTtcbiAgICAgICAgY29tLnBsYXllcnNbM10uaXNBSSA9IHRydWU7XG5cbiAgICAgICAgLy/orr7nva7njqnlrrbkvY3nva5cbiAgICAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgIHZhciBub2RlMSA9IGNvbS5wbGF5ZXJzWzFdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMSk7XG5cbiAgICAgICAgbm9kZTEuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLShub2RlMS53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICB2YXIgbm9kZTIgPSBjb20ucGxheWVyc1syXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTIpO1xuXG4gICAgICAgIG5vZGUyLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yLHNpemUuaGVpZ2h0IC0gKG5vZGUxLmhlaWdodC8zKjIpKSk7XG5cbiAgICAgICAgdmFyIG5vZGUzID0gY29tLnBsYXllcnNbM10ubm9kZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUzKTtcblxuICAgICAgICBub2RlMy5zZXRQb3NpdGlvbihjYy5wKChub2RlMy53aWR0aC8zKjIpLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAvL2NjLmxvZyhjb20ucGxheWVyc1swXSk7XG5cbiAgICAgICAgc2VsZi5wYWlBbi5nZXRDb21wb25lbnQoJ1BhaUFuJykucGxheWVyID0gY29tLnBsYXllcnNbMF07XG5cbiAgICAgICAgLy/lpoLmnpzmmK/mnLrlmajkurrvvIzmjIflrprlh7rniYxcbiAgICAgICAgaWYoY29tLl9jdXJyZW50UGxheWVyIT0wICYmIGNvbS5wbGF5ZXJzW2NvbS5fY3VycmVudFBsYXllcl0uaXNBSSl7XG5cbiAgICAgICAgICAgIGNvbS5yb3VuZHMgPSAxO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tjb20uX2N1cnJlbnRQbGF5ZXJdLnRvZ2dsZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBcblxuICAgICAgICAvLyBmb3IodmFyIG4gPSAwO248cHAubGVuZ3RoO24rKyl7XG5cbiAgICAgICAgLy8gICAgIHNlbGYucGxheWVyMC5nZXRDb21wb25lbnQoJ1BsYXllcicpLlNob3VQYWkgPSBwcFswXTtcblxuICAgICAgICAvLyB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuU3ByaXRlLFxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgeHVhblpodWFuQnRuOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuQnV0dG9uLFxuICAgICAgICB9LFxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vY2MubG9nKHRoaXMueHVhblpodWFuQnRuKTtcblxuICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkPSBjb20uY2hlY2tFbmFibGVYdWFuWmhhbih0aGlzLnBsYXllci5zaG91UGFpKSE9MDtcblxuICAgICAgICB0aGlzLnBsYXllci54dWFuUGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgXG4gICAgICAgIC8v546p5a625aS05YOPXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXIubm9kZTtcblxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoLXRoaXMubm9kZS53aWR0aC8yLShub2RlLndpZHRoLzMqMiksMCkpO1xuXG4gICAgICAgIC8v5bGV56S65omL54mMXG4gICAgICAgIHRoaXMuZHJhd1BhaSgpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOeCueWHu+Wuo+aImFxuICAgICAqL1xuICAgIHh1YW5aaGFuOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzRW5hYmxlWHVhblpoYW4gPSBjb20uY2hlY2tFbmFibGVYdWFuWmhhbih0aGlzLnBsYXllci5zaG91UGFpKTtcblxuICAgICAgICBpZihpc0VuYWJsZVh1YW5aaGFuPT0xKXtcblxuICAgICAgICAgICAgcGxheWVyLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwi5a6j5oiYXCI7XG5cbiAgICAgICAgfWVsc2UgaWYoaXNFbmFibGVYdWFuWmhhbj09Mil7XG5cbiAgICAgICAgICAgIHBsYXllci5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIui3n1wiO1xuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkPWZhbHNlO1xuXG4gICAgICAgIHRoaXMucGxheWVyLmlzWHVhblpoYW4gPSB0cnVlO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYxcbiAgICAgKi9cbiAgICBjaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy/lh7rniYzlkIjms5XmgKdcbiAgICAgICAgaWYoY29tLmNoZWNrQ2h1UGFpKHNlbGYucGxheWVyLnh1YW5QYWksMCkpe1xuXG4gICAgICAgICAgICB0aGlzLnh1YW5aaHVhbkJ0bi5lbmFibGVkID1mYWxzZTtcblxuICAgICAgICAgICAgLy/np7vpmaRUT1VDSOebkeWQrFxuICAgICAgICAgICAgZm9yKHZhciBtID0gMDttPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO20rKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpW21dLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5ZCI5rOVXG4gICAgICAgICAgICB2YXIgaW5kZXhBcnIgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd1NpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgICAgICAvL+W+l+WIsOimgeWHuueahOeJjOWcqOaJi+eJjOS4reeahOS9jee9rlxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtpXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKHNlbGYucGxheWVyLnNob3VQYWlbal0uX25hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleEFyci5wdXNoKGopO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkuc3BsaWNlKDAsc2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpbmRleEFyci5zb3J0KCk7XG5cbiAgICAgICAgICAgIC8v5riF56m654mM5qGMXG4gICAgICAgICAgICAvL2NvbS5jbGVhclBhaVpodW8oKTtcblxuICAgICAgICAgICAgdmFyIGxhc3RQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgLy/lh7rniYzliqjkvZxcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxpbmRleEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciBzcHJpdGUgPSBzZWxmLnBsYXllci5zaG91UGFpW2luZGV4QXJyW2ldXTtcblxuICAgICAgICAgICAgICAgIC8v6K6w5b2V5Ye654mMXG4gICAgICAgICAgICAgICAgbGFzdFBhaS5wdXNoKHNwcml0ZSk7XG5cbiAgICAgICAgICAgICAgICBzcHJpdGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIHAgPSBzcHJpdGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKDAsMCkpO1xuXG4gICAgICAgICAgICAgICAgLy8gdmFyIG5vZGVQID0gc2VsZi5ub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2UoY2MucChzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKS53aWR0aC8yLHNlbGYubm9kZS5nZXRDb250ZW50U2l6ZSgpLmhlaWdodC8yKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgeCA9IHdpbmRvd1NpemUud2lkdGgvMi1ub2RlUC54KzMwKmk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgeSA9IHdpbmRvd1NpemUuaGVpZ2h0LzItcC55O1xuXG4gICAgICAgICAgICAgICAgLy8gc3ByaXRlLnJ1bkFjdGlvbihjYy5tb3ZlVG8oMC41LGNjLnAoeCx5KSkpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgaW5kZXhBcnIucmV2ZXJzZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL+S7juaJi+eJjOS4reWIoOmZpFxuICAgICAgICAgICAgZm9yKHZhciBuID0gMDtuPGluZGV4QXJyLmxlbmd0aDtuKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIuc2hvdVBhaS5zcGxpY2UoaW5kZXhBcnJbbl0sMSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/liLfmlrDmiYvniYzlsZXnpLpcbiAgICAgICAgICAgIHNlbGYuZHJhd1BhaSgpO1xuXG4gICAgICAgICAgICBjb20ubmV4dFBsYXllcihsYXN0UGFpKTtcblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvL+S4jeWQiOazlVxuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8bGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnBvcCgpLnJ1bkFjdGlvbihjYy5tb3ZlQnkoMC4xLDAsLTMwKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBcbiAgICBidUNodVBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMueHVhblpodWFuQnRuLmVuYWJsZWQ9ZmFsc2U7XG5cbiAgICAgICAgY29tLm5leHRQbGF5ZXIoKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrmiYvniYxcbiAgICAgKi9cbiAgICBkcmF3UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNvbS5zb3J0UGFpKHNlbGYucGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIHZhciBudW0gPSBzZWxmLnBsYXllci5zaG91UGFpLmxlbmd0aDtcblxuICAgICAgICAvL3ZhciBzaXplID0gc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPG51bTtpKyspe1xuXG4gICAgICAgICAgICB2YXIgcGFpID0gc2VsZi5wbGF5ZXIuc2hvdVBhaVtpXTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInBhaSBpOlwiK2kpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHBhaSk7XG4gICAgICAgICAgICAvLyBjYy5sb2coXCJzZWxmLm5vZGU6XCIpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHNlbGYubm9kZSk7XG4gICAgICAgICAgICBzZWxmLm5vZGUuYWRkQ2hpbGQocGFpKTtcbiAgICAgICAgICAgIC8vIHBhaS5zZXRTY2FsZSgwLjUpO1xuICAgICAgICAgICAgcGFpLnNldFBvc2l0aW9uKGNjLnAoLShwYWkud2lkdGgrKG51bS0xKSozMCkvMitwYWkud2lkdGgvMitpKjMwLDApKTtcbiAgICAgICAgICAgIHBhaS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVE9VQ0jnm5HlkKzlm57osINcbiAgICAgKi9cbiAgICB0b3VjaFBhaTpmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgaWYobm9kZS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtqXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGo7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleD09LTEpe1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnB1c2gobm9kZSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwzMCkpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoaW5kZXgsMSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG52YXIgYWkgPSByZXF1aXJlKCdBSScpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNob3VQYWlOdW06e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXJJbWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3VycmVudFRhZzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25MYWJlbDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIHh1YW5aaGFuOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWwsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBSTpudWxsLC8v5piv5ZCm5pivQUlcblxuICAgICAgICBzaG91UGFpOm51bGwsLy/miYvniYxcblxuICAgICAgICB4dWFuUGFpOm51bGwsLy/pgInkuK3nmoTniYxcblxuICAgICAgICBpc1h1YW5aaGFuOmZhbHNlLC8v5piv5ZCm5a6j5oiYXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgICAgICBpZih0aGlzLmlzWHVhblpoYW4pe1xuICAgICAgICAgICAgdGhpcy54dWFuWmhhbi5zdHJpbmcgPSBcIuWuo1wiO1xuICAgICAgICB9XG4gICAgICAgIFxuXG4gICAgICAgIGlmKHRoaXMuc2hvdVBhaSE9bnVsbCl7XG4gICAgICAgICAgICB0aGlzLnNob3VQYWlOdW0uc3RyaW5nID0gdGhpcy5zaG91UGFpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYodGhpcy5pc0FJKXtcblxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZU9uY2UoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIGFpLmNodVBhaSh0aGlzKTtcblxuICAgICAgICAgICAgfSwxKTtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIC8v5LiN5pivQUlcblxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbn0pO1xuIl19