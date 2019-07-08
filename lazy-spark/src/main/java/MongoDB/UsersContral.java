package MongoDB;

import com.mongodb.spark.MongoSpark;
import com.mongodb.spark.rdd.api.java.JavaMongoRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.bson.Document;
import org.junit.Test;

/**
 * @author LaZY(李志一)
 * @create 2019-07-08 13:20
 */
public class UsersContral {
    SparkSession spark = null;
    public UsersContral() {
        spark = SparkSession.builder()
                .master("local")
                .appName("MongoSparkConnectorIntro")
                .config("spark.mongodb.input.uri", "mongodb://192.168.255.202:27200,192.168.255.203:27200,192.168.255.204:27200/mobike.bikes?readPreference=secondaryPreferred")
                .getOrCreate();
    }

    public Dataset<Row> getDf (String s){
        JavaSparkContext sc = new JavaSparkContext(spark.sparkContext());
        JavaMongoRDD<Document> rdd = MongoSpark.load(sc);
        Dataset<Row> df = rdd.toDF();
        return df;
    }

    /***
     * 显示表中所有记录
     */
    @Test
    public void showAll(){
        Dataset<Row> df = getDf("select * from mobikes.bikes");
        df.show();
    }



    public static void main(String[] args) {

    }
}


