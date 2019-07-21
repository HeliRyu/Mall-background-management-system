//登录注册
$(function(){
});

//勾选框选中后，使用cookie加密保存登录成功后的用户名、密码。再次打开登录页，直接从cookie中解密。
// （如果一周内免登陆复选框在提交数据时有选中，则跳转前将用户信息存入Cookie，下一次打开登陆页的时候不需要提交用户名密码直接到成功页面。）
//登录和记住密码，发送用户名和密码到后台进行验证
function login(){
    var lname=$("#login_uname").val();
    var lpassword=$("#login_upassword").val();
$.ajax({
    url:"/portal/login.do",//请求地址
    type:'post',//请求方式
    data:{//提交参数
        name:lname,
        password:lpassword
    },
    dataType:"json",//返回结构类型
    success:function (json) {
        $("#result").html(json.msg);
        if(json.success){
            $("#result").css("color","green");
            window.location.href="/view/login/main.html"//成功则跳转到登录成功的页面
        }else{
            $("#result").css("color","red");
        }
    },
    error:function () {
        alert("请求失败");
    }
})
}

//注册新增
//注册验证昵称，已经注册过的昵称不能使用，头像保存到磁盘，路径存入数据库中
function register_save() {
    $("#register_save").attr("disabled",true);//设置不可重复点击注册按钮
    var sname=$("#register_name").val();
    var spassword=$("#register_password").val();
    if(!sname){
        alert("昵称不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!spassword){
        alert("密码不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    if(!$("#register_img")[0].files[0]){
        alert("头像不可为空");
        $("#register_save").attr("disabled",false);
        return;
    }
    var f=new FormData();
    f.append("img",$("#register_img")[0].files[0]);//这里的img为MultipartFile的img
    f.append("name",sname);
    f.append("password",spassword);
    $.ajax({
        url:"/portal/register.do",
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
        dataType:'json',
        success:function (json) {
            $("#register_save").attr("disabled",false);
            $('#register').modal('hide');//关闭弹窗
            alert(json.msg);
        },
        error:function(){
            alert("服务器异常");
            $("#register_save").attr("disabled",false);
        }
    })
    // 模态框关闭事件
    $('register').on('hidden.bs.modal',function (e) {
        $("#register_name").val("");
        $("#register_password").val("");
        $("#register_img").val("");
    })
}