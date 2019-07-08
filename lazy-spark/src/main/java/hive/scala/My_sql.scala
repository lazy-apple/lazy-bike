package hive.scala

import hive.SQLHiveJava

/**
  * @author LaZY(李志一) 
  * @create 2019-07-07 22:11 
  */
object My_sql {
  def main(args: Array[String]): Unit = {
    val ds = SQLHiveJava.getDf("select * from mobike.logs")
    var df = ds.toDF();
    df.show();
//
//    df.createGlobalTempView("MoneyRecord");
//    ds.write
//      .format("jdbc")//com.mysql.cj.jdbc.Driver
//      .option("url", "jdbc:mysql://localhost:3306/bike")//jdbc:mysql://localhost:3306/houses
//      .option("dbtable", "moneyrecord2")
//      .option("user", "root")
//      .option("password", "root")
//      .save()
  }

}
