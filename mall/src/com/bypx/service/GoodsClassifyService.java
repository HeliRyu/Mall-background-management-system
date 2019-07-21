package com.bypx.service;
import com.bypx.dao.GoodsClassifyDao;
import com.bypx.page.GoodsClassifyPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

//分类管理
@Service
@Transactional
public class GoodsClassifyService {
    @Autowired
    private GoodsClassifyDao goodsClassifyDao;

    //获取数据建成树
    //树形结构表示当前的组织关系，右键任意一个节点，弹出新增、编辑、删除的相关操作
    //用树形结构显示分类数据，树形结构技术用ztree.js做，在树形图上绑定右键显示操作菜单
    public Map getdata(GoodsClassifyPage page) {
        Map result = new HashMap();
        List<GoodsClassifyPage> list=goodsClassifyDao.getdata(page);
        result.put("data",list);
        return result;
    }

    //点击 新增 按钮，弹出框 输入父级分类、分类名、序号，保存把写入信息保存入数据库，完成后，自动刷新分类树
    public Map add(GoodsClassifyPage page) {
        Map result = new HashMap();
        Integer add=goodsClassifyDao.add(page);
        if(add>0){
            result.put("success",true);
            result.put("msg","添加下级成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //把编辑的父级分类、分类名、序号数据显示出来，更改过后保存修改数据库中的数据
    public Map edit(GoodsClassifyPage page) {
        Map result = new HashMap();
        Integer edit=goodsClassifyDao.edit(page);
        if (edit>0){
                result.put("success",true);
                result.put("msg","编辑成功");
                return  result;
        }else{
                result.put("success",false);
                result.put("msg","数据有误");
                return result;
        }
    }

    //移除
    //直接删除勾选的数据，并同时删除关联表数据
    public Map delete(GoodsClassifyPage page) {
        Map result = new HashMap();
        Integer id=page.getId();
        Integer del=goodsClassifyDao.del(id);
        if (del>0) {
            result.put("success", true);
            result.put("msg", "移除成功");
            return result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

