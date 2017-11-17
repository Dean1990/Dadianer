(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/LoadRes.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '890625EtiZDNpq4jxcJ+YGb', 'LoadRes', __filename);
// script/LoadRes.js

"use strict";

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
    onLoad: function onLoad() {

        //加载语言
        var langjson = "language/string_cn.json";

        if (cc.sys.language == cc.sys.LANGUAGE_CHINESE) {
            langjson = "language/string_cn.json";
        } else if (cc.sys.language == cc.sys.LANGUAGE_ENGLISH) {
            langjson = "language/string_en.json";
        }

        cc.loader.loadRes(langjson, function (err, result) {

            cc.log("系统语言：" + cc.sys.language + " result>>" + result + " err>>" + err);

            com.lang = result;

            cc.director.loadScene("launch");
        });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        //# sourceMappingURL=LoadRes.js.map
        