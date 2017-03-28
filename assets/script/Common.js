module.exports = {

    playerNum : 4,//玩家数

    paiNum : 32,//牌数

    players: null,//所有玩家的容器

    lastPai:null,//上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer:0,//当前出牌的玩家

    setFirstPlayer:function(firstPlayer){
        
        //this._firstPlayer = firstPlayer;
        this._currentPlayer = firstPlayer;

    },

    nextPlayer:function(){

        this._currentPlayer = (this._currentPlayer+1)%this.playerNum;

        //cc.log(this.players[this._currentPlayer]);

        this.players[this._currentPlayer].getComponent("Player").toggle();

    },
        
    /**
     * 检查出牌的合法性
     */
    checkChuPai:function(xuanPai,p){

        var isCurrent = p==this._currentPlayer;

        // isCurrent = true;

        //是否该出牌
        if(!isCurrent){

            return false;
        }

        //判断选中的牌
        if(xuanPai!=null){

            if(this.lastPai==null || this.lastPai.length==0){

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
                if(arr[i]._name.substring(0,1)=="E"){

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
     * 不包括大小鬼
     */
    convertValue:function(l){

        if(l<4){

            return 13+l;

        }else {

            return l;

        }

    },

    /**
     * 大小鬼权值转换 
     * 
     */
    convertClownValue:function(l){
        //大鬼 l = 0  小鬼 l=1
        //小鬼要大于最大的单
        return 13+3+2-l;

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

            if(f == "E"){
                //鬼
                weight = this.convertClownValue(l);
                

            }else {

                weight = this.convertValue(l);

            }
            //特例
            if(arr.length==2){

                if(l == 10){

                    return 33;//比对3大1

                }else if(l == 5){

                    var value = f.charCodeAt()+arr[1]._name.substring(0,1).charCodeAt();
                                    
                    if(value == 196){
                        //对黑5
                        return 67;//比对红5大1
                    }else if(value == 198){
                        //对红5
                        return 66//比对鬼大1
                    }
                    
                }else if(f == "E"){

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

                    var code1 = name1.substring(0,1).charCodeAt();
                    var code2 = name2.substring(0,1).charCodeAt();

                    //5的特殊排序
                    if(name1.substring(1)=="5"){
                        //把对黑5或对红5放到一起
                        //把红桃与草花互换
                        if(code1==99){

                            code1 = 98;

                        }else if(code1==98){

                            code1 = 99;

                        }

                        if(code2==99){

                            code2 = 98;

                        }else if(code2==98){

                            code2 = 99;

                        }

                    }

                    if(code1>code2){

                        var temp = spriteArr[i];

                        spriteArr[i] = spriteArr[j];

                        spriteArr[j] = temp;

                    }

                }
            }
            

        }

    },

};
