package com.bypx.controller;
import com.bypx.page.ImagesPage;
import com.bypx.service.ImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

//图库管理
@Controller
@RequestMapping("/images")
public class ImagesController {

    @Autowired
    private ImagesService imagesService;

    // 上传的图片保存在本地磁盘，路径存入数据库中，然后以数据列表的形式显示出来
    @RequestMapping("/query.do")
    @ResponseBody
    public Object query(ImagesPage page){
        try{
            return imagesService.query(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    //上传新增图片
    // 点击上传图片按钮 弹出操作框，选择要上传的图片然后可以预览，
    // 点击保存的时候把图片保存到项目自己制定的目录下，同时把相应的信息保存到数据库
    @RequestMapping("/upload.do")
    @ResponseBody
    public Object add(MultipartFile img, ImagesPage page, HttpServletRequest request){
        try{
            return imagesService.upload(img,page,request);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }

    // 删除
    // 点击删除按钮，验证是否删除，确定删除该条数据
    @RequestMapping("/delete.do")
    @ResponseBody
    public Object delete(ImagesPage page){
        try{
            return imagesService.delete(page);
        }catch (Exception e){
            e.printStackTrace();
            Map result = new HashMap();
            result.put("success",false);
            result.put("msg","数据有误");
            return result;
        }
    }
}

