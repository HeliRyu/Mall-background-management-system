// 商品管理
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    $('#summernote').summernote({
        height:500, //高度
        minHeight:null, //最小高度
        maxHeight:null, //最大高度
        focus:false, //是否获取焦点
        lang:'zh-CN'});//中文
    param.page=page;
    param.size=row_size;
    makelist();
    // 分页条点击事件
    $("#page").on("click","li",function () {
        var li=$(this);
        if(li.hasClass("disabled")||li.hasClass("active")){//当前页或者不可操作
            return;
        }
        // 修改当前页号，重新获取数据
        var page_=new Number(li.attr("data-page"));
        page=page_;
        makelist();//页面加载后执行查询数据库，填充表格
    });

});

// 查询填充表格数据,刷新表格
function makelist() {
    param.page=page;
    param.size=row_size;
    $.ajax({
        url:"/goods/query.do",//请求地址
        type:'post',//请求方式
        data:param,
        dataType:"json",//返回结构类型
        success:function (json) {
            appendTable(json.data);
            appendPage(json.total);
        },
        error:function () {
            alert("请求失败");
        }
    });
}

// 生成分页条
function appendPage(total) {
    $("#page li").remove();//清空分页
    var html='';
    // 上一页
    html+='<li data-page="'+(page-1)+'"><a href="#">&laquo;</a></li>';
    // 添加前几页
    for(var i=page_size;i>0;i--){
        if((page-i)<1){
            continue;
        }
        html+='<li data-page="'+(page-i)+'"><a href="#">'+(page-i)+'</a></li>';
    }
    // 当前页
    html+='<li class="active" data-page="'+page+'"><a href="#">'+page+'</a></li>';
    // 添加后几页
    for(var i=0;i<page_size;i++){
        if((page+i)*row_size>=total){
            break;
        }
        html+='<li data-page="'+(page+i+1)+'"><a href="#">'+(page+i+1)+'</a></li>';
    }
    // 下一页
    html+='<li data-page="'+(page+1)+'"><a href="#">&raquo;</a></li>';
    $("#page").append(html);

    // 设置左右箭头
    // 当前第一页的时候设置上一页为不可点击
    $("#page li[data-page=0]").addClass("disabled");
    // 当前页为最后一页的时候设置下一页为不可点击
    if(page*row_size>=total){
        $("#page li:last-child").addClass("disabled");
    }
}

//生成表格数据
function appendTable(data) {
    $("#list tr").remove();//清空原有数据
    var html='';
    var i=1;
    data.forEach(function (row) {
        html+="<tr>" +
            "<td>"+i+"</td>" +
            "<td><input type='checkbox' name='ck' value='"+replaceNull(row.id)+"'></td>" +
            "<td>"+replaceNull(row.id)+"</td>" +
            "<td>"+replaceNull(row.name)+"</td>" +
            "<td>"+replaceNull(row.price)+"</td>" +
            "<td>"+replaceNull(row.total)+"</td>" +
            "<td>"+replaceNull(row.freight)+"</td>" ;
            if(row.status=='是'){
                html+=  "<td>"+"<input goods_id='"+replaceNull(row.id)+"' type=\"checkbox\" data-size=\"mini\" name=\"status\" checked>"+"</td>" ;
            }else{
                html+=   "<td>"+"<input goods_id='"+replaceNull(row.id)+"' type=\"checkbox\" data-size=\"mini\" name=\"status\" >"+"</td>" ;
            }
        html+= "<td>"+"<a class='btn btn-info btn-xs' href='javascript:void(0)' role='button' onclick='openEdit(\""+replaceNull(row.id)+"\")' id='goods_edit_button'><span class='glyphicon glyphicon-pencil'></span> 编辑</a>" +
            "</td>"+
            "</tr>";
        i++;
    });
    $("#list").append(html);//添加数据
    //改变上下架转换开关，更新数据库信息
    var cks=$('[name="status"]');//选择器，拿到状态框
    cks.each(function(index,item){//第一个是下标，第二个是元素，类似for循环的i和ck[i]
        var ck=$(item);//转为jq对象
        var f=true;
        if(!ck.prop("checked")){//如果是自带属性，就是prop，取到属性的值
            f=false;
        }
        ck.bootstrapSwitch({//加入开关按钮
            onText:"上架",
            offText:"下架",
            size:"mini",
            state:f,
            onSwitchChange:function(event,state){
                var ck=event.target;//触发事件的这个对象
                var goods_id=$(ck).attr("goods_id");//取这个对象的属性
                //ajax传递这两个值goods_id,state
                $.ajax({
                    url:"/goods/switch_change.do",//请求地址
                    type:'post',//请求方式
                    data:{
                        id:goods_id,
                        state:state
                    },
                    dataType:"json",//返回结构类型
                    success:function (json) {
                        alert("修改上下架状态成功");
                    },
                    error:function () {
                        alert("传递失败");
                    }
                });
            }
        })
    })
}

