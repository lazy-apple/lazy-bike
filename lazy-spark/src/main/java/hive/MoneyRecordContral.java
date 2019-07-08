package hive;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;
import org.apache.spark.sql.SparkSession;
import org.junit.Test;

import java.util.Properties;

/**
 * @author LaZY(李志一)
 * @create 2019-07-08 11:00
 */
public class MoneyRecordContral {
    SparkSession spark = null;
    public MoneyRecordContral() {
        spark = SparkSession
                .builder()
                .appName("Java Spark Hive Example")
                .master("local[*]")
                .config("spark.sql.warehouse.dir","hdfs://mycluster/user/hive/warehouse")
                .enableHiveSupport()
                .getOrCreate();
    }

    public Dataset<Row> getDf (String s){
        Dataset<Row> df = spark.sql(s);
        return df;
    }

    /***
     * 显示表中所有记录
     */
    @Test
    public void showAll(){
        Dataset<Row> df = SQLHiveJava.getDf("select * from mobike.logs");
        df.show();
    }

    /***
     * 保存所有记录到mysql
     */
    @Test
    public void saveAll(){
        Dataset<Row> df = SQLHiveJava.getDf("select * from mobike.logs");
        Properties connectionProperties = new Properties();
        connectionProperties.put("user", "root");
        connectionProperties.put("password", "root");
        df.write()
                .mode(SaveMode.Append).jdbc("jdbc:mysql://localhost:3306/bike", "moneyrecords", connectionProperties);
    }

    public void showSql(String s){
        Dataset<Row> df = SQLHiveJava.getDf(s);
        df.show();
    }

    /***
     * 显示每天的充值总金额
     */
    @Test
    public void showAllAmount_currentDay(){
        Dataset<Row> df = SQLHiveJava.getDf("SELECT dates,sum(amount) as sum FROM mobike.logs group by dates");
        df.show();
    }

    /***
     * 显示到目前充值的总额
     */
    @Test
    public void showAllAmount(){
        Dataset<Row> df = SQLHiveJava.getDf("SELECT sum(amount) from mobike.logs");
        df.show();
    }

    /***
     * 显示每天充值次数
     */
    @Test
    public void showCountToday(){
        showSql("select dates,count(dates) from mobike.logs group by dates");
    }

    /***
     * 显示每个地区每天的充值成功总数
     */
    @Test
    public void showCountDistriceDates(){
        showSql("SELECT district,dates,COUNT(dates) FROM mobike.logs GROUP BY district,dates");
    }

    /***
     * 显示每个地区每天的充值总金额
     */
    @Test
    public void showSumMoneyDistriceDates(){
        showSql("SELECT district,dates,sum(amount) FROM mobike.logs GROUP BY district,dates");
    }

    /***
     * 充值次数排名前三的终端设备
     */
    @Test
    public void showCountModel(){
        showSql("SELECT model,COUNT(model) from mobike.logs GROUP BY model ORDER BY COUNT(model) DESC LIMIT 3");
    }

    /***
     * 充值金额排名前三的终端设备
     */
    @Test
    public void showCountModelMoney(){
        showSql("SELECT model,sum(amount) from mobike.logs GROUP BY model ORDER BY sum(amount) DESC LIMIT 3");
    }

    public static void main(String[] args) {
        MoneyRecordContral obj = new MoneyRecordContral();
        obj.showSql("");
    }

}
