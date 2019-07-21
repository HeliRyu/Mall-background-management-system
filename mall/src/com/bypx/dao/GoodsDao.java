package com.bypx.dao;
import com.bypx.page.GoodsPage;
import java.util.List;

//商品管理
public interface GoodsDao {
    //数据列表的形式显示出来
    //添加查询条件,添加分页
    public List<GoodsPage> query(GoodsPage page);
    //查询总记录数
    public Integer total(GoodsPage page);
    //改变上下架转换开关，更新数据库信息
    public Integer switch_change(GoodsPage page);
    //新增
    //点击新增，填入商品信息，图片的上传从图库中选择
    public Integer add(GoodsPage page);
    //编辑
    //选中商品点击编辑，把选中商品的信息全部显示出来，更改保存后更新数据库中的数据
    //为了编辑获取数据
    public List<GoodsPage> getdata1(GoodsPage page);
    //编辑
    //在商品表更新商品
    public Integer edit(GoodsPage page);
    //删除勾选的数据
    public Integer goods_del(String id);
}