//生成表格数据中处理null值
function replaceNull(obj){
    if(obj===null||obj===undefined){
        return "";
    }
    return obj;
}

//点击新增，弹出框
function openAdd() {
    $('#goods_add').modal('show');
}

//填充选择图片弹出框
function chooseImg(){
    $('#goods_add_chooseImg').modal('show');
    $.ajax({
        url:"/images/query.do",//请求地址
        type:'post',//请求方式
        data:param,
        dataType:"json",//返回结构类型
        success:function (json) {
            appendImgTable(json.data);
        },
        error:function () {
            alert("请求失败");
        }
    });
}

// 点击选择图片，弹出框输出图库中的图片，生成图片列表
function appendImgTable(data) {
    $("#imgList tr").remove();//清空原有数据
    var html='';
    data.forEach(function (row) {
        html+="<tr>" +
            "<td> <img name=choose style='height: 50px;width: 50px' src='../../"+replaceNull(row.imageLink)+"' class='img-responsive' alt='Responsive image'></td>" +
            "<td><input type='checkbox' name='choose_ck' data-url='"+replaceNull(row.imageLink)+"' value='"+replaceNull(row.id)+"'>选择</td>" +
            "</td>"+
            "</tr>";
    });
    $("#imgList").append(html);//添加数据
}

// 选中需要上传的图片点击确定，保存图库图片的地址。Update地址。
function goods_chooseImg(){
    var choose_ck=$('[name="choose_ck"]:checked');//选择器，拿到状态框
    // 只能选一张图片
    if (choose.lenth>1){
        alert("只能选一张图片");
        return;
    }
    var choose_id=$(choose_ck).attr("value");//拿到这个对象商品的id
    var choose_link=$(choose_ck).attr("data-url");
    $("#goods_add_img").val(choose_link);//把图片地址放进图片的text框里
    $("#goods_edit_img").val(choose_link);
    $('#goods_add_chooseImg').modal('hide');//关闭弹窗进入新增的弹窗
}

//点击新增，填入商品信息
function goods_addss(){
    $("#goods_adds").attr("disabled",true);
    var name=$("#goods_add_name").val();
    var goods_cate_=$("#goods_add_classify").val();
    var price=$("#goods_add_price").val();
    var total=$("#goods_add_total").val();
    var sort=$("#goods_add_sort").val();
    var freight=$("#goods_add_freight").val();
    var cover=$("#goods_add_img").val();//设置封面的地址
    var imgSrc=$("#goods_add_img").val();//取到图片的地址
    var status=$("input[type='radio']:checked").val();//取到单选框的值
    var desc= $('#summernote').summernote('code');//取到详情框的值

    if(!name){//如果没有填写要添加的标题
        alert("标题不可为空");
        return;
    }
    if(!goods_cate_){//如果没有填写要添加的分类名
        alert("分类名不可为空");
        return;
    }
    if(!price){//如果没有填写要添加的价格
        alert("价格不可为空");
        return;
    }
    if(!total){//如果没有填写要添加的库存
        alert("库存不可为空");
        return;
    }
    if(!sort){//如果没有填写要添加的序号
        alert("序号不可为空");
        return;
    }
    if(!freight){//如果没有填写要添加的快递费
        alert("快递费不可为空");
        return;
    }
    if(!desc){//如果没有填写要添加的详情
        alert("详情不可为空");
        return;
    }
    if(!imgSrc){
        alert("图片不可为空");
        return;
    }
    if(!cover){
        alert("封面不可为空");
        return;
    }
    var f=new FormData();
    f.append("imgSrc",imgSrc);
    f.append("cover",cover);
    f.append("name",name);
    f.append("goodsCate",goods_cate_);
    f.append("price",price);
    f.append("total",total);
    f.append("sort",sort);
    f.append("freight",freight);
    f.append("status",status);
    f.append("goodsDesc",desc);
    $.ajax({
        url:"/goods/add.do",
        type:"post",
        data:f,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#goods_adds").attr("disabled",false);
                $('#goods_add').modal('hide');//关闭弹窗
                //输入框里清除数据
                $("#goods_add_name").val("");
                $("#goods_add_classify").val("");
                $("#goods_add_price").val("");
                $("#goods_add_total").val("");
                $("#goods_add_sort").val("");
                $("#goods_add_freight").val("");
                $("#goods_add_status").val("");
                $("#goods_add_desc").val("");
                $("#goods_add_img").val("");
                alert(json.msg);
                $("#chooseImg").attr("disabled",false);
                makelist();
            }
        },
        error:function () {
            $("#goods_adds").attr("disabled",false);
            //输入框里清除数据
            $("#goods_add_name").val("");
            $("#goods_add_classify").val("");
            $("#goods_add_price").val("");
            $("#goods_add_total").val("");
            $("#goods_add_sort").val("");
            $("#goods_add_freight").val("");
            $("#goods_add_status").val("");
            $("#goods_add_desc").val("");
            $("#goods_add_img").val("");
            alert("服务器异常");
        }
    })
}

