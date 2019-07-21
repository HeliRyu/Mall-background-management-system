package com.bypx.dao;
import com.bypx.page.GoodsClassifyPage;
import java.util.List;

//分类管理
public interface GoodsClassifyDao {
    //获取数据建成树
    //树形结构表示当前的组织关系，右键任意一个节点，弹出新增、编辑、删除的相关操作
    //用树形结构显示分类数据，树形结构技术用ztree.js做，在树形图上绑定右键显示操作菜单
    public List<GoodsClassifyPage> getdata(GoodsClassifyPage goodsClassifyPage);
    //点击 新增 按钮，弹出框 输入父级分类、分类名、序号，保存把写入信息保存入数据库，完成后，自动刷新分类树
    public Integer add(GoodsClassifyPage goodsClassifyPage);
    //把编辑的父级分类、分类名、序号数据显示出来，更改过后保存修改数据库中的数据
    public Integer edit(GoodsClassifyPage goodsClassifyPage);
    //移除
    //直接删除勾选的数据，并同时删除关联表数据
    public Integer del(Integer id);
}
