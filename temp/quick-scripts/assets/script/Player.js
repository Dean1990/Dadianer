(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c5d8QamBFBuaHZjtQBUcp+', 'Player', __filename);
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

        isXuanZhan: false //是否宣战


    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {

        if (this.isXuanZhan) {
            this.xuanZhan.string = com.lang.declare;
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
        //# sourceMappingURL=Player.js.map
        