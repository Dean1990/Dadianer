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