//选中商品点击编辑，把选中商品的信息全部显示出来，更改保存后更新数据库中的数据
function openEdit(id) {
    $.ajax({
        url:"/goods/getdata.do",
        type:"post",
        data:{
            id:id
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#mall_goods_editId").val(json.data[0].id);
                $("#goods_edit_name").val(json.data[0].name);
                $("#goods_edit_img").val(json.data[0].imgSrc);
                $("#goods_edit_classify").val(json.data[0].goodsCate);
                $("#goods_edit_price").val(json.data[0].price);
                $("#goods_edit_total").val(json.data[0].total);
                $("#goods_edit_sort").val(json.data[0].sort);
                $("#goods_edit_freight").val(json.data[0].freight);
                $("input[name='optionsRadios'][value='"+json.data[0].status+"']").prop("checked",true);
                var goodsDesc = json.data[0].goodsDesc;
                $('#edit_summernote').summernote('code', goodsDesc);
                $('#goods_edit').modal('show');
            }else{
                alert(json.msg);
                $("#goods_edit_button").attr("disabled",false);
            }
        },
        error:function () {
            $("#goods_edit_button").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

// 编辑
function goods_editss() {
    $("#goods_edits").attr("disabled",true);
    var id=$("#mall_goods_editId").val();
    var name=$("#goods_edit_name").val();
    var goods_cate_=$("#goods_edit_classify").val();
    var price=$("#goods_edit_price").val();
    var total=$("#goods_edit_total").val();
    var sort=$("#goods_edit_sort").val();
    var freight=$("#goods_edit_freight").val();
    var cover=$("#goods_edit_img").val();//设置封面的地址
    var imgSrc=$("#goods_edit_img").val();//取到图片的地址
    var status=$("input[name='edit_optionsRadios']:checked").val();
    var desc= $('#edit_summernote').summernote('code');//取到详情框的值

    if(!name){//如果没有填写要添加的标题
        alert("标题不可为空");
        return;
    }
    if(!goods_cate_){//如果没有填写要添加的分类名
        alert("分类名不可为空");
        return;
    }
    if(!price){//如果没有填写要添加的价格
        alert("价格不可为空");
        return;
    }
    if(!total){//如果没有填写要添加的库存
        alert("库存不可为空");
        return;
    }
    if(!sort){//如果没有填写要添加的序号
        alert("序号不可为空");
        return;
    }
    if(!freight){//如果没有填写要添加的快递费
        alert("快递费不可为空");
        return;
    }
    if(!desc){//如果没有填写要添加的详情
        alert("详情不可为空");
        return;
    }
    if(!imgSrc){
        alert("图片不可为空");
        return;
    }
    if(!cover){
        alert("封面不可为空");
        return;
    }

    var f=new FormData();
    f.append("imgSrc",imgSrc);
    f.append("cover",cover);
    f.append("id",id);
    f.append("name",name);
    f.append("goodsCate",goods_cate_);
    f.append("price",price);
    f.append("total",total);
    f.append("sort",sort);
    f.append("freight",freight);
    f.append("status",status);
    f.append("goodsDesc",desc);
    $.ajax({
        url:"/goods/edit.do",
        type:"post",
        data:f,
        /**
         *必须false才会自动加上正确的Content-Type
         */
        contentType: false,
        /**
         * 必须false才会避开jQuery对 formdata 的默认处理
         * XMLHttpRequest会对 formdata 进行正确的处理
         */
        processData: false,
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#goods_edits").attr("disabled",false);
                $('#goods_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#goods_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//删除勾选的数据，并删除关联表数据
function goods_delete(){
    $("#goods_delete_button").attr("disabled",true);
    var cks=$("#list input[name=ck]:checked");
    if(cks.length==0){
        alert("请选择要删除的数据");
        return;
    }
    var f=confirm("是否确认删除？");
    if(!f){
        return;
    }
    var ids=[];
    cks.each(function () {
        ids.push(this.value);//获取每一行选中的id
    });
    $.ajax({
        url:"/goods/delete.do",
        type:"post",
        data:{
            ids:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#goods_delete_button").attr("disabled",false);
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#goods_delete_button").attr("disabled",false);
            alert("服务器异常");
        }
    })
}



