import schedule
import time
import threading


class TaskSchedule:
    def __init__(self,interval=1,app=None) -> None:
        self.interval=interval
        self.thread = threading.Thread(target=self.run)
        self.app=app
    
    def start(self):
        self.thread.start()

    def run(self):        
        while True:
            with self.app.app_context():
                schedule.run_pending()
                time.sleep(self.interval)
    
    def init_app(self,interval,app):
        self.interval=interval
        self.app=app


