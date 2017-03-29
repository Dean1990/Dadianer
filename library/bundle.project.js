require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script/AI.js

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
// script/Common.js

module.exports = {

    playerNum: 4, //玩家数

    paiNum: 32, //牌数

    players: null, //所有玩家的容器

    _lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    _buChuNum: 0, //记录不出牌次数

    setFirstPlayer: function setFirstPlayer(firstPlayer) {

        this._currentPlayer = firstPlayer;
    },

    nextPlayer: function nextPlayer(lastPai) {

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
        if (this._buChuNum == 3) {

            //清理牌桌
            this.clearPaiZhuo();

            this._lastPai = null;
        }

        this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

        //cc.log(this.players[this._currentPlayer]);

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
// script/PaiAn.js

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

            //indexArr.reverse();

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
            // cc.log(pai);
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
            }, 5);
        } else {

            //不是AI

        }
    }

});

cc._RFpop();
},{"AI":"AI","Common":"Common"}]},{},["AI","Common","Game","PaiAn","Player"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL3NjcmlwdC9BSS5qcyIsImFzc2V0cy9zY3JpcHQvQ29tbW9uLmpzIiwiYXNzZXRzL3NjcmlwdC9HYW1lLmpzIiwiYXNzZXRzL3NjcmlwdC9QYWlBbi5qcyIsImFzc2V0cy9zY3JpcHQvUGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDUTtBQUNSO0FBQ0E7QUFDWTtBQUNaO0FBQ2dCO0FBQ2hCO0FBQ2dCO0FBQ2hCO0FBQ0E7QUFDQTtBQUdZO0FBRFo7QUFHWTtBQURaO0FBR1k7QUFEWjtBQUdnQjtBQURoQjtBQUdnQjtBQURoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR29CO0FBRHBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdvQjtBQURwQjtBQUdvQjtBQURwQjtBQUdvQjtBQURwQjtBQUNBO0FBQ0E7QUFLWTtBQUhaO0FBS2dCO0FBSGhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFTSTtBQVBKO0FBU1E7QUFQUjtBQVNZO0FBUFo7QUFTZ0I7QUFQaEI7QUFTb0I7QUFQcEI7QUFTb0I7QUFQcEI7QUFTb0I7QUFQcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBekRoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JYQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0k7QUFDSjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7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SGhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgY2h1UGFpOiBmdW5jdGlvbiAocGxheWVyKXtcblxuICAgICAgICBjb20uc29ydFBhaShwbGF5ZXIuc2hvdVBhaSlcblxuICAgICAgICB2YXIgd2VpZ2h0QXJyID0gdGhpcy5hbmFseXplKHBsYXllci5zaG91UGFpKTtcblxuICAgICAgICB0aGlzLnNvcnRXZWlnaHRBcnIod2VpZ2h0QXJyKTtcblxuICAgICAgICBpZihjb20uX2xhc3RQYWk9PW51bGx8fGNvbS5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAvL+WHuuS4gOS4quacgOWwj+adg+WAvOeahOe7hOWQiFxuICAgICAgICAgICAgaWYod2VpZ2h0QXJyLmxlbmd0aD4wKXtcblxuICAgICAgICAgICAgICAgIHZhciBwYWlzID0gcGxheWVyLnNob3VQYWkuc3BsaWNlKHdlaWdodEFyclswXVsxXSx3ZWlnaHRBcnJbMF1bMl0pO1xuXG4gICAgICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIocGFpcyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBsYXN0V2VpZ2h0ID0gY29tLmNvbnZlcnRWYWx1ZU1vcmUoY29tLl9sYXN0UGFpKTtcblxuICAgICAgICAgICAgdmFyIGlzQnVDaHVQYWkgPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHdlaWdodEFycltpXVswXTtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodD5sYXN0V2VpZ2h0ICYmICgoKGNvbS5fbGFzdFBhaS5sZW5ndGg9PTEgJiYgKHdlaWdodDw9MTgwIHx8IHdlaWdodD4xNjAwKSl8fGNvbS5fbGFzdFBhaS5sZW5ndGg+MSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvLyAgdmFyIGNhbnZhcyA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q2hpbGRCeU5hbWUoJ0NhbnZhcycpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICBjYy5sb2coY2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgLy/lh7rniYxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhaXMgPSBwbGF5ZXIuc2hvdVBhaS5zcGxpY2Uod2VpZ2h0QXJyW2ldWzFdLHdlaWdodEFycltpXVsyXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/muIXnqbrniYzmoYxcbiAgICAgICAgICAgICAgICAgICAgLy9jb20uY2xlYXJQYWlaaHVvKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmNodVBhaUFjdGlvbihwYWlzKTtcblxuICAgICAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcihwYWlzKTtcblxuICAgICAgICAgICAgICAgICAgICBpc0J1Q2h1UGFpID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoaXNCdUNodVBhaSl7XG5cbiAgICAgICAgICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Ye654mM5Yqo5L2cXG4gICAgICovXG4gICAgLy8gY2h1UGFpQWN0aW9uOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgLy8gICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgIC8vICAgICAvLyAvL+a4heepumxhc3RQYWlcbiAgICAvLyAgICAgLy8gaWYoY29tLl9sYXN0UGFpIT1udWxsKXtcbiAgICAvLyAgICAgLy8gICAgIC8v5riF56m65LiK5a625Ye655qE54mMIOWHhuWkh+iusOW9leatpOasoeWHuueJjFxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpLnNwbGljZSgwLGNvbS5fbGFzdFBhaS5sZW5ndGgpO1xuXG4gICAgLy8gICAgIC8vIH1lbHNlIHtcblxuICAgIC8vICAgICAvLyAgICAgY29tLl9sYXN0UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAvLyAgICAgLy8gfVxuXG4gICAgLy8gICAgIC8v5bGV56S6XG4gICAgLy8gICAgIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuXG4gICAgLy8gICAgICAgICB2YXIgbm9kZSA9IHBhaXNbal07XG5cbiAgICAvLyAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAvLyAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgIC8vICAgICAgICAgLy/mm7TmlrDliLBsYXN0UGFpXG4gICAgLy8gICAgICAgICAvLyBjb20uX2xhc3RQYWkucHVzaChwYWlzW2pdKTtcblxuICAgIC8vICAgICB9XG5cbiAgICAvLyB9LFxuXG4gICAgLyoqXG4gICAgICog5o6S5bqP5p2D5YC85YiX6KGoXG4gICAgICovXG4gICAgc29ydFdlaWdodEFycjpmdW5jdGlvbih3ZWlnaHRBcnIpe1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTx3ZWlnaHRBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGk7ajx3ZWlnaHRBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICBpZih3ZWlnaHRBcnJbaV1bMF0+d2VpZ2h0QXJyW2pdWzBdKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcEFyciA9IHdlaWdodEFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHRBcnJbaV0gPSB3ZWlnaHRBcnJbal07XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyW2pdID0gdGVtcEFycjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDorqHnrpflj6/ku6Xlh7rniYznmoTmiYDmnInmnYPlgLxcbiAgICAgKi9cbiAgICBhbmFseXplOmZ1bmN0aW9uKHBhaXMpe1xuXG4gICAgICAgIHZhciB3ZWlnaHRBcnIgPSBuZXcgQXJyYXkoKTsvL1vmnYPlgLws5byA5aeL5LiL5qCHLOmVv+W6pl1cblxuICAgICAgICAvLyB2YXIgbGFzdExlbmd0aCA9IGNvbS5fbGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgaWYocGFpcyE9bnVsbCl7XG5cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgLy8gICAgIGNjLmxvZyhwYWlzW2pdLl9uYW1lKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpOlwiK2kpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh3ZWlnaHRBcnIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocGFpc1tpXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6ay8IOWNleW8oFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0Q2xvd25WYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaSsxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGo8cGFpcy5sZW5ndGgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZjIgPSBwYWlzW2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZjIgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo5a+56ay855qE5p2D5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxqKzEpKSxpLDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWNleW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcG9zZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRve1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoaStqKTxwYWlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbDIgPSBwYXJzZUludChwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9zZSA9IGw9PWwyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGlzRGlmZmVyZW50Rml2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8v5a+56IqxNeeahOWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGw9PTUgJiYgaj09MSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGYyID0gcGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjb2RlID0gZi5jaGFyQ29kZUF0KCkrZjIuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5LiN5piv5a+56buRNee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoY29kZSE9MTk2ICYmIGNvZGUhPTE5OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzRGlmZmVyZW50Rml2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNDb21wb3NlICYmICghKGxhc3RMZW5ndGg9PTEgJiYgaj09MSkgfHwgKGw9PTUgJiYgIWlzRGlmZmVyZW50Rml2ZSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc0NvbXBvc2Upe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55aSa5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaStqKzEpKSxpLGorMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9d2hpbGUoaXNDb21wb3NlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsIT01KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vNeeJueauiuS4jeiDveecgeeVpei/meS4qui/h+eoi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ljrvpmaTph43lpI3mnYPlgLzorqHnrpdcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpK2otMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3ZWlnaHRBcnI7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIHBsYXllck51bSA6IDQsLy/njqnlrrbmlbBcblxuICAgIHBhaU51bSA6IDMyLC8v54mM5pWwXG5cbiAgICBwbGF5ZXJzOiBudWxsLC8v5omA5pyJ546p5a6255qE5a655ZmoXG5cbiAgICBfbGFzdFBhaTpudWxsLC8v5LiK5a625Ye655qE54mMXG5cbiAgICAvL19maXJzdFBsYXllcjowLC8v56ys5LiA5Liq5Ye654mM55qE546p5a62XG5cbiAgICBfY3VycmVudFBsYXllcjowLC8v5b2T5YmN5Ye654mM55qE546p5a62XG5cbiAgICBfYnVDaHVOdW06MCwvL+iusOW9leS4jeWHuueJjOasoeaVsFxuXG4gICAgc2V0Rmlyc3RQbGF5ZXI6ZnVuY3Rpb24oZmlyc3RQbGF5ZXIpe1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRQbGF5ZXIgPSBmaXJzdFBsYXllcjtcblxuICAgIH0sXG5cbiAgICBuZXh0UGxheWVyOmZ1bmN0aW9uKGxhc3RQYWkpe1xuXG4gICAgICAgIGlmKGxhc3RQYWk9PW51bGx8fGxhc3RQYWkubGVuZ3RoPT0wKXtcblxuICAgICAgICAgICAgdGhpcy5fYnVDaHVOdW0gPSB0aGlzLl9idUNodU51bSArIDE7XG4gICAgICAgICAgICAvL+S4jeWHulxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdLmdldENvbXBvbmVudChcIlBsYXllclwiKS5hY3Rpb25MYWJlbC5zdHJpbmcgPSBcIuS4jeWHulwiO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgdGhpcy5fYnVDaHVOdW0gPSAwO1xuICAgICAgICAgICAgLy/muIXnkIbniYzmoYxcbiAgICAgICAgICAgIHRoaXMuY2xlYXJQYWlaaHVvKCk7XG4gICAgICAgICAgICAvL+i1i+WAvFxuICAgICAgICAgICAgdGhpcy5fbGFzdFBhaSA9IGxhc3RQYWk7XG4gICAgICAgICAgICAvL+WxleekulxuICAgICAgICAgICAgdGhpcy5zaG93TGFzdFBhaSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvL+S4ieS4quS4jeWHuu+8jOivtOaYjuWPiOi9ruWIsOS4iuasoeWHuueJjOeahOeOqeWutlxuICAgICAgICBpZih0aGlzLl9idUNodU51bT09Myl7XG5cbiAgICAgICAgICAgIC8v5riF55CG54mM5qGMXG4gICAgICAgICAgICB0aGlzLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICB0aGlzLl9sYXN0UGFpID0gbnVsbDtcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9ICh0aGlzLl9jdXJyZW50UGxheWVyKzEpJXRoaXMucGxheWVyTnVtO1xuXG4gICAgICAgIC8vY2MubG9nKHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXSk7XG4gXG4gICAgICAgIHRoaXMucGxheWVyc1t0aGlzLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgIH0sXG4gICAgICAgIFxuICAgIC8qKlxuICAgICAqIOajgOafpeWHuueJjOeahOWQiOazleaAp1xuICAgICAqL1xuICAgIGNoZWNrQ2h1UGFpOmZ1bmN0aW9uKHh1YW5QYWkscCl7XG5cbiAgICAgICAgdmFyIGlzQ3VycmVudCA9IHA9PXRoaXMuX2N1cnJlbnRQbGF5ZXI7XG5cbiAgICAgICAgLy8gaXNDdXJyZW50ID0gdHJ1ZTtcblxuICAgICAgICAvL+aYr+WQpuivpeWHuueJjFxuICAgICAgICBpZighaXNDdXJyZW50KXtcblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy/liKTmlq3pgInkuK3nmoTniYxcbiAgICAgICAgaWYoeHVhblBhaSE9bnVsbCl7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuX2xhc3RQYWk9PW51bGwgfHwgdGhpcy5fbGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VDaGVjayh4dWFuUGFpKTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RMZW5ndGggPSB0aGlzLl9sYXN0UGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIGlmKGxhc3RMZW5ndGg9PTEpe1xuICAgICAgICAgICAgICAgICAgICAvL+WNlVxuICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0gMSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZU1vcmUoeHVhblBhaSk+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v54K4IOWkp+S6jjE2MDDkuLrngrhcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlPjE2MDAgJiYgdmFsdWU+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMuX2xhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGxhc3RMZW5ndGggPj0gMiAmJiBsYXN0TGVuZ3RoIDwgNSl7XG4gICAgICAgICAgICAgICAgICAgIC8v5a+5XG4gICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aD49Mil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPr+S7peWHuuWvue+8jOS5n+WPr+S7peWHuueCuFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5fbGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/kuI3og73lh7rljZVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOe7hOWQiOajgOafpVxuICAgICAqL1xuICAgIGNvbXBvc2VDaGVjazpmdW5jdGlvbihhcnIpe1xuXG4gICAgICAgIHZhciBsZW5ndGggPSBhcnIubGVuZ3RoO1xuXG4gICAgICAgIGlmKGxlbmd0aD09MSl7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9ZWxzZSBpZihsZW5ndGg8NSl7XG5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgIHZhciBpc0Nsb3duID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxsZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAvL+msvOaYr+S4gOS4queJueauiueahOe7hOWQiFxuICAgICAgICAgICAgICAgIGlmKGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMCwxKT09XCJFXCIpe1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPquacieS4pOW8oCDkuJTpg73mmK/prLxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aCA9PTIgKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0Nsb3duID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy/ov5vliLDov5nph4zvvIzov5nlvKDniYzkuI3mmK/lpKflsI/prLzvvIzlh7rnjrDkuI3lkIzmnYPlgLwg6L+U5ZueZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgaWYoaXNDbG93bil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlMiA9IGFycltpXS5fbmFtZS5zdWJzdHJpbmcoMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodmFsdWUhPXZhbHVlMil7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lpoLmnpzliLDov5nph4wgaXNDbG93biDkuLrnnJ/vvIzlj4rmnInprLzlrZjlnKjvvIzkvYblpJrlvKDniYzlj6rmnInkuIDkuKrprLzvvIzor7TmmI7niYznu4TlkIjkuI3lr7lcbiAgICAgICAgICAgIHJldHVybiAhaXNDbG93bjtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIFxuICAgICAqIOS4jeWMheaLrOWkp+Wwj+msvFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZTpmdW5jdGlvbihsKXtcblxuICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICByZXR1cm4gKDEzK2wpKjEwO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgcmV0dXJuIGwqMTA7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWkp+Wwj+msvOadg+WAvOi9rOaNoiBcbiAgICAgKiBcbiAgICAgKi9cbiAgICBjb252ZXJ0Q2xvd25WYWx1ZTpmdW5jdGlvbihsKXtcbiAgICAgICAgLy/lpKfprLwgbCA9IDAgIOWwj+msvCBsPTFcbiAgICAgICAgLy/lsI/prLzopoHlpKfkuo7mnIDlpKfnmoTljZVcbiAgICAgICAgcmV0dXJuICgxMyszKzItbCkqMTA7XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5p2D5YC86L2s5o2iIOWkmuW8oFxuICAgICAqL1xuICAgIGNvbnZlcnRWYWx1ZU1vcmU6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgd2VpZ2h0ID0gMDtcblxuICAgICAgICBpZihhcnI9PW51bGwgfHwgYXJyLmxlbmd0aCA9PSAwIHx8ICF0aGlzLmNvbXBvc2VDaGVjayhhcnIpKXtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBmID0gYXJyWzBdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICBpZihmID09IFwiRVwiKXtcbiAgICAgICAgICAgICAgICAvL+msvFxuICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzKzMrMi1sO1xuICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZihsPDQpe1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IDEzK2w7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0ID0gbDtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/nibnkvotcbiAgICAgICAgICAgIGlmKGFyci5sZW5ndGg9PTIpe1xuXG4gICAgICAgICAgICAgICAgaWYobCA9PSAxMCl7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDIpKzE7Ly/mr5Tlr7kz5aSnMVxuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobCA9PSA1KXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmLmNoYXJDb2RlQXQoKSthcnJbMV0uX25hbWUuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlID09IDE5Nil7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuem7kTVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSszOy8v5q+U5a+557qiNeWkpzFcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodmFsdWUgPT0gMTk4KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+557qiNVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzIvL+avlOWvuemsvOWkpzFcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihmID09IFwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMTsvL+avlOWbm+S4qjPlpKcxXG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9jYy5sb2coXCJ3ZWlnaHQ6XCIrd2VpZ2h0KTtcblxuICAgICAgICAgICAgcmV0dXJuIHdlaWdodCAqIE1hdGgucG93KDEwLGFyci5sZW5ndGgpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaOkuW6j+aWueazlVxuICAgICAqL1xuICAgIHNvcnRQYWk6ZnVuY3Rpb24oc3ByaXRlQXJyKXtcblxuICAgICAgICAvL2NjLmxvZyhzcHJpdGVBcnIpO1xuXG4gICAgICAgIGZvcih2YXIgaSA9IDA7aTxzcHJpdGVBcnIubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgIGZvcih2YXIgaiA9IGkrMTtqPHNwcml0ZUFyci5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMSA9IHNwcml0ZUFycltpXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lMiA9IHNwcml0ZUFycltqXS5fbmFtZTtcblxuICAgICAgICAgICAgICAgIC8vY2MubG9nKG5hbWUxLnN1YnN0cmluZygxKSk7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIm5hbWUxOlwiK25hbWUxK1wiIG5hbWUyOlwiK25hbWUyKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYocGFyc2VJbnQobmFtZTEuc3Vic3RyaW5nKDEpKT5wYXJzZUludChuYW1lMi5zdWJzdHJpbmcoMSkpKXtcblxuICAgICAgICAgICAgICAgICAgICAvL2NjLmxvZyhcIi1uYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltqXSA9IHRlbXA7XG5cbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PW5hbWUyLnN1YnN0cmluZygxKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUxID0gbmFtZTEuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZTIgPSBuYW1lMi5zdWJzdHJpbmcoMCwxKS5jaGFyQ29kZUF0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8155qE54m55q6K5o6S5bqPXG4gICAgICAgICAgICAgICAgICAgIGlmKG5hbWUxLnN1YnN0cmluZygxKT09XCI1XCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miorlr7npu5E15oiW5a+557qiNeaUvuWIsOS4gOi1t1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/miornuqLmoYPkuI7ojYnoirHkupLmjaJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPT05OSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMSA9IDk4O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihjb2RlMT09OTgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5OTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMj09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTIgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTI9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoY29kZTE+Y29kZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IHNwcml0ZUFycltpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2ldID0gc3ByaXRlQXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlsZXnpLrlnKjniYzmoYzkuIpcbiAgICAgKi9cbiAgICBzaG93TGFzdFBhaTpmdW5jdGlvbigpe1xuXG4gICAgICAgIGNjLmxvZyhcInBsYXllcjpcIit0aGlzLl9jdXJyZW50UGxheWVyKTtcblxuICAgICAgICBpZih0aGlzLl9sYXN0UGFpIT1udWxsICYmIHRoaXMuX2xhc3RQYWkubGVuZ3RoICE9MCl7XG5cbiAgICAgICAgICAgIHZhciBzaXplID0gY2Mud2luU2l6ZTtcblxuICAgICAgICAgICAgLy/lsZXnpLpcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7ajx0aGlzLl9sYXN0UGFpLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9sYXN0UGFpW2pdO1xuXG4gICAgICAgICAgICAgICAgY2MubG9nKFwibm9kZTpcIik7XG4gICAgICAgICAgICAgICAgY2MubG9nKG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmuIXnqbrniYzmoYxcbiAgICAgKi9cbiAgICBjbGVhclBhaVpodW86ZnVuY3Rpb24oKXtcblxuICAgICAgICBjYy5sb2coXCJjbGVhclBhaVpodW9cIik7XG5cbiAgICAgICAgaWYodGhpcy5fbGFzdFBhaSE9bnVsbCAmJiB0aGlzLl9sYXN0UGFpLmxlbmd0aCAhPTApe1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8dGhpcy5fbGFzdFBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdGhpcy5fbGFzdFBhaVtpXTtcblxuICAgICAgICAgICAgICAgIGNjLmxvZyhub2RlKTtcblxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRnJvbVBhcmVudCgpO1xuXG4gICAgICAgICAgICAgICAgbm9kZS5kZXN0cm95KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgXG5cbn07XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcGxheWVyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIHBhaUFuOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuU3ByaXRlLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLCAgICAgIC8vIFRoZSBkZWZhdWx0IHZhbHVlIHdpbGwgYmUgdXNlZCBvbmx5IHdoZW4gdGhlIGNvbXBvbmVudCBhdHRhY2hpbmdcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG5cbiAgICAgICAgYTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBiMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgLy8gYjEwOntcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgLy8gICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICAvLyB9LFxuICAgICAgICBiMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGMxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGM1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgZDE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGQxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgZDExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBFMDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgRTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cblxuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcblxuICAgIGluaXQ6ZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICB2YXIgcGFpcyA9IG5ldyBBcnJheShzZWxmLmExLHNlbGYuYTIsc2VsZi5hMyxzZWxmLmE1LHNlbGYuYTEwLHNlbGYuYTExLHNlbGYuYTEyLHNlbGYuYTEzLHNlbGYuYjEsc2VsZi5iMixzZWxmLmIzLHNlbGYuYjUsc2VsZi5iMTAsc2VsZi5iMTEsc2VsZi5iMTIsc2VsZi5iMTMsc2VsZi5jMSxzZWxmLmMyLHNlbGYuYzMsc2VsZi5jNSxzZWxmLmMxMCxzZWxmLmMxMSxzZWxmLmMxMixzZWxmLmMxMyxzZWxmLmQxLHNlbGYuZDIsc2VsZi5kMyxzZWxmLmQ1LHNlbGYuZDEwLHNlbGYuZDExLHNlbGYuZDEyLHNlbGYuZDEzLHNlbGYuRTAsc2VsZi5FMSk7XG5cbiAgICAgICAgLy/miZPkubHmlbDnu4RcbiAgICAgICAgcGFpcy5zb3J0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHJldHVybiAwLjUgLSBNYXRoLnJhbmRvbSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBwcCA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGNvbS5wbGF5ZXJzID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgZm9yKHZhciBqID0gMDtqPGNvbS5wbGF5ZXJOdW07aisrKXtcblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnBsYXllcik7XG5cbiAgICAgICAgICAgIG5vZGUuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5zaG91UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgICAgIGNvbS5wbGF5ZXJzLnB1c2gobm9kZS5nZXRDb21wb25lbnQoJ1BsYXllcicpKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPGNvbS5wYWlOdW07aSsrKXtcblxuICAgICAgICAgICAgdmFyIGogPSBpJWNvbS5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBjYy5pbnN0YW50aWF0ZShwYWlzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tqXS5zaG91UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgaWYoc3ByaXRlLl9uYW1lID09IFwiYTExXCIpe1xuXG4gICAgICAgICAgICAgICAgY29tLnNldEZpcnN0UGxheWVyKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbS5wbGF5ZXJzWzBdLmlzQUkgPSBmYWxzZTtcbiAgICAgICAgY29tLnBsYXllcnNbMV0uaXNBSSA9IHRydWU7XG4gICAgICAgIGNvbS5wbGF5ZXJzWzJdLmlzQUkgPSB0cnVlO1xuICAgICAgICBjb20ucGxheWVyc1szXS5pc0FJID0gdHJ1ZTtcblxuICAgICAgICAvL+iuvue9rueOqeWutuS9jee9rlxuICAgICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgdmFyIG5vZGUxID0gY29tLnBsYXllcnNbMV0ubm9kZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUxKTtcblxuICAgICAgICBub2RlMS5zZXRQb3NpdGlvbihjYy5wKHNpemUud2lkdGgtKG5vZGUxLndpZHRoLzMqMiksc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgICAgIHZhciBub2RlMiA9IGNvbS5wbGF5ZXJzWzJdLm5vZGU7XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5hZGRDaGlsZChub2RlMik7XG5cbiAgICAgICAgbm9kZTIuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIsc2l6ZS5oZWlnaHQgLSAobm9kZTEuaGVpZ2h0LzMqMikpKTtcblxuICAgICAgICB2YXIgbm9kZTMgPSBjb20ucGxheWVyc1szXS5ub2RlO1xuXG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZTMpO1xuXG4gICAgICAgIG5vZGUzLnNldFBvc2l0aW9uKGNjLnAoKG5vZGUzLndpZHRoLzMqMiksc2l6ZS5oZWlnaHQvMikpO1xuXG4gICAgICAgIC8vY2MubG9nKGNvbS5wbGF5ZXJzWzBdKTtcblxuICAgICAgICBzZWxmLnBhaUFuLmdldENvbXBvbmVudCgnUGFpQW4nKS5wbGF5ZXIgPSBjb20ucGxheWVyc1swXTtcblxuICAgICAgICAvL+WmguaenOaYr+acuuWZqOS6uu+8jOaMh+WumuWHuueJjFxuICAgICAgICBpZihjb20uX2N1cnJlbnRQbGF5ZXIhPTAgJiYgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS5pc0FJKXtcblxuICAgICAgICAgICAgY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXS50b2dnbGUoKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgXG5cbiAgICAgICAgLy8gZm9yKHZhciBuID0gMDtuPHBwLmxlbmd0aDtuKyspe1xuXG4gICAgICAgIC8vICAgICBzZWxmLnBsYXllcjAuZ2V0Q29tcG9uZW50KCdQbGF5ZXInKS5TaG91UGFpID0gcHBbMF07XG5cbiAgICAgICAgLy8gfVxuXG4gICAgfSxcbn0pO1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuY2MuQ2xhc3Moe1xuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICBwbGF5ZXI6e1xuXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIueHVhblBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIFxuXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5wbGF5ZXIubm9kZTtcblxuICAgICAgICAvLyBjYy5kaXJlY3Rvci5nZXRTY2VuZSgpLmFkZENoaWxkKG5vZGUpO1xuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChub2RlKTtcblxuICAgICAgICBub2RlLnNldFBvc2l0aW9uKGNjLnAoLXRoaXMubm9kZS53aWR0aC8yLShub2RlLndpZHRoLzMqMiksMCkpO1xuXG4gICAgICAgIC8v5bGV56S65omL54mMXG4gICAgICAgIHRoaXMuZHJhd1BhaSgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICAvKipcbiAgICAgKiDlh7rniYxcbiAgICAgKi9cbiAgICBjaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgLy/lh7rniYzlkIjms5XmgKdcbiAgICAgICAgaWYoY29tLmNoZWNrQ2h1UGFpKHNlbGYucGxheWVyLnh1YW5QYWksMCkpe1xuXG4gICAgICAgICAgICAvL+enu+mZpFRPVUNI55uR5ZCsXG4gICAgICAgICAgICBmb3IodmFyIG0gPSAwO208c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7bSsrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnNob3VQYWlbbV0ub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHNlbGYudG91Y2hQYWksdGhpcyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy/lkIjms5VcbiAgICAgICAgICAgIHZhciBpbmRleEFyciA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICB2YXIgd2luZG93U2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgIC8v5b6X5Yiw6KaB5Ye655qE54mM5Zyo5omL54mM5Lit55qE5L2N572uXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8c2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihzZWxmLnBsYXllci5zaG91UGFpW2pdLl9uYW1lPT1zZWxmLnBsYXllci54dWFuUGFpW2ldLl9uYW1lKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4QXJyLnB1c2goaik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoMCxzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIGluZGV4QXJyLnNvcnQoKTtcblxuICAgICAgICAgICAgLy/muIXnqbrniYzmoYxcbiAgICAgICAgICAgIC8vY29tLmNsZWFyUGFpWmh1bygpO1xuXG4gICAgICAgICAgICB2YXIgbGFzdFBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICAvL+WHuueJjOWKqOS9nFxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGluZGV4QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwcml0ZSA9IHNlbGYucGxheWVyLnNob3VQYWlbaW5kZXhBcnJbaV1dO1xuXG4gICAgICAgICAgICAgICAgLy/orrDlvZXlh7rniYxcbiAgICAgICAgICAgICAgICBsYXN0UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgICAgIHNwcml0ZS5yZW1vdmVGcm9tUGFyZW50KCk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgcCA9IHNwcml0ZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnAoMCwwKSk7XG5cbiAgICAgICAgICAgICAgICAvLyB2YXIgbm9kZVAgPSBzZWxmLm5vZGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKHNlbGYubm9kZS5nZXRDb250ZW50U2l6ZSgpLndpZHRoLzIsc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCkuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB4ID0gd2luZG93U2l6ZS53aWR0aC8yLW5vZGVQLngrMzAqaTtcblxuICAgICAgICAgICAgICAgIC8vIHZhciB5ID0gd2luZG93U2l6ZS5oZWlnaHQvMi1wLnk7XG5cbiAgICAgICAgICAgICAgICAvLyBzcHJpdGUucnVuQWN0aW9uKGNjLm1vdmVUbygwLjUsY2MucCh4LHkpKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAvL2luZGV4QXJyLnJldmVyc2UoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy/ku47miYvniYzkuK3liKDpmaRcbiAgICAgICAgICAgIGZvcih2YXIgbiA9IDA7bjxpbmRleEFyci5sZW5ndGg7bisrKXtcblxuICAgICAgICAgICAgICAgIHNlbGYucGxheWVyLnNob3VQYWkuc3BsaWNlKGluZGV4QXJyW25dLDEpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5Yi35paw5omL54mM5bGV56S6XG4gICAgICAgICAgICBzZWxmLmRyYXdQYWkoKTtcblxuICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIobGFzdFBhaSk7XG5cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy/kuI3lkIjms5VcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5wb3AoKS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMSwwLC0zMCkpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgXG4gICAgYnVDaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWxleekuuaJi+eJjFxuICAgICAqL1xuICAgIGRyYXdQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgY29tLnNvcnRQYWkoc2VsZi5wbGF5ZXIuc2hvdVBhaSk7XG5cbiAgICAgICAgdmFyIG51bSA9IHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO1xuXG4gICAgICAgIC8vdmFyIHNpemUgPSBzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8bnVtO2krKyl7XG5cbiAgICAgICAgICAgIHZhciBwYWkgPSBzZWxmLnBsYXllci5zaG91UGFpW2ldO1xuICAgICAgICAgICAgLy8gY2MubG9nKHBhaSk7XG4gICAgICAgICAgICBzZWxmLm5vZGUuYWRkQ2hpbGQocGFpKTtcbiAgICAgICAgICAgIC8vIHBhaS5zZXRTY2FsZSgwLjUpO1xuICAgICAgICAgICAgcGFpLnNldFBvc2l0aW9uKGNjLnAoLShwYWkud2lkdGgrKG51bS0xKSozMCkvMitwYWkud2lkdGgvMitpKjMwLDApKTtcbiAgICAgICAgICAgIHBhaS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVE9VQ0jnm5HlkKzlm57osINcbiAgICAgKi9cbiAgICB0b3VjaFBhaTpmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgaWYobm9kZS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtqXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGo7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleD09LTEpe1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnB1c2gobm9kZSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwzMCkpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoaW5kZXgsMSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG52YXIgYWkgPSByZXF1aXJlKCdBSScpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNob3VQYWlOdW06e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXJJbWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgY3VycmVudFRhZzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICBhY3Rpb25MYWJlbDp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsLFxuICAgICAgICB9LFxuXG4gICAgICAgIGlzQUk6bnVsbCwvL+aYr+WQpuaYr0FJXG5cbiAgICAgICAgc2hvdVBhaTpudWxsLC8v5omL54mMXG5cbiAgICAgICAgeHVhblBhaTpudWxsLC8v6YCJ5Lit55qE54mMXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAgICAgaWYodGhpcy5zaG91UGFpIT1udWxsKXtcbiAgICAgICAgICAgIHRoaXMuc2hvdVBhaU51bS5zdHJpbmcgPSB0aGlzLnNob3VQYWkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHRvZ2dsZTogZnVuY3Rpb24oKXtcblxuICAgICAgICBpZih0aGlzLmlzQUkpe1xuXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZShmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgYWkuY2h1UGFpKHRoaXMpO1xuXG4gICAgICAgICAgICB9LDUpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgLy/kuI3mmK9BSVxuXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxufSk7XG4iXX0=