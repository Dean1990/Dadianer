"use strict";

module.exports = {

    playerNum: 4, //玩家数

    paiNum: 32, //牌数

    rounds: 0, //回合数

    players: null, //所有玩家的容器

    _lastPai: null, //上家出的牌

    //_firstPlayer:0,//第一个出牌的玩家

    _currentPlayer: 0, //当前出牌的玩家

    //_buChuNum:0,//记录不出牌次数

    lastPlayerNum: 0, //最后出牌的玩家

    winPlayer: null, //记录胜出者序号

    partyPlayers: null, //记录同一伙可宣战的玩家数组

    isXuanZhan: false, //是否宣战

    num: 0, //记数

    getWindPlayerNum: -1, //记录给风的记数

    //voteGetWindNum:0,//参于投票人数

    setFirstPlayer: function setFirstPlayer(firstPlayer) {

        this._currentPlayer = firstPlayer;

        this.players[this._currentPlayer].currentTag.setVisible(true);
    },

    /**
     * 检查玩家，剔除胜出者，继续游戏
     */
    checkNextPlayerNoWinner: function checkNextPlayerNoWinner() {

        this.num = this.num + 1;

        //控制递归深度
        if (this.winPlayer.length < this.playerNum) {

            if (this.num % this.playerNum == 0) {

                this.rounds = this.rounds + 1;
            }

            this._currentPlayer = (this._currentPlayer + 1) % this.playerNum;

            if (this.winPlayer.indexOf(this._currentPlayer) != -1) {

                this.checkNextPlayerNoWinner();
            }
        }
        // cc.log("chekc player index:"+this._currentPlayer);
    },

    /**
     * 下一个玩家
     */
    nextPlayer: function nextPlayer(lastPai, message) {

        //设置默认值
        // getWindNum = getWindNum||-1;

        //清理当前玩家记录牌
        this.clearRecordPlayerPai();

        //当前调用该函数的玩家部分
        if (lastPai == null || lastPai.length == 0) {

            // this._buChuNum = this._buChuNum + 1;
            //不出
            if (message == null) {

                message = "不出";
            }

            if (this.getWindPlayerNum != -1) {
                //给风
                message = "给风";
            }

            this.players[this._currentPlayer].actionLabel.string = message;
        } else {
            //清除要风记录
            this.getWindPlayerNum = -1;

            // this._buChuNum = 0;
            this.lastPlayerNum = this._currentPlayer;
            //清理牌桌
            this.clearPaiZhuo();

            //赋值
            this._lastPai = lastPai;
            //展示
            this.showLastPai();
        }

        this.players[this._currentPlayer].currentTag.setVisible(false);

        var isPlayerWin = this.players[this._currentPlayer].shouPai.length == 0 && this.winPlayer.indexOf(this._currentPlayer) == -1;

        if (isPlayerWin) {

            //cc.log("wp lenght:"+this.winPlayer.length);

            this.winPlayer.push(this._currentPlayer);

            //this.players[this._currentPlayer].shouPaiNum.string = "";

            this.players[this._currentPlayer].actionLabel.string = "NO. " + this.winPlayer.length;

            var party = this.partyPlayers.indexOf(this._currentPlayer) != -1;

            var isGameOver = false;

            if (this.partyPlayers.length == 1) {
                //1:3

                if (party) {
                    //双鬼胜
                    isGameOver = true;
                } else if (this.winPlayer.length == 3) {
                    //没鬼玩家胜
                    isGameOver = this.winPlayer.indexOf(this.partyPlayers[0]) == -1;
                }
            } else {
                //2:2

                if (this.winPlayer.length == 2) {

                    isGameOver = this.isPlayerParty(this.winPlayer[0], this.winPlayer[1]);
                } else if (this.winPlayer.length == 3) {

                    isGameOver = true;
                }
            }

            if (isGameOver) {

                //清理牌桌
                this.clearPaiZhuo();

                cc.director.getScene().getChildByName('Canvas').getComponent('Game').gameLabel.string = "游戏结束";

                return;
            }
        }

        //********** 当前调用该函数的玩家部分结束 ************


        //下一个玩家部分
        //下一个合法的出牌者
        //this._currentPlayer = (this._currentPlayer+1)%this.playerNum;
        this.checkNextPlayerNoWinner();

        //cc.log(this.players[this._currentPlayer]);

        this.players[this._currentPlayer].currentTag.setVisible(true);

        this.players[this._currentPlayer].actionLabel.string = "";

        //三个不出，说明又轮到上次出牌的玩家 当有胜出者后，判断的数字要减少
        // if(this._buChuNum==(3-this.winPlayer.length)){

        if (this.lastPlayerNum == this._currentPlayer) {

            //清理牌桌
            this.clearPaiZhuo();

            this._lastPai = null;
        }

        if (isPlayerWin) {

            //记录下一个出牌者，及要风者
            this.getWindPlayerNum = this._currentPlayer;

            // getWindNum = this._currentPlayer;

            //更新下一个出牌者+1 出找下下家要风
            this.checkNextPlayerNoWinner();
        }

        //通知玩家可以出牌了
        this.players[this._currentPlayer].toggle();
    },

    /**
     * 检查出牌的合法性
     */
    checkChuPai: function checkChuPai(xuanPai, p) {

        var isCurrent = p == this._currentPlayer;

        // isCurrent = true;

        //是否该出牌
        if (!isCurrent) {

            return false;
        }

        //判断选中的牌
        if (xuanPai != null) {

            if (this.getWindPlayerNum == p || this._lastPai == null || this._lastPai.length == 0) {

                this.clearPaiZhuo();

                return this.composeCheck(xuanPai);
            } else {

                var length = xuanPai.length;

                var lastLength = this._lastPai.length;

                if (lastLength == 1) {
                    //单
                    if (length == 1) {

                        return this.convertValueMore(xuanPai) > this.convertValueMore(this._lastPai);
                    } else {
                        //炸 大于1600为炸
                        var value = this.convertValueMore(xuanPai);

                        return value > 1600 && value > this.convertValueMore(this._lastPai);
                    }
                } else if (lastLength >= 2 && lastLength < 5) {
                    //对
                    if (length >= 2) {
                        //可以出对，也可以出炸
                        return this.convertValueMore(xuanPai) > this.convertValueMore(this._lastPai);
                    } else {
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
    composeCheck: function composeCheck(arr) {

        var length = arr.length;

        if (length == 1) {

            return true;
        } else if (length < 5) {

            var value = arr[0]._name.substring(1);

            var isClown = false;

            for (var i = 0; i < length; i++) {
                //鬼是一个特殊的组合
                if (arr[i]._name.substring(0, 1) == "E") {

                    if (isClown) {

                        //只有两张 且都是鬼
                        if (length == 2) {

                            return true;
                        } else {

                            return false;
                        }
                    } else {

                        isClown = true;
                    }
                } else {
                    //进到这里，这张牌不是大小鬼，出现不同权值 返回false
                    if (isClown) {

                        return false;
                    }

                    var value2 = arr[i]._name.substring(1);

                    if (value != value2) {

                        return false;
                    }
                }
            }

            //如果到这里 isClown 为真，及有鬼存在，但多张牌只有一个鬼，说明牌组合不对
            return !isClown;
        } else {

            return false;
        }
    },

    /**
     * 权值转换 
     * 不包括大小鬼
     */
    convertValue: function convertValue(l) {

        if (l < 4) {

            return (13 + l) * 10;
        } else {

            return l * 10;
        }
    },

    /**
     * 大小鬼权值转换 
     * 
     */
    convertClownValue: function convertClownValue(l) {
        //大鬼 l = 0  小鬼 l=1
        //小鬼要大于最大的单
        return (13 + 3 + 2 - l) * 10;
    },

    /**
     * 权值转换 多张
     */
    convertValueMore: function convertValueMore(arr) {

        var weight = 0;

        if (arr == null || arr.length == 0 || !this.composeCheck(arr)) {

            return weight;
        } else {

            var f = arr[0]._name.substring(0, 1);

            var l = parseInt(arr[0]._name.substring(1));

            if (f == "E") {
                //鬼
                weight = 13 + 3 + 2 - l;
            } else {

                if (l < 4) {

                    weight = 13 + l;
                } else {

                    weight = l;
                }
            }
            //特例
            if (arr.length == 2) {

                if (l == 10) {

                    return 16 * Math.pow(10, 2) + 1; //比对3大1
                } else if (l == 5) {

                    var value = f.charCodeAt() + arr[1]._name.substring(0, 1).charCodeAt();

                    if (value == 196) {
                        //对黑5
                        return 16 * Math.pow(10, 4) + 3; //比对红5大1
                    } else if (value == 198) {
                        //对红5
                        return 16 * Math.pow(10, 4) + 2; //比对鬼大1
                    }
                } else if (f == "E") {

                    return 16 * Math.pow(10, 4) + 1; //比四个3大1
                }
            }

            //cc.log("weight:"+weight);

            return weight * Math.pow(10, arr.length);
        }
    },

    /**
     * 排序方法
     */
    sortPai: function sortPai(spriteArr) {

        //cc.log(spriteArr);

        for (var i = 0; i < spriteArr.length; i++) {

            for (var j = i + 1; j < spriteArr.length; j++) {

                var name1 = spriteArr[i]._name;

                var name2 = spriteArr[j]._name;

                //cc.log(name1.substring(1));

                //cc.log("name1:"+name1+" name2:"+name2);

                if (parseInt(name1.substring(1)) > parseInt(name2.substring(1))) {

                    //cc.log("-name1:"+name1+" name2:"+name2);

                    var temp = spriteArr[i];

                    spriteArr[i] = spriteArr[j];

                    spriteArr[j] = temp;
                } else if (name1.substring(1) == name2.substring(1)) {

                    var code1 = name1.substring(0, 1).charCodeAt();
                    var code2 = name2.substring(0, 1).charCodeAt();

                    //5的特殊排序
                    if (name1.substring(1) == "5") {
                        //把对黑5或对红5放到一起
                        //把红桃与草花互换
                        if (code1 == 99) {

                            code1 = 98;
                        } else if (code1 == 98) {

                            code1 = 99;
                        }

                        if (code2 == 99) {

                            code2 = 98;
                        } else if (code2 == 98) {

                            code2 = 99;
                        }
                    }

                    if (code1 > code2) {

                        var temp = spriteArr[i];

                        spriteArr[i] = spriteArr[j];

                        spriteArr[j] = temp;
                    }
                }
            }
        }
    },

    /**
     * 展示在牌桌上
     */
    showLastPai: function showLastPai() {

        // cc.log("player:"+this._currentPlayer);

        if (this._lastPai != null && this._lastPai.length != 0) {

            var size = cc.winSize;

            //展示
            for (var j = 0; j < this._lastPai.length; j++) {

                var node = this._lastPai[j];

                // cc.log("node:");
                // cc.log(node);

                cc.director.getScene().addChild(node);

                node.setPosition(cc.p(size.width / 2 + j * 30, size.height / 2));

                //node.runAction(cc.rotateBy(0,this._currentPlayer*-90));

                // var node1 = cc.instantiate(node._prefab.asset);

                //记录每回合出牌画在头像下边
                if (this._currentPlayer != 0) {

                    var node1 = cc.instantiate(node);

                    var labelBottomNode = this.players[this._currentPlayer].node.getChildByName('LabelBottom');

                    labelBottomNode.addChild(node1);

                    // this.players[this._currentPlayer].node.addChild(node1);

                    node1.setScale(0.3, 0.3);

                    node1.setAnchorPoint(0, 0);

                    node1.setCascadeOpacityEnabled(false);

                    node1.setPosition(cc.p(-labelBottomNode.width / 2 + j * 10, -labelBottomNode.height / 2 - node1.height / 3));
                }
            }
        }
    },

    /**
     * 清空牌桌
     */
    clearPaiZhuo: function clearPaiZhuo() {

        // cc.log("clearPaiZhuo");

        if (this._lastPai != null && this._lastPai.length != 0) {

            for (var i = 0; i < this._lastPai.length; i++) {

                var node = this._lastPai[i];

                // cc.log(node);

                node.removeFromParent();

                node.destroy();
            }
        }
    },

    /**
     * 清空记录在玩家头向下的出牌记录
     */
    clearRecordPlayerPai: function clearRecordPlayerPai() {

        var labelBottomNode = this.players[this._currentPlayer].node.getChildByName('LabelBottom');

        labelBottomNode.removeAllChildren();
    },

    /**
     * 是否可以宣战或跟随
     * 不可以 0
     * 宣战 1
     * 跟随 2
     */
    checkEnableXuanZhan: function checkEnableXuanZhan(pNum) {

        if (pNum == null) {

            pNum = this._currentPlayer;
        }

        // cc.log("rounds:"+this.rounds);
        // cc.log(this.partyPlayers);
        // cc.log(pNum);
        // cc.log(this.partyPlayers.indexOf(pNum)!=-1);

        if (this.num <= 4 && this.partyPlayers.indexOf(pNum) != -1) {

            if (this.isXuanZhan) {
                //跟
                return 2;
            } else {
                //宣战
                return 1;
            }
        } else {

            return 0;
        }
    },

    /**
     * 是否是同伙
     */
    isPlayerParty: function isPlayerParty(pNum, pNum2) {

        return pNum != pNum2 && !(this.partyPlayers.indexOf(pNum) == -1 ^ this.partyPlayers.indexOf(pNum2) == -1);
    }

};