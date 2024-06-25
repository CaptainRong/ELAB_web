from .avatar import avatars
from .photograph import photographs

class FileManage():
    def __init__(self):
        self.sets=[
            avatars,
            photographs,
        ]

    def init_app(self,app):
        for i in self.sets:
            i.init_app(app)
    
    def start(self):
        # 给每一个文件集设置路径
        for i in self.sets:
            i.set_access()

