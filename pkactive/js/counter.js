/**
 * Created by YiLiang on 15-10-26.
 *
 * counter模块
 *用来对用户在页面上的点击行为进行统计
 */

//示例接口：http://manhua.weibo.cn/sys/home/counter?point_id=1&object_id=0

//在页面上把参数按照如下方式放到dom上
// data-counter = 'point' data-point-id = '1' data-object-id = '0' 给页面上所有需要统计的元素都添加

var counter = { //作用域
    count:function(point_id,object_id){
        $(".counter-add").remove();
        var port = 'http://manhua.weibo.cn/sys/home/counter';
        var url = port+'?point_id='+point_id+'&object_id='+object_id;  //拼出url
        var template = '<img class="counter-add" src="'+url+'"  />';  //将url放进img
        $('body').append($(template)); //将img放进页面
    },
    getParams:function(){  //从页面上读取参数
        var _this = this;
        $("[data-counter='point']").on('click',function(){
            var object_id = $(this).attr('data-object-id');
            var point_id = $(this).attr('data-point-id');
            _this.count(point_id,object_id); //执行计数
        });
    }
};

counter.getParams();