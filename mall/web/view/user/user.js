// 对用户的增删改查功能
// 列表头像要显示出来

//创建表格查询，查询条件：会员ID及昵称，查出对应的数据，注意控制好分页
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    $("#search_userID").val("");//清空搜索框
    $("#search_userName").val("");//清空搜索框
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

//查询
function search_ok(){
    page=1;
    param.id=$("#search_userID").val();
    param.name=$("#search_userName").val();
    makelist();
}

// 查询填充表格数据,刷新表格
function makelist() {
    param.page=page;
    param.size=row_size;
    $.ajax({
        url:"/user/query.do",//请求地址
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
            "<td> <img style='height: 50px;width: 50px' src='../../"+replaceNull(row.photo)+"' class='img-responsive' alt='Responsive image'></td>"+
            "<td>"+replaceNull(row.id)+"</td>"+
            "<td>"+replaceNull(row.name)+"</td>"+
            "<td>"+replaceNull(row.degree)+"</td>";
        if(row.master=='是'){
            html+=  "<td>"+"<input goods_id='"+replaceNull(row.id)+"' type=\"checkbox\" data-size=\"mini\" name=\"status\" checked>"+"</td>" ;
        }else{
            html+=   "<td>"+"<input goods_id='"+replaceNull(row.id)+"' type=\"checkbox\" data-size=\"mini\" name=\"status\" >"+"</td>" ;
        }
        html+= "<td>"+replaceNull(row.phone)+"</td>" +
            "<td>"+replaceNull(row.idCard)+"</td>";
        html+="</tr>";
        i++;
    });
    $("#list").append(html);//添加数据
    //改变上下架转换开关，更新数据库信息
    var cks=$('[name="status"]');//选择器，拿到状态框
    console.info(cks)
    cks.each(function(index,item){//第一个是下标，第二个是元素，类似for循环的i和ck[i]
        var ck=$(item);//转为jq对象
        var f=true;
        if(!ck.prop("checked")){//如果是自带属性，就是prop，取到属性的值
            f=false;
        }
        console.info(f)
        ck.bootstrapSwitch({//加入开关按钮
            onText:"是",
            offText:"否",
            size:"mini",
            state:f,
            onSwitchChange:function(event,state){
                var ck=event.target;//触发事件的这个对象
                var goods_id=$(ck).attr("goods_id");//取这个对象的属性
                console.info(goods_id,state);
                //ajax传递这两个值goods_id,state
                $.ajax({
                    url:"/user/switch_change.do",//请求地址
                    type:'post',//请求方式
                    data:{
                        id:goods_id,
                        master:state
                    },
                    dataType:"json",//返回结构类型
                    success:function (json) {
                        alert("修改掌柜状态成功");
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
function user_openAdd(){
    $('#user_add').modal('show');
}

//点击新增按钮，弹出框中包含用户信息、以及角色、组织机构名
function user_addss(){
    var name=$("#user_addname").val();
    var password=$("#user_addpass").val();
    var degree=$("#user_adddegree").val();
    var master=$("input[type='radio']:checked").val();//取到单选框的值
    var phone=$("#user_addphone").val();
    var idCard=$("#user_addidCard").val();
    if(!name){
        alert("昵称不可为空");
        return;
    }
    if(!password){
        alert("密码不可为空");
        return;
    }
    if(!degree){
        alert("等级不可为空");
        return;
    }
    if(!phone){
        alert("手机号不可为空");
        return;
    }
    if(!idCard){
        alert("身份证不可为空");
        return;
    }
    if(!$("#user_addphoto")[0].files[0]){
        alert("头像不可为空");
        return;
    }
    var f=new FormData();
    f.append("img",$("#user_addphoto")[0].files[0]);
    f.append("name",name);
    f.append("password",password);
    f.append("degree",degree);
    f.append("master",master);
    f.append("phone",phone);
    f.append("idCard",idCard);
    $.ajax({
        url:"/user/add.do",
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
                $('#user_add').modal('hide');//关闭弹窗
                $("#user_addname").val("");
                $("#user_addpass").val("");
                $("#user_adddegree").val("");
                $("#user_addphone").val("");
                $("#user_addidCard").val("");
                $("#user_addphoto").val("");
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#user_addname").val("");
            $("#user_addpass").val("");
            $("#user_adddegree").val("");
            $("#user_addphone").val("");
            $("#user_addidCard").val("");
            $("#user_addphoto").val("");
            alert("服务器异常");
        }
    })
}

//为了编辑获取数据
// 勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
// 勾选多条时，提示“只能编辑一条数据”
function user_openEdit() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    if(cks.length==0){
        alert("请选择要编辑的数据");
        $("#user_edits").attr("disabled",false);
        return;
    }
    if(cks.length>1){
        alert("一次只能编辑一条记录");
        $("#user_edits").attr("disabled",false);
        return;
    }
    $.ajax({
        url:"/user/getdata.do",
        type:"post",
        data:{
            id:cks[0].value
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_editname").val(json.data[0].name);
                $("#user_editpass").val(json.data[0].password);
                $("#user_editdegree").val(json.data[0].degree);
                $("input[name='optionsRadios'][value='"+json.data[0].master+"']").prop("checked",true);
                $("#user_editphone").val(json.data[0].phone);
                $("#user_editidCard").val(json.data[0].idCard);
                $("#img_photo").attr("src",json.data[0].photo);
                $('#user_edit').modal('show');
            }else{
                alert(json.msg);
                $("#user_edits").attr("disabled",false);
            }
        },
        error:function () {
            $("#user_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
//编辑
function user_editss() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    $("#user_edits").attr("disabled",true);
    var id=cks[0].value;
    var name=$("#user_editname").val();
    var password=$("#user_editpass").val();
    var degree=$("#user_editdegree").val();
    var master=$("input[type='radio']:checked").val();//取到单选框的值
    var phone=$("#user_editphone").val();
    var idCard=$("#user_editidCard").val();
    var photo=$("#user_editphoto")[0].files[0];
    var f2=new FormData();
    f2.append("img",photo);
    f2.append("id",id);
    f2.append("name",name);
    f2.append("password",password);
    f2.append("degree",degree);
    f2.append("master",master);
    f2.append("phone",phone);
    f2.append("idCard",idCard);
    $.ajax({
        url:"/user/edit.do",
        type:"post",
        data:f2,
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
                $("#user_edits").attr("disabled",false);
                $('#user_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#per_edits").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//删除勾选的数据
function user_delete(){
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
        url:"/user/delete.do",
        type:"post",
        data:{
            id:ids.join(",")
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_delete").attr("disabled",false);
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#user_delete").attr("disabled",false);
            alert("服务器异常");
        }
    })
}

//为了重置密码获取密码
// 勾选数据，点击重置按钮
// 勾选多条时，提示“只能编辑一条数据”
function user_resetPass() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    if(cks.length==0){
        alert("请选择要重置密码的数据");
        $("#user_resetPassId").attr("disabled",false);
        return;
    }
    if(cks.length>1){
        alert("一次只能重置一条密码");
        $("#user_resetPassId").attr("disabled",false);
        return;
    }
    $.ajax({
        url:"/user/getdata.do",
        type:"post",
        data:{
            id:cks[0].value
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#user_editResetPass").val(json.data[0].password);
                $('#user_resetPass').modal('show');
            }else{
                alert(json.msg);
                $("#user_resetPassId").attr("disabled",false);
            }
        },
        error:function () {
            $("#user_resetPassId").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//重置密码
//编辑
function user_resetSave() {
    var cks=$("#list input[name=ck]:checked");//找到所有勾选中复选框
    $("#user_resetSaveId").attr("disabled",true);
    var id=cks[0].value;
    var password=$("#user_editResetPass").val();
    var f2=new FormData();
    f2.append("id",id);
    f2.append("password",password);
    $.ajax({
        url:"/user/reset.do",
        type:"post",
        data:f2,
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
                $("#user_resetSaveId").attr("disabled",false);
                $('#user_resetPass').modal('hide');//关闭弹窗
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#user_resetSaveId").attr("disabled",false);
            alert("服务器异常")
        }
    })
}


