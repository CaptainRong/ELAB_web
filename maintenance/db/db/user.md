user.py

包含两个表user和user_info。还有一个user_view视图。

## 结构

user是casdoor创建的，其实有上百字段，大部分没有什么用。因此user类中只选取了其中有用的字段定义，隐藏了大部分没有用的字段。

user_info中包含了user中未包含的其他用户信息。

为了方便查询，创建user_view视图将user和user_info两张表中的数据统一起来。这样查询就可以在user_view上，表现得就和一张表一样。==注意，user_view只能起到查询作用，增删改的时候还是要在user和user_info上进行，user_view底层是视图，不能改变。==



## 字段

### User

+ owner：所属组织
+ display_name：用户名字
+ name：学号。==用户信息使用学号作为唯一ID。这里实际放的是学号。casdoor中使用name作为主键和标识，所以在name放了学号，而在display_name放了用户姓名。==
+ id：casdoor中的id，每出现一个用户分一个唯一id。**这个id可以不用管，我们索引id用的学号**。
+ avatar：获取头像的url
+ password：
+ email：
+ phone：

### UserInfo

+ id：==唯一索引主键，这里使用的是学号==
+ name：用户名字
+ award_winning_experience：获奖经历
+ project_experience：项目经历
+ position：职务。这个会在权限中用到
+ department：所在部门
+ gender：性别
+ college：学院
+ major：专业
+ classname：班级
+ grade：入学年份
+ join_date：加入科中时间
+ native_place：籍贯
+ photograph：获取照片的url
+ reason_for_application：申请理由

### UserView

上面两个合起来的视图。

==注意name为姓名，id为学号。==