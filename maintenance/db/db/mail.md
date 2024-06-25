mail.py

有两个表mail_center,user_mailbox.

## 结构

mail_center储存所有的邮件

user_mailbox用户收件箱，储存用户个人的邮件，包含发送的历史邮件，未查看邮件，已查看邮件

## 字段

### MailCenter

+ id：自增主键
+ title：邮件标题
+ sender_id：发送者的id
+ sender_name：发送者的名字
+ pubdate：发送时间
+ receivers_id：接收者的id，是一个json，json中是包含接收者id的数组
+ body：正文
+ is_attachment：是否包含附件，计划邮件可以包含附件，预留的接口

### UserMailbox

+ id：用户的id
+ name：用户的名字
+ finished_mailbox：json，是一个包含已查看邮件的id的数组
+ unfinished_mailbox：json，已查看邮件
+ send_history：json，发送过的历史邮件

**方法**：

+ send_mail：发送邮件

+ have_unfinished_mail：返回知否拥有未查看邮件
+ add_mail_to_receivers：将一个邮件，添加到一组用户的未查看邮件



