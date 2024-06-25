部署在docker容器中，casdoor使用mysql储存用户信息。因此使用casdoor需要配置mysql。mysql当中的casdoor数据库就是casdoor的数据。里面有用的就是user表，储存用户信息，里面有一百多字段，大部分都没用。为了添加额外的用户信息，创建了user_info表。==casdoor中的表可以修改数据（CRUD），但是不能修改表结构。==

要使用casdoor需要先部署后好进入casdoor本地服务的网页（用户：admin，密码：123）：

1. 先创建一个组织（修改组织名就行，其他默认）
2. 创建一个应用：这个应用应该属于刚才新建的组织。应用中应该添加一个重定向url。还有一些登录页面的设置需要设置。
3. 记录下client_id,client_secret，复制到后端的oidc_client_secrets.json文件中。
4. 修改oidc_client_secrets中的所有url为casdoor所在的主机和端口



