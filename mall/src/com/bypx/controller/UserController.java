package com.bypx.controller;
import com.bypx.page.UserPage;
import com.bypx.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

// 对用户的增删改查功能
// 列表头像要显示出来
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    //创建表格查询，查出对应的数据，注意控制好分页
    @RequestMapping("/query.do")
    @ResponseBody
    public Object query(UserPage page){
        try{
            return userService.query(page);
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
    public Object switch_change(UserPage page){
        try{
            return userService.switch_change(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //点击新增按钮
    @RequestMapping("/add.do")
    @ResponseBody
    public Object add(MultipartFile img, UserPage page, HttpServletRequest request){
        try{
            return userService.add(img,page,request);
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
    public Object getdata(UserPage page){
        try{
            return userService.getdata(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //勾选数据，点击编辑按钮 ，弹出框中初始化对应信息，可以任意修改用户数据
    //勾选多条时，提示“只能编辑一条数据”
    //编辑
    @RequestMapping("/edit.do")
    @ResponseBody
    public Object edit(MultipartFile img, UserPage page, HttpServletRequest request){
        try{
            return userService.edit(img,page,request);
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
    public Object delete(UserPage page){
        try{
            return userService.delete(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //重置密码
    //编辑
    @RequestMapping("/reset.do")
    @ResponseBody
    public Object edit(UserPage page){
        try{
            return userService.resetPass(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

