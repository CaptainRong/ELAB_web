

## 配置

使用docker compose部署.

docker-compose.yml

```dockerfile
services:
  mysql:
    image: mysql:8.0
    volumes:
      - ./build/mysql:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123123
      MYSQL_DATABASE: casdoor
    networks:
      - cas-network
    ports:
      - "3306:3306"
   
  casdoor:
    image: casbin/casdoor:latest
    environment:
      driverName: mysql
      dataSourceName: root:123123@tcp(mysql:3306)/
    networks:
      - cas-network
    depends_on:
      - mysql
    ports:
      - "7000:8000"

  phpmyadmin:
    image: phpmyadmin:latest
    environment:
      PMA_HOSTS: mysql
      PMA_PORT: 3306   
      PMA_USER: root
      PMA_PASSWORD: 123123
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - cas-network 
     
  
networks:
  cas-network:
    driver: bridge
      	
```



部署了三个容器：mysql，casdoor，phpmyadmin（mysql的数据可视化应用）

三个容器之间使用桥接模式网络通信。

### mysql

+ volumes：设置了卷，将数据库文件挂载在本地的文件夹。
+ environment：设置环境变量。MYSQL_ROOT_PASSWORD管理员密码，MYSQL_DATABASE初始化创建的数据库
+ networks：网络模式

### casdoor

+ environment：环境变量，主要是连接mysql的配置
+ depends_on：依赖于mysql容器
+ ports：容器到主机的端口映射

### phpmyadmin

同上



## 运行

docker部署只需要运行命令`docker compose -p [name] up`

name是给容器组起个名字。

==**非常重要！！！！！**docker compose命令需要开两个终端分别各运行一次，name不用改，中间间隔五秒钟，当看到其中一个终端显示casdoor运行在端口上时才成功。==

==**非常重要！！！！！**docker compose命令需要开两个终端分别各运行一次，name不用改，中间间隔五秒钟，当看到其中一个终端显示casdoor运行在端口上时才成功。==

==**非常重要！！！！！**docker compose命令需要开两个终端分别各运行一次，name不用改，中间间隔五秒钟，当看到其中一个终端显示casdoor运行在端口上时才成功。==

只运行一次命令casdoor容器会报错退出，其他正常。

原因（以下为个人猜测，纯属脑洞）：mysql启动之后需要一定的准备时间，casdoor会检测到mysql不能使用因此无法正常启动，会报错退出。即使是添加了depends_on，也只能是保证mysql在casdoor之前启动，也无法保证mysql是可用的。启动第二遍docker compose时phpmyadmin和mysql已经启动了不会重新启动。casdoor已经关闭，会重新启动，此时mysql已经是可用的了。