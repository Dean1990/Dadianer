module.exports = {

    playerNum : 4,//玩家数

    paiNum : 32,//牌数

    players: null,//所有玩家的容器

    lastPai:null,//上家出的牌

    _firstPlayer:0,//第一个出牌的玩家

    _currentPlayer:0,//当前出牌的玩家

    setFirstPlayer:function(firstPlayer){
        
        this._firstPlayer = firstPlayer;
        this._currentPlayer = firstPlayer;

    },

    nextPlayer:function(){

        this._currentPlayer = this._currentPlayer%this.playerNum;

    },
        
    /**
     * 检查出牌的合法性
     */
    checkChuPai:function(xuanPai,isFirst){

        //得到上家出的牌
        if(this.lastPai==null && !isFirst){

            return false;

        }

        //判断选中的牌
        if(xuanPai!=null){

            if(isFirst){

                 return this.composeCheck(xuanPai);

            }else {

                var length = xuanPai.length;

                var lastLength = this.lastPai.length;

                if(lastLength==1){
                    //单
                    if(length == 1){

                        return this.convertValueMore(xuanPai)>this.convertValueMore(this.lastPai);

                    }else {
                        //炸 大于32为炸
                        var value = this.convertValueMore(xuanPai);

                        return value>32 && value>this.convertValueMore(this.lastPai);

                    }

                }else if(lastLength >= 2 && lastLength < 5){
                    //对
                    if(length>=2){
                        //可以出对，也可以出炸
                        return this.convertValueMore(xuanPai)>this.convertValueMore(this.lastPai);

                    }else {
                        //不能出单
                        return false;

                    }

                }

                return false;

            }

        }

        return false;

    },

    /**
     * 组合检查
     */
    composeCheck:function(arr){

        var length = arr.length;

        if(length==1){

            return true;
        }else if(length<5){

            var value = arr[0]._name.substring(1);

            var isClown = false;

            for(var i = 0;i<length;i++){
                //鬼是一个特殊的组合
                if(arr[i]._name.substring(0,1)=="e"){

                    if(isClown){

                        //只有两张 且都是鬼
                        if(length ==2 ){

                            return true;

                        }else {

                            return false;

                        }
                    }else {

                        isClown = true;

                    }
                        

                }else {
                    //进到这里，这张牌不是大小鬼，出现不同权值 返回false
                    if(isClown){

                        return false;

                    }

                    var value2 = arr[i]._name.substring(1);

                    if(value!=value2){

                        return false;

                    }

                }

            }

            //如果到这里 isClown 为真，及有鬼存在，但多张牌只有一个鬼，说明牌组合不对
            return !isClown;

        }else {

            return false;

        }

    },

    /**
     * 权值转换
     */
    convertValue:function(l){

        if(l<4){

            return 13+l;

        }else {

            return l;

        }

    },

    /**
     * 权值转换 多张
     */
    convertValueMore:function(arr){

        var weight = 0;

        if(arr==null || arr.length == 0 || !this.composeCheck(arr)){

            return weight;

        }else {

            var f = arr[0]._name.substring(0,1);

            var l = parseInt(arr[0]._name.substring(1));

            if(f == "e"){
                //鬼
                weight = 13+3+l;
                //大鬼的权值大于最小的对

            }else {

                weight = this.convertValue(l);

            }
            //特例
            if(arr.length==2){

                if(l == 10){

                    return 33;//比对3大1

                }else if(l == 5){

                    var value = f.charCodeAt()+arr[1]._name.substring(0,1).charCodeAt();
                                    
                    if(value == 195){
                        //对黑5
                        return 67;//比对红5大1
                    }else if(value == 199){
                        //对红5
                        return 66//比对鬼大1
                    }
                    
                }else if(f == "e"){

                    return 65;//比四个3大1

                }

            }

            

            return weight * arr.length;


        }

    },

    /**
     * 排序方法
     */
    sortPai:function(spriteArr){

        //cc.log(spriteArr);

        for(var i = 0;i<spriteArr.length;i++){

            for(var j = i+1;j<spriteArr.length;j++){

                var name1 = spriteArr[i]._name;

                var name2 = spriteArr[j]._name;

                //cc.log(name1.substring(1));

                //cc.log("name1:"+name1+" name2:"+name2);
              
                if(parseInt(name1.substring(1))>parseInt(name2.substring(1))){

                    //cc.log("-name1:"+name1+" name2:"+name2);

                    var temp = spriteArr[i];

                    spriteArr[i] = spriteArr[j];

                    spriteArr[j] = temp;

                }else if(name1.substring(1)==name2.substring(1)){

                    if(name1.substring(0,1).charCodeAt()>name2.substring(0,1).charCodeAt()){

                        var temp = spriteArr[i];

                        spriteArr[i] = spriteArr[j];

                        spriteArr[j] = temp;

                    }

                }

            }
            

        }

    },

};
