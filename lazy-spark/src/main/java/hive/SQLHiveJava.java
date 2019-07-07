package hive;


import org.apache.spark.sql.SparkSession;

import java.io.Serializable;

/**
 * Created by Administrator on 2017/4/3.
 */
public class SQLHiveJava {

    public static void main(String[] args) {

        SparkSession spark = SparkSession
                .builder()
                .appName("Java Spark Hive Example")
                .master("local[*]")
                .config("spark.sql.warehouse.dir","hdfs://mycluster/user/hive/warehouse")
                .enableHiveSupport()
                .getOrCreate();


        spark.sql("show databases").show();
        spark.sql("select count(*) from mob.lo").show();
        spark.sql("select * from mobike.logs").show();

    }
}
