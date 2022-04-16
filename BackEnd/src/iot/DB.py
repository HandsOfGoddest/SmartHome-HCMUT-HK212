from abc import ABCMeta, abstractstaticmethod
from mongoengine import *

class IDataBase(metaclass= ABCMeta):
    @abstractstaticmethod
    def get_data(): pass
        
class DBSingleton(IDataBase):
    __instance= None
    @staticmethod
    def get_instance():
        if DBSingleton.__instance is None:
            DBSingleton("mongodb+srv://Akatsuki:akatsuki@cluster0.afgoj.mongodb.net/IOT_project?retryWrites=true&w=majority")
        return DBSingleton.__instance
    
    def __init__(self, host):
        if DBSingleton.__instance is None:
            self.host= host
            self.alias= 'myIOTDB'
            DBSingleton.__instance= self
        else:
            raise Exception("Can't be initialized")
        
    def connectDB(self):
        connect(host= DBSingleton.__instance.host)
        
    def closeDB(self):
        disconnect()
        
    @staticmethod
    def get_data():
        print(DBSingleton.__instance.host)