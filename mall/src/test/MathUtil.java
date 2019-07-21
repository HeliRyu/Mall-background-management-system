package test;

public class MathUtil {
    public static boolean is_triangle(int a,int b,int c){
//        int i=1/0;
        if((a+b)<c){
            return  false;
        }
        if((a+c)<b){
            return  false;
        }
        if((b+c)<a){
            return  false;
        }
        if((a-b)>c){
            return  false;
        }
        if((a-c)>b){
            return  false;
        }
        if((b-c)>a){
            return  false;
        }
        return  true;
    }
   static public int add(int a,int b){
        return  a+b;
    }
}
