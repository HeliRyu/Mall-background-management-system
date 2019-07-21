//分类管理

//获取数据建成树
//树形结构表示当前的组织关系，右键任意一个节点，弹出新增、编辑、删除的相关操作
//用树形结构显示分类数据，树形结构技术用ztree.js做，在树形图上绑定右键显示操作菜单
var tree;//设置全局变量
var setting = {
    data: {
        key: {
            name: "name"
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pid",////使其有父节点和子节点之分
            rootPId: 0
        }
    },
    callback: { //回调函数
        onRightClick: zTreeOnRightClick //右键事件  
    }
};

// 取数据形成树
$(function(){
    document.onclick=function(){
        $("#rmenu").hide();
    };
    //自动刷新树
    getdata();
});

//完成后，自动刷新组织树
function getdata() {
    $.ajax({
        url:"/goodsClassify/getdata.do",//请求地址
        type:'post',//请求方式
        data:{//提交参数
        },
        dataType:"json",//返回结构类型
        success:function (json) {
            tree=$.fn.zTree.init($("#goodsClassifyTree"), setting,json.data);
            tree.expandAll(true);
            appendAddTable(json.data);
            appendEditTable(json.data);

        },
        error:function () {
            alert("请求失败");
        }
    });
}

// zTree树节点右键单击出现菜单选项
function zTreeOnRightClick(event, treeId, treeNode) {
    var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
    // 如果没有选中节点，只能添加下级。选中节点后，才可以编辑、添加、移除。
    if(nodes.length==0){
        $('#editNode').hide();
        $('#deleteNode').hide();
    }else{
        $('#editNode').show();
        $('#deleteNode').show();
    }
    // 设置菜单的位置
    $("#rmenu").css("left",event.clientX+"px");
    $("#rmenu").css("top",event.clientY+"px");
    $("#rmenu").show();
}

//生成新增下拉框数据
function appendAddTable(data) {
    $("#goods_classify_add_select option").remove();//清空原有数据
    var html='<option>&nbsp;&nbsp;</option>';
    data.forEach(function (row) {
        html+="<option value='"+row.id+"'>"+replaceNull(row.name)+"</option>";
    });
    $("#goods_classify_add_select").append(html);//添加数据
}

//生成编辑下拉框数据
function appendEditTable(data) {
    $("#goods_classify_edit_select option").remove();//清空原有数据
    var html='<option>&nbsp;&nbsp;</option>';
    data.forEach(function (row) {
        html+="<option value='"+row.id+"'>"+replaceNull(row.name)+"</option>";
    });
    $("#goods_classify_edit_select").append(html);//添加数据
}

//生成下拉框数据中处理null值
function replaceNull(obj){
    if(obj===null||obj===undefined){
        return "";
    }
    return obj;
}

//把新增的父级分类数据显示出来
function openAdd() {
    var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
    console.info(nodes[0].id)
    $("#goods_classify_add_select").val(nodes[0].id);
    $("#goods_classify_add_select").attr("disabled",true);
    $('#goods_classify_add').modal('show');
}

//点击 新增 按钮，弹出框 输入父级分类、分类名、序号，保存把写入信息保存入数据库，完成后，自动刷新分类树
function add_save() {
    $("#add_save").attr("disabled",true);
    var nodes=tree.getSelectedNodes();//获取当前被选中的节点数据集合'
    var name=$("#goods_classify_add_name").val();
    var sort=$("#goods_classify_add_sort").val();
    if(!name){//如果没有填写要添加的分类名
        alert("分类名不可为空");
        return;
    }
    if(!sort){//如果没有填写要添加的序号
        alert("序号不可为空");
        return;
    }
    var pid;
    if (nodes.length==0){//如果在空白处点击添加下级
        pid=null;
    } else {
        pid=nodes[0].id;
    }
    $.ajax({
        url:"/goodsClassify/add.do",
        type:"post",
        data:{
            name:name,
            pid:pid,
            sort:sort
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
                var newNode = {name:"newNode1"};//给定一个要添加的新节点
                if(nodes.length>0){//把这个新节点添加到当前选中的节点下，作为它的子节点
                    newNode = tree.addNodes(nodes[0], newNode);
                }
                //自动刷新树
                getdata();
                $("#add_save").attr("disabled",false);
                $('#goods_classify_add').modal('hide');//关闭弹窗
                $("#goods_classify_add_name").val("");//输入框里清除数据
                $("#goods_classify_add_sort").val("");//输入框里清除数据
                alert(json.msg);
                $("#goods_classify_add_select").attr("disabled",false);
            }
        },
        error:function () {
            $("#add_save").attr("disabled",false);
            $("#goods_classify_add_name").val("");//输入框里清除数据
            $("#goods_classify_add_sort").val("");//输入框里清除数据
            alert("服务器异常");
        }
    })
}

//把编辑的父级分类、分类名、序号数据显示出来，更改过后保存修改数据库中的数据
function openEdit() {
    var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
    // 下标为0，因为只上传了一个list，注意键要大写字母。先取值，再传值。id也要传，后面才能写sql，隐藏。
    //使用mybatis后大写字母改为小写字母。
    $("#goods_classify_edit_name").val(nodes[0].name);
    $("#goods_classify_editId").val(nodes[0].id);
    $("#goods_classify_edit_sort").val(nodes[0].sort);
    $("#goods_classify_edit_select").val(nodes[0].pid);
    $('#goods_classify_edit').modal('show');
}

// 编辑
function edit_save() {
    $("#edit_save").attr("disabled",true);
    var nodes=tree.getSelectedNodes();
    $.ajax({
        url:"/goodsClassify/edit.do",
        type:"post",
        data:{
            id:$("#goods_classify_editId").val(),
            name:$("#goods_classify_edit_name").val(),
            pid:$("#goods_classify_edit_select").val(),
            sort:$("#goods_classify_edit_sort").val()
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                $("#edit_save").attr("disabled",false);
                $('#goods_classify_edit').modal('hide');//关闭弹窗
                alert(json.msg);
                getdata();
            }
        },
        error:function () {
            $("#edit_save").attr("disabled",false);
            alert("服务器异常")
        }
    })
}

//移除
//直接删除勾选的数据，并同时删除关联表数据
function delete_save(){
    var nodes=tree.getSelectedNodes();//获取当前被选中的节点数据集合
    var id=nodes[0].id;
    $.ajax({
        url:"/goodsClassify/delete.do",
        type:"post",
        data:{
            id:id
        },
        dataType:"json",
        success:function (json) {
            if(json.success){
                var nodes = tree.getSelectedNodes();//获取当前被选中的节点数据集合
                // 删除所有选中的节点
                for (var i=0, l=nodes.length; i < l; i++) {
                    tree.removeNode(nodes[i]);
                }
                //自动刷新树
                getdata();
                $('#goods_classify_delete').modal('hide');//关闭弹窗
                alert(json.msg);
            }
        },
        error:function () {
            alert("服务器异常");
        }
    })
}

