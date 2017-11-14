(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Info.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '260eba28uVACaJSc1X2j0YK', 'Info', __filename);
// script/Info.js

"use strict";

var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {

        closeBtnLabel: {
            default: null,
            type: cc.Label
        }
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

        this.closeBtnLabel.string = com.lang.close;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    close: function close() {

        cc.director.loadScene("launch");
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
        //# sourceMappingURL=Info.js.map
        