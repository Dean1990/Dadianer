require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script\AI.js

var com = require('Common');
module.exports = {

    chuPai: function chuPai(player) {

        com.sortPai(player.shouPai);

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
// script\Common.js

module.exports = {

    playerNum: 4, //玩家数

    paiNum: 32, //牌数

    players: null, //所有玩家的容器

    _lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    _buChuNum: 0, //记录不出牌次数

    winPlayer: null, //记录胜出者序号

    setFirstPlayer: function setFirstPlayer(firstPlayer) {

        this._currentPlayer = firstPlayer;

        this.players[this._currentPlayer].currentTag.setVisible(true);
    },

    nextPlayer: function nextPlayer(lastPai) {

        cc.log("cp:" + this._currentPlayer);

        cc.log("winPlayer->");

        var isWiner = false;

        for (var i = 0; i < this.winPlayer.length; i++) {

            cc.log(this.winPlayer[i]);

            if (this.winPlayer[i] == (this._currentPlayer + 1) % this.playerNum) {

                cc.log("winer i:" + this.winPlayer[i]);

                isWiner = true;

                break;
            }
        }

        cc.log("for end");

        cc.log("isWiner:" + isWiner);

        if (isWiner) {

            this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

            this.nextPlayer(lastPai);
        } else {

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

            //三个不出，说明又轮到上次出牌的玩家
            if (this._buChuNum == 3 - this.winPlayer.length) {

                //清理牌桌
                this.clearPaiZhuo();

                this._lastPai = null;
            }

            this.players[this._currentPlayer].currentTag.setVisible(false);

            if (this.players[this._currentPlayer].shouPai.length == 0) {

                cc.log("wp lenght:" + this.winPlayer.length);

                this.winPlayer.push(this._currentPlayer);

                this.players[this._currentPlayer].getComponent("Player").actionLabel.string = "NO. " + this.winPlayer.length;
            }

            this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

            //cc.log(this.players[this._currentPlayer]);

            this.players[this._currentPlayer].currentTag.setVisible(true);

            this.players[this._currentPlayer].actionLabel.string = "";

            this.players[this._currentPlayer].toggle();
        }
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

        cc.log("player:" + this._currentPlayer);

        if (this._lastPai != null && this._lastPai.length != 0) {

            var size = cc.winSize;

            //展示
            for (var j = 0; j < this._lastPai.length; j++) {

                var node = this._lastPai[j];

                cc.log("node:");
                cc.log(node);

                cc.director.getScene().addChild(node);

                node.setPosition(cc.p(size.width / 2 + j * 30, size.height / 2));
            }
        }
    },

    /**
     * 清空牌桌
     */
    clearPaiZhuo: function clearPaiZhuo() {

        cc.log("clearPaiZhuo");

        if (this._lastPai != null && this._lastPai.length != 0) {

            for (var i = 0; i < this._lastPai.length; i++) {

                var node = this._lastPai[i];

                cc.log(node);

                node.removeFromParent();

                node.destroy();
            }
        }
    }

};

cc._RFpop();
},{}],"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52296tYeOJGtoyHtGk1jFup', 'Game');
// script\Game.js

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
// script\PaiAn.js

