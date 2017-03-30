var com = require('Common');
var ai = require('AI');

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

        currentTag:{
            default:null,
            type:cc.Sprite,
        },

        actionLabel:{
            default:null,
            type:cc.Label,
        },

        xuanZhan:{
            default:null,
            type:cc.Label,
        },

        isAI:null,//是否是AI

        shouPai:null,//手牌

        xuanPai:null,//选中的牌

        isXuanZhan:false,//是否宣战

        
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        if(this.isXuanZhan){
            this.xuanZhan.string = "宣";
        }
        

        if(this.shouPai!=null){
            this.shouPaiNum.string = this.shouPai.length;
        }
    },

    toggle: function(){

        if(this.isAI){

            this.scheduleOnce(function(){

                ai.chuPai(this);

            },1);

        }else {

            //不是AI


        }

    },

});
