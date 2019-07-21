package com.bypx.dao;
import com.bypx.page.UserPage;
import java.util.List;

// 对用户的增删改查功能
// 列表头像要显示出来
public interface UserDao {
    //创建表格查询，查询条件：会员ID及昵称，查出对应的数据，注意控制好分页
    //添加查询条件,添加分页
    public List<UserPage> query(UserPage userPage);
    //查询总记录数
    public Integer total(UserPage userPage);
    //改变上下架转换开关，更新数据库信息
    public Integer switch_change(UserPage page);
    //点击新增按钮
    //新增到用户表
    public Integer user_add(UserPage page);
    //为了编辑获取数据
    //获取用户表数据
    public List<UserPage> getdata1(UserPage page);
    //勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    //在用户表更新用户
    public Integer edit(UserPage page);
    //删除勾选的数据
    public Integer user_del(String id);
    //重置密码
    public Integer resetPass(UserPage page);
}
