from elab.db.clockin import UserClockIn,ClockInRecord,db
from datetime import datetime,timedelta
from elab.setting import setting_manage
import schedule


class ClockInManager:
    def __init__(self) -> None:
        self.update_weekly_data_job=None
        self.check_overtime_job=None


    # 开启clock运作
    def start(self):
        setting=setting_manage.get()
        # 将每周更新数据添加到任务调度里面
        self.update_weekly_data_job=schedule.every().\
            sunday.at(setting['clock_in']['update_weekly_time'].strftime("%H:%M")).do(
            self.update_weekly_data)
        
        # 将每日检测超时添加到任务调度里面
        self.check_overtime_job=schedule.every().day.\
            at(setting['clock_in']['end_time'].strftime("%H:%M")).do(
            self.check_overtime)

        # 开启数据库中每日删除过期记录的事件
        ClockInRecord.set_delete_expired_record_event(setting['clock_in']['record_expire_day'])


    # 开始打卡,返回打卡时间
    def start_clock_in(self,user_id):
        # 检测是否在打卡时间范围内
        current_time = datetime.now()
        if not self.is_within_clock_time_range(current_time.time()):
            raise Exception('未在打卡时间')
        # 检查用户状态
        user_clock_in=UserClockIn.query.get(user_id)
        if user_clock_in.status!='nodone':
            raise Exception('用户状态错误')
        # 创建打卡记录
        clock_in_record=ClockInRecord(user_id=user_id,start_time=current_time)
        db.session.add(clock_in_record)
        db.session.commit()
        # 修改个人打卡信息
        user_clock_in.status='doing'
        user_clock_in.clock_in_id=clock_in_record.id
        db.session.commit()
        return current_time

    # 结束打卡,返回打卡信息
    def end_clock_in(self,user_id):
        # 检测用户状态
        user_clock_in=UserClockIn.query.get(user_id)
        if user_clock_in.status!='doing':
            raise Exception('用户状态错误')

        # 修改打卡记录
        clock_in_record=ClockInRecord.query.filter_by(user_id=user_id,status='doing').one()
        clock_in_record.status='done'
        clock_in_record.end_time=datetime.now()
        clock_in_record.duration=clock_in_record.end_time-clock_in_record.start_time
        
        # 修改个人打卡信息
        user_clock_in.status='nodone'
        user_clock_in.clock_in_id=-1
        user_clock_in.all_duration+=clock_in_record.duration
        user_clock_in.this_week_duration+=clock_in_record.duration

        # 判断是否达到本周标准
        if self.is_clock_duration_meet(user_clock_in.user_id,user_clock_in.this_week_duration):
            user_clock_in.this_week_meeting=True

        db.session.commit()    
        return clock_in_record.start_time,clock_in_record.end_time,clock_in_record.duration


    # 获取单个成员的状态
    def get_status(self,user_id):
        user_clock_in=UserClockIn.query.get(user_id)
        result=user_clock_in.return_to_dict()
        result['start_time']=0

        # 如果状态为正在打卡，则返回打卡开始时间
        if user_clock_in.status=='doing':
            clock_in_record=ClockInRecord.query.get(user_clock_in.clock_in_id)
            result['start_time']=clock_in_record.start_time.timestamp()
        # 如果状态为超时，则修改为未做
        if user_clock_in.status=='overtime':
            user_clock_in.status='nodone'
        db.session.commit()
        return result

    # 获取所有成员的打卡状态
    def get_all_status(self):
        # 这个是管理员的特权，这个不能将用户的超时状态
        users=UserClockIn.query.all()
        return [user.return_to_dict() for user in users]

    # 获取单个成员的打卡记录，打卡记录记录在clock_in_record中
    def get_record(self,user_id):
        records=ClockInRecord.query.filter_by(user_id=user_id).all()
        return [record.return_to_dict() for record in records]

    # 获取单个成员的历史记录，历史记录记录在user_clock_in中
    def get_history(self,user_id):
        user_clock_in=UserClockIn.query.get(user_id)
        return user_clock_in.history


    # 设置重新加载
    def reload_setting(self,old_setting,new_setting):
        setting=setting_manage.get()
        # 如果没有设置old_setting就全部重新加载，若是设置了，则对比前后是否修改，只重载修改了的设置
        if old_setting==None or old_setting['update_weekly_time']!=new_setting['update_weekly_time']:
            schedule.cancel_job(self.update_weekly_data_job)
            self.update_weekly_data_job=schedule.every().\
                sunday.at(setting['clock_in']['update_weekly_time'].strftime("%H:%M")).do(
                self.update_weekly_data)

        if old_setting==None or old_setting['end_time']!=new_setting['end_time']:
            schedule.cancel_job(self.check_overtime_job)
            self.check_overtime_job=schedule.every().day.\
                at(setting['clock_in']['end_time'].strftime("%H:%M")).do(
                self.check_overtime)
            
        if old_setting==None or old_setting['record_expire_day']!=new_setting['record_expire_day']:
            # 重新设置数据库中每日检测过期记录的事件
            ClockInRecord.set_delete_expired_record_event(setting['clock_in']['record_expire_day'])
        
        # 这个required_duration不好判断前后是否修改，重新对所有成员进行一下打卡时间判断
        users=UserClockIn.query.all()
        for user in users:
            self.this_week_meeting=self.is_clock_duration_meet(user.user_id,user.this_week_duration)
        db.session.commit()


    # 判断一个成员的打卡时间是否足够
    def is_clock_duration_meet(self,user_id,time):
        setting=setting_manage.get()
        required_duration=setting['clock_in']['required_duration']['member'].get(user_id)
        if required_duration==None:
            required_duration=setting['clock_in']['required_duration']['default']
        return time>=required_duration


    # 判断是否在打卡的时间范围内
    def is_within_clock_time_range(self,time):
        setting=setting_manage.get()
        print(setting['clock_in']['start_time'])
        print(time)
        print(setting['clock_in']['end_time'])
        return setting['clock_in']['start_time']<=time<setting['clock_in']['end_time']


    # 每日在截止时间检测打卡是否超时
    def check_overtime(self):
        users=UserClockIn.query.all()
        for user in users:
            if user.status=='doing':
                user.status=='overtime'
                db.session.commit()
                clock_in_record=ClockInRecord.query.get(user.clock_in_id)
                clock_in_record.status='overtime'
                user.clock_in_id=-1
            db.session.commit()


    # 每周更新数据
    def update_weekly_data(self):
        users=UserClockIn.query.all()
        for user in users:
            # 将上周数据记录为历史数据
            user.history.append(
                {
                    # 上周开始时间
                    'start_datetime':(datetime.now()-timedelta(days=13)).date(),
                    # 上周结束时间
                    'end_datetime':(datetime.now()-timedelta(day=7)).date(),
                    # 打卡时间是否足够
                    'is_meeting':user.last_week_meeting,
                    # 打卡时长
                    'duration':user.last_week_duration,
                }
            )
            # 将本周数据改变为上周数据
            user.last_week_meeting=user.this_week_meeting
            user.last_week_duration=user.this_week_duration
            # 将本周数据初始化
            user.this_week_duration=timedelta()
            user.this_week_meeting=self.is_clock_duration_meet(user.user_id,user.this_week_duration)

        db.session.commit()
