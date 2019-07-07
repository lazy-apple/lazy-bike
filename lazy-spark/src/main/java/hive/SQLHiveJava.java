package hive;


import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/4/3.
 */
public class SQLHiveJava {

    public static void main(String[] args) {


        getDf("select * from mobike.logs");


    }

    public static Dataset<Row> getDf (String s){
        SparkSession spark = SparkSession
                .builder()
                .appName("Java Spark Hive Example")
                .master("local[*]")
                .config("spark.sql.warehouse.dir","hdfs://mycluster/user/hive/warehouse")
                .enableHiveSupport()
                .getOrCreate();
        Dataset<Row> df = null;

        df = spark.sql(s);
//        df.show();

        return df;
    }
}
