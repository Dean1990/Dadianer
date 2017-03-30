var com = require('Common');
module.exports = {

    chuPai: function chuPai(player) {

        com.sortPai(player.shouPai);

        var isEnableXuanZhan = com.checkEnableXuanZhan(player.shouPai);

        if (isEnableXuanZhan != 0) {
            //可以宣战
            //设置宣战
            player.isXuanZhan = true;

            if (isEnableXuanZhan == 1) {

                player.actionLabel.string = "宣战";
            } else if (isEnableXuanZhan == 2) {

                player.actionLabel.string = "跟";
            }
        }

        var weightArr = this.analyze(player.shouPai);

        this.sortWeightArr(weightArr);

        if (com._lastPai == null || com._lastPai.length == 0) {

            //出一个最小权值的组合
            if (weightArr.length > 0) {

                var pais = player.shouPai.splice(weightArr[0][1], weightArr[0][2]);

                com.nextPlayer(pais);
            }
        } else {

            var lastWeight = com.convertValueMore(com._lastPai);

            var isBuChuPai = true;

            for (var i = 0; i < weightArr.length; i++) {

                var weight = weightArr[i][0];

                if (weight > lastWeight && (com._lastPai.length == 1 && (weight <= 180 || weight > 1600) || com._lastPai.length > 1)) {

                    //  var canvas = cc.director.getScene().getChildByName('Canvas');

                    //  cc.log(canvas);
                    //出牌
                    var pais = player.shouPai.splice(weightArr[i][1], weightArr[i][2]);

                    //清空牌桌
                    //com.clearPaiZhuo();

                    //this.chuPaiAction(pais);

                    com.nextPlayer(pais);

                    isBuChuPai = false;

                    break;
                }
            }

            if (isBuChuPai) {

                com.nextPlayer();
            }
        }
    },

    /**
     * 出牌动作
     */
    // chuPaiAction:function(pais){

    //     var size = cc.winSize;

    //     // //清空lastPai
    //     // if(com._lastPai!=null){
    //     //     //清空上家出的牌 准备记录此次出牌
    //     //     com._lastPai.splice(0,com._lastPai.length);

    //     // }else {

    //     //     com._lastPai = new Array();

    //     // }

    //     //展示
    //     for(var j = 0;j<pais.length;j++){

    //         var node = pais[j];

    //         cc.director.getScene().addChild(node);

    //         node.setPosition(cc.p(size.width/2 + j*30,size.height/2));

    //         //更新到lastPai
    //         // com._lastPai.push(pais[j]);

    //     }

    // },

    /**
     * 排序权值列表
     */
    sortWeightArr: function sortWeightArr(weightArr) {

        for (var i = 0; i < weightArr.length; i++) {

            for (var j = i; j < weightArr.length; j++) {

                if (weightArr[i][0] > weightArr[j][0]) {

                    var tempArr = weightArr[i];

                    weightArr[i] = weightArr[j];

                    weightArr[j] = tempArr;
                }
            }
        }
    },

    /**
     * 计算可以出牌的所有权值
     */
    analyze: function analyze(pais) {

        var weightArr = new Array(); //[权值,开始下标,长度]

        // var lastLength = com._lastPai.length;

        if (pais != null) {

            // for(var j = 0;j<pais.length;j++){
            //     cc.log(pais[j]._name);
            // }

            for (var i = 0; i < pais.length; i++) {

                // cc.log("i:"+i);
                // cc.log(weightArr.length);
                // cc.log(pais[i]._name);

                var f = pais[i]._name.substring(0, 1);

                var l = parseInt(pais[i]._name.substring(1));

                if (f == "E") {
                    // if(lastLength==1){
                    //鬼 单张
                    weightArr.push([com.convertClownValue(l), i, 1]);
                    // }

                    var j = i + 1;

                    if (j < pais.length) {

                        var f2 = pais[j]._name.substring(0, 1);
                        if (f2 == "E") {
                            //存储对鬼的权值
                            weightArr.push([com.convertValueMore(pais.slice(i, j + 1)), i, 2]);
                        }
                    }
                } else {
                    // if(lastLength==1){
                    //对单张的权值保存
                    weightArr.push([com.convertValue(l), i, 1]);
                    // }

                    var j = 0;

                    var isCompose = false;

                    do {
                        j++;

                        if (i + j < pais.length) {

                            var l2 = parseInt(pais[i + j]._name.substring(1));

                            isCompose = l == l2;

                            // var isDifferentFive = false;
                            // //对花5的处理
                            // if(l==5 && j==1){

                            //     var f2 = pais[i+j]._name.substring(0,1);

                            //     var code = f.charCodeAt()+f2.charCodeAt();

                            //     //不是对黑5红5
                            //     if(code!=196 && code!=198){

                            //         isDifferentFive = true;

                            //     }

                            // }

                            // if(isCompose && (!(lastLength==1 && j==1) || (l==5 && !isDifferentFive))){
                            if (isCompose) {

                                //对多张的权值保存
                                weightArr.push([com.convertValueMore(pais.slice(i, i + j + 1)), i, j + 1]);
                            }
                        } else {

                            break;
                        }
                    } while (isCompose);

                    if (l != 5) {
                        //5特殊不能省略这个过程
                        //去除重复权值计算
                        i = i + j - 1;
                    }
                }
            }
        }

        return weightArr;
    }

};
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },