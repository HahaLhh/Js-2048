//创建一个对象,所有的操作全部都在对象里面完成
var game = {
    data:[],//存放数据
    score:0,//分数
    status:1,// 定义游戏状态：可以玩的时候为状态为：1
    gameover:0,//游戏结束的状态定义为0
    gamerunning:1,//表示的是当前游戏的状态，时时刻刻检测该状态，如果这个状态等于1，表示可以继续，如果等于0，结束

    // 游戏开始
    start: function(){
        game.gamerunning = game.status;
        game.score = 0; //游戏开始时分数清零
        game.data = [ //重新给数组进行赋值
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0]
        ]
        // 生成两个随机数
        game.randomNum();
        game.randomNum();
        // 生成游戏开始时的视图
        game.dataView();
    },
    randomNum:function(){//生成随机数的方法
        //这个方法,需要用到的时候调用,不需要用到的时候不用
        //数字要随机生成2或者4;位置也要随机生成
        for(;;){//死循环，直到生成完成再停止，否则一直生成
            var r = Math.floor(Math.random()*4);//生成一个行
            var c = Math.floor(Math.random()*4);//生成一个列
            if(game.data[r][c] == 0){//只有数组这一个位置为 0 的时候才可以赋值
                var num = Math.random()>0.5?2:4; //随机生成2或者4
                game.data[r][c] = num;
                break;//退出死循环
            }
        }
    },
    dataView:function(){    //更新视图的方法
        for (var r = 0; r < 4; r++) {
            for(var c = 0; c<4;c++){
                // console.log(game.data[r][c]);
                var div = document.getElementById("c" + r + c); //获取到每一个对应的div
                if(game.data[r][c] != 0){   //如果数组里有数值
                    div.innerHTML = game.data[r][c];//给单元格进行赋值
                    div.className = "cell n" + game.data[r][c]; //改变样式
                }else{  //如果数组里不含有元素
                    div.innerHTML = "";//数组中的元素如果为0的时候，界面中是没有值的，把内容清空
                    div.className = "cell";//样式恢复
                }
            }
        }

        document.getElementById("score_01").innerText = game.score; //找到分数的ID，更新分数

        if(game.gamerunning == game.gameover){  //如果游戏处于结束的阶段了，更新视图
            document.getElementById("gameover").style.display = "block";//在进行中 对某一状态进行直接的改变 "游戏结束时，将结束时对应写好的'框'display:显示出来'block'"
            document.getElementById("score_02").innerText = game.score;//找到结束时的分数ID，更新分数
        }else{//如果游戏处于游戏状态中
            document.getElementById("gameover").style.display = "none";
        }// 定义游戏的结束状态和游戏时的状态，根据状态来确定何时弹出对应状态的'display:block || none'
    },
    isgameover:function(){  //  判断游戏是否结束的方法
        // 那，游戏结束需要满足哪些条件呢？
        // 1.格子全部都不为0的时候 && 相邻的位置不能有相同的
        // 给函数增加一个返回值,如果false表示还可以继续,ture表示游戏结束
        for(var r = 0;r<4;r++){
            for(var c = 0;c<4;c++){
                if(game.data[r][c] == 0){   //如果有等于零的情况，则游戏继续
                    return false;
                }
                if(c<3){//检测同一行之间是否有相同
                    if(game.data[r][c] == game.data[r][c+1]){
                        return false;
                    }
                }
                if(r<3){//检测同一列之间是否有相同
                    if(game.data[r][c] == game.data[r+1][c]){
                        return false;
                    }
                }

            }
        }
        return true;//如果条件全都不满足，表示游戏结束
    },

    //移动的方法：
    //左移
    moveLeft:function(){
        var before = String(game.data);//给移动之前的数组“拍个照”      因为数组之间不能直接比较(地址问题),所以这里需要先将其转化为字符串,然后才能用于比较
        for(var r = 0;r<4;r++){
            game.moveLeftinRow(r);
        }
        var after = String(game.data);//给移动之后的数组“拍个照”
        // 比较“拍照”前的前后
        if(before != after){    //  若是前后不相等
            game.randomNum();   //生成一个随机数
            if(game.isgameover()){
                game.gamerunning == game.gameover;      //游戏状态改变为gameover
            }
            game.dataView();//更新视图
        }
    },
    moveLeftinRow:function(r){
        for(var c = 0;c<3;c++){
            var nextc = game.moveLeftNextRows(r,c);//找数字,并依据不同的情况返回值
            if(nextc != -1){//在位置game.data[r][i]上找到了元素
                if(game.data[r][c] == 0){//如果为0,则替代
                    game.data[r][c] = game.data[r][nextc];
                    game.data[r][nextc] = 0;
                    c--;
                }else if(game.data[r][c] == game.data[r][nextc]){
                    game.data[r][c] *= 2;
                    game.score += game.data[r][c];
                    game.data[r][nextc] = 0;
                }
            }else{//如果没找到
                break;
            }
        }
    },
    moveLeftNextRows:function(r,c){//找位置的函数
        for (var i = c+1;i<4;i++) {//从当前位置的下一个元素开始去找,所以是 c+1(当前位置为c，下一个为c+1)
            if (game.data[r][i] != 0) {//如果不等于0，则表明位置上存在一个元素
                return i;//找到了就把这个位置直接返回出来
            }
        }
        return -1;//如果没有找到，随意取一个标识符返回回来:表示没有找到
    },
    //  左移结束
    ///////////////////////////////////////////////////////////////////////////////////
    //  右移开始
    moveRight:function(){
        var before = String(game.data);
        for (var r = 0;r<4;r++) {//逐行比较
            game.moveRightinRow(r);
        }
        var after = String(game.data);
        if (before != after) {
            game.randomNum();//生成一个随机数
            if(game.isgameover()){//判断游戏是否结束
                game.gamerunning = game.gameover;
            }
            game.dataView();//更新视图
        }
    },
    moveRightinRow:function(r){
        for(var c = 3;c>0;c--){
            var nextc = game.moveRightNextRows(r,c);//找数字,并根据找数字的情况接收返回值
            if (nextc != -1) {//如果返回值不为 -1,则表示位置上找到了元素
                if(game.data[r][c] == 0){
                    game.data[r][c] = game.data[r][nextc];
                    game.data[r][nextc] = 0;
                    c++;// 这一步,重点理解: 当位置替代发生了改变之后,下一次的比较则从下一位开始比较,需要让它回到原点的位置重新从头开始继续比较
                }else if (game.data[r][c] == game.data[r][nextc]) {
                    game.data[r][c] *= 2;
                    game.score += game.data[r][c];
                    game.data[r][nextc] = 0;
                }
            }else{
                break;
            }
        }
    },
    moveRightNextRows:function(r,c){//找位置的函数
        for(var i = c-1;i>=0;i--){//因为从c开始,所以下一位是从 c-1 开始找
            if (game.data[r][i] != 0) {
                return i;
            }
        }
        return -1;
    },
