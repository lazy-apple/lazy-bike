# lazy-bike
共享单车项目完善版


# 项目操作指南
1.	启动zk（s201~s203）
	zkServer.sh start(记得检查状态 zkServer.sh status)
2.	启动hadoop集群
	start-all.sh
3.	启动MongoDB服务（s202~s204）
	#启动所有的config server
mongod --config /soft/mongo/config/mongod.conf
#启动所有的shard1
mongod --config /soft/mongo/shard1/mongod.conf
#启动所有的shard2
mongod --config /soft/mongo/shard2/mongod.conf
#启动所有的shard3
mongod --config /soft/mongo/shard3/mongod.conf
#启动所有的mongos
mongos --config /soft/mongo/mongos/mongod.conf
如果想在集群操作MongoDB，执行以下命令（s202）：
mongo --port 27200
MongoDB其他操作：
show dbs;
use mobike
show tables;
db.bikes.find()
4.	启动nginx日志采集服务器（s203）
[centos@s203 /usr/local/nginx/sbin]$sudo ./nginx
5.	启动kafka集群（s202~s204）
[centos@s202 /soft/kafka/bin]$kafka-server-start.sh -daemon /soft/kafka/config/server.properties
用于测试的kafka生产者和消费
生产者：
kafka-console-producer.sh --broker-list s202:9092,s203:9092,s204:9092 --topic track
消费者：
kafka-console-consumer.sh --bootstrap-server s202,s203,s204 --topic track --from-beginning --zookeeper s201:2181

6.	启动flume（s203、s204）
flume-ng agent -f /soft/flume/conf/kafka-hdfs.conf -n a1 Dflume.root.logger=INFO,console
7.	启动hive
hive --service metastore
8.	启动mysql
9.	启动redis
10.	运行主程序
11.	启动sparkStreaming
12.	使用hiveSql