var com = require('Common');
cc.Class({
    'extends': cc.Component,

    properties: {

        player: {

            'default': null,
            type: cc.Sprite

        }

    },

    // use this for initialization
    onLoad: function onLoad() {

        this.player.xuanPai = new Array();

        var node = this.player.node;

        // cc.director.getScene().addChild(node);

        this.node.addChild(node);

        node.setPosition(cc.p(-this.node.width / 2 - node.width / 3 * 2, 0));

        //展示手牌
        this.drawPai();
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
// script\Player.js

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

        isAI: null, //是否是AI

        shouPai: null, //手牌

        xuanPai: null },

    //选中的牌

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvQUkuanMiLCJhc3NldHMvc2NyaXB0L0NvbW1vbi5qcyIsImFzc2V0cy9zY3JpcHQvR2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvUGFpQW4uanMiLCJhc3NldHMvc2NyaXB0L1BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDUTtBQUNSO0FBQ1E7QUFDUjtBQUNBO0FBQ1k7QUFDWjtBQUNnQjtBQUNoQjtBQUNnQjtBQUNoQjtBQUNBO0FBQ0E7QUFHWTtBQURaO0FBR1k7QUFEWjtBQUdZO0FBRFo7QUFHZ0I7QUFEaEI7QUFHZ0I7QUFEaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdvQjtBQURwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHb0I7QUFEcEI7QUFHb0I7QUFEcEI7QUFHb0I7QUFEcEI7QUFDQTtBQUNBO0FBS1k7QUFIWjtBQUtnQjtBQUhoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBU0k7QUFQSjtBQVNRO0FBUFI7QUFTWTtBQVBaO0FBU2dCO0FBUGhCO0FBU29CO0FBUHBCO0FBU29CO0FBUHBCO0FBU29CO0FBUHBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFhSTtBQVhKO0FBYVE7QUFYUjtBQUNBO0FBQ0E7QUFhUTtBQVhS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Q0E7QUE4REk7QUE1REo7QUE4RFE7QUE1RFI7QUE4RFE7QUE1RFI7QUE4RFk7QUE1RFo7QUFDQTtBQThEWTtBQTVEWjtBQThEZ0I7QUE1RGhCO0FBOERnQjtBQUNBO0FBNURoQjtBQThEZ0I7QUE1RGhCO0FBOERnQjtBQTVEaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFpRUk7QUEvREo7QUFpRVE7QUEvRFI7QUFpRVE7QUEvRFI7QUFpRVk7QUEvRFo7QUFpRWdCO0FBL0RoQjtBQWlFZ0I7QUEvRGhCO0FBaUVnQjtBQS9EaEI7QUFpRWdCO0FBL0RoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hhQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdJO0FBREo7QUFHUTtBQURSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUk7QUFGSjtBQUlRO0FBRlI7QUFJUTtBQUZSO0FBQ0E7QUFJUTtBQUZSO0FBSVk7QUFGWjtBQUNBO0FBS1E7QUFIUjtBQUtRO0FBSFI7QUFLUTtBQUhSO0FBS1k7QUFIWjtBQUtZO0FBSFo7QUFLWTtBQUhaO0FBS1k7QUFIWjtBQUNBO0FBTVE7QUFKUjtBQU1ZO0FBSlo7QUFNWTtBQUpaO0FBTVk7QUFKWjtBQU1ZO0FBSlo7QUFNZ0I7QUFKaEI7QUFDQTtBQUNBO0FBUVE7QUFOUjtBQVFRO0FBQ0E7QUFDQTtBQUNBO0FBTlI7QUFDQTtBQVFRO0FBTlI7QUFRUTtBQU5SO0FBUVE7QUFOUjtBQVFRO0FBTlI7QUFRUTtBQU5SO0FBUVE7QUFOUjtBQVFRO0FBTlI7QUFRUTtBQU5SO0FBUVE7QUFOUjtBQVFRO0FBTlI7QUFDQTtBQUNBO0FBUVE7QUFOUjtBQUNBO0FBUVE7QUFOUjtBQVFZO0FBTlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pSQTtBQUNBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ1k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBR1E7QUFEUjtBQUNBO0FBQ0E7QUFHUTtBQURSO0FBR1E7QUFEUjtBQUNBO0FBR1E7QUFEUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlJO0FBRko7QUFJUTtBQUZSO0FBQ0E7QUFJUTtBQUZSO0FBQ0E7QUFJWTtBQUZaO0FBSWdCO0FBRmhCO0FBQ0E7QUFDQTtBQUtZO0FBSFo7QUFLWTtBQUhaO0FBQ0E7QUFLWTtBQUhaO0FBS2dCO0FBSGhCO0FBS29CO0FBSHBCO0FBQ0E7QUFDQTtBQUt3QjtBQUh4QjtBQUNBO0FBQ0E7QUFDQTtBQU1ZO0FBSlo7QUFNWTtBQUpaO0FBQ0E7QUFDQTtBQUNBO0FBTVk7QUFKWjtBQUNBO0FBTVk7QUFKWjtBQU1nQjtBQUpoQjtBQUNBO0FBTWdCO0FBSmhCO0FBTWdCO0FBSmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFZO0FBTlo7QUFDQTtBQVFZO0FBTlo7QUFRZ0I7QUFOaEI7QUFDQTtBQUNBO0FBU1k7QUFQWjtBQVNZO0FBUFo7QUFDQTtBQVVZO0FBUlo7QUFVWTtBQVJaO0FBVWdCO0FBUmhCO0FBQ0E7QUFDQTtBQUNBO0FBY0k7QUFaSjtBQWNRO0FBWlI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWVJO0FBYko7QUFlUTtBQWJSO0FBZVE7QUFiUjtBQWVRO0FBYlI7QUFDQTtBQUNBO0FBZVE7QUFiUjtBQWVZO0FBYlo7QUFDQTtBQUNBO0FBQ0E7QUFlWTtBQWJaO0FBZVk7QUFDQTtBQWJaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWtCSTtBQWhCSjtBQWtCUTtBQWhCUjtBQWtCUTtBQUNBO0FBaEJSO0FBa0JRO0FBaEJSO0FBa0JZO0FBaEJaO0FBa0JnQjtBQWhCaEI7QUFrQmdCO0FBaEJoQjtBQUNBO0FBQ0E7QUFvQlE7QUFsQlI7QUFvQlk7QUFsQlo7QUFvQlk7QUFsQlo7QUFDQTtBQXFCWTtBQW5CWjtBQXFCWTtBQW5CWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFBSjtBQUNBO0FBSUk7QUFGSjtBQUlRO0FBQ0k7QUFGWjtBQUNBO0FBQ0E7QUFJSTtBQUZKO0FBSVE7QUFGUjtBQUlZO0FBRlo7QUFJZ0I7QUFGaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgICBjaHVQYWk6IGZ1bmN0aW9uIChwbGF5ZXIpe1xuXG4gICAgICAgIGNvbS5zb3J0UGFpKHBsYXllci5zaG91UGFpKVxuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSB0aGlzLmFuYWx5emUocGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIHRoaXMuc29ydFdlaWdodEFycih3ZWlnaHRBcnIpO1xuXG4gICAgICAgIGlmKGNvbS5fbGFzdFBhaT09bnVsbHx8Y29tLl9sYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgIC8v5Ye65LiA5Liq5pyA5bCP5p2D5YC855qE57uE5ZCIXG4gICAgICAgICAgICBpZih3ZWlnaHRBcnIubGVuZ3RoPjApe1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhaXMgPSBwbGF5ZXIuc2hvdVBhaS5zcGxpY2Uod2VpZ2h0QXJyWzBdWzFdLHdlaWdodEFyclswXVsyXSk7XG5cbiAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcihwYWlzKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgdmFyIGxhc3RXZWlnaHQgPSBjb20uY29udmVydFZhbHVlTW9yZShjb20uX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICB2YXIgaXNCdUNodVBhaSA9IHRydWU7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTx3ZWlnaHRBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgd2VpZ2h0ID0gd2VpZ2h0QXJyW2ldWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYod2VpZ2h0Pmxhc3RXZWlnaHQgJiYgKCgoY29tLl9sYXN0UGFpLmxlbmd0aD09MSAmJiAod2VpZ2h0PD0xODAgfHwgd2VpZ2h0PjE2MDApKXx8Y29tLl9sYXN0UGFpLmxlbmd0aD4xKSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICB2YXIgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIGNjLmxvZyhjYW52YXMpO1xuICAgICAgICAgICAgICAgICAgICAvL+WHuueJjFxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFpcyA9IHBsYXllci5zaG91UGFpLnNwbGljZSh3ZWlnaHRBcnJbaV1bMV0sd2VpZ2h0QXJyW2ldWzJdKTtcblxuICAgICAgICAgICAgICAgICAgICAvL+a4heepuueJjOahjFxuICAgICAgICAgICAgICAgICAgICAvL2NvbS5jbGVhclBhaVpodW8oKTtcblxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuY2h1UGFpQWN0aW9uKHBhaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKHBhaXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlzQnVDaHVQYWkgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihpc0J1Q2h1UGFpKXtcblxuICAgICAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYzliqjkvZxcbiAgICAgKi9cbiAgICAvLyBjaHVQYWlBY3Rpb246ZnVuY3Rpb24ocGFpcyl7XG5cbiAgICAvLyAgICAgdmFyIHNpemUgPSBjYy53aW5TaXplO1xuXG4gICAgLy8gICAgIC8vIC8v5riF56m6bGFzdFBhaVxuICAgIC8vICAgICAvLyBpZihjb20uX2xhc3RQYWkhPW51bGwpe1xuICAgIC8vICAgICAvLyAgICAgLy/muIXnqbrkuIrlrrblh7rnmoTniYwg5YeG5aSH6K6w5b2V5q2k5qyh5Ye654mMXG4gICAgLy8gICAgIC8vICAgICBjb20uX2xhc3RQYWkuc3BsaWNlKDAsY29tLl9sYXN0UGFpLmxlbmd0aCk7XG5cbiAgICAvLyAgICAgLy8gfWVsc2Uge1xuXG4gICAgLy8gICAgIC8vICAgICBjb20uX2xhc3RQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgIC8vICAgICAvLyB9XG5cbiAgICAvLyAgICAgLy/lsZXnpLpcbiAgICAvLyAgICAgZm9yKHZhciBqID0gMDtqPHBhaXMubGVuZ3RoO2orKyl7XG5cbiAgICAvLyAgICAgICAgIHZhciBub2RlID0gcGFpc1tqXTtcblxuICAgIC8vICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgIC8vICAgICAgICAgbm9kZS5zZXRQb3NpdGlvbihjYy5wKHNpemUud2lkdGgvMiArIGoqMzAsc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgLy8gICAgICAgICAvL+abtOaWsOWIsGxhc3RQYWlcbiAgICAvLyAgICAgICAgIC8vIGNvbS5fbGFzdFBhaS5wdXNoKHBhaXNbal0pO1xuXG4gICAgLy8gICAgIH1cblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDmjpLluo/mnYPlgLzliJfooahcbiAgICAgKi9cbiAgICBzb3J0V2VpZ2h0QXJyOmZ1bmN0aW9uKHdlaWdodEFycil7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPHdlaWdodEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgZm9yKHZhciBqID0gaTtqPHdlaWdodEFyci5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodEFycltpXVswXT53ZWlnaHRBcnJbal1bMF0pe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wQXJyID0gd2VpZ2h0QXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodEFycltpXSA9IHdlaWdodEFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnJbal0gPSB0ZW1wQXJyO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOiuoeeul+WPr+S7peWHuueJjOeahOaJgOacieadg+WAvFxuICAgICAqL1xuICAgIGFuYWx5emU6ZnVuY3Rpb24ocGFpcyl7XG5cbiAgICAgICAgdmFyIHdlaWdodEFyciA9IG5ldyBBcnJheSgpOy8vW+adg+WAvCzlvIDlp4vkuIvmoIcs6ZW/5bqmXVxuXG4gICAgICAgIC8vIHZhciBsYXN0TGVuZ3RoID0gY29tLl9sYXN0UGFpLmxlbmd0aDtcblxuICAgICAgICBpZihwYWlzIT1udWxsKXtcblxuICAgICAgICAgICAgLy8gZm9yKHZhciBqID0gMDtqPHBhaXMubGVuZ3RoO2orKyl7XG4gICAgICAgICAgICAvLyAgICAgY2MubG9nKHBhaXNbal0uX25hbWUpO1xuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8cGFpcy5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhcImk6XCIraSk7XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKHdlaWdodEFyci5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyhwYWlzW2ldLl9uYW1lKTtcblxuICAgICAgICAgICAgICAgIHZhciBmID0gcGFpc1tpXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcblxuICAgICAgICAgICAgICAgIHZhciBsID0gcGFyc2VJbnQocGFpc1tpXS5fbmFtZS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICAgICAgaWYoZiA9PSBcIkVcIil7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmKGxhc3RMZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/prLwg5Y2V5bygXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnIucHVzaChbY29tLmNvbnZlcnRDbG93blZhbHVlKGwpLGksMV0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGogPSBpKzE7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoajxwYWlzLmxlbmd0aCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmMiA9IHBhaXNbal0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihmMiA9PSBcIkVcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lrZjlgqjlr7nprLznmoTmnYPlgLxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnIucHVzaChbY29tLmNvbnZlcnRWYWx1ZU1vcmUocGFpcy5zbGljZShpLGorMSkpLGksMl0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55Y2V5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnIucHVzaChbY29tLmNvbnZlcnRWYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gMDtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaXNDb21wb3NlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgZG97XG4gICAgICAgICAgICAgICAgICAgICAgICBqKys7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKChpK2opPHBhaXMubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsMiA9IHBhcnNlSW50KHBhaXNbaStqXS5fbmFtZS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wb3NlID0gbD09bDI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgaXNEaWZmZXJlbnRGaXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLy/lr7noirE155qE5aSE55CGXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYobD09NSAmJiBqPT0xKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB2YXIgZjIgPSBwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGNvZGUgPSBmLmNoYXJDb2RlQXQoKStmMi5jaGFyQ29kZUF0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgLy/kuI3mmK/lr7npu5E157qiNVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICBpZihjb2RlIT0xOTYgJiYgY29kZSE9MTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgICAgaXNEaWZmZXJlbnRGaXZlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZihpc0NvbXBvc2UgJiYgKCEobGFzdExlbmd0aD09MSAmJiBqPT0xKSB8fCAobD09NSAmJiAhaXNEaWZmZXJlbnRGaXZlKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzQ29tcG9zZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7nlpJrlvKDnmoTmnYPlgLzkv53lrZhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxpK2orMSkpLGksaisxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH13aGlsZShpc0NvbXBvc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGwhPTUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8154m55q6K5LiN6IO955yB55Wl6L+Z5Liq6L+H56iLXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WOu+mZpOmHjeWkjeadg+WAvOiuoeeul1xuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGkrai0xO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHdlaWdodEFycjtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgcGxheWVyTnVtIDogNCwvL+eOqeWutuaVsFxuXG4gICAgcGFpTnVtIDogMzIsLy/niYzmlbBcblxuICAgIHBsYXllcnM6IG51bGwsLy/miYDmnInnjqnlrrbnmoTlrrnlmahcblxuICAgIF9sYXN0UGFpOm51bGwsLy/kuIrlrrblh7rnmoTniYxcblxuICAgIC8vX2ZpcnN0UGxheWVyOjAsLy/nrKzkuIDkuKrlh7rniYznmoTnjqnlrrZcblxuICAgIF9jdXJyZW50UGxheWVyOjAsLy/lvZPliY3lh7rniYznmoTnjqnlrrZcblxuICAgIF9idUNodU51bTowLC8v6K6w5b2V5LiN5Ye654mM5qyh5pWwXG5cbiAgICB3aW5QbGF5ZXI6bnVsbCwvL+iusOW9leiDnOWHuuiAheW6j+WPt1xuXG4gICAgc2V0Rmlyc3RQbGF5ZXI6ZnVuY3Rpb24oZmlyc3RQbGF5ZXIpe1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSBmaXJzdFBsYXllcjtcblxuICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uY3VycmVudFRhZy5zZXRWaXNpYmxlKHRydWUpO1xuXG4gICAgfSxcblxuICAgIG5leHRQbGF5ZXI6ZnVuY3Rpb24obGFzdFBhaSl7XG5cbiAgICAgICAgY2MubG9nKFwiY3A6XCIrdGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICAgICAgY2MubG9nKFwid2luUGxheWVyLT5cIik7XG4gICAgICAgIFxuXG4gICAgICAgIHZhciBpc1dpbmVyID0gZmFsc2U7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPHRoaXMud2luUGxheWVyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBjYy5sb2codGhpcy53aW5QbGF5ZXJbaV0pO1xuXG4gICAgICAgICAgICBpZih0aGlzLndpblBsYXllcltpXSA9PSAodGhpcy5fY3VycmVudFBsYXllcisxKSV0aGlzLnBsYXllck51bSl7XG5cbiAgICAgICAgICAgICAgICBjYy5sb2coXCJ3aW5lciBpOlwiK3RoaXMud2luUGxheWVyW2ldKVxuXG4gICAgICAgICAgICAgICAgaXNXaW5lciA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBjYy5sb2coXCJmb3IgZW5kXCIpO1xuXG4gICAgICAgIGNjLmxvZyhcImlzV2luZXI6XCIraXNXaW5lcik7XG5cbiAgICAgICAgaWYoaXNXaW5lcil7XG5cbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSAodGhpcy5fY3VycmVudFBsYXllcisxKSV0aGlzLnBsYXllck51bTtcblxuICAgICAgICAgICAgdGhpcy5uZXh0UGxheWVyKGxhc3RQYWkpO1xuXG4gICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICBpZihsYXN0UGFpPT1udWxsfHxsYXN0UGFpLmxlbmd0aD09MCl7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9idUNodU51bSA9IHRoaXMuX2J1Q2h1TnVtICsgMTtcbiAgICAgICAgICAgICAgICAvL+S4jeWHulxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS5nZXRDb21wb25lbnQoXCJQbGF5ZXJcIikuYWN0aW9uTGFiZWwuc3RyaW5nID0gXCLkuI3lh7pcIjtcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fYnVDaHVOdW0gPSAwO1xuICAgICAgICAgICAgICAgIC8v5riF55CG54mM5qGMXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhaVpodW8oKTtcbiAgICAgICAgICAgICAgICAvL+i1i+WAvFxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RQYWkgPSBsYXN0UGFpO1xuICAgICAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TGFzdFBhaSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5LiJ5Liq5LiN5Ye677yM6K+05piO5Y+I6L2u5Yiw5LiK5qyh5Ye654mM55qE546p5a62XG4gICAgICAgICAgICBpZih0aGlzLl9idUNodU51bT09KDMtdGhpcy53aW5QbGF5ZXIubGVuZ3RoKSl7XG5cbiAgICAgICAgICAgICAgICAvL+a4heeQhueJjOahjFxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0UGFpID0gbnVsbDtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgaWYodGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLnNob3VQYWkubGVuZ3RoID09IDApe1xuXG4gICAgICAgICAgICAgICAgY2MubG9nKFwid3AgbGVuZ2h0OlwiK3RoaXMud2luUGxheWVyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLndpblBsYXllci5wdXNoKHRoaXMuX2N1cnJlbnRQbGF5ZXIpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmdldENvbXBvbmVudChcIlBsYXllclwiKS5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIk5PLiBcIit0aGlzLndpblBsYXllci5sZW5ndGg7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpJXRoaXMucGxheWVyTnVtO1xuXG4gICAgICAgICAgICAvL2NjLmxvZyh0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0pO1xuICAgIFxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmN1cnJlbnRUYWcuc2V0VmlzaWJsZSh0cnVlKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmFjdGlvbkxhYmVsLnN0cmluZyA9IFwiXCI7XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuICAgICAgICBcbiAgICAvKipcbiAgICAgKiDmo4Dmn6Xlh7rniYznmoTlkIjms5XmgKdcbiAgICAgKi9cbiAgICBjaGVja0NodVBhaTpmdW5jdGlvbih4dWFuUGFpLHApe1xuXG4gICAgICAgIHZhciBpc0N1cnJlbnQgPSBwPT10aGlzLl9jdXJyZW50UGxheWVyO1xuXG4gICAgICAgIC8vIGlzQ3VycmVudCA9IHRydWU7XG5cbiAgICAgICAgLy/mmK/lkKbor6Xlh7rniYxcbiAgICAgICAgaWYoIWlzQ3VycmVudCl7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8v5Yik5pat6YCJ5Lit55qE54mMXG4gICAgICAgIGlmKHh1YW5QYWkhPW51bGwpe1xuXG4gICAgICAgICAgICBpZih0aGlzLl9sYXN0UGFpPT1udWxsIHx8IHRoaXMuX2xhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb3NlQ2hlY2soeHVhblBhaSk7XG5cbiAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSB4dWFuUGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHZhciBsYXN0TGVuZ3RoID0gdGhpcy5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgLy/ljZVcbiAgICAgICAgICAgICAgICAgICAgaWYobGVuZ3RoID09IDEpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eCuCDlpKfkuo4xNjAw5Li654K4XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZT4xNjAwICYmIHZhbHVlPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihsYXN0TGVuZ3RoID49IDIgJiYgbGFzdExlbmd0aCA8IDUpe1xuICAgICAgICAgICAgICAgICAgICAvL+WvuVxuICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGg+PTIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6/ku6Xlh7rlr7nvvIzkuZ/lj6/ku6Xlh7rngrhcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95Ye65Y2VXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu4TlkIjmo4Dmn6VcbiAgICAgKi9cbiAgICBjb21wb3NlQ2hlY2s6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblxuICAgICAgICBpZihsZW5ndGg9PTEpe1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfWVsc2UgaWYobGVuZ3RoPDUpe1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICB2YXIgaXNDbG93biA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8bGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgLy/prLzmmK/kuIDkuKrnibnmrornmoTnu4TlkIhcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk9PVwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihpc0Nsb3duKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6rmnInkuKTlvKAg5LiU6YO95piv6ay8XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0yICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6L+b5Yiw6L+Z6YeM77yM6L+Z5byg54mM5LiN5piv5aSn5bCP6ay877yM5Ye6546w5LiN5ZCM5p2D5YC8IOi/lOWbnmZhbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlIT12YWx1ZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5aaC5p6c5Yiw6L+Z6YeMIGlzQ2xvd24g5Li655yf77yM5Y+K5pyJ6ay85a2Y5Zyo77yM5L2G5aSa5byg54mM5Y+q5pyJ5LiA5Liq6ay877yM6K+05piO54mM57uE5ZCI5LiN5a+5XG4gICAgICAgICAgICByZXR1cm4gIWlzQ2xvd247XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiBcbiAgICAgKiDkuI3ljIXmi6zlpKflsI/prLxcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWU6ZnVuY3Rpb24obCl7XG5cbiAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgcmV0dXJuICgxMytsKSoxMDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBsKjEwO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlpKflsI/prLzmnYPlgLzovazmjaIgXG4gICAgICogXG4gICAgICovXG4gICAgY29udmVydENsb3duVmFsdWU6ZnVuY3Rpb24obCl7XG4gICAgICAgIC8v5aSn6ay8IGwgPSAwICDlsI/prLwgbD0xXG4gICAgICAgIC8v5bCP6ay86KaB5aSn5LqO5pyA5aSn55qE5Y2VXG4gICAgICAgIHJldHVybiAoMTMrMysyLWwpKjEwO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiDlpJrlvKBcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWVNb3JlOmZ1bmN0aW9uKGFycil7XG5cbiAgICAgICAgdmFyIHdlaWdodCA9IDA7XG5cbiAgICAgICAgaWYoYXJyPT1udWxsIHx8IGFyci5sZW5ndGggPT0gMCB8fCAhdGhpcy5jb21wb3NlQ2hlY2soYXJyKSl7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQ7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgZiA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBwYXJzZUludChhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgaWYoZiA9PSBcIkVcIil7XG4gICAgICAgICAgICAgICAgLy/prLxcbiAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMyszKzItbDtcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMytsO1xuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IGw7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v54m55L6LXG4gICAgICAgICAgICBpZihhcnIubGVuZ3RoPT0yKXtcblxuICAgICAgICAgICAgICAgIGlmKGwgPT0gMTApe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCwyKSsxOy8v5q+U5a+5M+WkpzFcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGwgPT0gNSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZi5jaGFyQ29kZUF0KCkrYXJyWzFdLl9uYW1lLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZSA9PSAxOTYpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7npu5E1XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMzsvL+avlOWvuee6ojXlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbHVlID09IDE5OCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSsyLy/mr5Tlr7nprLzlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoZiA9PSBcIkVcIil7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzE7Ly/mr5Tlm5vkuKoz5aSnMVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2MubG9nKFwid2VpZ2h0OlwiK3dlaWdodCk7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQgKiBNYXRoLnBvdygxMCxhcnIubGVuZ3RoKTtcblxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmjpLluo/mlrnms5VcbiAgICAgKi9cbiAgICBzb3J0UGFpOmZ1bmN0aW9uKHNwcml0ZUFycil7XG5cbiAgICAgICAgLy9jYy5sb2coc3ByaXRlQXJyKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8c3ByaXRlQXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBmb3IodmFyIGogPSBpKzE7ajxzcHJpdGVBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTEgPSBzcHJpdGVBcnJbaV0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTIgPSBzcHJpdGVBcnJbal0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhuYW1lMS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2coXCJuYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHBhcnNlSW50KG5hbWUxLnN1YnN0cmluZygxKSk+cGFyc2VJbnQobmFtZTIuc3Vic3RyaW5nKDEpKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coXCItbmFtZTE6XCIrbmFtZTErXCIgbmFtZTI6XCIrbmFtZTIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3ByaXRlQXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobmFtZTEuc3Vic3RyaW5nKDEpPT1uYW1lMi5zdWJzdHJpbmcoMSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlMSA9IG5hbWUxLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUyID0gbmFtZTIuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vNeeahOeJueauiuaOkuW6j1xuICAgICAgICAgICAgICAgICAgICBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PVwiNVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK5a+56buRNeaIluWvuee6ojXmlL7liLDkuIDotbdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK57qi5qGD5LiO6I2J6Iqx5LqS5o2iXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMT09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTE9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUxID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29kZTI9PTk5KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGUyPT05OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMiA9IDk5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPmNvZGUyKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2pdID0gdGVtcDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5bGV56S65Zyo54mM5qGM5LiKXG4gICAgICovXG4gICAgc2hvd0xhc3RQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICBjYy5sb2coXCJwbGF5ZXI6XCIrdGhpcy5fY3VycmVudFBsYXllcik7XG5cbiAgICAgICAgaWYodGhpcy5fbGFzdFBhaSE9bnVsbCAmJiB0aGlzLl9sYXN0UGFpLmxlbmd0aCAhPTApe1xuXG4gICAgICAgICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwO2o8dGhpcy5fbGFzdFBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fbGFzdFBhaVtqXTtcblxuICAgICAgICAgICAgICAgIGNjLmxvZyhcIm5vZGU6XCIpO1xuICAgICAgICAgICAgICAgIGNjLmxvZyhub2RlKTtcblxuICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoc2l6ZS53aWR0aC8yICsgaiozMCxzaXplLmhlaWdodC8yKSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5riF56m654mM5qGMXG4gICAgICovXG4gICAgY2xlYXJQYWlaaHVvOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgY2MubG9nKFwiY2xlYXJQYWlaaHVvXCIpO1xuXG4gICAgICAgIGlmKHRoaXMuX2xhc3RQYWkhPW51bGwgJiYgdGhpcy5fbGFzdFBhaS5sZW5ndGggIT0wKXtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHRoaXMuX2xhc3RQYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX2xhc3RQYWlbaV07XG5cbiAgICAgICAgICAgICAgICBjYy5sb2cobm9kZSk7XG5cbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZUZyb21QYXJlbnQoKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuZGVzdHJveSgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIFxuXG59O1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYWlBbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGE1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYjE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGIxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgYjExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBjMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGQxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQ1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGQxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgRTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIEUxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHBhaXMgPSBuZXcgQXJyYXkoc2VsZi5hMSxzZWxmLmEyLHNlbGYuYTMsc2VsZi5hNSxzZWxmLmExMCxzZWxmLmExMSxzZWxmLmExMixzZWxmLmExMyxzZWxmLmIxLHNlbGYuYjIsc2VsZi5iMyxzZWxmLmI1LHNlbGYuYjEwLHNlbGYuYjExLHNlbGYuYjEyLHNlbGYuYjEzLHNlbGYuYzEsc2VsZi5jMixzZWxmLmMzLHNlbGYuYzUsc2VsZi5jMTAsc2VsZi5jMTEsc2VsZi5jMTIsc2VsZi5jMTMsc2VsZi5kMSxzZWxmLmQyLHNlbGYuZDMsc2VsZi5kNSxzZWxmLmQxMCxzZWxmLmQxMSxzZWxmLmQxMixzZWxmLmQxMyxzZWxmLkUwLHNlbGYuRTEpO1xuXG4gICAgICAgIC8v5omT5Lmx5pWw57uEXG4gICAgICAgIHBhaXMuc29ydChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHAgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBjb20ucGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxjb20ucGxheWVyTnVtO2orKyl7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuc2hvdVBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICBub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykuY3VycmVudFRhZy5zZXRWaXNpYmxlKGZhbHNlKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnMucHVzaChub2RlLmdldENvbXBvbmVudCgnUGxheWVyJykpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8Y29tLnBhaU51bTtpKyspe1xuXG4gICAgICAgICAgICB2YXIgaiA9IGklY29tLnBsYXllck51bTtcblxuICAgICAgICAgICAgdmFyIHNwcml0ZSA9IGNjLmluc3RhbnRpYXRlKHBhaXMuc2hpZnQoKSk7XG5cbiAgICAgICAgICAgIGNvbS5wbGF5ZXJzW2pdLnNob3VQYWkucHVzaChzcHJpdGUpO1xuXG4gICAgICAgICAgICBpZihzcHJpdGUuX25hbWUgPT0gXCJhMTFcIil7XG5cbiAgICAgICAgICAgICAgICBjb20uc2V0Rmlyc3RQbGF5ZXIoaik7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgY29tLndpblBsYXllciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGNvbS5wbGF5ZXJzWzBdLmlzQUkgPSBmYWxzZTtcbiAgICAgICAgY29tLnBsYXllcnNbMV0uaXNBSSA9IHRydWU7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzJdLmlzQUkgPSB0cnVlO1xuICAgICAgICBjb20ucGxheWVyc1szXS5pc0FJID0gdHJ1ZTtcblxuICAgICAgICAvL+iuvue9rueOqeWutuS9jee9rlxuICAgICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgdmFyIG5vZGUxID0gY29tLnBsYXllcnNbMV0ubm9kZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUxKTtcblxuICAgICAgICBub2RlMS5zZXRQb3NpdGlvbihjYy5wKHNpemUud2lkdGgtKG5vZGUxLndpZHRoLzMqMiksc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgICAgIHZhciBub2RlMiA9IGNvbS5wbGF5ZXJzWzJdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMik7XG5cbiAgICAgICAgbm9kZTIuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIsc2l6ZS5oZWlnaHQgLSAobm9kZTEuaGVpZ2h0LzMqMikpKTtcblxuICAgICAgICB2YXIgbm9kZTMgPSBjb20ucGxheWVyc1szXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTMpO1xuXG4gICAgICAgIG5vZGUzLnNldFBvc2l0aW9uKGNjLnAoKG5vZGUzLndpZHRoLzMqMiksc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgICAgIC8vY2MubG9nKGNvbS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICBzZWxmLnBhaUFuLmdldENvbXBvbmVudCgnUGFpQW4nKS5wbGF5ZXIgPSBjb20ucGxheWVyc1swXTtcblxuICAgICAgICAvL+WmguaenOaYr+acuuWZqOS6uu+8jOaMh+WumuWHuueJjFxuICAgICAgICBpZihjb20uX2N1cnJlbnRQbGF5ZXIhPTAgJiYgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS5pc0FJKXtcblxuICAgICAgICAgICAgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgXG5cbiAgICAgICAgLy8gZm9yKHZhciBuID0gMDtuPHBwLmxlbmd0aDtuKyspe1xuXG4gICAgICAgIC8vICAgICBzZWxmLnBsYXllcjAuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5TaG91UGFpID0gcHBbMF07XG5cbiAgICAgICAgLy8gfVxuXG4gICAgfSxcbn0pO1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBwbGF5ZXI6e1xuXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIueHVhblBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIFxuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXIubm9kZTtcblxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoLXRoaXMubm9kZS53aWR0aC8yLShub2RlLndpZHRoLzMqMiksMCkpO1xuXG4gICAgICAgIC8v5bGV56S65omL54mMXG4gICAgICAgIHRoaXMuZHJhd1BhaSgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYxcbiAgICAgKi9cbiAgICBjaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy/lh7rniYzlkIjms5XmgKdcbiAgICAgICAgaWYoY29tLmNoZWNrQ2h1UGFpKHNlbGYucGxheWVyLnh1YW5QYWksMCkpe1xuXG4gICAgICAgICAgICAvL+enu+mZpFRPVUNI55uR5ZCsXG4gICAgICAgICAgICBmb3IodmFyIG0gPSAwO208c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7bSsrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnNob3VQYWlbbV0ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHNlbGYudG91Y2hQYWksdGhpcyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lkIjms5VcbiAgICAgICAgICAgIHZhciBpbmRleEFyciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICB2YXIgd2luZG93U2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgIC8v5b6X5Yiw6KaB5Ye655qE54mM5Zyo5omL54mM5Lit55qE5L2N572uXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihzZWxmLnBsYXllci5zaG91UGFpW2pdLl9uYW1lPT1zZWxmLnBsYXllci54dWFuUGFpW2ldLl9uYW1lKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QXJyLnB1c2goaik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoMCxzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGluZGV4QXJyLnNvcnQoKTtcblxuICAgICAgICAgICAgLy/muIXnqbrniYzmoYxcbiAgICAgICAgICAgIC8vY29tLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICAvL+WHuueJjOWKqOS9nFxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGluZGV4QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNlbGYucGxheWVyLnNob3VQYWlbaW5kZXhBcnJbaV1dO1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXlh7rniYxcbiAgICAgICAgICAgICAgICBsYXN0UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgICAgIHNwcml0ZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgcCA9IHNwcml0ZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnAoMCwwKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgbm9kZVAgPSBzZWxmLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKHNlbGYubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoLzIsc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB4ID0gd2luZG93U2l6ZS53aWR0aC8yLW5vZGVQLngrMzAqaTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB5ID0gd2luZG93U2l6ZS5oZWlnaHQvMi1wLnk7XG5cbiAgICAgICAgICAgICAgICAvLyBzcHJpdGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjUsY2MucCh4LHkpKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpbmRleEFyci5yZXZlcnNlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8v5LuO5omL54mM5Lit5Yig6ZmkXG4gICAgICAgICAgICBmb3IodmFyIG4gPSAwO248aW5kZXhBcnIubGVuZ3RoO24rKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpLnNwbGljZShpbmRleEFycltuXSwxKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WIt+aWsOaJi+eJjOWxleekulxuICAgICAgICAgICAgc2VsZi5kcmF3UGFpKCk7XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKGxhc3RQYWkpO1xuXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIC8v5LiN5ZCI5rOVXG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gc2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxsZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkucG9wKCkucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIFxuICAgIGJ1Q2h1UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgY29tLm5leHRQbGF5ZXIoKTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrmiYvniYxcbiAgICAgKi9cbiAgICBkcmF3UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNvbS5zb3J0UGFpKHNlbGYucGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgIHZhciBudW0gPSBzZWxmLnBsYXllci5zaG91UGFpLmxlbmd0aDtcblxuICAgICAgICAvL3ZhciBzaXplID0gc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCk7XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPG51bTtpKyspe1xuXG4gICAgICAgICAgICB2YXIgcGFpID0gc2VsZi5wbGF5ZXIuc2hvdVBhaVtpXTtcbiAgICAgICAgICAgIC8vIGNjLmxvZyhcInBhaSBpOlwiK2kpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHBhaSk7XG4gICAgICAgICAgICAvLyBjYy5sb2coXCJzZWxmLm5vZGU6XCIpO1xuICAgICAgICAgICAgLy8gY2MubG9nKHNlbGYubm9kZSk7XG4gICAgICAgICAgICBzZWxmLm5vZGUuYWRkQ2hpbGQocGFpKTtcbiAgICAgICAgICAgIC8vIHBhaS5zZXRTY2FsZSgwLjUpO1xuICAgICAgICAgICAgcGFpLnNldFBvc2l0aW9uKGNjLnAoLShwYWkud2lkdGgrKG51bS0xKSozMCkvMitwYWkud2lkdGgvMitpKjMwLDApKTtcbiAgICAgICAgICAgIHBhaS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVE9VQ0jnm5HlkKzlm57osINcbiAgICAgKi9cbiAgICB0b3VjaFBhaTpmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgaWYobm9kZS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtqXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGo7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleD09LTEpe1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnB1c2gobm9kZSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwzMCkpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoaW5kZXgsMSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG52YXIgYWkgPSByZXF1aXJlKCdBSScpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNob3VQYWlOdW06e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXJJbWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3VycmVudFRhZzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25MYWJlbDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIGlzQUk6bnVsbCwvL+aYr+WQpuaYr0FJXG5cbiAgICAgICAgc2hvdVBhaTpudWxsLC8v5omL54mMXG5cbiAgICAgICAgeHVhblBhaTpudWxsLC8v6YCJ5Lit55qE54mMXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgICAgICBpZih0aGlzLnNob3VQYWkhPW51bGwpe1xuICAgICAgICAgICAgdGhpcy5zaG91UGFpTnVtLnN0cmluZyA9IHRoaXMuc2hvdVBhaS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpe1xuXG4gICAgICAgIGlmKHRoaXMuaXNBSSl7XG5cbiAgICAgICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICBhaS5jaHVQYWkodGhpcyk7XG5cbiAgICAgICAgICAgIH0sMSk7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAvL+S4jeaYr0FJXG5cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG59KTtcbiJdfQ==