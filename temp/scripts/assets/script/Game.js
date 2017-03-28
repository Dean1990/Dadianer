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