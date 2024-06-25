只处理这四个字段

name,remark,place,type



```shell
serverAddr = "59.110.6.139"
serverPort = 7000

[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 7001
```

