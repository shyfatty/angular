Array.prototype.remove=function(dx) //从数组中按照下标删除元素
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
};
//pk相关功能
var pk = {
    _cfg:{
        _changebutton   :   $('.pk-change'),                //换一组按钮
        _leftbutton     :   $(".go-die-button-left"),       //左侧狗带按钮
        _rightbutton    :   $(".go-die-button-right"),      //右侧狗带按钮
        _leftpic        :   $('.left').find('.pk-manhua'),  //左侧pk漫画图片容器
        _rightpic       :   $('.right').find('.pk-manhua'), //右侧pk漫画图片容器
        _piclist        :   $('.pk-list-content'),          //漫画列表
        _port           :   'http://manhua.weibo.cn/special/asia_bang/vote', //投票接口
        _port_send      :   'http://manhua.weibo.cn/special/asia_bang/share'  //转发接口
    },
    lastComic:[  //剩余参赛漫画  (包含正在参赛漫画)

    ],
    changeButtonRefresh:function(){
        if(this.lastComic.length<4){
            this._cfg._changebutton.css('visibility','hidden');
        }
    },
    delComicById:function(id){ //根据id从comic数组中删除元素
        for(var i in this.lastComic){
            if(this.lastComic[i].id == id){
                this.lastComic.remove(i);
            }
        }
    },
    takeJsonById:function(id){  //根据漫画id选出一个传往后台的json
        var _json={};
        for(var i in this.lastComic){
            if(this.lastComic[i].id == id){
                _json = this.lastComic[i];
            }
        }
        return _json;
    },
    getScoreById:function(id){
        var result = 0;
        for(var i in this.lastComic){
            if(this.lastComic[i].id == id){
                result = this.lastComic[i].score;
            }
        }
        return result;
    },
    setScoreById:function(score,id){
        for(var i in this.lastComic){
            if(this.lastComic[i].id == id){
                this.lastComic[i].score += score;
            }
        }
    },
    takeKeyById:function(id){
        var key = 0;
        for(var i in this.lastComic){
            if(this.lastComic[i].id == id){
                key = i;
            }
        }
        return key;
    },
    takeNotKey:function(number,key){ //从0-number(不含)中随机抽取一个不为key的数
        var num = key;
        while(num == key){
            num = parseInt(Math.random()*number);
        }
        return num;
    },
    takeTwoNum:function(number){ //从0-number(不含)中随机抽取两个不同的数
        var num1 = parseInt(Math.random()*number);
        var num2 = num1;
        while(num2 == num1){
            num2 = parseInt(Math.random()*number);
        }
        return [num1,num2];
    },
    render:function(id1,id2){ //渲染赛场
        this.renderLeft(id1);
        this.renderRight(id2);
    },
    renderLeft:function(id){ //渲染左侧选手
        var pic = this._cfg._piclist.find('[data-id="'+id+'"]').find('img').attr('src');
        var template = '<img src="'+pic+'" width="96" data-id="'+id+'" />';
        this._cfg._leftpic.children('img').remove();
        this._cfg._leftpic.append($(template));
    },
    renderRight:function(id){//渲染右侧选手
        var pic = this._cfg._piclist.find('[data-id="'+id+'"]').find('img').attr('src');
        var template = '<img src="'+pic+'" width="96" data-id="'+id+'" />';
        this._cfg._rightpic.children('img').remove();
        this._cfg._rightpic.append($(template));
    },
    changePic:function(){ //换一组pk漫画
        //从lastComic中删除现在的两个元素
        var id1 = this._cfg._leftpic.children('img').attr('data-id');
        var id2 = this._cfg._rightpic.children('img').attr('data-id');
        this.delComicById(id1);
        this.delComicById(id2);
        //从刷新后的lastComic中选出下一组选手
        var _arr = this.takeTwoNum(this.lastComic.length);
        //送上赛场
        this.render(this.lastComic[_arr[0]].id,this.lastComic[_arr[1]].id);
    },
    changeLeftPic:function(){  //干掉左侧漫画
        //从lastComic中删除现在的两个元素
        var _this = this;
        var id = this._cfg._leftpic.children('img').attr('data-id');
        var other = this._cfg._rightpic.children('img').attr('data-id');
        this.setScoreById(this.getScoreById(id)+1,other);//修改分数
        var _json = this.takeJsonById(other);
        this._cfg._leftbutton.addClass('go-die-button-dis');
        this.sendJson(_json,function(){//数据分数发往后台
            _this._cfg._leftbutton.removeClass('go-die-button-dis');
            _this.delComicById(id);
            //从刷新后的lastComic中选出下一个选手
            var key = _this.takeNotKey(_this.lastComic.length,_this.takeKeyById(other));
//        var key = parseInt(Math.random()*(this.lastComic.length));
            //送上赛场
            _this.renderLeft(_this.lastComic[key].id);
        });
    },
    changeRightPic:function(){  //干掉右侧漫画
        //从lastComic中删除现在的两个元素
        var _this = this;
        var id = this._cfg._rightpic.children('img').attr('data-id');
        var other = this._cfg._leftpic.children('img').attr('data-id');
        this.setScoreById(this.getScoreById(id)+1,other);
        var _json = this.takeJsonById(other);
        this._cfg._rightbutton.addClass('go-die-button-dis');
        this.sendJson(_json,function(){//数据分数发往后台
            _this._cfg._rightbutton.removeClass('go-die-button-dis');
            _this.delComicById(id);
            //从刷新后的lastComic中选出下一个选手
            var key = _this.takeNotKey(_this.lastComic.length,_this.takeKeyById(other));
//        var key = parseInt(Math.random()*(this.lastComic.length));
            //送上赛场
            _this.renderRight(_this.lastComic[key].id);
        });
    },
    sendJson:function(_json,callback){ //向后台发送pk结果
        var _this = this;
        var __json = {
            'score':_json.score,
            'item_id':_json.id
        };
        $.ajax({
            type:"POST",
            url:_this._cfg._port,
            data:__json,
            dataType:"json",
            cache:false,
            success:function(data){
                if(data.code > 0){
                    callback();
                }else{
                    alert(data.message)
                }
            }
        })
    },
    refreshNum:function(){  //刷新输入框中可输入的字数
        var _this = this;
        var txt = $(".zhuanfa-textarea textarea").val();
        var number = 140-Math.ceil(_this.getStringLen(txt)/2);
        if(number < 0){
            $(".zishu").addClass('red-color');
        }else{
            $(".zishu").removeClass('red-color');
        }
        $(".zishu").html(number);
        return txt;
    },
    //获取内容字符数
    getStringLen:function(Str){
        var   i,len,code;
        if(Str==null || Str == "")   return 0;
        len = Str.length;
        for(i = 0;i < Str.length;i++){
            code = Str.charCodeAt(i);
            if(code > 255){len ++;}
        }
        return len;
    },
    initLastComic:function(){ //初始化lastComic数组
        var _this = this;
        this._cfg._piclist.find('li').each(function(index){
            var _json = {"id":$(this).attr('data-id'),"score":0};
            _this.lastComic.push(_json);
        })
    },
    //发送分享
    sendWeiboComment:function(url,image,content,bangId){
        var _this = this;
        var _json ={
            'url':url,
            'image':image,
            'content':content,
            'bangId':bangId
        };
        $.ajax({
            type:"POST",
            url:_this._cfg._port_send,
            data:_json,
            dataType:"json",
            cache:false,
            success:function(data){
                if(data.code > 0){
                    callback();
                }else{
                    alert(data.message);
                }
            }
        })
    },

    init:function(){ //初始化
        var _this = this;
        this._cfg._changebutton.on('click',function(e){  //换一组绑定事件
            e.preventDefault();
            if(_this.lastComic.length >=4){
                _this.changePic();
            }else{

            }
            _this.changeButtonRefresh();
        });
        this._cfg._leftbutton.on('click',function(e){//左边狗带按钮绑定事件
            e.preventDefault();
            if(_this.lastComic.length>=3){
                _this.changeLeftPic();
            }else{
                var item_id = $('.left').find('.pk-manhua').find('img').attr('data-id');
                var item_id2 = $('.right').find('.pk-manhua').find('img').attr('data-id');
                var score = _this.getScoreById(item_id)+_this.getScoreById(item_id2);
                var bang_id = $(".title").find('span').attr('bang-id');
                var url = 'http://manhua.weibo.cn/special/asia_bang/result?bang_id='+bang_id+'&item_id='+item_id2;
                _this.sendJson({'id':item_id2,'score':score},function(){
                    window.location.href=url;
                });
            }
            _this.changeButtonRefresh();
        });
        this._cfg._rightbutton.on('click',function(e){//右边狗带按钮绑定事件
            e.preventDefault();
            if(_this.lastComic.length>=3){
                _this.changeRightPic();
            }else{
                var item_id = $('.right').find('.pk-manhua').find('img').attr('data-id');
                var item_id2 = $('.left').find('.pk-manhua').find('img').attr('data-id');
                var score = _this.getScoreById(item_id)+_this.getScoreById(item_id2);
                var bang_id = $(".title").find('span').attr('bang-id');
                var url = 'http://manhua.weibo.cn/special/asia_bang/result?bang_id='+bang_id+'&item_id='+item_id2;
                _this.sendJson({'id':item_id2,'score':score},function(){
                    window.location.href=url;
                });
            }
            _this.changeButtonRefresh();
        });
        $(".left").on('click',".go-die-button-dis",function(e){
            e.preventDefault();
        });

        $(".title-zhuanfa .send").on('click',function(e){ //点击发送
            e.preventDefault();
            var content = $(".zhuanfa-textarea textarea").val();
            var url = $(".title-zhuanfa").find("span").attr('share-url');
            var bangId = $(".title-zhuanfa").find("span").attr('bang-id');
            var txt = _this.refreshNum();
            var number = 140-Math.ceil(_this.getStringLen(txt)/2);
            if(number<0){
                alert('字数超过140个，请删除相应字数后重新发送');
            }else if(number>=140){
                alert('请输入您要发送的内容');
            }else{
                _this.sendWeiboComment(url,'',content,bangId);
            }
        });

        $("textarea").on('keydown',function(){
            _this.refreshNum();
        });
    }

};
pk.refreshNum();
pk.initLastComic();//初始化剩余漫画数据
pk.init();//初始化整体