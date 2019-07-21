package com.bypx.dao;
import com.bypx.page.ImagesPage;
import java.util.List;

//图库管理
public interface ImagesDao {
    // 上传的图片保存在本地磁盘，路径存入数据库中，然后以数据列表的形式显示出来
    //添加查询条件,添加分页
    public List<ImagesPage> query(ImagesPage page);
    //查询总记录数
    public Integer total(ImagesPage page);
    //上传新增图片
    // 点击上传图片按钮 弹出操作框，选择要上传的图片然后可以预览，
    // 点击保存的时候把图片保存到项目自己制定的目录下，同时把相应的信息保存到数据库
    public Integer images_upload(ImagesPage page);
    // 点击删除按钮，验证是否删除，确定删除该条数据
    public Integer images_del(String id);
}
