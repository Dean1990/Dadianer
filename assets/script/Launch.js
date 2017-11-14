var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {

    	startGameBtnLabel:{
    		default:null,
            type:cc.Label,
    	},

    	rulesBtnLabel:{
    		default:null,
    		type:cc.Label,
    	},

    	exitBtnLabel:{
    		default:null,
    		type:cc.Label,
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
    },

    // use this for initialization
    onLoad: function () {

    	this.startGameBtnLabel.string = com.lang.startGame;
    	this.rulesBtnLabel.string = com.lang.rules;
    	this.exitBtnLabel.string = com.lang.exit;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    startGame:function (){

        cc.director.loadScene("main");
    },

    info:function(){

        cc.director.loadScene("info");

    },

    exitGame:function(){

        cc.game.end();

    },
});
