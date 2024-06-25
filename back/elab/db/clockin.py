from elab.db import sqlAlchemy as db
from datetime import timedelta,datetime
from elab.db.user import UserView

class UserClockIn(db.Model):
    __tablename__='user_clock_in'
    user_id=db.Column(db.String(100),primary_key=True)
    user_name=db.Column(db.String(100))
    # 目前状态
    status=db.Column(db.Enum('doing','nodone','overtime'),default='nodone')
    # 上周打卡时间是否满足
    last_week_meeting=db.Column(db.Boolean,default=False)
    # 本周打卡时间是否满足
    this_week_meeting=db.Column(db.Boolean,default=False)
    # 正在进行的打卡的id
    clock_in_id=db.Column(db.Integer,default=-1)
    # 打卡总时长
    all_duration=db.Column(db.Interval,default=timedelta())
    # 上周打卡时长
    last_week_duration=db.Column(db.Interval,default=timedelta())
    # 本周打卡时长
    this_week_duration=db.Column(db.Interval,default=timedelta())
    # 历史打卡情况
    history=db.Column(db.JSON,default=[])

    def return_to_dict(self):
        result={
            'user_id':self.user_id,
            'user_name':self.user_name,
            'status':self.status,
            'last_week_meeting':self.last_week_meeting,
            'this_week_meeting':self.this_week_meeting,
            'all_duration':self.all_duration.total_seconds(),
            'this_week_duration':self.this_week_duration.total_seconds(),
            'last_week_duration':self.last_week_duration.total_seconds(),
        }
        return result



class ClockInRecord(db.Model):
    __tablename__='clock_in_record'
    # 打卡的id
    id=db.Column(db.Integer,primary_key=True)
    # 用户信息
    user_id=db.Column(db.String(100))
    # 状态
    status=db.Column(db.Enum('doing','done','overtime'),default='doing')
    # 本次打卡开始时间
    start_time=db.Column(db.DateTime,default=datetime.now())
    # 本次打卡结束时间
    end_time=db.Column(db.DateTime)
    # 本次打卡时长
    duration=db.Column(db.Interval,default=timedelta())

    def return_to_dict(self):
        result={
            'id':self.id,
            'user_id':self.user_id,
            'status':self.status,
            'start_time':self.start_time.timestamp(),
            'end_time':self.end_time.timestamp(),
            'duration':self.duration.total_seconds(),
        }
        return result
    

    # 数据库删除过期记录的函数
    @classmethod
    def set_delete_expired_record_fun(self):
        sql='''
        CREATE PROCEDURE IF NOT EXISTS Delete_expired_record(IN record_expire_day INT)
        BEGIN
            DECLARE delete_date DATE;
            SET delete_date = CURDATE() - INTERVAL record_expire_day DAY;
            DELETE FROM clock_in_record WHERE start_time < delete_date;
        END;
        '''
        db.session.execute(db.text(sql))
        db.session.commit()


    # 数据库每日删除过期记录的事件
    @classmethod
    def set_delete_expired_record_event(self,record_expire_day):
        tomorrow = datetime.now() + timedelta(days=1)
        sql=f'''
            CREATE EVENT IF NOT EXISTS delete_expired_record_daily
            ON SCHEDULE EVERY 1 DAY STARTS '{tomorrow.strftime('%Y-%m-%d 23:00:00')}'
            ON COMPLETION PRESERVE
            ENABLE
            COMMENT '第二天的23:00开始检测,此后每隔一天检测一次,删除过期的记录'
            DO
                CALL Delete_expired_record({record_expire_day});
            '''
        db.session.execute(db.text(sql))
        db.session.commit()

        # 这样修改和创建事件就可以为同一个函数了
        sql=f'ALTER EVENT delete_expired_record_daily DO CALL Delete_expired_record({record_expire_day});'
        db.session.execute(db.text(sql))
        db.session.commit()



def init_clockin():
    db.metadata.create_all(bind=db.engine, tables=[UserClockIn.__table__,ClockInRecord.__table__])
    # 设置删除过期记录的函数
    ClockInRecord.set_delete_expired_record_fun()
    # 为每一个用户创建一个UserClockIn
    users=UserView.query.all()
    for user in users:
        new_user_clock_in=UserClockIn(
            user_id=user.id,
            user_name=user.name,
        )
        db.session.add(new_user_clock_in)
        db.session.commit()


def drop_clockin():
    try:
        db.session.execute(db.text('drop tables if exists clock_in_record,user_clock_in'))
        db.session.execute(db.text('DROP PROCEDURE IF EXISTS Delete_expired_record;'))
        db.session.execute(db.text('DROP EVENT IF EXISTS delete_expired_record_daily;'))
        db.session.commit()
    except Exception as e:
        print(e)


def forge_clockin():
    has_user=[user.user_id for user in UserClockIn.query.all()]
    # 为每一个用户创建一个UserClockIn
    users=UserView.query.all()
    for user in users:
        if user.id not in has_user:
            new_user_clock_in=UserClockIn(
                user_id=user.id,
                user_name=user.name,
            )
            db.session.add(new_user_clock_in)
            db.session.commit()
