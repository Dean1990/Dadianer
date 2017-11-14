(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Launch.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9cac70OYI5K7qV8sa8VyBRS', 'Launch', __filename);
// script/Launch.js

"use strict";

var com = require('Common');

cc.Class({
    extends: cc.Component,

    properties: {

        startGameBtnLabel: {
            default: null,
            type: cc.Label
        },

        rulesBtnLabel: {
            default: null,
            type: cc.Label
        },

        exitBtnLabel: {
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

        this.startGameBtnLabel.string = com.lang.startGame;
        this.rulesBtnLabel.string = com.lang.rules;
        this.exitBtnLabel.string = com.lang.exit;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    startGame: function startGame() {

        cc.director.loadScene("main");
    },

    info: function info() {

        cc.director.loadScene("info");
    },

    exitGame: function exitGame() {

        cc.game.end();
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
        //# sourceMappingURL=Launch.js.map
        