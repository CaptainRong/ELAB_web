from flask import Blueprint,current_app,request
from elab.response import response_data,response_message
from elab.setting import setting_manage
from elab.extensions import oidc
from elab.permission import check_permission
from elab.setting import setting_manage,ReadSignIn,ReadClockIn,ReadPublicMessage
import json

site_blueprint=Blueprint('site',__name__)

setting_map={
    'sign_in':ReadSignIn,
    'clock_in':ReadClockIn,
    'public_message':ReadPublicMessage,
}

# 获取网站公共消息
@site_blueprint.route('')
def get_public_message():
    setting=setting_manage.get()
    return response_data(setting['public_message'])


# 获取设置
@site_blueprint.route('/setting',methods=['GET'])
@check_permission('view_admin_panel')
@oidc.require_login
def get_setting():
    setting_type=request.args.get('setting_type')
    transition=setting_map[setting_type]()
    jsonstr=transition.dump(setting_manage.get()[setting_type])
    return response_data(jsonstr)


# 设置clock_in
# 设置public_message
# 设置sign_in


def site_init(api_blueprint):
    api_blueprint.register_blueprint(site_blueprint,url_prefix='/site')