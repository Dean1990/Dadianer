var com = require('Common');
module.exports = {

    chuPai: function (player){

        //有人要风
        if(com.getWindPlayerNum!=-1){

            if(com.isPlayerParty(com._currentPlayer,com.getWindPlayerNum)){
                //队友  不出
                com.nextPlayer();

                return;
                
            }

        }

        com.sortPai(player.shouPai)

        var isEnableXuanZhan = com.checkEnableXuanZhan();

        if(isEnableXuanZhan!=0){
            //可以宣战
            //设置宣战
            player.isXuanZhan = true;

            //宣战 修改全局变量
            com.isXuanZhan = true;

            if(isEnableXuanZhan==1){

                player.actionLabel.string = com.lang.declareWar;

            }else if(isEnableXuanZhan==2){

                player.actionLabel.string = com.lang.follow;

            }
            
        }

        if((com.getWindPlayerNum==com._currentPlayer) || com._lastPai==null||com._lastPai.length==0){

            this.firstChuPai(player);

        }else {

            var pais = this.getEnableChuPai(player);

            com.nextPlayer(pais);

            
        }

    },

    /**
     * 第一个出牌
     */
    firstChuPai:function(player){

        var weightArr = this.analyze(player.shouPai);

        //出一个最小权值的组合
        if(weightArr.length>0){

            var pais = player.shouPai.splice(weightArr[0][1],weightArr[0][2]);

            com.nextPlayer(pais);

        }

    },

    /**
     * 计算出可以出的牌
     */
    getEnableChuPai:function(player){

            var weightArr = this.analyze(player.shouPai);

            var lastWeight = com.convertValueMore(com._lastPai);

            //要出的牌
            var pais = null;

            for(var i = 0;i<weightArr.length;i++){

                var weight = weightArr[i][0];

                if(weight>lastWeight && (((com._lastPai.length==1 && (weight<=180 || weight>1600))||com._lastPai.length>1))){

                    //上一张牌是否是队友出的
                    if(com.isPlayerParty(com._currentPlayer,com.lastPlayerNum) && ((com._lastPai.length==1 && weight>140) || (com._lastPai.length>1 && weight>1400))){
                        //不怼队友
                        //大于A或者大于对A 不出
                    }else {

                        //出牌
                        pais = player.shouPai.splice(weightArr[i][1],weightArr[i][2]);

                    }

                    break;

                }

            }

            return pais;

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
    sortWeightArr:function(weightArr){

        for(var i = 0;i<weightArr.length;i++){

            for(var j = i;j<weightArr.length;j++){

                if(weightArr[i][0]>weightArr[j][0]){

                    var tempArr = weightArr[i];

                    weightArr[i] = weightArr[j];

                    weightArr[j] = tempArr;

                }

            }

        }

    },

    /**
     * 剔除不合理的权值
     */
    trim:function(weightArr){

        var trimWeightArr = new Array();

        if(weightArr!=null && weightArr.length>0){

            var indexArr = new Array();

            for(var i = weightArr.length-1;i>=0;i--){

                if(indexArr.indexOf(weightArr[i][1])==-1){

                    //大于等于最小的炸 不拆开用 //对鬼也没考虑拆开
                    if(weightArr[i][0]>1600){

                        for(var j = weightArr[i][1];j<(weightArr[i][1] + weightArr[i][2]);j++){

                            indexArr.push(j);

                        }

                    }

                    trimWeightArr.push(weightArr[i]);
                    
                }

                

            }

        }

        this.sortWeightArr(trimWeightArr);

        return trimWeightArr;

    },

    /**
     * 计算可以出牌的所有权值
     */
    analyze:function(pais){

        var weightArr = new Array();//[权值,开始下标,长度]

        // var lastLength = com._lastPai.length;

        if(pais!=null){

            // for(var j = 0;j<pais.length;j++){
            //     cc.log(pais[j]._name);
            // }
                

            for(var i = 0;i<pais.length;i++){

                // cc.log("i:"+i);
                // cc.log(weightArr.length);
                // cc.log(pais[i]._name);

                var f = pais[i]._name.substring(0,1);

                var l = parseInt(pais[i]._name.substring(1));

                if(f == "E"){
                    // if(lastLength==1){
                        //鬼 单张
                        weightArr.push([com.convertClownValue(l),i,1]);
                    // }

                    var j = i+1;

                    if(j<pais.length){

                        var f2 = pais[j]._name.substring(0,1);
                        if(f2 == "E"){
                            //存储对鬼的权值
                            weightArr.push([com.convertValueMore(pais.slice(i,j+1)),i,2]);

                        }

                    }

                }else {
                    // if(lastLength==1){
                        //对单张的权值保存
                        weightArr.push([com.convertValue(l),i,1]);
                    // }

                    var j = 0;

                    var isCompose = false;

                    do{
                        j++;

                        if((i+j)<pais.length){
                        
                            var l2 = parseInt(pais[i+j]._name.substring(1));

                            isCompose = l==l2;

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
                            if(isCompose){

                                //对多张的权值保存
                                weightArr.push([com.convertValueMore(pais.slice(i,i+j+1)),i,j+1]);
                                
                            }

                        }else{

                            break;

                        }

                    }while(isCompose);

                    if(l!=5){
                        //5特殊不能省略这个过程
                        //去除重复权值计算
                        i = i+j-1;
                    }

                }

            }

        }

        this.sortWeightArr(weightArr);

        return this.trim(weightArr);

    },


    

};
