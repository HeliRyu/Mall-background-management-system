package com.bypx.service;
import com.bypx.dao.UserDao;
import com.bypx.page.UserPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

// 对用户的增删改查功能
// 列表头像要显示出来
@Service
@Transactional
public class UserService {
    @Autowired
    private UserDao userDao;

    //创建表格查询，查询条件：会员ID及昵称，查出对应的数据，注意控制好分页
    public Map query(UserPage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);
        List<UserPage> list=userDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=userDao.total(page);
        result.put("total",total);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //改变上下架转换开关，更新数据库信息
    public Map switch_change(UserPage page) {
        Map result = new HashMap();
        String switch_boolean=page.getMaster();
        if (switch_boolean.equals("true")){//字符串判断用equals
            page.setMaster("是");
        }else{
            page.setMaster("否");
        }
        userDao.switch_change(page);
        result.put("success",true);
        result.put("msg","传递数据成功");
        return  result;
    }

    //点击新增按钮，弹出框中包含用户信息、以及角色、组织机构名
    public Map add(MultipartFile img, UserPage page, HttpServletRequest request) {
        Map result = new HashMap();
        //上传头像
        String OriginalFilename=img.getOriginalFilename();
        String suffix=OriginalFilename.substring(OriginalFilename.lastIndexOf("."));
        if (!suffix.equals(".jpg")&&!suffix.equals(".gif")&&!suffix.equals("png")){
            result.put("success", false);
            result.put("msg", "文件类型错误");
            return result;
        }
        if (img.getSize()>1024*1024*2){
            result.put("success", false);
            result.put("msg", "文件超过2m");
            return result;
        }
        //上传文件夹地址
        String up_dir_path=request.getRealPath("/upload");
        File up_dir=new File(up_dir_path);//上传文件夹
        if (!up_dir.exists()){//如果文件夹不存在则创建文件夹
            up_dir.mkdirs();
        }
        //新文件名
        String file_name= UUID.randomUUID().toString()+suffix;
        //新文件路径
        String file_path=up_dir_path+"/"+file_name;
        File file=new File(file_path);
        try{
            String user_id=UUID.randomUUID().toString();
            img.transferTo(file);
            page.setId(user_id);
            page.setPhoto("upload/"+file_name);
            //新增到用户表
            Integer add= userDao.user_add(page);
            result.put("success",true);
            result.put("msg","新增成功");
            return  result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","文件上传失败");
            return result;
        }
    }

    //为了编辑获取数据
    public Map getdata(UserPage page) {
        Map result = new HashMap();
        //获取用户表数据
        List<UserPage> list=userDao.getdata1(page);
        result.put("data",list);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    public Map edit(MultipartFile img, UserPage page, HttpServletRequest request) {
        Map result = new HashMap();
        //上传头像
        String OriginalFilename=img.getOriginalFilename();
        String suffix=OriginalFilename.substring(OriginalFilename.lastIndexOf("."));
        if (!suffix.equals(".jpg")&&!suffix.equals(".gif")&&!suffix.equals("png")){
            result.put("success", false);
            result.put("msg", "文件类型错误");
            return result;
        }
        if (img.getSize()>1024*1024*2){
            result.put("success", false);
            result.put("msg", "文件超过2m");
            return result;
        }
        //上传文件夹地址
        String up_dir_path=request.getRealPath("/upload");
        File up_dir=new File(up_dir_path);//上传文件夹
        if (!up_dir.exists()){//如果文件夹不存在则创建文件夹
            up_dir.mkdirs();
        }
        //新文件名
        String file_name= UUID.randomUUID().toString()+suffix;
        //新文件路径
        String file_path=up_dir_path+"/"+file_name;
        File file=new File(file_path);
        try{
            img.transferTo(file);
            //在用户表更新用户
            page.setPhoto("upload/"+file_name);
            userDao.edit(page);
            result.put("success",true);
            result.put("msg","编辑成功");
            return  result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","文件上传失败");
            return result;
        }
    }

    //删除勾选的数据
    public Map delete(UserPage page) {
        Map result = new HashMap();
        String[] ids=page.getId().split(",");
        for (int i = 0; i <ids.length ; i++) {
            System.out.println("---------"+ids[i]+"=========");
            userDao.user_del(ids[i]);
        }
        result.put("success",true);
        result.put("msg","删除成功");
        return  result;
    }

    //重置密码
    public Map resetPass(UserPage page) {
        Map result = new HashMap();
        userDao.resetPass(page);
        result.put("success",true);
        result.put("msg","重置密码成功");
        return  result;
    }
}

