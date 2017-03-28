require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AI":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3865cNvozdCB615DN8X95x0', 'AI');
// script\AI.js

var com = require('Common');
module.exports = {

    chuPai: function chuPai(player) {

        //var node = com.players[com._currentPlayer];

        //cc.log(player.node.shouPai);

        com.sortPai(player.node.shouPai);

        if (com.lastPai == null || com.lastPai.length == 0) {

            //出一个最小权值的组合

        } else {

                var lastWeight = com.convertValueMore(com.lastPai);

                var weightArr = this.analyze(player.node.shouPai);

                //cc.log(weightArr);

                this.sortWeightArr(weightArr);

                for (var i = 0; i < weightArr.length; i++) {

                    var weight = weightArr[i][0];

                    if (weight > lastWeight && (com.lastPai.length == 1 && (weight <= 180 || weight >= 1000) || com.lastPai.length > 1)) {

                        //  var canvas = cc.director.getScene().getChildByName('Canvas');

                        //  cc.log(canvas);

                        var size = cc.winSize;

                        //出牌
                        var pais = player.node.shouPai.splice(weightArr[i][1], weightArr[i][2]);

                        //清空lastPai
                        if (com.lastPai != null) {
                            //清空上家出的牌 准备记录此次出牌
                            com.lastPai.splice(0, com.lastPai.length);
                        } else {

                            com.lastPai = new Array();
                        }

                        //展示
                        for (var j = 0; j < pais.length; j++) {

                            var node = pais[j];

                            cc.director.getScene().addChild(node);

                            node.setPosition(cc.p(size.width / 2 + j * 30, size.height / 2));

                            //更新到lastPai
                            com.lastPai.push(pais[j]);
                        }

                        com.nextPlayer();

                        break;
                    }
                }
            }
    },

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

        // var lastLength = com.lastPai.length;

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

    lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    setFirstPlayer: function setFirstPlayer(firstPlayer) {

        //this._firstPlayer = firstPlayer;
        this._currentPlayer = firstPlayer;
    },

    nextPlayer: function nextPlayer() {

        this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

        //cc.log(this.players[this._currentPlayer]);

        this.players[this._currentPlayer].getComponent("Player").toggle();
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

            if (this.lastPai == null || this.lastPai.length == 0) {

                return this.composeCheck(xuanPai);
            } else {

                var length = xuanPai.length;

                var lastLength = this.lastPai.length;

                if (lastLength == 1) {
                    //单
                    if (length == 1) {

                        return this.convertValueMore(xuanPai) > this.convertValueMore(this.lastPai);
                    } else {
                        //炸 大于32为炸
                        var value = this.convertValueMore(xuanPai);

                        return value > 32 && value > this.convertValueMore(this.lastPai);
                    }
                } else if (lastLength >= 2 && lastLength < 5) {
                    //对
                    if (length >= 2) {
                        //可以出对，也可以出炸
                        return this.convertValueMore(xuanPai) > this.convertValueMore(this.lastPai);
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

            node.shouPai = new Array();

            com.players.push(node);
        }

        for (var i = 0; i < com.paiNum; i++) {

            var j = i % com.playerNum;

            var sprite = cc.instantiate(pais.shift());

            com.players[j].shouPai.push(sprite);

            if (sprite._name == "a11") {

                com.setFirstPlayer(j);
            }
        }

        self.paiAn.getComponent('PaiAn').player = com.players[0];

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

            //出牌动作
            for (var i = 0; i < indexArr.length; i++) {

                var sprite = self.player.shouPai[indexArr[i]];

                var p = sprite.convertToWorldSpace(cc.p(0, 0));

                var nodeP = self.node.convertToWorldSpace(cc.p(self.node.getContentSize().width / 2, self.node.getContentSize().height / 2));

                var x = windowSize.width / 2 - nodeP.x + 30 * i;

                var y = windowSize.height / 2 - p.y;

                sprite.runAction(cc.moveTo(0.5, cc.p(x, y)));
            }

            indexArr.reverse();

            if (com.lastPai != null) {
                //清空上家出的牌 准备记录此次出牌
                com.lastPai.splice(0, com.lastPai.length);
            } else {

                com.lastPai = new Array();
            }

            //从手牌中删除
            for (var n = 0; n < indexArr.length; n++) {
                //记录出牌，更新到lastPai
                com.lastPai.push(self.player.shouPai[indexArr[n]]);

                self.player.shouPai.splice(indexArr[n], 1);
            }

            //刷新手牌展示
            self.drawPai();

            com.nextPlayer();
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
            pai.setPosition(cc.p(i * 30, 0));
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

        isAI: true,

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

            ai.chuPai(this);
        } else {}
    }

});

