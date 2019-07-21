package test;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import java.util.Arrays;
import java.util.Collection;

//参数初始化运行
@RunWith(Parameterized.class)
public class AddTestSuit {
    private int result;//预期结果
    private int a;//参数1
    private int b;//参数2
    //赋值构造器
    public AddTestSuit( int a, int b,int result) {
        this.result = result;
        this.a = a;
        this.b = b;
    }
    @Parameterized.Parameters
    public static Collection data(){
       Object[][] data=new Object[][]{
               new Object[]{0,0,0},
               new Object[]{-1,0,-1},
               new Object[]{1,0,-1},
       };
        return Arrays.asList(data);
    }
    @Test
    public void run(){
       int temp= MathUtil.add(a,b);
        Assert.assertEquals(result,temp);
    }
}
