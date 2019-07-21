package com.bypx.service;
import com.bypx.dao.GoodsDao;
import com.bypx.page.GoodsPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

//商品管理
@Service
@Transactional
public class GoodsService {
    @Autowired
    private GoodsDao goodsDao;

    //数据列表的形式显示出来
    public Map query(GoodsPage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);
        List<GoodsPage> list=goodsDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=goodsDao.total(page);
        result.put("total",total);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //改变上下架转换开关，更新数据库信息
    public Map switch_change(GoodsPage page) {
        Map result = new HashMap();
        boolean switch_boolean=page.isState();
        if (switch_boolean==true){
        page.setStatus("是");
        }else{
            page.setStatus("否");
        }
        goodsDao.switch_change(page);
        result.put("success",true);
        result.put("msg","传递数据成功");
        return  result;
    }

    //新增
    //点击新增，填入商品信息，图片的上传从图库中选择，
    public Map add(GoodsPage page) {
        Map result = new HashMap();
        Integer add=goodsDao.add(page);
        if(add>0){
            result.put("success",true);
            result.put("msg","新增成功");
            return  result;
        }else{
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //为了编辑获取数据
    public Map getdata(GoodsPage page) {
        Map result = new HashMap();
        //获取商品表数据
        List<GoodsPage> list=goodsDao.getdata1(page);
        result.put("data",list);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //编辑
    public Map edit(GoodsPage page) {
        Map result = new HashMap();
        goodsDao.edit(page);
        result.put("success",true);
        result.put("msg","编辑成功");
        return  result;
    }

    //删除勾选的数据
    public Map delete(GoodsPage page) {
        Map result = new HashMap();
        String[] ids=page.getIds().split(",");
        for (int i = 0; i <ids.length ; i++) {
            goodsDao.goods_del(ids[i]);
        }
        result.put("success",true);
        result.put("msg","删除成功");
        return  result;
    }
}

