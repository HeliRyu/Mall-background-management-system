package test;

import com.bypx.page.UserPage;
import com.bypx.service.LoginService;
import org.junit.*;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.http.HttpRequest;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;

public class TestMathUtil {
//    @BeforeClass
//   static public  void before_class(){
//        System.out.println("--before_class---");
//    }
//    @AfterClass
//    static public  void after_class(){
//        System.out.println("--after_class---");
//    }
//    @Before
//    public  void before(){
//        System.out.println("--before---");
//    }
//
//    @After
//    public  void after(){
//        System.out.println("--after---");
//    }
    @Test
    public void test(){
        ClassPathXmlApplicationContext context=new ClassPathXmlApplicationContext("spring-*.xml");

        //测试LoginService类
        LoginService loginService= (LoginService) context.getBean("");
        UserPage page =new UserPage();
        page.setName("admin");
        page.setPassword("123");
        Assert.assertTrue(loginService.login(page));
        //课堂测试User类
//        User user= (User) context.getBean("");
//        String name= user.getName();
//        Assert.assertNotNull(name);

       //单元测试是否是三角形
        Assert.assertTrue(MathUtil.is_triangle(3,4,5));

//        int result=MathUtil.add(0,0);
//        Assert.assertEquals(0,result);
    }
    @Test
    public void test2(){
        int result=MathUtil.add(-1,0);
        Assert.assertEquals(0,result);
        Assert.assertTrue(MathUtil.is_triangle(-3,4,5));
    }
}