//  右移结束
    //////////////////////////////////////////////////////////////////////////////////////////

    moveTop:function(){//上移的方法
        var before = String(game.data);//强制转换成字符串  移动前给数组拍一个照  //join toString()
//      移动的方法
        for(var c = 0;c<4;c++){//移动每一列
            game.moveTopinRow(c);
        }
        var after = String(game.data);//强制转换成字符串  移动以后给数组拍一个照   ?

        if(before != after){//如果两次拍照不相等，就发生了移动
            game.randomNum();//生成一个随机数
            if(game.isgameover()){//如果游戏结束
                game.gamerunning = game.gameover;//改变游戏的状态
            }
            game.dataView();//移动完成数据更新
        }

    },
    moveTopinRow:function(c){//仅仅移动一行
        for(var r = 0;r<4;r++){
            var nextr = game.moveTopNextRows(r,c);//获取到后面数字的位置   1 2 3  -1
            if(nextr != -1){//如果后面找到元素
                if(game.data[r][c] == 0){//如果为0，就替代
                    game.data[r][c] = game.data[nextr][c];//
                    game.data[nextr][c] = 0;
                    r--;//从原地开始，继续往后
                }else if(game.data[r][c] == game.data[nextr][c]){//如果相等
                    game.data[r][c] *= 2;//当前位置的值*2
                    game.score += game.data[r][c];//加上分数
                    game.data[nextr][c] = 0;//位置变为0
                }
            }else{//如果没有找到元素
                break;//直接退出循环
            }
        }
    },
    moveTopNextRows:function(r,c){
        for(var i = r + 1;i < 4;i++){
            //如果不为0，表示找到，就返回i，i对应的格子的几个位置
            if (game.data[i][c] != 0) {
                return i;
            }
        }
        return -1//表示的是后面都找不到元素。表示返回一个状态，这个状态自己定义，只要后面对应就OK
    },
    //////////////////////////////////////////////////////////////////////////////////////////

    moveDown:function(){//下移的方法
        var before = String(game.data);//强制转换成字符串  移动前给数组拍一个照  //join toString()
//      移动的方法
        for(var c = 0;c<4;c++){//移动每一列
            game.moveDowninRow(c);
        }
        var after = String(game.data);//强制转换成字符串  移动以后给数组拍一个照   ?

        if(before != after){//如果两次拍照不相等，就发生了移动
            game.randomNum();//生成一个随机数
            if(game.isgameover()){//如果游戏结束
                game.gamerunning = game.gameover;//改变游戏的状态
            }
            game.dataView();//移动完成数据更新
        }

    },
    moveDowninRow:function(c){//仅仅移动一行
        for(var r = 3;r>=0;r--){
            var nextr = game.moveDownNextRows(r,c);//获取到后面数字的位置   1 2 3  -1
            if(nextr != -1){//如果后面找到元素
                if(game.data[r][c] == 0){//如果为0，就替代
                    game.data[r][c] = game.data[nextr][c];//
                    game.data[nextr][c] = 0;
                    r++;//从原地开始，继续往后
                }else if(game.data[r][c] == game.data[nextr][c]){//如果相等
                    game.data[r][c] *= 2;//当前位置的值*2
                    game.score += game.data[r][c];//加上分数
                    game.data[nextr][c] = 0;//位置变为0
                }
            }else{//如果没有找到元素
                break;//直接退出循环
            }
        }
    },
    moveDownNextRows:function(r,c){
        for(var i = r - 1;i >= 0;i--){
            //如果不为0，表示找到，就返回i，i对应的格子的几个位置
            if (game.data[i][c] != 0) {
                return i;
            }
        }
        return -1//表示的是后面都找不到元素。表示返回一个状态，这个状态自己定义，只要后面对应就OK
    }
}

    game.start();
    document.onkeydown = function(e){
        var e = e || event || arguments[0];
        if(e.keyCode == 37){
            game.moveLeft();
        }else if (e.keyCode == 39) {
            game.moveRight();
        }else if (e.keyCode == 38) {
            game.moveTop();
        }else if (e.keyCode == 40) {
            game.moveDown();
        }
    }
