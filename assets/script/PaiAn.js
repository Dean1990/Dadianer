var com = require('Common');
cc.Class({
    extends: cc.Component,

    properties: {

        player:{

            default:null,
            type:cc.Sprite,

        }

    },

    // use this for initialization
    onLoad: function () {

        this.player.xuanPai = new Array();

        //展示手牌
        this.drawPai();

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     * 出牌
     */
    chuPai:function(){

        var self = this;

        //出牌合法性
        if(com.checkChuPai(self.player.xuanPai,0)){

            //移除TOUCH监听
            for(var m = 0;m<self.player.shouPai.length;m++){

                self.player.shouPai[m].off(cc.Node.EventType.TOUCH_START,self.touchPai,this);

            }

            //合法
            var indexArr = new Array();

            var windowSize = cc.winSize;

            //得到要出的牌在手牌中的位置
            for(var i = 0;i<self.player.xuanPai.length;i++){

                for(var j=0;j<self.player.shouPai.length;j++){

                    if(self.player.shouPai[j]._name==self.player.xuanPai[i]._name){

                        //cc.log(self.player.shouPai[j]._name);

                        indexArr.push(j);

                    }
                }
            }

            self.player.xuanPai.splice(0,self.player.xuanPai.length);

            indexArr.sort();

                //出牌动作
                for(var i = 0;i<indexArr.length;i++){

                    var sprite = self.player.shouPai[indexArr[i]];

                    var p = sprite.convertToWorldSpace(cc.p(0,0));

                    var nodeP = self.node.convertToWorldSpace(cc.p(self.node.getContentSize().width/2,self.node.getContentSize().height/2));

                    var x = windowSize.width/2-nodeP.x+30*i;

                    var y = windowSize.height/2-p.y;

                    sprite.runAction(cc.moveTo(0.5,cc.p(x,y)));

                }
            

            indexArr.reverse();

            if(com.lastPai!=null){
                //清空上家出的牌 准备记录此次出牌
                com.lastPai.splice(0,com.lastPai.length);

            }else {

                com.lastPai = new Array();

            }
            
            //从手牌中删除
            for(var n = 0;n<indexArr.length;n++){
                //记录出牌，更新到lastPai
                com.lastPai.push(self.player.shouPai[indexArr[n]]);

                self.player.shouPai.splice(indexArr[n],1);

            }

            //刷新手牌展示
            self.drawPai();

            com.nextPlayer();

        }else {
            //不合法
            var length = self.player.xuanPai.length;

            for(var i = 0;i<length;i++){

                self.player.xuanPai.pop().runAction(cc.moveBy(0.1,0,-30));

            }
        
        }

    },

    
    buChuPai:function(){

        com.nextPlayer();

    },

    /**
     * 展示手牌
     */
    drawPai:function(){

        var self = this;

            com.sortPai(self.player.shouPai);

            var num = self.player.shouPai.length;

            //var size = self.node.getContentSize();

            for(var i = 0;i<num;i++){

                var pai = self.player.shouPai[i];
                // cc.log(pai);
                self.node.addChild(pai);
                // pai.setScale(0.5);
                pai.setPosition(cc.p(i*30,0));
                pai.on(cc.Node.EventType.TOUCH_START,self.touchPai,this);

            }
        

    },

    /**
     * TOUCH监听回调
     */
    touchPai:function(event){

        var self = this;

        var node = event.target;
        var index = -1;

        for(var j = 0;j<self.player.xuanPai.length;j++){

            if(node._name==self.player.xuanPai[j]._name){

                index = j;

                break;

            }

        }

        if(index==-1){

            self.player.xuanPai.push(node);

            node.runAction(cc.moveBy(0.1,0,30));

        }else {

            self.player.xuanPai.splice(index,1);

            node.runAction(cc.moveBy(0.1,0,-30));

        }

    },
});
