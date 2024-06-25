from elab.db.permission import Positon,Duty,PositonDutyMap,MemberDutyMap,db
from elab.response import response_message
from elab.extensions import oidc
from functools import wraps
from flask import request



def check_permission(duty, resp=None,is_self=None,url_arg=None,oidc_arg=None):
    def my_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal resp,is_self,url_arg,oidc_arg

            if resp is None:
                resp = response_message('权限不足')

            # 返回结果的函数
            return_result=lambda x:func(*args, **kwargs) if x else resp
            # 找到请求人
            user_id = oidc.user_getfield('name')
            # 验证是否有权限
            have_permission = (MemberDutyMap.query.filter_by(member_id=user_id, duty=duty).first())!=None
            
            if is_self==None:
                return return_result(have_permission)
            
            check_is_self=oidc.user_getfield(oidc_arg)==request.args.get(url_arg)
            if is_self=='or':
                return return_result(have_permission or check_is_self)
            if is_self=='and':
                return return_result(have_permission and check_is_self)

        return wrapper
    return my_decorator
