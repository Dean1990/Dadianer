var com = require('Common');
module.exports = {

    chuPai: function (player){

        //var node = com.players[com._currentPlayer];

        //cc.log(player.node.shouPai);

        com.sortPai(player.node.shouPai)

        if(com.lastPai==null||com.lastPai.length==0){

            //出一个最小权值的组合

        }else {

            var weight = com.convertValueMore(com.lastPai);

            var weightArr = this.analyze(player.node.shouPai);

            cc.log(weightArr);

            weightArr.sort();

            cc.log(weightArr);
            
        }

    },

    /**
     * 排序权值列表
     */
    sortweightArr:function(weightArr){



    },

    /**
     * 计算可以出牌的所有权值
     */
    analyze:function(pais){

        var weightArr = new Array();//[权值,开始下标,长度]

        var lastLength = com.lastPai.length;

        if(pais!=null){

            for(var j = 0;j<pais.length;j++){
                cc.log(pais[j]._name);
            }
                

            for(var i = 0;i<pais.length;i++){

                cc.log("i:"+i);
                cc.log(weightArr.length);
                cc.log(pais[i]._name);

                var f = pais[i]._name.substring(0,1);

                var l = parseInt(pais[i]._name.substring(1));

                if(f == "E"){
                    if(lastLength==1){
                        //鬼 单张
                        weightArr.push([com.convertClownValue(l),i,1]);
                    }

                    var j = i+1;

                    if(j<pais.length){

                        var f2 = pais[j]._name.substring(0,1);
                        if(f2 == "E"){
                            //存储对鬼的权值
                            weightArr.push([com.convertValueMore(pais.slice(i,j+1)),i,2]);
                            //去除重复权值计算
                            i = j;

                        }

                    }

                }else {
                    if(lastLength==1){
                        //对单张的权值保存
                        weightArr.push([com.convertValue(l),i,1]);
                    }

                    var j = 0;

                    var isCompose = false;

                    do{
                        j++;

                        if((i+j)<pais.length){
                        
                            var l2 = parseInt(pais[i+j]._name.substring(1));

                            isCompose = l==l2;

                            var isDifferentFive = false;
                            //对花5的处理
                            if(l==5 && j==1){

                                var f2 = pais[i+j]._name.substring(0,1);

                                var code = f.charCodeAt()+f2.charCodeAt();

                                //不是对黑5红5
                                if(code!=196 && code!=198){

                                    isDifferentFive = true;

                                }

                            }

                            if(isCompose && (!(lastLength==1 && j==1) || (l==5 && !isDifferentFive))){

                                //对多张的权值保存
                                weightArr.push([com.convertValueMore(pais.slice(i,i+j+1)),i,j]);
                                
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

        return weightArr;

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
};
