from elab.extensions import oidc
from elab.permission import check_permission
from elab.response import response_data,response_message
from flask import Blueprint,current_app,request
from elab.permission import check_permission
from elab.service import clock_in_service


clockin_blueprint=Blueprint('clockin',__name__)

# 开始打卡
@clockin_blueprint.route('/start',methods=['get'])
@oidc.require_login
def start_clock_in():
    user_id=oidc.user_getfield('name')
    try:
        time=clock_in_service.start_clock_in(user_id)
        return response_data({'start_time':time.timestamp()})
    except Exception as e:
        return response_message(str(e))

# 结束打卡
@clockin_blueprint.route('/end',methods=['get'])
@oidc.require_login
def end_clock_in():
    user_id=oidc.user_getfield('name')
    # try:
    start_time,end_time,duration=clock_in_service.end_clock_in(user_id)
    return response_data({
        'start_time':start_time.timestamp(),
        'end_time':end_time.timestamp(),
        'duration':duration.total_seconds(),
        })
    # except Exception as e:
    #     print(e)
    #     return response_message(str(e))

# 获取自己的状态
@clockin_blueprint.route('',methods=['get'])
@oidc.require_login
def get_status():
    user_id=oidc.user_getfield('name')
    return response_data(clock_in_service.get_status(user_id))



# 获取所有成员的状态,管理员权限
@clockin_blueprint.route('/status',methods=['get'])
@check_permission('view_clock_in')
@oidc.require_login
def get_all_status():
    user_id=oidc.user_getfield('name')
    return response_data(clock_in_service.get_all_status(user_id))

# 获取单个成员的打卡记录，管理员权限或者本人
@clockin_blueprint.route('/record',methods=['get'])
@check_permission('view_clock_in',is_self='or',url_arg='user_id',oidc_arg='name')
@oidc.require_login
def get_record():
    user_id=oidc.user_getfield('name')
    return response_data(clock_in_service.get_record(user_id))

# 获取单个成员的历史记录，管理员权限或者本人
@clockin_blueprint.route('/history',methods=['get'])
@check_permission('view_clock_in',is_self='or',url_arg='user_id',oidc_arg='name')
@oidc.require_login
def get_history():
    user_id=oidc.user_getfield('name')
    return response_data(clock_in_service.get_history(user_id))


def clockin_init(service_blueprint):
    service_blueprint.register_blueprint(clockin_blueprint,url_prefix='/clockin')
    