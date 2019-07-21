package com.bypx.service;
import com.bypx.dao.ImagesDao;
import com.bypx.page.ImagesPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

//图库管理
@Service
@Transactional
public class ImagesService {
    @Autowired
    private ImagesDao imagesDao;

    // 上传的图片保存在本地磁盘，路劲存入数据库中，然后以数据列表的形式显示出来
    public Map query(ImagesPage page) {
        Map result = new HashMap();
        int page_=page.getPage();
        int size=page.getSize();

        //添加查询条件,添加分页
        int start_index=(page_-1)*size+1;
        page.setStart_index((page_-1)*size+1);
        page.setEnd_index(start_index+size-1);
        List<ImagesPage> list=imagesDao.query(page);
        result.put("data",list);

        //查询总记录数
        int total=imagesDao.total(page);
        result.put("total",total);
        result.put("success",true);
        result.put("msg","获取数据成功");
        return  result;
    }

    //上传新增图片
    // 点击上传图片按钮 弹出操作框，选择要上传的图片然后可以预览，
    // 点击保存的时候把图片保存到项目自己制定的目录下，同时把相应的信息保存到数据库
    public Map upload(MultipartFile img, ImagesPage page, HttpServletRequest request) {
        Map result = new HashMap();
        //上传图片
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
            String images_id=UUID.randomUUID().toString();
            img.transferTo(file);
            page.setId(images_id);
            page.setImageLink("upload/"+file_name);
            //获取上传图片的时间
            Date date=new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            String nowTime = dateFormat.format(date);
            page.setAddTime(nowTime);
            //新增到图库表
            System.out.println(page);
            Integer upload=imagesDao.images_upload(page);
            result.put("success",true);
            result.put("msg","图片上传成功");
            return  result;
        } catch (IOException e) {
            e.printStackTrace();
            result.put("success",false);
            result.put("msg","图片上传失败");
            return result;
        }
    }

    // 删除
    // 点击删除按钮，验证是否删除，确定删除该条数据
    public Map delete(ImagesPage page) {
        Map result = new HashMap();
        imagesDao.images_del(page.getId());
        result.put("success",true);
        result.put("msg","删除成功");
        return  result;
    }
}

