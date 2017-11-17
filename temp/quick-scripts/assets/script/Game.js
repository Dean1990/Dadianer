(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '52296tYeOJGtoyHtGk1jFup', 'Game', __filename);
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

        restartBtnLabel: {
            default: null,
            type: cc.Label
        },

        exitBtnLabel: {
            default: null,
            type: cc.Label
        },

        playBtnLabel: {
            default: null,
            type: cc.Label
        },

        passBtnLabel: {
            default: null,
            type: cc.Label
        },

        declareWarBtnLabel: {
            default: null,
            type: cc.Label
        },

        allowBtnLabel: {
            default: null,
            type: cc.Label
        },

        againBtnLabel: {
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

        this.restartBtnLabel.string = com.lang.restart;
        this.exitBtnLabel.string = com.lang.exit;
        this.playBtnLabel.string = com.lang.play;
        this.passBtnLabel.string = com.lang.pass;
        this.declareWarBtnLabel.string = com.lang.declareWar;
        this.allowBtnLabel.string = com.lang.allow;
        this.againBtnLabel.string = com.lang.again;

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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Game.js.map
        