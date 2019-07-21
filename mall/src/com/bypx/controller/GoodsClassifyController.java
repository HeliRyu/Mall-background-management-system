package com.bypx.controller;
import com.bypx.page.GoodsClassifyPage;
import com.bypx.service.GoodsClassifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

//分类管理
@Controller
@RequestMapping("/goodsClassify")
public class GoodsClassifyController {
    @Autowired
    private GoodsClassifyService goodsClassifyService;

    //获取数据建成树
    //树形结构表示当前的组织关系，右键任意一个节点，弹出新增、编辑、删除的相关操作
    //用树形结构显示分类数据，树形结构技术用ztree.js做，在树形图上绑定右键显示操作菜单
    @RequestMapping("/getdata.do")
    @ResponseBody
    public Object getdata(GoodsClassifyPage page){
        return goodsClassifyService.getdata(page);
    }

    //点击 新增 按钮，弹出框 输入父级分类、分类名、序号，保存把写入信息保存入数据库，完成后，自动刷新分类树
    @RequestMapping("/add.do")
    @ResponseBody
    public Object add(GoodsClassifyPage page){
        return goodsClassifyService.add(page);
    }

    //把编辑的父级分类、分类名、序号数据显示出来，更改过后保存修改数据库中的数据
    @RequestMapping("/edit.do")
    @ResponseBody
    public Object edit(GoodsClassifyPage page){
        return goodsClassifyService.edit(page);
    }

    //移除
    //直接删除勾选的数据，并同时删除关联表数据
    //1）点击 移除 按钮，弹出确认框，确认后删除下级组织，并刷新组织树
    //2）若该组织为根节点，不允许删除
    //3）若该组织已关联用户，不允许删除（在组织用户关系表设立外键）：（设立了用户外键，删除用户，组织用户关系表里也删除）
    //4）若有下级，则同时删除下级组织（在组织表里设立外键）
    @RequestMapping("/delete.do")
    @ResponseBody
    public Object delete(GoodsClassifyPage page){
        return goodsClassifyService.delete(page);
    }
}

