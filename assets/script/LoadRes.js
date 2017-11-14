var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {
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

    	//加载语言
        var langjson = "language/string_cn.json";

        if(cc.sys.language == cc.sys.LANGUAGE_CHINESE){
            langjson = "language/string_cn.json";
        }else if (cc.sys.language == LANGUAGE_ENGLISH){
            langjson = "language/string_en.json";
        }

        cc.loader.loadRes(langjson,function(err,result){
            
            cc.log("系统语言："+cc.sys.language+" result>>"+result +" err>>" +err);

            com.lang = result;

            cc.director.loadScene("launch");
                        
        });

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
