from elab.extensions import sqlAlchemy
from .user import init_user,drop_user,forge_user
from .permission import init_permission,drop_permission,forge_permission
from .mail import init_mail,drop_mail,forge_mail
from .material import init_material,drop_material,forge_material
from .file import init_file,drop_file,forge_file
from .log import init_log,drop_log,forge_log
from .signin import init_signup,drop_signup,forge_signup
from .clockin import init_clockin,drop_clockin,forge_clockin

def init_command():
    init_permission()
    init_user()
    init_mail()
    init_material()
    init_file()
    init_log()
    init_signup()
    init_clockin()
    

def drop_command():
    drop_user()
    drop_permission()
    drop_mail()
    drop_material()
    drop_file()
    drop_log()
    drop_signup()
    drop_clockin()


def forge_commond():
    forge_user()
    forge_mail()
    forge_material()
    forge_file()
    forge_log()
    forge_signup()
    forge_permission()
    forge_clockin()