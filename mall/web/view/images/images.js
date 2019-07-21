// 上传的图片保存在本地磁盘，路劲存入数据库中，然后以数据列表的形式显示出来
var param={};
var page=1;//页号
var row_size=3;//每页个数
var page_size=3;//跨度个数
$(function () {
    // 预览头像
    $("#images_uploadPhoto").on("change",function () {
        // 预览头像的id
        var preview = document.getElementById('imgShow');//这个是在下面input框里面加入id="xx"，要写入xx的，要写成这样(‘#xx’)
        // input图片的id
        var file  = document.getElementById('images_uploadPhoto').files[0];//这个下标也相对应的来改，第一个的图片是下标是0，那么第二个图片的话，下标就要是1，以此类推
        var reader = new FileReader();
        reader.onloadend = function () {
            preview.src = reader.result;
        }
        if (file) {
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
        }
    });
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
        url:"/images/query.do",//请求地址
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
            "<td>"+replaceNull(row.imageName)+"</td>" +
            "<td> <img style='height: 50px;width: 50px' src='../../"+replaceNull(row.imageLink)+"' class='img-responsive' alt='Responsive image'></td>" +
            "<td>"+replaceNull(row.imageLink)+"</td>" +
            "<td>"+
            "<a class='btn btn-danger' href='javascript:void(0)' role='button' onclick='images_delete(\""+replaceNull(row.id)+"\")' id='images_delete'><span class='glyphicon glyphicon-trash'></span> 删除</a>" +
            "</td>"+
            "</tr>";
        i++;
    });
    $("#list").append(html);//添加数据
}

//生成表格数据中处理null值
function replaceNull(obj){
    if(obj===null||obj===undefined){
        return "";
    }
    return obj;
}

// 上传图片
// 点击上传图片按钮 弹出操作框，选择要上传的图片然后可以预览，
// 点击保存的时候把图片保存到项目自己制定的目录下，同时把相应的信息保存到数据库
function images_uploadss(){
    var name=$("#images_uploadName").val();
    if(!name){
        alert("图片名不可为空");
        return;
    }
    if(!$("#images_uploadPhoto")[0].files[0]){
        alert("图片文件不可为空");
        return;
    }
    var f=new FormData();
    f.append("img",$("#images_uploadPhoto")[0].files[0]);
    f.append("imageName",name);
    $.ajax({
        url:"/images/upload.do",
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
                $('#images_upload').modal('hide');//关闭弹窗
                $("#images_uploadName").val("");
                $("#images_uploadPhoto").val("");
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            $("#images_uploadName").val("");
            $("#images_uploadPhoto").val("");
            alert("服务器异常");
        }
    })
}

// 删除
// 点击删除按钮，验证是否删除，确定删除该条数据
function images_delete(id){
    var f=confirm("是否确认删除？");
    if(!f){
        return;
    }
    $.ajax({
        url:"/images/delete.do",
        type:"post",
        data:{
            id:id
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                alert(json.msg);
                page=1;
                makelist();
            }
        },
        error:function () {
            alert("服务器异常");
        }
    })
}



