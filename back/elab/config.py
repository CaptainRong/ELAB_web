import os
import json

def read_site_info(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)
    return data


class BaseConfig:
    # file
    UPLOADED_AVATARS_DEST = 'static/avatars'
    UPLOADED_PHOTOGRAPHS_DEST = 'asset/photographs'

    # elab
    ADMIN_PASSWARD='123132'


    # flask-oidc
    OIDC_SCOPES = ['openid', 'email', 'profile']
    OIDC_ID_TOKEN_COOKIE_TTL=600000
    OIDC_COOKIE_SECURE=False


class DevelopmentConfig(BaseConfig):
    # elab
    FRONT_INDEX_URL="http://localhost:3000"
    SECRET_KEY='aaa'
    OWNER_NAME='built-in'
    HOST_ADDRESS='localhost:5000'
    ROOT_URL='http://'+HOST_ADDRESS
    SITE_SETTING=os.environ.get('SITE_SETTING')


    # flask-sqlalchemy
    SQLALCHEMY_DATABASE_URI='mysql+pymysql://root:123123@localhost/casdoor'


class ProductionConfig(BaseConfig):
    # elab
    HOST_ADDRESS=os.environ.get('HOST_ADDRESS')
    ROOT_URL=f'http://{HOST_ADDRESS}'
    FRONT_INDEX_URL=value = os.environ.get('FRONT_INDEX_URL')
    SECRET_KEY= os.environ.get('SECRET_KEY')
    OWNER_NAME=os.environ.get('OWNER_NAME')
    SITE_SETTING=os.environ.get('SITE_SETTING')

    # flask-sqlalchemy
    SQLALCHEMY_DATABASE_URI=f'mysql+pymysql://root:{os.environ.get("DB_PASSWARD")}@{os.environ.get("DB_ADDRESS")}/casdoor'
    # oidc
    OVERWRITE_REDIRECT_URI = "http://"+os.environ.get('HOST_ADDRESS')+"/oidc_callback"
    OIDC_CLIENT_SECRETS = os.environ.get('OIDC_CLIENT_SECRETS')

Config={
    'development':DevelopmentConfig,
    'production': ProductionConfig,
}

