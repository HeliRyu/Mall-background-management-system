package com.bypx.controller;
import com.bypx.page.GoodsPage;
import com.bypx.service.GoodsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

//商品管理
@Controller
@RequestMapping("/goods")
public class GoodsController {

    @Autowired
    private GoodsService goodsService;

    // 数据列表的形式显示出来
    @RequestMapping("/query.do")
    @ResponseBody
    public Object query(GoodsPage page){
        try{
            return goodsService.query(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //改变上下架转换开关，更新数据库信息
    @RequestMapping("/switch_change.do")
    @ResponseBody
    public Object switch_change(GoodsPage page){
        try{
            return goodsService.switch_change(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //新增
    //点击新增，填入商品信息，图片的上传从图库中选择
    @RequestMapping("/add.do")
    @ResponseBody
    public Object add(GoodsPage page){
        try{
            return goodsService.add(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //为了编辑获取数据
    @RequestMapping("/getdata.do")
    @ResponseBody
    public Object getdata(GoodsPage page){
        try{
            return goodsService.getdata(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //编辑
    @RequestMapping("/edit.do")
    @ResponseBody
    public Object edit(GoodsPage page){
        try{
            return goodsService.edit(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //删除勾选的数据
    @RequestMapping("/delete.do")
    @ResponseBody
    public Object delete(GoodsPage page){
        try{
            return goodsService.delete(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