cc._RFpop();
},{"AI":"AI","Common":"Common"}]},{},["AI","Common","Game","PaiAn","Player"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6L0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHQvQUkuanMiLCJhc3NldHMvc2NyaXB0L0NvbW1vbi5qcyIsImFzc2V0cy9zY3JpcHQvR2FtZS5qcyIsImFzc2V0cy9zY3JpcHQvUGFpQW4uanMiLCJhc3NldHMvc2NyaXB0L1BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDUTtBQUNSO0FBQ1E7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1k7QUFDWjtBQUNZO0FBQ1o7QUFDQTtBQUNBO0FBQ1k7QUFDWjtBQUNZO0FBQ1o7QUFDZ0I7QUFDaEI7QUFDZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNxQjtBQUNyQjtBQUNBO0FBQ29CO0FBQ3BCO0FBQ0E7QUFDb0I7QUFDcEI7QUFDd0I7QUFDeEI7QUFDQTtBQUV3QjtBQUF4QjtBQUNBO0FBQ0E7QUFHb0I7QUFEcEI7QUFHd0I7QUFEeEI7QUFHd0I7QUFEeEI7QUFHd0I7QUFEeEI7QUFDQTtBQUd3QjtBQUR4QjtBQUNBO0FBS29CO0FBSHBCO0FBS29CO0FBSHBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFVSTtBQVJKO0FBVVE7QUFSUjtBQVVZO0FBUlo7QUFVZ0I7QUFSaEI7QUFVb0I7QUFScEI7QUFVb0I7QUFScEI7QUFVb0I7QUFScEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWNJO0FBWko7QUFjUTtBQVpSO0FBQ0E7QUFDQTtBQWNRO0FBWlI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWVZO0FBYlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWVnQjtBQWJoQjtBQWVnQjtBQWJoQjtBQWVnQjtBQWJoQjtBQUNBO0FBZXdCO0FB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Q1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNJO0FBQ0E7QUFDWjtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHSTtBQURKO0FBR1E7QUFEUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlJO0FBRko7QUFJUTtBQUZSO0FBSVE7QUFGUjtBQUNBO0FBSVE7QUFGUjtBQUlZO0FBRlo7QUFDQTtBQUtRO0FBSFI7QUFLUTtBQUhSO0FBS1E7QUFIUjtBQUtZO0FBSFo7QUFLWTtBQUhaO0FBS1k7QUFIWjtBQUNBO0FBTVE7QUFKUjtBQU1ZO0FBSlo7QUFNWTtBQUpaO0FBTVk7QUFKWjtBQU1ZO0FBSlo7QUFNZ0I7QUFKaEI7QUFDQTtBQUNBO0FBUVE7QUFOUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNPQTtBQUNBO0FBQ0k7QUFDSjtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ1k7QUFDQTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDUTtBQUNSO0FBQ0E7QUFDUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUk7QUFBSjtBQUVRO0FBQVI7QUFDQTtBQUVRO0FBQVI7QUFDQTtBQUVZO0FBQVo7QUFFZ0I7QUFBaEI7QUFDQTtBQUNBO0FBR1k7QUFEWjtBQUdZO0FBRFo7QUFDQTtBQUdZO0FBRFo7QUFHZ0I7QUFEaEI7QUFHb0I7QUFEcEI7QUFDQTtBQUNBO0FBR3dCO0FBRHhCO0FBQ0E7QUFDQTtBQUNBO0FBSVk7QUFGWjtBQUlZO0FBRlo7QUFDQTtBQUlnQjtBQUZoQjtBQUlvQjtBQUZwQjtBQUlvQjtBQUZwQjtBQUlvQjtBQUZwQjtBQUlvQjtBQUZwQjtBQUlvQjtBQUZwQjtBQUlvQjtBQUZwQjtBQUNBO0FBTVk7QUFKWjtBQU1ZO0FBSlo7QUFNZ0I7QUFKaEI7QUFDQTtBQU9nQjtBQUxoQjtBQUNBO0FBQ0E7QUFRWTtBQU5aO0FBUWdCO0FBTmhCO0FBUWdCO0FBTmhCO0FBQ0E7QUFDQTtBQVNZO0FBUFo7QUFTWTtBQVBaO0FBQ0E7QUFVWTtBQVJaO0FBVVk7QUFSWjtBQVVnQjtBQVJoQjtBQUNBO0FBQ0E7QUFDQTtBQWNJO0FBWko7QUFjUTtBQVpSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFlSTtBQWJKO0FBZVE7QUFiUjtBQWVZO0FBYlo7QUFlWTtBQWJaO0FBQ0E7QUFDQTtBQWVZO0FBYlo7QUFlZ0I7QUFiaEI7QUFlZ0I7QUFiaEI7QUFlZ0I7QUFDQTtBQWJoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFrQkk7QUFoQko7QUFrQlE7QUFoQlI7QUFrQlE7QUFDQTtBQWhCUjtBQWtCUTtBQWhCUjtBQWtCWTtBQWhCWjtBQWtCZ0I7QUFoQmhCO0FBa0JnQjtBQWhCaEI7QUFDQTtBQUNBO0FBb0JRO0FBbEJSO0FBb0JZO0FBbEJaO0FBb0JZO0FBbEJaO0FBQ0E7QUFxQlk7QUFuQlo7QUFxQlk7QUFuQlo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0o7QUFDSTtBQUNKO0FBQ1E7QUFDSTtBQUNBO0FBQ1o7QUFDQTtBQUNRO0FBQ0k7QUFDQTtBQUNaO0FBQ0E7QUFDUTtBQUNSO0FBQ1E7QUFDUjtBQUNRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFFSTtBQUFKO0FBQ0E7QUFLSTtBQUhKO0FBS1E7QUFDSTtBQUhaO0FBQ0E7QUFDQTtBQUtJO0FBSEo7QUFLUTtBQUhSO0FBS1k7QUFIWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gICAgY2h1UGFpOiBmdW5jdGlvbiAocGxheWVyKXtcblxuICAgICAgICAvL3ZhciBub2RlID0gY29tLnBsYXllcnNbY29tLl9jdXJyZW50UGxheWVyXTtcblxuICAgICAgICAvL2NjLmxvZyhwbGF5ZXIubm9kZS5zaG91UGFpKTtcblxuICAgICAgICBjb20uc29ydFBhaShwbGF5ZXIubm9kZS5zaG91UGFpKVxuXG4gICAgICAgIGlmKGNvbS5sYXN0UGFpPT1udWxsfHxjb20ubGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAvL+WHuuS4gOS4quacgOWwj+adg+WAvOeahOe7hOWQiFxuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgdmFyIGxhc3RXZWlnaHQgPSBjb20uY29udmVydFZhbHVlTW9yZShjb20ubGFzdFBhaSk7XG5cbiAgICAgICAgICAgIHZhciB3ZWlnaHRBcnIgPSB0aGlzLmFuYWx5emUocGxheWVyLm5vZGUuc2hvdVBhaSk7XG5cbiAgICAgICAgICAgIC8vY2MubG9nKHdlaWdodEFycik7XG5cbiAgICAgICAgICAgIHRoaXMuc29ydFdlaWdodEFycih3ZWlnaHRBcnIpO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHdlaWdodCA9IHdlaWdodEFycltpXVswXTtcblxuICAgICAgICAgICAgICAgIGlmKHdlaWdodD5sYXN0V2VpZ2h0ICYmICgoKGNvbS5sYXN0UGFpLmxlbmd0aD09MSAmJiAod2VpZ2h0PD0xODAgfHwgd2VpZ2h0Pj0xMDAwKSl8fGNvbS5sYXN0UGFpLmxlbmd0aD4xKSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICB2YXIgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gIGNjLmxvZyhjYW52YXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICB2YXIgc2l6ZSA9IGNjLndpblNpemU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy/lh7rniYxcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhaXMgPSBwbGF5ZXIubm9kZS5zaG91UGFpLnNwbGljZSh3ZWlnaHRBcnJbaV1bMV0sd2VpZ2h0QXJyW2ldWzJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgLy/muIXnqbpsYXN0UGFpXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvbS5sYXN0UGFpIT1udWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5riF56m65LiK5a625Ye655qE54mMIOWHhuWkh+iusOW9leatpOasoeWHuueJjFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tLmxhc3RQYWkuc3BsaWNlKDAsY29tLmxhc3RQYWkubGVuZ3RoKTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbS5sYXN0UGFpID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8v5bGV56S6XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHBhaXNbal07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmRpcmVjdG9yLmdldFNjZW5lKCkuYWRkQ2hpbGQobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUuc2V0UG9zaXRpb24oY2MucChzaXplLndpZHRoLzIgKyBqKjMwLHNpemUuaGVpZ2h0LzIpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/mm7TmlrDliLBsYXN0UGFpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb20ubGFzdFBhaS5wdXNoKHBhaXNbal0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAgICAgY29tLm5leHRQbGF5ZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaOkuW6j+adg+WAvOWIl+ihqFxuICAgICAqL1xuICAgIHNvcnRXZWlnaHRBcnI6ZnVuY3Rpb24od2VpZ2h0QXJyKXtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8d2VpZ2h0QXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBmb3IodmFyIGogPSBpO2o8d2VpZ2h0QXJyLmxlbmd0aDtqKyspe1xuXG4gICAgICAgICAgICAgICAgaWYod2VpZ2h0QXJyW2ldWzBdPndlaWdodEFycltqXVswXSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXBBcnIgPSB3ZWlnaHRBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyW2ldID0gd2VpZ2h0QXJyW2pdO1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodEFycltqXSA9IHRlbXBBcnI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6h566X5Y+v5Lul5Ye654mM55qE5omA5pyJ5p2D5YC8XG4gICAgICovXG4gICAgYW5hbHl6ZTpmdW5jdGlvbihwYWlzKXtcblxuICAgICAgICB2YXIgd2VpZ2h0QXJyID0gbmV3IEFycmF5KCk7Ly9b5p2D5YC8LOW8gOWni+S4i+aghyzplb/luqZdXG5cbiAgICAgICAgLy8gdmFyIGxhc3RMZW5ndGggPSBjb20ubGFzdFBhaS5sZW5ndGg7XG5cbiAgICAgICAgaWYocGFpcyE9bnVsbCl7XG5cbiAgICAgICAgICAgIC8vIGZvcih2YXIgaiA9IDA7ajxwYWlzLmxlbmd0aDtqKyspe1xuICAgICAgICAgICAgLy8gICAgIGNjLmxvZyhwYWlzW2pdLl9uYW1lKTtcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHBhaXMubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coXCJpOlwiK2kpO1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZyh3ZWlnaHRBcnIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAvLyBjYy5sb2cocGFpc1tpXS5fbmFtZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZiA9IHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgbCA9IHBhcnNlSW50KHBhaXNbaV0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgIGlmKGYgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAvLyBpZihsYXN0TGVuZ3RoPT0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v6ay8IOWNleW8oFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0Q2xvd25WYWx1ZShsKSxpLDFdKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gaSsxO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKGo8cGFpcy5sZW5ndGgpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZjIgPSBwYWlzW2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZjIgPT0gXCJFXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a2Y5YKo5a+56ay855qE5p2D5YC8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWVNb3JlKHBhaXMuc2xpY2UoaSxqKzEpKSxpLDJdKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WvueWNleW8oOeahOadg+WAvOS/neWtmFxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0QXJyLnB1c2goW2NvbS5jb252ZXJ0VmFsdWUobCksaSwxXSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcG9zZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGRve1xuICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoaStqKTxwYWlzLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbDIgPSBwYXJzZUludChwYWlzW2kral0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcG9zZSA9IGw9PWwyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIGlzRGlmZmVyZW50Rml2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC8v5a+56IqxNeeahOWkhOeQhlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmKGw9PTUgJiYgaj09MSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgdmFyIGYyID0gcGFpc1tpK2pdLl9uYW1lLnN1YnN0cmluZygwLDEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjb2RlID0gZi5jaGFyQ29kZUF0KCkrZjIuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIC8v5LiN5piv5a+56buRNee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgaWYoY29kZSE9MTk2ICYmIGNvZGUhPTE5OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlzRGlmZmVyZW50Rml2ZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYoaXNDb21wb3NlICYmICghKGxhc3RMZW5ndGg9PTEgJiYgaj09MSkgfHwgKGw9PTUgJiYgIWlzRGlmZmVyZW50Rml2ZSkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihpc0NvbXBvc2Upe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8v5a+55aSa5byg55qE5p2D5YC85L+d5a2YXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlaWdodEFyci5wdXNoKFtjb20uY29udmVydFZhbHVlTW9yZShwYWlzLnNsaWNlKGksaStqKzEpKSxpLGorMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9d2hpbGUoaXNDb21wb3NlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsIT01KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vNeeJueauiuS4jeiDveecgeeVpei/meS4qui/h+eoi1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/ljrvpmaTph43lpI3mnYPlgLzorqHnrpdcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBpK2otMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3ZWlnaHRBcnI7XG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICAgIHBsYXllck51bSA6IDQsLy/njqnlrrbmlbBcblxuICAgIHBhaU51bSA6IDMyLC8v54mM5pWwXG5cbiAgICBwbGF5ZXJzOiBudWxsLC8v5omA5pyJ546p5a6255qE5a655ZmoXG5cbiAgICBsYXN0UGFpOm51bGwsLy/kuIrlrrblh7rnmoTniYxcblxuICAgIC8vX2ZpcnN0UGxheWVyOjAsLy/nrKzkuIDkuKrlh7rniYznmoTnjqnlrrZcblxuICAgIF9jdXJyZW50UGxheWVyOjAsLy/lvZPliY3lh7rniYznmoTnjqnlrrZcblxuICAgIHNldEZpcnN0UGxheWVyOmZ1bmN0aW9uKGZpcnN0UGxheWVyKXtcbiAgICAgICAgXG4gICAgICAgIC8vdGhpcy5fZmlyc3RQbGF5ZXIgPSBmaXJzdFBsYXllcjtcbiAgICAgICAgdGhpcy5fY3VycmVudFBsYXllciA9IGZpcnN0UGxheWVyO1xuXG4gICAgfSxcblxuICAgIG5leHRQbGF5ZXI6ZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLl9jdXJyZW50UGxheWVyID0gKHRoaXMuX2N1cnJlbnRQbGF5ZXIrMSkldGhpcy5wbGF5ZXJOdW07XG5cbiAgICAgICAgLy9jYy5sb2codGhpcy5wbGF5ZXJzW3RoaXMuX2N1cnJlbnRQbGF5ZXJdKTtcblxuICAgICAgICB0aGlzLnBsYXllcnNbdGhpcy5fY3VycmVudFBsYXllcl0uZ2V0Q29tcG9uZW50KFwiUGxheWVyXCIpLnRvZ2dsZSgpO1xuXG4gICAgfSxcbiAgICAgICAgXG4gICAgLyoqXG4gICAgICog5qOA5p+l5Ye654mM55qE5ZCI5rOV5oCnXG4gICAgICovXG4gICAgY2hlY2tDaHVQYWk6ZnVuY3Rpb24oeHVhblBhaSxwKXtcblxuICAgICAgICB2YXIgaXNDdXJyZW50ID0gcD09dGhpcy5fY3VycmVudFBsYXllcjtcblxuICAgICAgICAvLyBpc0N1cnJlbnQgPSB0cnVlO1xuXG4gICAgICAgIC8v5piv5ZCm6K+l5Ye654mMXG4gICAgICAgIGlmKCFpc0N1cnJlbnQpe1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL+WIpOaWremAieS4reeahOeJjFxuICAgICAgICBpZih4dWFuUGFpIT1udWxsKXtcblxuICAgICAgICAgICAgaWYodGhpcy5sYXN0UGFpPT1udWxsIHx8IHRoaXMubGFzdFBhaS5sZW5ndGg9PTApe1xuXG4gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvc2VDaGVjayh4dWFuUGFpKTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGxlbmd0aCA9IHh1YW5QYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RMZW5ndGggPSB0aGlzLmxhc3RQYWkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgaWYobGFzdExlbmd0aD09MSl7XG4gICAgICAgICAgICAgICAgICAgIC8v5Y2VXG4gICAgICAgICAgICAgICAgICAgIGlmKGxlbmd0aCA9PSAxKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlTW9yZSh4dWFuUGFpKT50aGlzLmNvbnZlcnRWYWx1ZU1vcmUodGhpcy5sYXN0UGFpKTtcblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+eCuCDlpKfkuo4zMuS4uueCuFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU+MzIgJiYgdmFsdWU+dGhpcy5jb252ZXJ0VmFsdWVNb3JlKHRoaXMubGFzdFBhaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobGFzdExlbmd0aCA+PSAyICYmIGxhc3RMZW5ndGggPCA1KXtcbiAgICAgICAgICAgICAgICAgICAgLy/lr7lcbiAgICAgICAgICAgICAgICAgICAgaWYobGVuZ3RoPj0yKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+v5Lul5Ye65a+577yM5Lmf5Y+v5Lul5Ye654K4XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVNb3JlKHh1YW5QYWkpPnRoaXMuY29udmVydFZhbHVlTW9yZSh0aGlzLmxhc3RQYWkpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5LiN6IO95Ye65Y2VXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu4TlkIjmo4Dmn6VcbiAgICAgKi9cbiAgICBjb21wb3NlQ2hlY2s6ZnVuY3Rpb24oYXJyKXtcblxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJyLmxlbmd0aDtcblxuICAgICAgICBpZihsZW5ndGg9PTEpe1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfWVsc2UgaWYobGVuZ3RoPDUpe1xuXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICB2YXIgaXNDbG93biA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwO2k8bGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgLy/prLzmmK/kuIDkuKrnibnmrornmoTnu4TlkIhcbiAgICAgICAgICAgICAgICBpZihhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDAsMSk9PVwiRVwiKXtcblxuICAgICAgICAgICAgICAgICAgICBpZihpc0Nsb3duKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy/lj6rmnInkuKTlvKAg5LiU6YO95piv6ay8XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihsZW5ndGggPT0yICl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaXNDbG93biA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8v6L+b5Yiw6L+Z6YeM77yM6L+Z5byg54mM5LiN5piv5aSn5bCP6ay877yM5Ye6546w5LiN5ZCM5p2D5YC8IOi/lOWbnmZhbHNlXG4gICAgICAgICAgICAgICAgICAgIGlmKGlzQ2xvd24pe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZTIgPSBhcnJbaV0uX25hbWUuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlIT12YWx1ZTIpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5aaC5p6c5Yiw6L+Z6YeMIGlzQ2xvd24g5Li655yf77yM5Y+K5pyJ6ay85a2Y5Zyo77yM5L2G5aSa5byg54mM5Y+q5pyJ5LiA5Liq6ay877yM6K+05piO54mM57uE5ZCI5LiN5a+5XG4gICAgICAgICAgICByZXR1cm4gIWlzQ2xvd247XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiBcbiAgICAgKiDkuI3ljIXmi6zlpKflsI/prLxcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWU6ZnVuY3Rpb24obCl7XG5cbiAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgcmV0dXJuICgxMytsKSoxMDtcblxuICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgIHJldHVybiBsKjEwO1xuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlpKflsI/prLzmnYPlgLzovazmjaIgXG4gICAgICogXG4gICAgICovXG4gICAgY29udmVydENsb3duVmFsdWU6ZnVuY3Rpb24obCl7XG4gICAgICAgIC8v5aSn6ay8IGwgPSAwICDlsI/prLwgbD0xXG4gICAgICAgIC8v5bCP6ay86KaB5aSn5LqO5pyA5aSn55qE5Y2VXG4gICAgICAgIHJldHVybiAoMTMrMysyLWwpKjEwO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOadg+WAvOi9rOaNoiDlpJrlvKBcbiAgICAgKi9cbiAgICBjb252ZXJ0VmFsdWVNb3JlOmZ1bmN0aW9uKGFycil7XG5cbiAgICAgICAgdmFyIHdlaWdodCA9IDA7XG5cbiAgICAgICAgaWYoYXJyPT1udWxsIHx8IGFyci5sZW5ndGggPT0gMCB8fCAhdGhpcy5jb21wb3NlQ2hlY2soYXJyKSl7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQ7XG5cbiAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgZiA9IGFyclswXS5fbmFtZS5zdWJzdHJpbmcoMCwxKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBwYXJzZUludChhcnJbMF0uX25hbWUuc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICAgICAgaWYoZiA9PSBcIkVcIil7XG4gICAgICAgICAgICAgICAgLy/prLxcbiAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMyszKzItbDtcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYobDw0KXtcblxuICAgICAgICAgICAgICAgICAgICB3ZWlnaHQgPSAxMytsO1xuXG4gICAgICAgICAgICAgICAgfWVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHdlaWdodCA9IGw7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v54m55L6LXG4gICAgICAgICAgICBpZihhcnIubGVuZ3RoPT0yKXtcblxuICAgICAgICAgICAgICAgIGlmKGwgPT0gMTApe1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCwyKSsxOy8v5q+U5a+5M+WkpzFcblxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGwgPT0gNSl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZi5jaGFyQ29kZUF0KCkrYXJyWzFdLl9uYW1lLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih2YWx1ZSA9PSAxOTYpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy/lr7npu5E1XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTYqTWF0aC5wb3coMTAsNCkrMzsvL+avlOWvuee6ojXlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbHVlID09IDE5OCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+Wvuee6ojVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxNipNYXRoLnBvdygxMCw0KSsyLy/mr5Tlr7nprLzlpKcxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoZiA9PSBcIkVcIil7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE2Kk1hdGgucG93KDEwLDQpKzE7Ly/mr5Tlm5vkuKoz5aSnMVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vY2MubG9nKFwid2VpZ2h0OlwiK3dlaWdodCk7XG5cbiAgICAgICAgICAgIHJldHVybiB3ZWlnaHQgKiBNYXRoLnBvdygxMCxhcnIubGVuZ3RoKTtcblxuXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmjpLluo/mlrnms5VcbiAgICAgKi9cbiAgICBzb3J0UGFpOmZ1bmN0aW9uKHNwcml0ZUFycil7XG5cbiAgICAgICAgLy9jYy5sb2coc3ByaXRlQXJyKTtcblxuICAgICAgICBmb3IodmFyIGkgPSAwO2k8c3ByaXRlQXJyLmxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICBmb3IodmFyIGogPSBpKzE7ajxzcHJpdGVBcnIubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTEgPSBzcHJpdGVBcnJbaV0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICB2YXIgbmFtZTIgPSBzcHJpdGVBcnJbal0uX25hbWU7XG5cbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhuYW1lMS5zdWJzdHJpbmcoMSkpO1xuXG4gICAgICAgICAgICAgICAgLy9jYy5sb2coXCJuYW1lMTpcIituYW1lMStcIiBuYW1lMjpcIituYW1lMik7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHBhcnNlSW50KG5hbWUxLnN1YnN0cmluZygxKSk+cGFyc2VJbnQobmFtZTIuc3Vic3RyaW5nKDEpKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9jYy5sb2coXCItbmFtZTE6XCIrbmFtZTErXCIgbmFtZTI6XCIrbmFtZTIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gc3ByaXRlQXJyW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICBzcHJpdGVBcnJbal0gPSB0ZW1wO1xuXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYobmFtZTEuc3Vic3RyaW5nKDEpPT1uYW1lMi5zdWJzdHJpbmcoMSkpe1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2RlMSA9IG5hbWUxLnN1YnN0cmluZygwLDEpLmNoYXJDb2RlQXQoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUyID0gbmFtZTIuc3Vic3RyaW5nKDAsMSkuY2hhckNvZGVBdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vNeeahOeJueauiuaOkuW6j1xuICAgICAgICAgICAgICAgICAgICBpZihuYW1lMS5zdWJzdHJpbmcoMSk9PVwiNVwiKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK5a+56buRNeaIluWvuee6ojXmlL7liLDkuIDotbdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5oqK57qi5qGD5LiO6I2J6Iqx5LqS5o2iXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb2RlMT09OTkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZTEgPSA5ODtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoY29kZTE9PTk4KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUxID0gOTk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29kZTI9PTk5KXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUyID0gOTg7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGUyPT05OCl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlMiA9IDk5O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGNvZGUxPmNvZGUyKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBzcHJpdGVBcnJbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwcml0ZUFycltpXSA9IHNwcml0ZUFycltqXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3ByaXRlQXJyW2pdID0gdGVtcDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblxuICAgICAgICB9XG5cbiAgICB9LFxuXG59O1xuIiwidmFyIGNvbSA9IHJlcXVpcmUoJ0NvbW1vbicpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBsYXllcjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBwYWlBbjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlNwcml0ZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCwgICAgICAvLyBUaGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHVzZWQgb25seSB3aGVuIHRoZSBjb21wb25lbnQgYXR0YWNoaW5nXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub2RlIGZvciB0aGUgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuXG4gICAgICAgIGExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGE1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGExMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYTEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBhMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgYjE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYjU6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGIxMDp7XG4gICAgICAgIC8vICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgIC8vICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgLy8gfSxcbiAgICAgICAgYjExOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBiMTI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGIxMzp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcblxuICAgICAgICBjMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzI6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjNTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEwOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBjMTE6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGMxMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgYzEzOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG4gICAgICAgIGQxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMjp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIGQ1OntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICAvLyBkMTA6e1xuICAgICAgICAvLyAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAvLyAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGQxMTp7XG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXG4gICAgICAgICAgICB0eXBlOmNjLlByZWZhYixcbiAgICAgICAgfSxcbiAgICAgICAgZDEyOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuICAgICAgICBkMTM6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgRTA6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5QcmVmYWIsXG4gICAgICAgIH0sXG4gICAgICAgIEUxOntcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcbiAgICAgICAgICAgIHR5cGU6Y2MuUHJlZmFiLFxuICAgICAgICB9LFxuXG5cbiAgICAgICAgXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBpbml0OmZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHBhaXMgPSBuZXcgQXJyYXkoc2VsZi5hMSxzZWxmLmEyLHNlbGYuYTMsc2VsZi5hNSxzZWxmLmExMCxzZWxmLmExMSxzZWxmLmExMixzZWxmLmExMyxzZWxmLmIxLHNlbGYuYjIsc2VsZi5iMyxzZWxmLmI1LHNlbGYuYjEwLHNlbGYuYjExLHNlbGYuYjEyLHNlbGYuYjEzLHNlbGYuYzEsc2VsZi5jMixzZWxmLmMzLHNlbGYuYzUsc2VsZi5jMTAsc2VsZi5jMTEsc2VsZi5jMTIsc2VsZi5jMTMsc2VsZi5kMSxzZWxmLmQyLHNlbGYuZDMsc2VsZi5kNSxzZWxmLmQxMCxzZWxmLmQxMSxzZWxmLmQxMixzZWxmLmQxMyxzZWxmLkUwLHNlbGYuRTEpO1xuXG4gICAgICAgIC8v5omT5Lmx5pWw57uEXG4gICAgICAgIHBhaXMuc29ydChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICByZXR1cm4gMC41IC0gTWF0aC5yYW5kb20oKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgcHAgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICBjb20ucGxheWVycyA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgIGZvcih2YXIgaiA9IDA7ajxjb20ucGxheWVyTnVtO2orKyl7XG5cbiAgICAgICAgICAgIHZhciBub2RlID0gY2MuaW5zdGFudGlhdGUodGhpcy5wbGF5ZXIpO1xuXG4gICAgICAgICAgICBub2RlLnNob3VQYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgY29tLnBsYXllcnMucHVzaChub2RlKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yKHZhciBpID0gMDtpPGNvbS5wYWlOdW07aSsrKXtcblxuICAgICAgICAgICAgdmFyIGogPSBpJWNvbS5wbGF5ZXJOdW07XG5cbiAgICAgICAgICAgIHZhciBzcHJpdGUgPSBjYy5pbnN0YW50aWF0ZShwYWlzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICBjb20ucGxheWVyc1tqXS5zaG91UGFpLnB1c2goc3ByaXRlKTtcblxuICAgICAgICAgICAgaWYoc3ByaXRlLl9uYW1lID09IFwiYTExXCIpe1xuXG4gICAgICAgICAgICAgICAgY29tLnNldEZpcnN0UGxheWVyKGopO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYucGFpQW4uZ2V0Q29tcG9uZW50KCdQYWlBbicpLnBsYXllciA9IGNvbS5wbGF5ZXJzWzBdO1xuXG4gICAgICAgIFxuXG4gICAgICAgIC8vIGZvcih2YXIgbiA9IDA7bjxwcC5sZW5ndGg7bisrKXtcblxuICAgICAgICAvLyAgICAgc2VsZi5wbGF5ZXIwLmdldENvbXBvbmVudCgnUGxheWVyJykuU2hvdVBhaSA9IHBwWzBdO1xuXG4gICAgICAgIC8vIH1cblxuICAgIH0sXG59KTtcbiIsInZhciBjb20gPSByZXF1aXJlKCdDb21tb24nKTtcbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcGxheWVyOntcblxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMucGxheWVyLnh1YW5QYWkgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAvL+WxleekuuaJi+eJjFxuICAgICAgICB0aGlzLmRyYXdQYWkoKTtcblxuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxuXG4gICAgLyoqXG4gICAgICog5Ye654mMXG4gICAgICovXG4gICAgY2h1UGFpOmZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8v5Ye654mM5ZCI5rOV5oCnXG4gICAgICAgIGlmKGNvbS5jaGVja0NodVBhaShzZWxmLnBsYXllci54dWFuUGFpLDApKXtcblxuICAgICAgICAgICAgLy/np7vpmaRUT1VDSOebkeWQrFxuICAgICAgICAgICAgZm9yKHZhciBtID0gMDttPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO20rKyl7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpW21dLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCxzZWxmLnRvdWNoUGFpLHRoaXMpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8v5ZCI5rOVXG4gICAgICAgICAgICB2YXIgaW5kZXhBcnIgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgICAgICAgdmFyIHdpbmRvd1NpemUgPSBjYy53aW5TaXplO1xuXG4gICAgICAgICAgICAvL+W+l+WIsOimgeWHuueahOeJjOWcqOaJi+eJjOS4reeahOS9jee9rlxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPHNlbGYucGxheWVyLnh1YW5QYWkubGVuZ3RoO2krKyl7XG5cbiAgICAgICAgICAgICAgICBmb3IodmFyIGo9MDtqPHNlbGYucGxheWVyLnNob3VQYWkubGVuZ3RoO2orKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoc2VsZi5wbGF5ZXIuc2hvdVBhaVtqXS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtpXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY2MubG9nKHNlbGYucGxheWVyLnNob3VQYWlbal0uX25hbWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleEFyci5wdXNoKGopO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYucGxheWVyLnh1YW5QYWkuc3BsaWNlKDAsc2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpbmRleEFyci5zb3J0KCk7XG5cbiAgICAgICAgICAgICAgICAvL+WHuueJjOWKqOS9nFxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxpbmRleEFyci5sZW5ndGg7aSsrKXtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgc3ByaXRlID0gc2VsZi5wbGF5ZXIuc2hvdVBhaVtpbmRleEFycltpXV07XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBzcHJpdGUuY29udmVydFRvV29ybGRTcGFjZShjYy5wKDAsMCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBub2RlUCA9IHNlbGYubm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnAoc2VsZi5ub2RlLmdldENvbnRlbnRTaXplKCkud2lkdGgvMixzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKS5oZWlnaHQvMikpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB4ID0gd2luZG93U2l6ZS53aWR0aC8yLW5vZGVQLngrMzAqaTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IHdpbmRvd1NpemUuaGVpZ2h0LzItcC55O1xuXG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZS5ydW5BY3Rpb24oY2MubW92ZVRvKDAuNSxjYy5wKHgseSkpKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpbmRleEFyci5yZXZlcnNlKCk7XG5cbiAgICAgICAgICAgIGlmKGNvbS5sYXN0UGFpIT1udWxsKXtcbiAgICAgICAgICAgICAgICAvL+a4heepuuS4iuWutuWHuueahOeJjCDlh4blpIforrDlvZXmraTmrKHlh7rniYxcbiAgICAgICAgICAgICAgICBjb20ubGFzdFBhaS5zcGxpY2UoMCxjb20ubGFzdFBhaS5sZW5ndGgpO1xuXG4gICAgICAgICAgICB9ZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb20ubGFzdFBhaSA9IG5ldyBBcnJheSgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8v5LuO5omL54mM5Lit5Yig6ZmkXG4gICAgICAgICAgICBmb3IodmFyIG4gPSAwO248aW5kZXhBcnIubGVuZ3RoO24rKyl7XG4gICAgICAgICAgICAgICAgLy/orrDlvZXlh7rniYzvvIzmm7TmlrDliLBsYXN0UGFpXG4gICAgICAgICAgICAgICAgY29tLmxhc3RQYWkucHVzaChzZWxmLnBsYXllci5zaG91UGFpW2luZGV4QXJyW25dXSk7XG5cbiAgICAgICAgICAgICAgICBzZWxmLnBsYXllci5zaG91UGFpLnNwbGljZShpbmRleEFycltuXSwxKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WIt+aWsOaJi+eJjOWxleekulxuICAgICAgICAgICAgc2VsZi5kcmF3UGFpKCk7XG5cbiAgICAgICAgICAgIGNvbS5uZXh0UGxheWVyKCk7XG5cbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy/kuI3lkIjms5VcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBzZWxmLnBsYXllci54dWFuUGFpLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPGxlbmd0aDtpKyspe1xuXG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5wb3AoKS5ydW5BY3Rpb24oY2MubW92ZUJ5KDAuMSwwLC0zMCkpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgXG4gICAgYnVDaHVQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICBjb20ubmV4dFBsYXllcigpO1xuXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWxleekuuaJi+eJjFxuICAgICAqL1xuICAgIGRyYXdQYWk6ZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgICAgIGNvbS5zb3J0UGFpKHNlbGYucGxheWVyLnNob3VQYWkpO1xuXG4gICAgICAgICAgICB2YXIgbnVtID0gc2VsZi5wbGF5ZXIuc2hvdVBhaS5sZW5ndGg7XG5cbiAgICAgICAgICAgIC8vdmFyIHNpemUgPSBzZWxmLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDtpPG51bTtpKyspe1xuXG4gICAgICAgICAgICAgICAgdmFyIHBhaSA9IHNlbGYucGxheWVyLnNob3VQYWlbaV07XG4gICAgICAgICAgICAgICAgLy8gY2MubG9nKHBhaSk7XG4gICAgICAgICAgICAgICAgc2VsZi5ub2RlLmFkZENoaWxkKHBhaSk7XG4gICAgICAgICAgICAgICAgLy8gcGFpLnNldFNjYWxlKDAuNSk7XG4gICAgICAgICAgICAgICAgcGFpLnNldFBvc2l0aW9uKGNjLnAoaSozMCwwKSk7XG4gICAgICAgICAgICAgICAgcGFpLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULHNlbGYudG91Y2hQYWksdGhpcyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVE9VQ0jnm5HlkKzlm57osINcbiAgICAgKi9cbiAgICB0b3VjaFBhaTpmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICB2YXIgaW5kZXggPSAtMTtcblxuICAgICAgICBmb3IodmFyIGogPSAwO2o8c2VsZi5wbGF5ZXIueHVhblBhaS5sZW5ndGg7aisrKXtcblxuICAgICAgICAgICAgaWYobm9kZS5fbmFtZT09c2VsZi5wbGF5ZXIueHVhblBhaVtqXS5fbmFtZSl7XG5cbiAgICAgICAgICAgICAgICBpbmRleCA9IGo7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBpZihpbmRleD09LTEpe1xuXG4gICAgICAgICAgICBzZWxmLnBsYXllci54dWFuUGFpLnB1c2gobm9kZSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwzMCkpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXIueHVhblBhaS5zcGxpY2UoaW5kZXgsMSk7XG5cbiAgICAgICAgICAgIG5vZGUucnVuQWN0aW9uKGNjLm1vdmVCeSgwLjEsMCwtMzApKTtcblxuICAgICAgICB9XG5cbiAgICB9LFxufSk7XG4iLCJ2YXIgY29tID0gcmVxdWlyZSgnQ29tbW9uJyk7XG52YXIgYWkgPSByZXF1aXJlKCdBSScpO1xuXG5jYy5DbGFzcyh7XG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNob3VQYWlOdW06e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbCxcbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5ZXJJbWc6e1xuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxuICAgICAgICAgICAgdHlwZTpjYy5TcHJpdGUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBSTp0cnVlLFxuXG4gICAgICAgIHNob3VQYWk6bnVsbCwvL+aJi+eJjFxuXG4gICAgICAgIHh1YW5QYWk6bnVsbCwvL+mAieS4reeahOeJjFxuXG4gICAgICAgIFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG5cbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgICAgIGlmKHRoaXMuc2hvdVBhaSE9bnVsbCl7XG4gICAgICAgICAgICB0aGlzLnNob3VQYWlOdW0uc3RyaW5nID0gdGhpcy5zaG91UGFpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB0b2dnbGU6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgaWYodGhpcy5pc0FJKXtcblxuICAgICAgICAgICAgYWkuY2h1UGFpKHRoaXMpO1xuXG4gICAgICAgIH1lbHNlIHtcblxuXG5cbiAgICAgICAgfVxuXG4gICAgfSxcblxufSk7XG4iXX0=