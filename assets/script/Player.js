var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {

        shouPaiNum:{
            default:null,
            type:cc.Label,
        },

        playerImg:{
            default:null,
            type:cc.Sprite,
        },

        shouPai:null,//手牌

        xuanPai:null,//选中的牌

        
    },

    // use this for initialization
    onLoad: function () {
        

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(this.shouPai!=null){
            this.shouPaiNum.string = this.shouPai.length;
        }
    },

});
