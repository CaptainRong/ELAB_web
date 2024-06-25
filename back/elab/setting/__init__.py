import copy
from types import MappingProxyType
from marshmallow import Schema, fields
from contextlib import contextmanager
import json
import os

from .clock import ReadClockIn
from .public_message import ReadPublicMessage
from .sign import ReadSignIn

# 设置管理
class SettingManage:
    def __init__(self) -> None:
        self.file_path=None
        # 设置的数据
        self.data=None
        # self.data的MappingProxyType类型,不可修改的对外访问接口
        self.setting=None
        # 重新加载的回调函数
        self.reload_setting={}

    # 开始管理
    def start(self):
        self.data=self.read()
        # 将setting设置为不可修改对象
        self.setting = MappingProxyType(self.data)

    # 初始化，添加设置文件的路径，添加重载的回调函数
    def init_app(self,path,**kwargs):
        self.file_path=path
        self.reload_setting=kwargs

    # 读取设置信息
    def read(self):
        with open(self.file_path, 'r') as file:
            read_setting=ReadSetting()
            file_str=file.read()
            data = read_setting.loads(file_str)
        return data
    
    def get(self):
        return self.setting

    # 保存设置信息
    def save(self):
        read_setting=ReadSetting()
        with open(self.file_path, 'w') as file:
            read_setting.dump(self.setting,file)

    # 更新设置的上下文管理
    @contextmanager
    def update(self,data_type):
        # 查看data_type是否存在
        if data_type not in self.data:
            raise Exception('没有这个设置')
        
        # 返回对象类型的可修改数据
        new_data=copy.deepcopy(self.data[data_type])
        yield new_data

        old_data=self.data[data_type]
        self.data[data_type]=new_data
        # 保存设置
        self.save()
        # 重新加载设置
        self.reload(data_type,old_data,new_data)

    # 重新加载设置
    def reload(self,data_type,old_data,new_data):
        # 执行对应设置的重载
        if data_type in self.reload_setting:
            self.reload_setting[data_type](old_data,new_data)


    @classmethod
    def init_command(cls):
        with open('site_setting.json', 'w') as file:
            file.write('')

    @classmethod
    def forge_command(cls):
        with open('site_setting.json', 'w') as file:
            json.dump(cls.default(),file,ensure_ascii=False,indent=4)
    
    @classmethod
    def drop_command(cls):
        try:
            os.remove('site_setting.json')
        except FileNotFoundError:
            pass
        except Exception as e:
            raise e

    # 默认的设置信息
    @classmethod
    def default(cls):
        return{
        "public_message":{
            "announcement":"本网站在2023的最后一天正式投入使用。祝各位2024年新年快乐，万事如意，身体健康，龙年大吉。",
            "about":[
                {
                    "title":"密码",
                    "content":[
                        "elab网的wifi:elab2023",
                        "elab网的wifi:elab2023",
                        "elab网的wifi:elab2023"
                    ]
                },
                {
                    "title":"密码",
                    "content":[
                        "elab网的wifi:elab2023",
                        "elab网的wifi:elab2023",
                        "elab网的wifi:elab2023"
                    ]
                }
            ]
        },
        "clock_in":{
            # 开启打卡的时间
            'start_time':'8:00:00',
            # 截止打卡的时间
            'end_time':'22:00:00',
            # 打卡记录过期天数
            'record_expire_day':15,
            # 每周数据结算时间
            'update_weekly_time':'23:00:00',
            # 每周打卡要求时长
            'required_duration':{
                'default':1,
                'member':{},
                'group':{}
            }
        },
        "sign_in":{}
    }

# 读取设置
class ReadSetting(Schema):
    public_message=fields.Nested(ReadPublicMessage)
    clock_in=fields.Nested(ReadClockIn)
    sign_in=fields.Nested(ReadSignIn)

setting_manage=SettingManage()
